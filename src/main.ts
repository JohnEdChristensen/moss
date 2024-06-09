import { run } from './user';


window.onload = async function() {
  run()
}



// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', () => {
//     navigator.serviceWorker.register('/sw.js').then(reg => {
//       console.log('ServiceWorker registration successful with scope: ', reg.scope);
//     }, err => {
//       console.log('ServiceWorker registration failed: ', err);
//     });
//   });
// }
