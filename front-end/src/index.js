/* eslint-disable no-unused-vars,no-case-declarations */
"use strict";
import * as ARCH from "@/archiweb"
import socket from "@/socket";
import * as THREE from "three";
import {DragControls} from "three/examples/jsm/controls/DragControls";
import {Block, Building, Road} from "@/data";

let renderer, scene, drag;
let gf, am, mt;

let camera, light;
let environment, buildings;

let handles=[];
let EDITMODE = false, IMAGEMODE = false;

let blockID = 1936  , block;

//1936

function setBlockID(id) {
  blockID = id;
  
  handles.forEach((handle)=>{
    handle.forEach((h)=>{
      h.parent.remove(h);
    })
  })
  handles = [];
  buildings.clear();
  environment.clear();
  if(block) {
    block.segments.parent.remove(block.segments)
  }
  
  socket.emit('browserQueryCanvas', {properties: {id:blockID}})
  
}

function searchImage() {
  if(!IMAGEMODE) {
    alert("Press R to toggle image mode.")
    return;
  }
  
  let size = new THREE.Vector2();
  renderer.getSize(size);
  let w = size.x;
  let h = size.y;
  
  let renderin = new THREE.WebGLRenderer({antialias: true, alpha: true, preserveDrawingBuffer: true});
  renderin.autoClear = false;
  renderin.setPixelRatio(window.devicePixelRatio);
  renderin.setSize(w, h)
  const rt = new THREE.WebGLRenderTarget(w, h);
  // renderin.render(scene, camera);
  // renderin.setRenderTarget(rt);
  renderin.render(scene, camera, rt);
  
  const buffer = new Uint8Array(w * h * 4);
  renderin.readRenderTargetPixels(rt, 0, 0, w, h, buffer);
  let res = new Array(w * h);
  for(let i = 0; i < w * h; ++ i) {
    res[i] = buffer[4*i];
  }
  
  let params = block.toArchiJSON();
  params.image = res;
  
  window.Result.blocks = [];
  socket.emit('browserSearchImage', params)
}


function initWS() {
  socket.on('resultBlocks', async function(data){
    
    for (let e of data) {
      window.Result.blocks.push(e);
    }
  })
  
  socket.on('canvasResult', async function (data) {
    if(data.properties.status === 'error') {
      alert('canvas init error');
      return;
    }
  


    for(let e of data.geometryElements) {
      let points = gf.coordinatesToPoints(e.coordinates, e.size);
      if(e.closed) points.pop();
  
      let handle = [];
      
      if( e.properties.type === 'block' || e.properties.type === 'building') {
        points.forEach((p)=>{
          handle.push(gf.Cylinder([p.x, p.y, p.z], [1, 10], mt.Matte(0xB68D70), false));
        });
        am.addSelection(handle, 1);
        handles.push(handle);
      }
      
      if( e.properties.type === 'block') {
        block = new Block(gf.Segments(points, e.closed, 0xffffff, true), e.properties);
        block.toSideBar();
        handle.object = block.segments;
      } else if (e.properties.type === 'building') {
        let building = new Building(gf.Segments(points, e.closed, 0, true), e.properties, buildings);
        handle.object = building.segments;
      } else if (e.properties.type === 'road') {
        new Road(gf.Segments(points, e.closed), e.properties, environment);
      } else {
        new Building(gf.Segments(points, e.closed, 0x444444, true), e.properties, environment);
      }
    }
  
    initDrag();
  
    toggleImageMode(true);
    searchImage();
    toggleImageMode(false);
    toggleEditMode(EDITMODE);
    am.refreshSelection(scene);
    am.setCurrentID(1);
  });
}

function initScene() {
  scene.background = new THREE.Color('#cccccc');
  handles = []
  
  gf = new ARCH.GeometryFactory(scene);
  mt = new ARCH.MaterialFactory();
  light = new THREE.AmbientLight( 0xffffff ); // soft white light
  scene.add( light );
  environment = new THREE.Group();
  buildings = new THREE.Group();
  scene.add(buildings);
  scene.add(environment);
  socket.emit('browserQueryCanvas', {properties: {id:blockID}})
}

function initDrag() {
  drag = new DragControls(handles.flat(), camera, renderer.domElement);

  drag.addEventListener('drag', function (event) {
    handles.forEach((handle) => {
      if(handle.includes(event.object)) {
        let z;
        if(handle.object.type === 'building') z = 5;
        else if(handle.object.type === 'block') z = 0;
        handle.object.setFromPoints((handle.map((h) => new THREE.Vector3(h.position.x, h.position.y, z))));
      }
    })
  
  })
}

function addKeyEvent() {
  renderer.domElement.addEventListener('keydown', onDocumentKeyDown, false);
  
  function onDocumentKeyDown(event) {
    if(event.altKey || event.ctrlKey || event.shiftKey) return;
    console.log(event);
    switch (event.keyCode) {
      case 69: // e
        if(IMAGEMODE) toggleImageMode(false)
        EDITMODE = !EDITMODE;
        toggleEditMode(EDITMODE);
        break;
      case 82: // r
        if(EDITMODE) toggleEditMode(false);
        IMAGEMODE = !IMAGEMODE;
        toggleImageMode(IMAGEMODE);
        break;
      case 83: // s
        if(IMAGEMODE)
          searchImage();
        
    }
  }
}


function toggleImageMode(mode) {
  IMAGEMODE = mode;
  handles.forEach((handle)=>{
    handle.forEach((h)=>{
      h.visible = false;
    })
  })
  environment.visible = !mode;
  block.segments.children[1].visible = mode;
  drag.deactivate();
  
  if(mode) {
    scene.background = new THREE.Color('#ffffff');
  } else {
    scene.background = new THREE.Color('#cccccc');
  }
}

function toggleEditMode(mode) {
  EDITMODE = mode;
  handles.forEach((handle)=>{
    handle.forEach((h)=>{
      h.visible = mode;
    })
  })
  
  environment.visible = !mode;
  block.segments.children[1].visible = mode;
  if(mode) {
    drag.activate();
  } else {
    drag.deactivate();
  }
}

function clear(list) {
  list = list ?? [];
  list.forEach((e)=>{
    if(Array.isArray(e)) {
      clear(e);
    } else {
      e.parent.remove(e)
    }
  });
  list = [];
}

function main() {
  const size = document.getElementById('container').clientWidth;
  
  const viewport = new ARCH.Viewport(size, size);
  renderer = viewport.renderer;
  scene = viewport.scene;
  viewport.controller.enabled = false;
  
  camera = viewport.to2D();
  camera.zoom = 3;
  camera.updateProjectionMatrix();
  
  am = viewport.enableAssetManager();
  viewport.disableGUI();
  
  initWS();
  initScene();
  addKeyEvent();
}

export {
  main,
  searchImage,
  setBlockID,
}
