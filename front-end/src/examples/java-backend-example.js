import * as THREE from "three";
import * as ARCH from "@/archiweb"

let scene, gui;
let gf, mf;
let archijson;
let lastRandom = 1;

function random(seed) {
  seed = seed || lastRandom;
  return lastRandom = ('0.' + Math.sin(seed).toString().substr(6));
}

/* ---------- GUI setup ---------- */
const control = {
  seed: 1,
  num: 10,
  nx: 500,
  ny: 300,
  sendToJava: function () {
    archijson.sendArchiJSON('bts:sendGeometry', 'example', window.objects, property);
  }
}

const property = {
  d: 1,
}

function update() {
  generatePoints(control.num, control.nx, control.ny);
  border.scale.x = control.nx;
  border.scale.y = control.ny;
  
  control.sendToJava();
}

function initGUI() {
  
  gui.add(control, 'seed', 0, 1).onChange(() => {
    update()
  });
  gui.add(control, 'num', 5, 1000, 1).onChange(() => {
    update()
  });
  gui.add(control, 'nx', 100, 1000, 1).onChange(() => {
    update()
  });
  gui.add(control, 'ny', 100, 1000, 1).onChange(() => {
    update()
  });
  gui.add(property, 'd', 0.5, 20).onChange(() => {
    control.sendToJava();
  });
  
  gui.add(control, 'sendToJava').name('Send Geometries');
}


/* ---------- create your scene object ---------- */
let positions, colors, points, border;

function initScene() {
  scene.background = new THREE.Color('#ffffff');
  
  gf = new ARCH.GeometryFactory(scene);
  mf = new ARCH.MaterialFactory();
  //
  archijson = new ARCH.ArchiJSON(scene, gf);
  
  points = gf.Vertices();
  points.material = new THREE.PointsMaterial({size: 10, vertexColors: true})
  generatePoints(control.num, control.nx, control.ny);
  
  
  border = gf.Plane([0, 0, 0], [control.nx, control.ny, 0.5],
    mf.Void(), true);
  
  
  // refresh global objects
  ARCH.refreshSelection(scene);
  control.sendToJava();
}

function generatePoints(num, nx, ny) {
  positions = [];
  colors = [];
  random(control.seed);
  for (let i = 0; i < num; ++i) {
    const x = random() * nx - nx / 2;
    const y = random() * ny - ny / 2;
    positions.push(x, y, 0);
    colors.push(x / nx + 0.5, y / ny + 0.5, -x / nx + 0.5);
  }
  
  points.size = num;
  points.geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  points.geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  points.geometry.computeBoundingSphere();
}


/* ---------- animate per frame ---------- */
function draw() {

}


/* ---------- main entry ---------- */
function main() {
  const viewport = new ARCH.Viewport();
  scene = viewport.scene;
  gui = viewport.gui.gui;
  
  viewport.setCameraPosition([300, -400, 300], [0, 0, 0])
  initGUI();
  initScene();
  
  viewport.draw = draw;
  
}

export {
  main
}