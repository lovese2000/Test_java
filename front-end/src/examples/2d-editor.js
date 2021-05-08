import * as THREE from "three";
import * as ARCH from "@/archiweb"

import {DragControls} from "three/examples/jsm/controls/DragControls";

let scene, renderer, gui, camera;
let drag, controller;
let gf;
let count = 20;
let tangent = [];
let handle = [];
let left, right, center, curve;

function initScene() {
  tangent = []
  handle = []
  
  const axes = new THREE.AxesHelper(50)
  scene.add(axes);
  gf = new ARCH.GeometryFactory(scene);
  let controls = {
    color: 0xfafafa
  };
  scene.background = new THREE.Color(controls.color);
  
  gui.gui.addColor(controls, 'color').onChange(function () {
    scene.background = new THREE.Color(controls.color);
  });
  
  
  const light = new THREE.SpotLight(0xffffff, 1.5);
  light.position.set(0, 0, 1000);
  scene.add(light);
  
  let pos = [[-10, 30], [0, 10], [30, -10], [40, -30], [50, -50]];
  for (let p of pos) {
    handle.push(gf.Cylinder(p, [1, 1],
      new THREE.MeshLambertMaterial({color: 0xff0000})));
  }
  
  curve = new THREE.CatmullRomCurve3(handle.map((handle) => handle.position));
  curve.curveType = "centripetal";
  
  const points = curve.getPoints(50);
  
  
  for (let i = 0; i < count; ++i) {
    tangent.push(gf.Segments(null, false, 0xff000));
    tangent[i].rotation.z = Math.PI / 2;
    scene.add(tangent[i]);
  }
  left = gf.Segments(null, false, 0xff0000);
  right = gf.Segments(null, false, 0x0000ff);
  
  center = gf.Segments(points)
  
  ARCH.refreshSelection(scene);
  
  updateCurve();
}

function initDrag() {
  drag = new DragControls(handle, camera, renderer.domElement);
  drag.addEventListener('hoveron', function (event) {
    // console.log(event)
    let o = event.object;
    if (o.type === 'Cylinder') o.toInfoCard();
    controller.enabled = false;
  });
  drag.addEventListener('hoveroff', function () {
    controller.enabled = true;
  });
  
  drag.addEventListener('dragend', function (event) {
    let o = event.object;
    if (o.type === 'Cylinder') o.toInfoCard();
  });
  drag.addEventListener('drag', function () {
    const points = curve.getPoints(500);
    center.setFromPoints(points);
    updateCurve();
  })
}

function updateCurve() {
  for (let i = 0; i < count; ++i) {
    const t = i * (1. / count);
    let point = curve.getPointAt(t);
    let tangentAt = curve.getTangentAt(t);
  
    let e1 = tangentAt.clone().multiplyScalar(3);
    let e2 = tangentAt.clone().multiplyScalar(-3);
  
    tangent[i].geometry.setFromPoints([e1, e2]);
    tangent[i].position.copy(point);
  }
  const l = [];
  const r = [];
  
  for (let i = 0; i < count; ++i) {
    let normal = tangent[i].geometry.clone();
    normal.applyMatrix4(tangent[i].matrix);
    let position = normal.attributes.position;
    l.push(new THREE.Vector3(position.getX(0), position.getY(0), position.getZ(0)));
    r.push(new THREE.Vector3(position.getX(1), position.getY(1), position.getZ(1)));
  }
  
  let cv = new THREE.CatmullRomCurve3(l);
  left.setFromPoints(cv.getPoints(100))
  cv = new THREE.CatmullRomCurve3(r);
  right.setFromPoints(cv.getPoints(100))
  
  
}

function updateObject(uuid, model) {
  const o = scene.getObjectByProperty('uuid', uuid);
  o.updateModel(o, model);
  const points = curve.getPoints(500);
  center.setFromPoints(points);
  updateCurve();
}


function main() {
  const viewport = new ARCH.Viewport();
  renderer = viewport.renderer;
  
  scene = viewport.scene;
  gui = viewport.gui;
  controller = viewport.controller;
  
  camera = viewport.to2D();
  camera.zoom = 7;
  camera.updateProjectionMatrix();
  
  initScene();
  initDrag();
  
}

export {
  main,
  updateObject,
  
}
