//! Auth module — handles signing into the Lafter web service
//! and persisting the session token locally.

use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;

const API_BASE: &str = "https://lafter.gg/api/auth";

/// Stored session data (persisted to disk).
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Session {
    pub token: String,
    pub user_id: i64,
    pub display_name: String,
    pub username: String,
}

/// Get the path to the session file.
/// Stored in the user's app data directory.
fn session_path() -> PathBuf {
    let mut path = app_data_dir();
    path.push("lafter-connector");
    fs::create_dir_all(&path).ok();
    path.push("session.json");
    path
}

/// App data directory per platform.
fn app_data_dir() -> PathBuf {
    #[cfg(target_os = "windows")]
    { return std::env::var("APPDATA").map(PathBuf::from).unwrap_or_else(|_| PathBuf::from(".")); }

    #[cfg(not(target_os = "windows"))]
    { return std::env::var("HOME").map(|h| PathBuf::from(h).join(".config")).unwrap_or_else(|_| PathBuf::from(".")); }
}

/// Sign in to Lafter. Posts credentials to the API and stores the token.
pub async fn signin(
    username: &str,
    password: &str,
) -> Result<serde_json::Value, Box<dyn std::error::Error + Send + Sync>> {
    let client = reqwest::Client::new();

    let resp = client
        .post(&format!("{}/signin.php", API_BASE))
        .json(&serde_json::json!({
            "username": username,
            "password": password,
        }))
        .send()
        .await?;

    let data: serde_json::Value = resp.json().await?;

    if data.get("success").and_then(|v| v.as_bool()) == Some(true) {
        let session = Session {
            token: data["token"].as_str().unwrap_or("").to_string(),
            user_id: data["user_id"].as_i64().unwrap_or(0),
            display_name: data["display_name"].as_str().unwrap_or("").to_string(),
            username: data["username"].as_str().unwrap_or("").to_string(),
        };
        save_session(&session)?;
        Ok(serde_json::json!({
            "success": true,
            "display_name": session.display_name,
        }))
    } else {
        let error = data["error"].as_str().unwrap_or("Invalid credentials.");
        Ok(serde_json::json!({
            "success": false,
            "error": error,
        }))
    }
}

/// Sign out — delete the stored session.
pub fn signout() -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
    let path = session_path();
    if path.exists() {
        fs::remove_file(path)?;
    }
    Ok(())
}

/// Get the current session (if stored and valid).
pub fn get_session() -> Result<Option<serde_json::Value>, Box<dyn std::error::Error + Send + Sync>> {
    let path = session_path();
    if !path.exists() {
        return Ok(None);
    }

    let content = fs::read_to_string(&path)?;
    let session: Session = serde_json::from_str(&content)?;

    Ok(Some(serde_json::json!({
        "display_name": session.display_name,
        "username": session.username,
        "user_id": session.user_id,
    })))
}

/// Persist session to disk.
fn save_session(session: &Session) -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
    let path = session_path();
    let json = serde_json::to_string_pretty(session)?;
    fs::write(path, json)?;
    Ok(())
}

/// Load stored session (for use by other modules, e.g. heartbeat).
pub fn load_session() -> Option<Session> {
    let path = session_path();
    let content = fs::read_to_string(path).ok()?;
    serde_json::from_str(&content).ok()
}
