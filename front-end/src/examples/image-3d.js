import * as THREE from "three";
import * as ARCH from "@/archiweb"

let scene, gui;
let gf, mt;
let image;
let gb = [];

function getImageData(image) {
  
  const canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;
  
  const context = canvas.getContext('2d');
  context.drawImage(image, 0, 0);
  
  return context.getImageData(0, 0, image.width, image.height);
  
}

function getPixel(imagedata, x, y) {
  
  const position = (x + imagedata.width * y) * 4, data = imagedata.data;
  return {r: data[position], g: data[position + 1], b: data[position + 2], a: data[position + 3]};
  
}

function getIllumination(pixel) {
  Object.keys(pixel).map((key) => {
    pixel[key] /= 255
  });
  const i = 0.3 * pixel.r + 0.59 * pixel.g + 0.11 * pixel.b;
  return i * pixel.a;
}

function gcd(a, b) {
  return b ? gcd(b, a % b) : a;
}

function getDiff(imagedata, x, y, w, h) {
  let min = 1, max = 0;
  for (let i = x; i + 2 < x + w; i += 2) {
    for (let j = y; j + 2 < y + h; j += 2) {
      // console.log('i, j = ', i, j)
      let pixel = getPixel(imagedata, i, j);
      let illum = getIllumination(pixel);
      min = Math.min(illum, min);
      max = Math.max(illum, max);
    }
  }
  return {min, max};
}

function paintGrid(imagedata, x, y, w, h) {
  let {min, max} = getDiff(imagedata, x, y, w, h);
  // console.log(min, max);
  if (max - min > control.threshold && w > control.minimal && h > control.minimal) {
    let mw = Math.floor(w / 2);
    let mh = Math.floor(h / 2);
    paintGrid(imagedata, x, y, mw, mh);
    paintGrid(imagedata, x + mw, y, w - mw, mh);
    paintGrid(imagedata, x, y + mh, mw, h - mh);
    paintGrid(imagedata, x + mw, y + mh, w - mw, h - mh);
  } else {
    let pixel = getPixel(imagedata, x, y);
    // console.log(pixel)
    let illum = getIllumination(pixel);
    let color = new THREE.Color(pixel.r, pixel.g, pixel.b);
    gb.push(
      gf.Cuboid([x + w / 2 - imagedata.width / 2, -y - h / 2 + imagedata.height / 2, 0],
        [w, h, illum * w], mt.Matte(color), control.edge)
    );
  }
  
}

function generateGrid(imagedata) {
  let mn = gcd(imagedata.width, imagedata.height);
  console.log(mn)
  let mim = Math.max(90, control.minimal);
  if (mn < mim) mn = mim;
  // mn/=20;
  
  for (let x = 0; x < imagedata.width; x += mn) {
    for (let y = 0; y < imagedata.height; y += mn) {
      paintGrid(imagedata, x, y, mn, mn);
    }
  }
  ARCH.refreshSelection(scene);
}

/* ---------- create GUI ---------- */
function initGUI() {
  gui.add(control, 'edge');
  gui.add(control, 'threshold', 0, 1);
  gui.add(control, 'minimal', 1, 100, 1);
  gui.add(control, 'update');
  gui.add(control, 'save');
}

/* ---------- create your scene object ---------- */
function initScene() {
  gf = new ARCH.GeometryFactory(scene);
  mt = new ARCH.MaterialFactory();
  
  const loader = new ARCH.Loader(scene);
  loader.addGUI(gui);
  
  loader.addEventListener('load', (event) => {
    image = getImageData(event.object);
    clear();
    generateGrid(image);
  });
  
}

function clear() {
  gb.forEach((it) => {
    it.parent.remove(it);
  });
  gb = [];
}


const control = {
  edge: false,
  threshold: 0.3,
  minimal: 9,
  update: function () {
    clear();
    generateGrid(image);
  },
  save: function () {
  
    window.saveAsImage();
  }
}


/* ---------- main entry ---------- */
function main() {
  const viewport = new ARCH.Viewport();
  scene = viewport.scene;
  gui = viewport.gui.gui;
  
  if (viewport.isPC()) {
    viewport.enableDragFrames();
    viewport.enableTransformer();
  } else {
    viewport.controller.enablePan = true;
  }
  
  const sceneBasic = viewport.enableSceneBasic();
  sceneBasic.floorColor = '#ffffff';
  sceneBasic.y = 0;
  sceneBasic.axes = false;
  sceneBasic.shadow = false;
  sceneBasic.update();
  sceneBasic.gui.close();
  
  
  initGUI();
  initScene();
}

export {
  main
}