import * as THREE from "three";
import * as ARCH from "@/archiweb"
import {create} from "@/piechart";

const doubled = function (color = 0xdddddd) {
  return new THREE.MeshPhongMaterial({
    color: color,
    side: THREE.DoubleSide,
    shadowSide: THREE.BackSide,
    flatShading: true
  });
}

const Block = function (segments, properties, group) {
  
  this.properties = properties ?? {};
  this.segments = segments;
  if(segments) {
    segments.material = doubled(0xffffff);
    segments.position.z = 0;
    ARCH.setPolygonOffsetMaterial(segments.material);
    segments.type = properties.type;
  }
  
  this.toSideBar = function() {
    window.piedata = []
    for (let key in properties['F_Diversity'] ) {
      window.piedata.push({label: key, val:properties['F_Diversity'][key]});
    }
  
    window.SideBar.items[1].hint = '' + properties['A'].toFixed(2) + 'm2';
    window.SideBar.items[2].hint = '' + properties['GSI'].toFixed(4);
    window.SideBar.items[3].hint = '' + (properties['T_dense']/Math.sqrt(properties['A'])).toFixed(4);
    create();
  }
  
  this.toTooltip = function() {
    return properties;
  }
  
  this.toArchiJSON = function() {
    let ret = {};
    ret.ratio = {};
    for (let item of window.SideBar.items) {
      ret.ratio[item.label] = item.val;
    }
    ret.GSI = properties.GSI;
    ret.area = properties.A;
    ret.activity = properties['T_dense']/Math.sqrt(properties['A']);
    
    ret.function = {};
    for (let item of window.piedata) {
      ret.function[item.label] = item.val;
    }
    return {properties: ret};
  }
  
  if(group) group.add(segments);
}


const Building = function (segments, properties, group) {
  this.properties = properties ?? {};
  this.segments = segments;
  
  if(properties.type === 'building') {
    segments.material = doubled(0);
    segments.position.z = 5;
    segments.children[1].material.color = new THREE.Color('#FFF')
    segments.type = properties.type;
  
  } else {
    segments.material = doubled(0x666666);
    segments.position.z = -5
    
  }
  ARCH.setPolygonOffsetMaterial(segments.material);
  if(group) group.add(segments);
}


const Road = function(segments, properties, group) {
  this.properties = properties ?? {};
  this.segments = segments;
  
  segments.position.z = -2;
  if(group) group.add(segments);
}

export {
  Block,
  Building,
  Road,
}