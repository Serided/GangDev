//! LCU (League Client Update) connection module.
//!
//! Discovers the running League Client process, extracts the auth token
//! and port from its command-line arguments, and provides HTTP access
//! to LCU endpoints (specifically champ select).

use base64::Engine;
use sysinfo::{ProcessRefreshKind, ProcessesToUpdate, System, UpdateKind};

/// Credentials needed to talk to the LCU.
#[derive(Debug, Clone)]
pub struct LcuCredentials {
    pub port: u16,
    pub auth_token: String,
}

impl LcuCredentials {
    /// Build the Authorization header value.
    pub fn auth_header(&self) -> String {
        let encoded = base64::engine::general_purpose::STANDARD
            .encode(format!("riot:{}", self.auth_token));
        format!("Basic {}", encoded)
    }

    /// Base URL for LCU REST API.
    pub fn base_url(&self) -> String {
        format!("https://127.0.0.1:{}", self.port)
    }
}

/// Scan running processes for LeagueClientUx and extract port + token
/// from its command-line arguments.
///
/// The League Client launches with args like:
///   --app-port=XXXXX --remoting-auth-token=YYYYYY
pub fn find_credentials() -> Option<LcuCredentials> {
    let mut sys = System::new();
    sys.refresh_processes_specifics(
        ProcessesToUpdate::All,
        true,
        ProcessRefreshKind::nothing().with_cmd(UpdateKind::Always),
    );

    for (_pid, process) in sys.processes() {
        let name = process.name().to_string_lossy().to_lowercase();
        if !name.contains("leagueclientux") {
            continue;
        }

        let cmd: Vec<String> = process.cmd().iter().map(|s| s.to_string_lossy().to_string()).collect();
        let cmd_str = cmd.join(" ");

        let port = extract_arg(&cmd_str, "--app-port=")?;
        let token = extract_arg(&cmd_str, "--remoting-auth-token=")?;

        return Some(LcuCredentials {
            port: port.parse().ok()?,
            auth_token: token,
        });
    }

    None
}

/// Extract a value from a command-line string by prefix.
/// e.g. extract_arg("--app-port=12345 --other=x", "--app-port=") -> Some("12345")
fn extract_arg(cmd: &str, prefix: &str) -> Option<String> {
    let start = cmd.find(prefix)? + prefix.len();
    let rest = &cmd[start..];
    let end = rest.find(|c: char| c == ' ' || c == '"').unwrap_or(rest.len());
    Some(rest[..end].to_string())
}

/// Fetch the current champ select session from the LCU.
/// Returns the full JSON response, or an error.
pub async fn get_champ_select(
    creds: &LcuCredentials,
) -> Result<serde_json::Value, Box<dyn std::error::Error + Send + Sync>> {
    let client = reqwest::Client::builder()
        .danger_accept_invalid_certs(true) // LCU uses self-signed cert
        .build()?;

    let url = format!("{}/lol-champ-select/v1/session", creds.base_url());
    let resp = client
        .get(&url)
        .header("Authorization", creds.auth_header())
        .send()
        .await?;

    if resp.status() == 404 {
        return Ok(serde_json::json!({ "active": false, "message": "Not in champ select" }));
    }

    let data: serde_json::Value = resp.json().await?;
    Ok(data)
}
