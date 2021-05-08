/* eslint-disable no-unused-vars */
import * as THREE from 'three'
import CSM from 'three-csm';
// THREE.CSM = CSM;

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

const SceneBasic = function (_scene, _renderer, _camera) {
  let scope = this;
  this.csm;
  this._transformer;
  this.skyColor = '#c4ced6';
  this.floorColor = '#80807a';
  this.sunColor = '#ffffff';
  this.ambientColor = '#444445'
  this.x = 0.4;
  this.y = -0.6;
  this.z = 0.6;
  
  const scale = new THREE.Vector3(1500, 1500, 1500);
  const matFloor = new THREE.MeshPhongMaterial({color: scope.floorColor, depthWrite: false});
  const geoFloor = new THREE.PlaneBufferGeometry(50000, 50000);
  const mshFloor = new THREE.Mesh(geoFloor, matFloor);
  const dirLight = new THREE.DirectionalLight(scope.sunColor);
  const ambientLight = new THREE.AmbientLight(scope.ambientColor);
  
  let gridHelper = new THREE.GridHelper(1000, 20);
  let axesHelper = new THREE.AxesHelper(5000);
  
  let _basic = new THREE.Group();
  
  
  function init() {
    _renderer.outputEncoding = THREE.sRGBEncoding;
    _renderer.shadowMap.enabled = true;
    _renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  
  
    _scene.add(_basic);
    matFloor.polygonOffset = true;
    matFloor.polygonOffsetFactor = 1.0;
    matFloor.polygonOffsetUnits = 1.0;
  
    mshFloor.receiveShadow = true;
    mshFloor.position.set(0, 0, -0.5);
    _basic.add(mshFloor);
  
  
    _scene.background = new THREE.Color(scope.skyColor);
    _scene.fog = new THREE.FogExp2(scope.skyColor, 0.00018);
  
    _basic.add(ambientLight);
  
    if (_camera) {
      scope.csm = new CSM({
        maxFar: 50000,
        lightIntensity: 1,
        lightFar: 10000,
        lightNear: 0.01,
        cascades: 6,
        parent: _scene,
        shadowMapSize: 4096,
        lightDirection: new THREE.Vector3(scope.x, scope.y, scope.z).normalize(),
        camera: _camera
      });
      scope.csm.fade = true;
      scope.csm.setupMaterial(matFloor)
    
    
    } else {
      dirLight.position.set(scale.x * scope.x, scale.y * scope.y, scale.z * scope.z);
    
      dirLight.castShadow = true;
      dirLight.shadow.camera.top = 10000;
      dirLight.shadow.camera.bottom = -5000;
      dirLight.shadow.camera.left = -5000;
      dirLight.shadow.camera.right = 5000;
      dirLight.shadow.camera.near = 10;
      dirLight.shadow.camera.far = 10000;
      dirLight.shadow.mapSize.set(4096, 4096);
      dirLight.shadow.bias = -0.0001;
      _basic.add(dirLight);
    }
    // _scene.add( new THREE.CameraHelper( dirLight.shadow.camera ) );
    // _scene.add( new THREE.DirectionalLightHelper(dirLight));
  
  
    gridUpdate();
    axesUpdate();
  }
  
  function axesUpdate(toggle) {
    if (toggle === false)
      _basic.remove(axesHelper);
    else
      _basic.add(axesHelper);
  }
  
  function gridUpdate(size) {
    _basic.remove(gridHelper);
    if (size > 0) {
      gridHelper = new THREE.GridHelper(20 * size, 20, 0x222222, 0x444444);
      gridHelper.rotateX(Math.PI / 2.0);
      _basic.add(gridHelper);
    }
  }
  
  function skyColorUpdate(fog = true) {
    _scene.background.set(scope.skyColor);
    if (fog) {
      _scene.fog.density = 0.00018;
      _scene.fog.color.set(scope.skyColor);
    } else
      _scene.fog.density = 0;
  }
  
  function update() {
    axesUpdate(scope.axes);
    skyColorUpdate(scope.fog);
    gridUpdate(scope.grid);
    mshFloor.material.color.set(scope.floorColor);
    ambientLight.color.set(scope.ambientColor);
  
    if (_camera) {
      scope.csm.lightDirection.x = scope.x;
      scope.csm.lightDirection.y = scope.y;
      scope.csm.lightDirection.z = scope.z;
    
    } else {
      dirLight.castShadow = scope.shadow;
      dirLight.position.x = scope.x * scale.x;
      dirLight.position.y = scope.y * scale.y;
      dirLight.position.z = scope.z * scale.z;
    
    
      dirLight.color.set(scope.sunColor);
    
    }
  
  
  }
  
  
  function addGUI(gui) {
    let sceneBasic = gui.addFolder('Scene Basic')
    scope.gui = sceneBasic;
    sceneBasic.open();
    sceneBasic.add(scope, 'axes')
      .listen().onChange(
      function () {
        axesUpdate(scope.axes);
      }
    );
  
    if (_camera === undefined) {
      sceneBasic.add(scope, 'shadow')
        .listen().onChange(function () {
        dirLight.castShadow = scope.shadow;
      });
    
    }
    sceneBasic.add(scope, 'fog')
      .listen().onChange(function () {
      skyColorUpdate(scope.fog);
    });
    sceneBasic.add(scope, 'grid').min(0).max(500).step(10)
      .listen().onChange(
      function () {
        gridUpdate(scope.grid);
        if (scope._transformer === undefined) return;
        
        if (scope.grid > 0) {
          scope._transformer.setTranslationSnap(scope.grid);
          scope._transformer.setRotationSnap(THREE.MathUtils.degToRad(15));
          scope._transformer.setScaleSnap(0.25);
        } else {
          scope._transformer.setTranslationSnap(null);
          scope._transformer.setRotationSnap(null);
          scope._transformer.setScaleSnap(null);
        }
      }
    );
    sceneBasic.addColor(scope, 'skyColor').name('sky')
      .listen().onChange(function () {
      skyColorUpdate(scope.fog);
    });
    sceneBasic.addColor(scope, 'floorColor').name('floor')
      .listen().onChange(function () {
      mshFloor.material.color.set(scope.floorColor);
    });
    let sun = sceneBasic.addFolder('Sun Position')
    sun.add(scope, 'x').min(-1).max(1).onChange(function () {
      if (_camera) {
        scope.csm.lightDirection.x = scope.x;
      } else {
        dirLight.position.x = scope.x * scale.x;
      }
    
    });
    sun.add(scope, 'y').min(-1).max(1).onChange(function () {
      if (_camera) {
        scope.csm.lightDirection.y = scope.y;
      } else {
        dirLight.position.y = scope.y * scale.y;
      }
    
    });
    sun.add(scope, 'z').min(-1).max(1).onChange(function () {
      if (_camera) {
        scope.csm.lightDirection.z = scope.z;
      } else {
        dirLight.position.z = scope.z * scale.z;
      }
    
    });
    if (_camera === undefined) {
      sun.addColor(scope, 'sunColor').name('sun')
        .listen().onChange(() => {
        dirLight.color.set(scope.sunColor);
      })
    }
    sun.addColor(scope, 'ambientColor').name('ambient')
      .listen().onChange(() => {
      ambientLight.color.set(scope.ambientColor);
    })
  }
  
  
  init();
  
  // APIs
  this.floor = mshFloor;
  this.axes = true;
  this.shadow = true;
  this.fog = true;
  this.grid = 0;
  this.addGUI = addGUI;
  this.update = update;
  
  // this.directLight = dirLight;
  this.ambientLight = ambientLight;
  
};


export {SceneBasic};