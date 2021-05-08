/* eslint-disable no-unused-vars,no-case-declarations */
import mapboxgl from 'mapbox-gl';
import * as dat from 'dat.gui';
import {my_accesstoken} from "@/testdata";
import * as ARCH from "@/archiweb";
import * as THREE from 'three';

let gui, util, map;

mapboxgl.accessToken = 'your_token';
mapboxgl.accessToken = my_accesstoken;

let control = {
  randomCenter: function () {
    let center = map.getCenter();
    let dx = Math.random() * 0.02 - 0.01;
    let dy = Math.random() * 0.02 - 0.01;
    map.flyTo({
      center: [center.lng + dx, center.lat + dy],
      essential: true
    });
    
  },
  getAABB: function () {
    let bbox = [[16.371658895495273, 48.20703295326334], [16.37303218651013, 48.207855212279554]]
    let range = [];
    bbox.forEach((p) => {
      range.push(mousePos(map.project(p)))
    });
    let features = map.queryRenderedFeatures(range, {
      layers: ['building']
    });
    
    // add one layer and source
    let feature = JSON.parse(JSON.stringify(features[0]));
    feature.toJSON = features[0].toJSON;
    feature.geometry.coordinates = [];
    for (let i = 0; i < features.length; ++i) {
      feature.geometry.coordinates.push(features[i].geometry.coordinates);
    }
    feature.geometry.type = 'MultiPolygon';
    highlightBuilding(feature, '-aabb');
  
    // add multiple layer and source
    // for (let i = 0; i < features.length; ++i) {
    //   highlightBuilding(features[i], 'h' + i.toString());
    // }
  },
  show3D: false
}
var modelOrigin = [16.371658895495273, 48.20703295326334];
var modelAltitude = 0;
var modelRotate = [0, 0, 0];

var modelAsMercatorCoordinate = mapboxgl.MercatorCoordinate.fromLngLat(
  modelOrigin,
  modelAltitude
);

// transformation parameters to position, rotate and scale the 3D model onto the map
var modelTransform = {
  translateX: modelAsMercatorCoordinate.x,
  translateY: modelAsMercatorCoordinate.y,
  translateZ: modelAsMercatorCoordinate.z,
  rotateX: modelRotate[0],
  rotateY: modelRotate[1],
  rotateZ: modelRotate[2],
  /* Since our 3D model is in real world meters, a scale transform needs to be
  * applied since the CustomLayerInterface expects units in MercatorCoordinates.
  */
  scale: modelAsMercatorCoordinate.meterInMercatorCoordinateUnits()
};

function initGUI() {
  gui = new dat.GUI({autoPlace: false});
  
  util = gui.addFolder('Utils');
  util.add(control, 'randomCenter').name('center');
  util.add(control, 'getAABB').name('getAABB');
  util.add(control, 'show3D').onChange(() => {
    if (control.show3D) {
      map.addLayer(
        {
          'id': '3d-buildings',
          'source': 'composite',
          'source-layer': 'building',
          'filter': ['==', 'extrude', 'true'],
          'type': 'fill-extrusion',
          'minzoom': 16.6,
          'paint': {
            'fill-extrusion-color': '#aaa',
            
            'fill-extrusion-height': [
              'interpolate',
              ['linear'],
              ['zoom'],
              16.99,
              0,
              17.04,
              ['get', 'height']
            ],
            'fill-extrusion-base': [
              'interpolate',
              ['linear'],
              ['zoom'],
              16.99,
              0,
              17.04,
              ['get', 'min_height']
            ],
            'fill-extrusion-opacity': 0.96
          },
        },
      );
      
    } else {
      map.removeLayer('3d-buildings')
    }
  })
  util.open();
  
  const container = document.getElementById('gui-container');
  container.appendChild(gui.domElement);
}

function initScene() {
  let modelLayer = {
    id: '3d-model',
    type: 'custom',
    renderingMode: '3d',
    onAdd: function (map, gl) {
      this.camera = new THREE.Camera();
      this.scene = new THREE.Scene();
      this.map = map;
      this.renderer = new THREE.WebGLRenderer({
        canvas: map.getCanvas(),
        context: gl,
        antialias: true
      });
      this.renderer.autoClear = false;
  
  
      const sb = new ARCH.SceneBasic(this.scene, this.renderer);
      sb.lightOnly();
      sb.addGUI(gui);
      const gf = new ARCH.GeometryFactory(this.scene);
      const mt = new ARCH.MaterialFactory();
  
      const box = gf.Cuboid([1, 1, 0], [0.6, 0.6, 1.8], mt.Matte(0xff0000));
  
      const loader = new ARCH.Loader(this.scene);
      loader.loadModel('http://model.amomorning.com/tree/autumn-tree.dae', (mesh) => {
        mesh.position.set(22, 22, 0)
        mesh.scale.set(0.05, 0.05, 0.05);
      })
  
    },
    render: function (gl, matrix) {
      var rotationX = new THREE.Matrix4().makeRotationAxis(
        new THREE.Vector3(1, 0, 0),
        modelTransform.rotateX
      );
      var rotationY = new THREE.Matrix4().makeRotationAxis(
        new THREE.Vector3(0, 1, 0),
        modelTransform.rotateY
      );
      var rotationZ = new THREE.Matrix4().makeRotationAxis(
        new THREE.Vector3(0, 0, 1),
        modelTransform.rotateZ
      );
      
      var m = new THREE.Matrix4().fromArray(matrix);
      var l = new THREE.Matrix4()
        .makeTranslation(
          modelTransform.translateX,
          modelTransform.translateY,
          modelTransform.translateZ
        )
        .scale(
          new THREE.Vector3(
            modelTransform.scale,
            -modelTransform.scale,
            modelTransform.scale
          )
        )
        .multiply(rotationX)
        .multiply(rotationY)
        .multiply(rotationZ);
      
      this.camera.projectionMatrix = m.multiply(l);
  
      this.renderer.resetState();
      this.renderer.render(this.scene, this.camera);
      this.map.triggerRepaint();
    }
  };
  
  map.on('style.load', function () {
    map.addLayer(modelLayer, 'waterway-label');
  });
  
  window.onresize = function () {
    modelLayer.renderer.setSize(window.innerWidth, window.innerHeight);
    // model position is a little bit up
    // camera resize is needed?
  }
}

function mousePos(e) {
  let canvas = map.getCanvasContainer();
  let rect = canvas.getBoundingClientRect();
  return new mapboxgl.Point(
    e.x - rect.left - canvas.clientLeft,
    e.y - rect.top - canvas.clientTop
  )
}

function highlightBuilding(feature, id = '') {
  if (typeof map.getLayer('building-highlighted' + id) !== "undefined" &&
    map.getSource('building-highlighted' + id)._data.id !== feature.id) {
    map.removeLayer('building-highlighted' + id)
    map.removeSource('building-highlighted' + id);
    
  }
  
  if (typeof map.getLayer('building-highlighted' + id) === "undefined") {
    map.addSource('building-highlighted' + id, {
      "type": "geojson",
      "data": feature.toJSON()
    });
  }
  
  if (typeof map.getLayer('building-highlighted' + id) === "undefined") {
    map.addLayer({
        'id': 'building-highlighted' + id,
        'type': 'fill',
        'source': 'building-highlighted' + id,
        'paint': {
          'fill-outline-color': '#775858',
          'fill-color': '#775858',
          'fill-opacity': 1,
        },
      }
    )
  }
}

/* ---------- main entry ---------- */
function main() {
  
  map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/amomorning/ckmzydbvf0aik18obwp77yn5g', // style URL
    center: [16.373, 48.208], // starting position [lng, lat]
    minZoom: 11,
    zoom: 15.1,
    antialias: true
  });
  
  map.addControl(new mapboxgl.FullscreenControl(), 'bottom-left');
  map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
  initGUI();
  initScene();
  map.on('load', () => {
    
    map.on('mousemove', function (e) {
      if (!control.show3D) {
        let feature = map.queryRenderedFeatures(e.point, {layers: ['building']})[0];
        if (feature === undefined) {
          if (typeof map.getLayer('building-highlighted') !== "undefined") {
            map.removeLayer('building-highlighted')
          }
          if (typeof map.getSource('building-highlighted') !== "undefined") {
              map.removeSource('building-highlighted')
            }
          } else {
  
          if (feature.id !== undefined) {
            let range = []
            let canvas = map.getCanvasContainer();
            range.push(new mapboxgl.Point(0, 0));
            range.push(new mapboxgl.Point(canvas.clientWidth, canvas.clientWidth))
            let sameid = map.queryRenderedFeatures(range, {layers: ['building']});
            let coords = feature.geometry.coordinates;
            feature.geometry.coordinates = [coords];
    
            for (let i = 0; i < sameid.length; ++i) {
              if (sameid[i].id === feature.id) {
        
                if (sameid[i].geometry.type === 'MultiPolygon') {
                  for (let j = 0; j < sameid[i].geometry.coordinates.length; ++j) {
                    feature.geometry.coordinates.push(sameid[i].geometry.coordinates[j]);
                  }
          
                } else {
                  feature.geometry.coordinates.push(sameid[i].geometry.coordinates);
                }
              }
            }
            feature.geometry.type = 'MultiPolygon';
    
          }
  
          highlightBuilding(feature);
  
        }
          
        }
      }
    );
    
    // map.on('click', function (e) {
    //   console.log(e.lngLat);
    //   console.log(map.unproject(e.point));
    // })
  })
  
}

export {
  main
}
