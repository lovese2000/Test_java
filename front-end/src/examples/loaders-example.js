import * as ARCH from "@/archiweb"
import {loaderOption} from "@/archiweb";


let scene, gui;
let am;

/* ---------- create your scene object ---------- */
function initScene() {
  
  const loader = new ARCH.Loader(scene);
  loader.addGUI(gui.util);
  
  // render a sketchup model
  loaderOption.status = 'raw';
  loaderOption.edge = true;
  loaderOption.doubleSide = true;
  loader.loadModel('/models/bugalow_fbx/model.fbx', (result) => {
    result.scale.set(0.1, 0.1, 0.1);
    ARCH.applyTransformGroup(result);
    am.refreshSelection(scene);
  });
  
  // test model
  // loaderOption.status = 'grouped';
  // loaderOption.edge = true;
  // loaderOption.doubleSide = false;
  // loader.loadModel('/models/test/model.dae', (result) => {
  //   console.log(result);
  //   am.refreshSelection(scene);
  // });
  
  //apartment
  // loaderOption.status = 'grouped';
  // loaderOption.edge = false;
  // loaderOption.doubleSide = false;
  // loader.loadModel('/models/kalibo/model.dae', (result) => {
  //   console.log(result);
  //   am.refreshSelection(scene);
  // })
  
  //test fbx
  // loaderOption.status = 'raw';
  // loaderOption.edge = true;
  // loaderOption.doubleSide = false;
  // loader.loadModel('/models/fbox/model.fbx', (result) => {
  //   console.log(result);
  //   am.refreshSelection(scene);
  // })
  
  //test rhino 3dm
  // loaderOption.status = 'grouped';
  // loaderOption.edge = true;
  // loaderOption.doubleSide = false;
  // loader.loadModel('/models/b_3dm/model.3dm', (result) => {
  //   console.log(result);
  //   am.refreshSelection(scene);
  // })
}


/* ---------- main entry ---------- */
function main() {
  console.warn = () => {
  };
  const viewport = new ARCH.Viewport();
  scene = viewport.scene;
  gui = viewport.gui;
  viewport.setCameraPosition([1120, 630, 450], [160, 135, 400]);
  
  am = viewport.enableAssetManager();
  viewport.enableDragFrames();
  viewport.enableTransformer();
  let sb = viewport.enableSceneBasic();
  sb.x = 1;
  sb.y = 0.5;
  sb.z = 0.6;
  sb.update();
  initScene();
  
}

export {
  main
}