/* eslint-disable no-unused-vars,no-case-declarations */
"use strict";
import * as THREE from 'three'
import * as ARCH from "@/archiweb"

let renderer, scene, gui;

let camera;

let gf, am, mt;
let balls = [], segs;
let cubes = [], segs2;

function initScene() {
  scene.background = new THREE.Color(0xfafafa);
  
  
  gf = new ARCH.GeometryFactory(scene);
  mt = new ARCH.MaterialFactory();
  
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
  
  am.addSelection(cubes, 1);
  am.addSelection(balls, 1);
  am.refreshSelection(scene);
  am.setCurrentID(1);
  
}

let curO = undefined;

function draw() {
  if (curO !== undefined) {
    if (balls.includes(curO))
      segs.setFromPoints((balls.map((handle) => handle.position)))
    if (cubes.includes(curO))
      segs2.setFromPoints((cubes.map((handle) => handle.position)))
    
  }
}


function draggingChanged(o, event) {
  if (event && (balls.includes(o) || cubes.includes(o))) {
    curO = o;
  } else {
    curO = undefined;
  }
}

function main() {
  const viewport = new ARCH.Viewport();
  scene = viewport.scene;
  renderer = viewport.renderer;
  gui = viewport.gui;
  camera = viewport.camera;
  
  am = viewport.enableAssetManager();
  viewport.enableDragFrames();
  let tr = viewport.enableTransformer();
  tr.draggingChanged = draggingChanged;
  tr.control.showZ = false;
  
  viewport.draw = draw;
  
  initScene();
  
  const sceneBasic = new ARCH.SceneBasic(scene, renderer);
  sceneBasic.addGUI(gui.gui);
  
}

export {
  main
}
