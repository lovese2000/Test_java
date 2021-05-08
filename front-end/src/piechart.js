/* eslint-disable no-unused-vars,no-case-declarations */
"use strict";
import * as THREE from 'three'
import * as ARCH from "@/archiweb"
import {Lut} from "three/examples/jsm/math/Lut";

let renderer, scene, camera;
let gf, am, mt;


let handle = [], radius = 400;
let mouse;
const raycaster = new THREE.Raycaster();
const xoy = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);


function initScene() {
  gf = new ARCH.GeometryFactory(scene);
  mt = new ARCH.MaterialFactory();
  const light = new THREE.SpotLight(0xffffff, 1.0);
  light.position.set(0, 0, 1000);
  scene.add(light);
  
  create()
}

let cur = 0;
let circles, textMesh;


function createPieChart(data) {
  if (circles) scene.remove(circles);
  
  circles = new THREE.Group();
  let cnt = 1;
  
  let lut = new Lut('cooltowarm', handle.length);
  data.forEach((e) => {
    let color = lut.getColor(1 - cnt / (handle.length)).getHex();
    let c = new THREE.CircleGeometry(radius, 16, cur, Math.PI * 2.0 * e.val)
    
    let mesh = new THREE.Mesh(c, mt.Matte(color))
    mesh.add(ARCH.createMeshEdge(mesh));
    circles.add(mesh)
    
    e.color = color;
    cur += Math.PI * 2.0 * e.val;
    cnt += 1;
  })
  
  scene.add(circles);
}

function createPieLabel(data) {
  if (textMesh) scene.remove(textMesh);
  
  textMesh = new THREE.Group();
  const loader = new THREE.FontLoader();
  
  let y = 450;
  
  loader.load('fonts/helvetiker_regular.typeface.json', function (font) {
    data.forEach((e) => {
      textMesh.add(gf.Plane([520, y, 0], [50, 50], mt.Matte(e.color)));
      
      const text = new THREE.TextGeometry(e.label, {
        font: font,
        size: 50,
        height: 5,
      });
      let mesh = new THREE.Mesh(text, mt.Matte(0x000));
      mesh.position.set(600, y - 25, 0);
      textMesh.add(mesh);
      
      y -= 80;
    })
    
  });
  scene.add(textMesh);
}

function create() {
  if (handle) {
    handle.forEach((h) => h.parent.remove(h));
  }
  handle = []
  for (let data of window.piedata) {
    let angle = Math.PI * 2.0 * data.val;
    
    const lineGeometry = new THREE.BufferGeometry();
    const lineMaterial = new THREE.LineBasicMaterial({color: 0x000000});
    
    const line = new THREE.Line(lineGeometry, lineMaterial);
    line.start = new THREE.Vector3();
    line.end = new THREE.Vector3(radius * Math.cos(cur + angle), radius * Math.sin(cur + angle));
    line.data = data;
    
    lineGeometry.setFromPoints([line.start, line.end]);
    scene.add(line)
    handle.push(line);
    
    cur += angle;
  }
  
  cur = 0;
  createPieChart(window.piedata);
  createPieLabel(window.piedata);
}


function addMouseEvent() {
  renderer.domElement.addEventListener('pointermove', onMove);
  renderer.domElement.addEventListener('pointerdown', onDown);
  renderer.domElement.addEventListener('pointerup', onCancel);
  renderer.domElement.addEventListener('pointerleave', onCancel);
  raycaster.params.Line.threshold = 20;
  let line = null;
  
  function onMove(event) {
    event.preventDefault();
    
    var rect = renderer.domElement.getBoundingClientRect();
    
    mouse = new THREE.Vector2(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1
    )
    
    raycaster.setFromCamera(mouse, camera);
    let intersections = raycaster.intersectObjects(handle, true);
    if (intersections.length === 0) {
      if (renderer.domElement.style.cursor !== 'move') {
        line = null;
        renderer.domElement.style.cursor = 'auto';
      } else {
        let pt = raycaster.ray.intersectPlane(xoy, new THREE.Vector3());
        let angle = new THREE.Vector2(pt.x, pt.y).angle();
        line.end = new THREE.Vector3(radius * Math.cos(angle), radius * Math.sin(angle), 0);
        line.geometry.setFromPoints([line.start, line.end]);
        
      }
    } else if (line === null || intersections[0].object.uuid !== line.uuid) {
      line = intersections[0].object;
      renderer.domElement.style.cursor = 'pointer';
    }
    
  }
  
  
  function onDown(event) {
    event.preventDefault();
    if (line !== null) {
      
      renderer.domElement.style.cursor = 'move';
    }
  }
  
  
  function onCancel(event) {
    event.preventDefault();
    renderer.domElement.style.cursor = 'auto';
    
    let lastH = handle[handle.length - 1];
    for (let h of handle) {
      
      let angle = angleBetween(
        new THREE.Vector2(h.end.x, h.end.y).angle(),
        new THREE.Vector2(lastH.end.x, lastH.end.y).angle()
      )
      h.data.val = angle / (Math.PI * 2);
      lastH = h;
    }
    cur = new THREE.Vector2(lastH.end.x, lastH.end.y).angle();
    
    if (cur > Math.PI) cur = cur - Math.PI * 2;
    createPieChart(window.piedata)
    
    
    line = null;
  }
  
  
  function angleBetween(a, b) {
    if (b > a) return Math.PI * 2 - (b - a);
    return a - b;
  }
  
}


function main() {
  const size = document.getElementById('container').clientWidth;
  const viewport = new ARCH.Viewport(size, size / 3 * 2, 'piechart');
  
  renderer = viewport.renderer;
  scene = viewport.scene;
  camera = viewport.to2D();
  
  viewport.setCameraPosition([250, 0, 1000], [250, 0, 0])
  viewport.disableGUI();
  viewport.controller.enabled = false;
  
  initScene();
  addMouseEvent();
}

export {
  main,
  create
}
