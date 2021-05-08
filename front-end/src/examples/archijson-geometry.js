import * as ARCH from "@/archiweb"
import {building} from "@/assets/models/csg";

let scene, gui;
let gf, mt, am;
let archijson;

let reconstructed = [];
let balls = []
let segments, prism, vertices, mesh;

/* ---------- GUI setup ---------- */
const control = {
  send: function () {
    reconstructed.forEach((it) => {
      it.parent.remove(it);
    })
    reconstructed = [];
    
    am.setCurrentID(1);
    archijson.sendArchiJSON('bts:sendGeometry', 'archijson', window.objects);
  },
  dragChanging: false
}

function initGUI() {
  gui.gui.add(control, 'send');
  gui.gui.add(control, 'dragChanging');
}

function parseGeometry(geometryElements) {
  for (let e of geometryElements) {
    
    let b = scene.getObjectByProperty('uuid', e.uuid);
    
    if (!b) {
      if (e.type === 'Mesh') {
        console.log(e)
        b = gf.Mesh(e.vertices, e.faces);
        console.log(b)
    
      } else {
        b = gf[e.type]();
        reconstructed.push(b);
      }
    }
    
    b.fromArchiJSON(b, e);
  }
  ARCH.refreshSelection(scene);
}


/* ---------- create your scene object ---------- */
function initScene() {
  gf = new ARCH.GeometryFactory(scene);
  mt = new ARCH.MaterialFactory();
  archijson = new ARCH.ArchiJSON(scene, gf);
  
  const cuboid = gf.Cuboid([100, 100, 0], [200, 200, 300], mt.Matte(0xff0000));
  
  const cylinder = gf.Cylinder([400, 300, 0], [100, 400], mt.Matte(0xffff00), true);
  
  const plane = gf.Plane([-600, 300, 5], [600, 600], mt.Matte(0xff00ff), true)
  
  // let points = [[-190, 730, 6], [320, 940, 6], [520, 640, 6], [240, 410, 6], [50, 500, 6], [-110, 460, 6]]
  let points = [
    [-110, 460, 6],
    [50, 500, 6],
    [240, 410, 6],
    [520, 640, 6],
    [320, 940, 6],
    [-190, 730, 6]
  ]
  points.forEach((p) => balls.push(gf.Sphere(p, 10, mt.Flat(0xff0000))));
  
  segments = gf.Segments(balls.map((handle) => handle.position), true);
  
  prism = gf.Prism(segments,
    mt.Matte(0x0000ff), 5, 1)
  
  /* ---------- generate points each 5000 area ---------- */
  vertices = gf.Vertices(gf.pointsInsideSegments(segments, 5000), 6)
  
  
  /* ---------- generate mesh ---------- */
  mesh = gf.Mesh({coordinates: building.verts.flat(), size: 3}, {index: building.faces.flat()}, mt.Flat());
  // mesh = geoFty.Mesh(polygonmesh.vertices, polygonmesh.faces, matFty.Flat())
  
  /* ---------- refresh global objects ---------- */
  ARCH.refreshSelection(scene);
  am.addSelection(balls, 2)
  am.addSelection([cuboid, cylinder, plane, segments, vertices, mesh], 1);
  am.setCurrentID(1);
  
  
  /* ---------- handle returned object ---------- */
  archijson.parseGeometry = parseGeometry;
}

window.searchSceneByUUID = function (uuid) {
  return scene.getObjectByProperty('uuid', uuid);
}


function draw() {
  if (control.dragChanging && curO) {
    segments.setFromPoints((balls.map((handle) => handle.position)))
    prism.setFromSegments(segments);
  
    vertices.geometry.setFromPoints(gf.pointsInsideSegments(segments, 5000))
  }
}

let curO = undefined;

function draggingChanged(o, event) {
  if (event && balls.includes(o)) {
    curO = o;
  } else {
    curO = undefined;
  }
  
  if (!event && balls.includes(o)) {
    
    segments.setFromPoints((balls.map((handle) => handle.position)))
    prism.setFromSegments(segments);
    
    vertices.geometry.setFromPoints(gf.pointsInsideSegments(segments, 5000))
  }
}

function updateObject(uuid, model) {
  const o = scene.getObjectByProperty('uuid', uuid);
  o.updateModel(o, model);
}

/* ---------- main entry ---------- */
function main() {
  const viewport = new ARCH.Viewport();
  scene = viewport.scene;
  gui = viewport.gui;
  
  am = viewport.enableAssetManager();
  viewport.enableDragFrames();
  let tr = viewport.enableTransformer();
  tr.draggingChanged = draggingChanged;
  
  viewport.draw = draw;
  initGUI();
  initScene();
  
  const sceneBasic = viewport.enableSceneBasic();
  sceneBasic.floorColor = '#ffffff';
  sceneBasic.update();
}

export {
  main,
  updateObject
}