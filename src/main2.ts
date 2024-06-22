import { run } from './l-systems/user.ts';

import { appWindow } from '@tauri-apps/api/window'

document.getElementById('menu-icon')?.append()
/**
 * TitleBar
 */
document
  ?.getElementById('titlebar-minimize')
  ?.addEventListener('click', () => appWindow.minimize())
document
  ?.getElementById('titlebar-maximize')
  ?.addEventListener('click', () => appWindow.toggleMaximize())
document
  ?.getElementById('titlebar-close')
  ?.addEventListener('click', () => appWindow.close())

/**
 * Run WebGL
 */
window.onload = async function() {
  run()
}

