// Prevents additional console window on Windows in release
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod lcu;
mod auth;

use tauri::{
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
    Manager,
};

#[tauri::command]
fn get_lcu_status() -> Result<String, String> {
    match lcu::find_credentials() {
        Some(creds) => Ok(format!("Connected — port {}", creds.port)),
        None => Err("League client not detected".into()),
    }
}

#[tauri::command]
async fn get_champ_select() -> Result<serde_json::Value, String> {
    let creds = lcu::find_credentials().ok_or("League client not running")?;
    lcu::get_champ_select(&creds).await.map_err(|e| e.to_string())
}

#[tauri::command]
async fn signin(username: String, password: String) -> Result<serde_json::Value, String> {
    auth::signin(&username, &password).await.map_err(|e| e.to_string())
}

#[tauri::command]
fn signout() -> Result<(), String> {
    auth::signout().map_err(|e| e.to_string())
}

#[tauri::command]
fn get_session() -> Result<Option<serde_json::Value>, String> {
    auth::get_session().map_err(|e| e.to_string())
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_updater::Builder::new().build())
        .setup(|app| {
            // Build system tray
            let _tray = TrayIconBuilder::new()
                .tooltip("Lafter Connector")
                .on_tray_icon_event(|tray, event| {
                    if let TrayIconEvent::Click {
                        button: MouseButton::Left,
                        button_state: MouseButtonState::Up,
                        ..
                    } = event
                    {
                        let app = tray.app_handle();
                        if let Some(window) = app.get_webview_window("main") {
                            let _ = window.show();
                            let _ = window.set_focus();
                        }
                    }
                })
                .build(app)?;

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            get_lcu_status,
            get_champ_select,
            signin,
            signout,
            get_session,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
