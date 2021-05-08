import * as THREE from 'three'
import {LineMaterial} from "three/examples/jsm/lines/LineMaterial";
import {WireframeGeometry2} from "three/examples/jsm/lines/WireframeGeometry2";
import {Wireframe} from "three/examples/jsm/lines/Wireframe";

/**
 *      ___           ___           ___           ___                       ___           ___           ___
 *     /\  \         /\  \         /\  \         /\__\          ___        /\__\         /\  \         /\  \
 *    /::\  \       /::\  \       /::\  \       /:/  /         /\  \      /:/ _/_       /::\  \       /::\  \
 *   /:/\:\  \     /:/\:\  \     /:/\:\  \     /:/__/          \:\  \    /:/ /\__\     /:/\:\  \     /:/\:\  \
 *  /::\~\:\  \   /::\~\:\  \   /:/  \:\  \   /::\  \ ___      /::\__\  /:/ /:/ _/_   /::\~\:\  \   /::\~\:\__\
 * /:/\:\ \:\__\ /:/\:\ \:\__\ /:/__/ \:\__\ /:/\:\  /\__\  __/:/\/__/ /:/_/:/ /\__\ /:/\:\ \:\__\ /:/\:\ \:|__|
 * \/__\:\/:/  / \/_|::\/:/  / \:\  \  \/__/ \/__\:\/:/  / /\/:/  /    \:\/:/ /:/  / \:\~\:\ \/__/ \:\~\:\/:/  /
 *      \::/  /     |:|::/  /   \:\  \            \::/  /  \::/__/      \::/_/:/  /   \:\ \:\__\    \:\ \::/  /
 *      /:/  /      |:|\/__/     \:\  \           /:/  /    \:\__\       \:\/:/  /     \:\ \/__/     \:\/:/  /
 *     /:/  /       |:|  |        \:\__\         /:/  /      \/__/        \::/  /       \:\__\        \::/__/
 *     \/__/         \|__|         \/__/         \/__/                     \/__/         \/__/         ~~
 *
 *
 *
 * Copyright (c) 2020-present, Inst.AAA.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * Date: 2020-11-12
 * Author: Yichen Mo
 */
import {setMaterialDoubleSide, setPolygonOffsetMaterial} from "@/creator/MaterialFactory";

const GeometryFactory = function (_scene) {
  
  
  // Box Basic
  const boxGeometry = new THREE.BoxBufferGeometry(1, 1, 1);
  boxGeometry.translate(0, 0, 0.5);
  
  // Cylinder Basic
  const cylinderGeometry = new THREE.CylinderBufferGeometry(1, 1, 1, 32)
  cylinderGeometry.rotateX(Math.PI / 2);
  cylinderGeometry.translate(0, 0, 0.5);

  const planeGeometry = new THREE.PlaneBufferGeometry(1, 1);
  
  // const scope = this;
  // API
  this.Plane = function ([x, y, z], [w, h], material, showEdge = true) {
    let mesh = new THREE.Mesh(planeGeometry, material);
    sceneAddMesh(_scene, mesh, showEdge);
    
    mesh.type = 'Plane';
    mesh.scale.set(w, h, 1);
    mesh.position.set(x, y, z);
    
    publicProperties(mesh);
    return mesh;
  }
  
  this.Box = function ([x, y, z], [w, h, d], material, showEdge=true) {
    
    let mesh = new THREE.Mesh(boxGeometry, material);
    sceneAddMesh(_scene, mesh, showEdge)
    
    mesh.type = 'Box';
    mesh.scale.set(w, h, d);
    mesh.position.set(x, y, z);
    
    publicProperties(mesh);
    
    return mesh;
  }
  
  this.Cylinder = function ([x, y, z], [r, h], material, showEdge = false) {
    let mesh = new THREE.Mesh(cylinderGeometry, material);
    sceneAddMesh(_scene, mesh, showEdge);
    
    mesh.type = 'Cylinder';
    mesh.scale.set(r, r, h);
    mesh.position.set(x, y, z);
    
    publicProperties(mesh);
    return mesh;
  }
  
  this.Line = function (points, color=0x000, selectable=false) {
    let line = new THREE.Line(
      new THREE.BufferGeometry(),
      new THREE.LineBasicMaterial( { color: color } )
    );
    if(selectable)
      sceneAddMesh(_scene, line, false);
    else
      sceneAddMesh(_scene, line, false, false, []);
  
    line.type = 'Line';
    if(points)
      line.geometry.setFromPoints(points);
    publicProperties(line);
    return line;
  }
  

  /**
   * 2D shape to extruded geometry, set extruded = 0.0 to get a 2d polygon
   *
   * @param shape
   * @param material
   * @param height
   * @param extruded
   * @returns {Mesh<ExtrudeGeometry, *>}
   * @constructor
   */
  this.Shape = function (shape, material, height=0.0, extruded=0.0) {
    const o = getPointsCenter(shape.getPoints());
    console.log(o)
    
    const extrudeSettings = {
      depth:1.,
      bevelEnabled:false
    }
    
    const mesh = new THREE.Mesh(
      new THREE.ExtrudeGeometry(shape, extrudeSettings),
      material
    );
  
    mesh.type = 'Shape';
    mesh.geometry.translate(-o.x, -o.y, 0);
    mesh.position.x = o.x;
    mesh.position.y = o.y;
    mesh.position.z = height;
    mesh.scale.z = extruded;
    sceneAddMesh(_scene, mesh)
    
    publicProperties(mesh);
    return mesh;
  }
  
  
  
  function getPointsCenter(points) {
    const v = new THREE.Vector2();
    points.forEach((pt)=>{
      v.add(pt);
    })
    v.divideScalar(points.length);
    return v;
  }
  
  
  function updateModel (self, modelParam) {
    switch (self.type) {
      case 'Plane':
        self.scale.x = modelParam['w'];
        self.scale.y = modelParam['h'];
        break;
      case 'Box' :
        self.scale.x = modelParam['w'];
        self.scale.y = modelParam['h'];
        self.scale.z = modelParam['d'];
        break;
      case 'Cylinder' :
        self.scale.x = modelParam['r'];
        self.scale.y = modelParam['r'];
        self.scale.z = modelParam['h'];
        break;
      case 'Shape':
        self.scale.z = modelParam['h'];
        break;
      default:
        break;
    }
  }
  
  function modelParam (self) {
    switch (self.type) {
      case 'Plane':
        return {w: self.scale.x, h:self.scale.y};
      case 'Box':
        return {w: self.scale.x, h: self.scale.y, d: self.scale.z};
      case 'Cylinder':
        return {r: self.scale.x, h: self.scale.z};
      case 'Shape':
        return {h: self.scale.z};
      default:
        return {};
    }
  }
  
  
  function publicProperties (mesh) {
    
    mesh.updateModel = updateModel;
    mesh.modelParam = modelParam;
    
    mesh.exchange = true;
    mesh.toArchiJSON = function () {
      return {type: mesh.type, matrix: mesh.matrix.elements, uuid:mesh.uuid, position:mesh.position, param: mesh.modelParam(mesh)};
    }
    
    mesh.toInfoCard = function () {
      let o = mesh;
      window.InfoCard.info.uuid = o.uuid;
      window.InfoCard.info.position = o.position;
      window.InfoCard.info.model = o.modelParam(o);
      window.InfoCard.info.properties = {
        type: o.type, material:
          JSON.stringify({
            type: o.material.type,
            uuid: o.material.uuid,
            color: o.material.color,
            opacity: o.material.opacity
          })
        , matrix: o.matrix.elements
      };
    }
  }
  
}


function createMeshEdge(mesh, color = 0x000000) {
  if(!mesh.geometry) return;
  
  setPolygonOffsetMaterial(mesh.material);
  
  const matLine = new THREE.LineBasicMaterial({color: color});
  const geoLine = new THREE.EdgesGeometry(mesh.geometry);
  return new THREE.LineSegments(geoLine, matLine);
}

/**
 * create mesh wireframe with linewidth, must use specific LineMaterial in three@r0.121
 * @param mesh
 * @param color
 * @param linewidth
 * @returns {Wireframe}
 */
function createMeshWireframe(mesh, color = 0xffff00, linewidth) {
  
  setPolygonOffsetMaterial(mesh.material);
  
  const matLine = new LineMaterial({color: color, linewidth: linewidth});
  const geoLine = new WireframeGeometry2(mesh.geometry);
  const wireframe = new Wireframe(geoLine, matLine);
  wireframe.computeLineDistances();
  wireframe.scale.set(1, 1, 1);
  return wireframe;
}

function sceneMesh(object, shadow=true, doubleSide=false, layer=[0]) {
  object.traverseVisible((mesh)=>{
    mesh.layer = layer;
    console.log(mesh)
    if(shadow) {
      mesh.castShadow = true;
      mesh.receiveShadow = true;
    }
    if(mesh.isMesh) {
      if(doubleSide) {
        setMaterialDoubleSide(mesh.material);
      }
      mesh.add(createMeshWireframe(mesh, 0xffff00, 0.005));
      mesh.children[0].visible = false;
      mesh.layer=[0];
    }
  });
}

/**
 * add a new mesh to a object3D (scene, group)
 * @param object
 * @param mesh
 * @param edge 
 * @param shadow
 * @param layer
 */
function sceneAddMesh (object, mesh, edge = true, shadow = true, layer=[0]) {
  // show edge
  setPolygonOffsetMaterial(mesh.material);
  mesh.add(createMeshWireframe(mesh, 0xffff00, 0.005));
  mesh.children[0].visible = false;
  
  if(edge.isLineSegments) {
    mesh.add(edge);
  } else if (edge === true) {
    mesh.add(createMeshEdge(mesh));
  }
  // show shadow
  if(shadow) {
    mesh.castShadow = true;
    mesh.receiveShadow = true;
  }
  
  // layer, default is [0]
  mesh.layer = layer;
  object.add(mesh);
}
export {
  GeometryFactory,
  sceneMesh,
  sceneAddMesh,
  createMeshWireframe,
  createMeshEdge
};