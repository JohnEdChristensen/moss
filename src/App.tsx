import "./App.css";
import "./style.css"

import { Frame } from "./Frame.tsx";
import { TitleBar } from "./components/TitleBar.tsx";


function App() {

  // /**
  //  * Run WebGL
  //  */
  // window.onload = async function() {
  //   run()
  // }

  return (
    <>
      <TitleBar />
      <Frame />
    </>
  );
}

export default App;

