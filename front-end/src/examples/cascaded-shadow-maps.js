"use strict";
import * as ARCH from "@/archiweb"

let scene, csm;

let gf, am;

function initScene() {
  
  gf = new ARCH.GeometryFactory(scene);
  const mt = new ARCH.MaterialFactory();
  
  const matte = mt.Matte(0xffffff);
  csm.setupMaterial(matte);
  
  let cubes = [];
  
  for (let i = 0; i < 6; ++i) {
    for (let j = 0; j < 18; ++j) {
      let height = Math.random() * 1000 + 300;
      cubes.push(gf.Cuboid([900 * i - 3000, j * 600 - 1000, 0], [200, 200, height], matte))
    }
  }
  
  am.refreshSelection(scene);
  am.addSelection(cubes, 1);
  am.setCurrentID(1);
  
}


function main() {
  const viewport = new ARCH.Viewport();
  scene = viewport.scene;
  
  viewport.setCameraPosition([800, -2000, 270], [800, 20, 300]);
  
  const sceneBasic = viewport.enableSceneBasic(true, true);
  sceneBasic.skyColor = '#e8c8c8';
  sceneBasic.floorColor = '#5b2d2d';
  sceneBasic.x = 0.4;
  sceneBasic.y = 0.5;
  sceneBasic.z = -0.8;
  sceneBasic.axes = false;
  sceneBasic.update();
  csm = sceneBasic.csm;
  
  
  am = viewport.enableAssetManager();
  viewport.enableDragFrames();
  viewport.enableTransformer();
  
  
  initScene();
  
}

export {
  main
}
