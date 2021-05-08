/* eslint-disable no-unused-vars,no-case-declarations */

import * as ARCH from "@/archiweb";
import * as THREE from "three";

let scene, renderer, gui, camera;
let gf, mt;
let am;

/* ---------- GUI setup ---------- */
function initGUI() {

}


/* ---------- create your scene object ---------- */
function initScene() {
  gf = new ARCH.GeometryFactory(scene);
  mt = new ARCH.MaterialFactory();
  
  const s1 = gb.Cuboid([150, 150, 0], [300, 300, 300], mt.Matte());
  
  const s2 = gb.Cuboid([-300, -300, 0], [300, 300, 100], mt.Matte());
  
  const s3 = gb.Cuboid([300, -500, 0], [300, 300, 150], mt.Matte());
  let points = [
    [-110, 460, 6],
    [50, 500, 6],
    [240, 410, 6],
    [520, 640, 6],
    [320, 940, 6],
    [-190, 730, 6]
  ]
  points.forEach((p) => balls.push(gf.Cylinder(p, [5, 2], mt.Flat(0xff0000), true)));
  
  segs = gf.Segments(balls.map((handle) => handle.position), true, 0x993322, true);
  
  points = [
    [-100, -100, 6],
    [100, -100, 6],
    [100, 100, 6],
    [0, 200, 6],
    [-100, 100, 6]
  ]
  
  points.forEach((p) => cubes.push(gf.Cuboid(p, [10, 10, 2], mt.Flat(0x0000ff))));
  segs2 = gf.Segments(cubes.map((handle) => handle.position), true, 0x223344, true);
  
  am.addSelection([s1, s2, s3], 1);
  am.addSelection(cubes, 1);
  am.addSelection(balls, 1);
  am.refreshSelection(scene);
  am.setCurrentID(1);
  
}


/* ---------- animate per frame ---------- */
function draw() {

}


/* ---------- main entry ---------- */
function main() {
  const viewport = new ARCH.Viewport();
  renderer = viewport.renderer;
  scene = viewport.scene;
  gui = viewport.gui;
  camera = viewport.camera;
  
  am = viewport.enableAssetManager();
  viewport.enableDragFrames();
  viewport.enableTransformer();
  viewport.enableSceneBasic();
  
  initGUI();
  initScene();
  
  viewport.draw = draw;
  
}

export {
  main
}
