import { appWindow } from "@tauri-apps/api/window"

export function TitleBar() {
  return (
    <div data-tauri-drag-region className="titlebar">
      <div className="menu">
        <div id="menu-icon">
        </div>
        <div>
          File
        </div>
        <div>
          Projects
        </div>
      </div>
      <div className="titlebar-controls">
        <div className="titlebar-button"
          onClick={() => {
            appWindow.minimize()
          }}>
          <img src="/src/assets/minimize.svg" alt="minimize" />
        </div>
        <div className="titlebar-button"
          onClick={() => {
            appWindow.maximize()
          }}>
          <img src="/src/assets/maximize.svg" alt="maximize" />
        </div>
        <div className="titlebar-button"
          onClick={() => {
            appWindow.close()
          }}>
          <img src="/src/assets/close.svg" alt="close" />
        </div>
      </div>
    </div>
  )

}
