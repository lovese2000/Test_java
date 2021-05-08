import * as THREE from 'three';
import * as gui from '@/gui'
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

import * as ARCH from "@/archiweb";
import {AssetManager, DragFrames, MultiCamera, Transformer} from "@/archiweb";

const Viewport = function (width = window.innerWidth, height = window.innerHeight, name = 'container') {
  const aspect = height / width;
  const renderer = new THREE.WebGLRenderer({antialias: true, alpha: true, preserveDrawingBuffer: true});
  const scene = new THREE.Scene();
  
  const camera = new MultiCamera(renderer.domElement);
  const controller = new OrbitControls(camera.camera, renderer.domElement);
  
  let drag;
  let transformer;
  let assetManager;
  
  let scope = this;
  
  this.csm;
  
  function init() {
    window.layer = 0;
    window.objects = [];
    window.searchSceneByUUID = function (uuid) {
      return scene.getObjectByProperty('uuid', uuid);
    }
    window.saveAsImage = saveAsImage;
    /* ---------- renderer ---------- */
    renderer.domElement.tabIndex = 0;
    renderer.autoClear = false;
    renderer.setPixelRatio(window.devicePixelRatio);
    
    /* ---------- dom ---------- */
    addToDOM();
    
    /* ---------- gui ---------- */
  
    enableGUI();
    /* ---------- camera ---------- */
    camera.addGUI(gui.gui);
    camera.setController(controller);
  
    /* ---------- control ---------- */
    controller.enableKeys = false;
    controller.mouseButtons = {
      LEFT: THREE.MOUSE.PAN,
      RIGHT: THREE.MOUSE.ROTATE
    }
    controller.update();
    animate();
  
    windowResize(width, height);
    console.log(` %c      ___           ___           ___           ___                       ___           ___           ___\n      /\\  \\         /\\  \\         /\\  \\         /\\__\\          ___        /\\__\\         /\\  \\         /\\  \\\n     /::\\  \\       /::\\  \\       /::\\  \\       /:/  /         /\\  \\      /:/ _/_       /::\\  \\       /::\\  \\    \n    /:/\\:\\  \\     /:/\\:\\  \\     /:/\\:\\  \\     /:/__/          \\:\\  \\    /:/ /\\__\\     /:/\\:\\  \\     /:/\\:\\  \\ \n   /::\\~\\:\\  \\   /::\\~\\:\\  \\   /:/  \\:\\  \\   /::\\  \\ ___      /::\\__\\  /:/ /:/ _/_   /::\\~\\:\\  \\   /::\\~\\:\\__\\ \n  /:/\\:\\ \\:\\__\\ /:/\\:\\ \\:\\__\\ /:/__/ \\:\\__\\ /:/\\:\\  /\\__\\  __/:/\\/__/ /:/_/:/ /\\__\\ /:/\\:\\ \\:\\__\\ /:/\\:\\ \\:|__| \n  \\/__\\:\\/:/  / \\/_|::\\/:/  / \\:\\  \\  \\/__/ \\/__\\:\\/:/  / /\\/:/  /    \\:\\/:/ /:/  / \\:\\~\\:\\ \\/__/ \\:\\~\\:\\/:/  /  \n       \\::/  /     |:|::/  /   \\:\\  \\            \\::/  /  \\::/__/      \\::/_/:/  /   \\:\\ \\:\\__\\    \\:\\ \\::/  / \n       /:/  /      |:|\\/__/     \\:\\  \\           /:/  /    \\:\\__\\       \\:\\/:/  /     \\:\\ \\/__/     \\:\\/:/  / \n      /:/  /       |:|  |        \\:\\__\\         /:/  /      \\/__/        \\::/  /       \\:\\__\\        \\::/__/ \n      \\/__/         \\|__|         \\/__/         \\/__/                     \\/__/         \\/__/         ~~
      
                            Powered by ArchiWeb 0.1.0, Institute of Architectural Algorithms and Applications
                             `, 'color: #FDDF65');
  }
  
  function onSelectDown(event) {
    window.highlighted = true;
    assetManager.highlightList(event.object);
  }
  
  function onSelectUp(event) {
    window.highlighted = false;
    if (event.object.length > 1000) {
      assetManager.unHighlightList(event.object);
      alert('too much selected');
    } else {
      assetManager.unHighlightList(event.object);
      transformer.setSelected(event.object);
    }
  }
  
  function enableGUI() {
    gui.initGUI();
    addGUI(gui.gui);
    gui.util.add(window, 'saveAsImage').name('save image');
  }
  
  function disableGUI() {
    const container = document.getElementById('gui-container');
    const canvas = document.getElementsByClassName('dg main');
    if (canvas.length > 0) {
      container.removeChild(canvas[0]);
    }
  }
  
  /**
   * Enable group/ungroup and highlight/unhighlight object with AssetManager
   * @returns {AssetManager}
   */
  function enableAssetManager(enableGUI = true) {
    assetManager = new AssetManager(scene);
    if (enableGUI) {
      assetManager.addGUI(gui.util);
    }
    
    return assetManager;
  }
  
  
  /**
   * Enable multiple select with DragFrame control
   * Highlight object during selection : {@link onSelectDown}
   * Unhighlight object and push to transformer ( if exist ) after selection : {@link onSelectUp}
   * @returns {DragFrames}
   */
  function enableDragFrames() {
    if (assetManager === undefined) enableAssetManager();
    
    drag = new DragFrames(renderer, scene, camera.camera);
    
    drag.addEventListener('selectdown', () => {
      transformer.clear()
    });
    drag.addEventListener('select', onSelectDown);
    drag.addEventListener('selectup', onSelectUp);
    
    camera.setDrag(drag);
    
    return drag;
  }
  
  /**
   * Transform tool derive from THREE.TransformControl, just like your familiar Rhino Gumball.
   * be careful to enable while it rewrite click event
   * @returns {Transformer}
   */
  function enableTransformer(enableGUI = true) {
    if (assetManager === undefined) enableAssetManager();
    
    transformer = new Transformer(scene, renderer, camera.camera);
    camera.setTransformer(transformer);
    
    transformer._dragFrames = drag;
    transformer._assetManager = assetManager;
    assetManager.setTransformer(transformer);
    
    if (enableGUI) {
      transformer.addGUI(gui.gui);
    }
    return transformer;
  }
  
  function enableSceneBasic(enableGUI = true, enableCSM = false) {
    let sceneBasic;
    if (enableCSM) {
      sceneBasic = new ARCH.SceneBasic(scene, renderer, camera.camera);
      scope.csm = sceneBasic.csm;
    } else {
      sceneBasic = new ARCH.SceneBasic(scene, renderer);
    }
    
    if (enableGUI) {
      sceneBasic.addGUI(gui.gui)
    }
    return sceneBasic;
  }
  
  function animate() {
    controller.update();
    requestAnimationFrame(animate);
    render();
  }
  
  function addToDOM() {
    const container = document.getElementById(name);
    const canvas = container.getElementsByTagName('canvas');
    if (canvas.length > 0) {
      container.removeChild(canvas[0]);
    }
    container.appendChild(renderer.domElement);
  
    window.onresize = function () {
      const w = document.getElementById('container').clientWidth;
      windowResize(w, w * aspect);
    };
    renderer.domElement.addEventListener('keydown', onDocumentKeyDown, false);
    renderer.domElement.addEventListener('keyup', onDocumentKeyUp, false);
    window.addEventListener('resize', onWindowResize, false);
  
  }
  
  function windowResize(w, h) {
    
    if (drag) drag.onWindowResize(w, h);
    camera.onWindowResize(w, h);
    renderer.setSize(w, h);
    render();
  }
  
  function onWindowResize() {
    if (document.fullscreenElement === null) {
      const w = document.getElementById('container').clientWidth;
      windowResize(w, w * aspect);
    }
  }
  
  function onDocumentKeyDown(event) {
    // console.log('viewport key down', event.keyCode);
    let elem;
    switch (event.keyCode) {
      case 16: // Shift
        controller.enablePan = true;
        break;
      case 73: // I
        if(window.InfoCard)
          window.InfoCard.hideInfoCard(!window.InfoCard.show);
        break;
      case 70: // F
        elem = document.getElementById("container").children[0];
        if (elem.mozRequestFullScreen) { /* Firefox */
          elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
          elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { /* IE/Edge */
          elem.msRequestFullscreen();
        }
        console.log(screen);
        windowResize(screen.availWidth, screen.availHeight);
        
        break;
    }
  }
  
  // function onFullScreen() {
  //   if (document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement !== undefined) {
  //     /* Run code when going to fs mode */
  //     windowResize(screen.width, screen.height);
  //
  //   } else {
  //     onWindowResize();
  //     /* Run code when going back from fs mode */
  //   }
  // }
  //
  function onDocumentKeyUp(event) {
    switch (event.keyCode) {
      case 16: // Shift
        controller.enablePan = false;
        break;
    }
  }
  
  
  function render() {
    
    scene.traverse((obj) => {
      if (obj.toCamera) {
        let v = new THREE.Vector3().subVectors(camera.camera.position, obj.position);
        let theta = -Math.atan2(v.x, v.y);
  
        obj.quaternion.set(0, 0, 0, 1);
        obj.rotateZ(theta);
      }
    });
    
    renderer.clear();
    renderer.render(scene, camera.camera);
    if (scope.csm) scope.csm.update();
    
    if (drag) drag.render();
    if (scope.draw) scope.draw();
  }
  
  /**
   * Enable 2D, pan with right mouse
   * @returns camera.camera
   */
  function to2D() {
    camera.top();
    camera.toggleOrthographic();
    controller.mouseButtons = {
      LEFT: THREE.MOUSE.ROTATE,
      RIGHT: THREE.MOUSE.PAN
    }
    controller.enablePan = true;
    controls.pan = true;
    
    controller.enableRotate = false;
    controls.rotate = false;
  
    return camera.camera;
  }
  
  /**
   * Enable 3D, rotate with right mouse, pan with shift + right mouse
   * @returns camera.camera
   */
  function to3D() {
    controller.mouseButtons = {
      LEFT: THREE.MOUSE.PAN,
      RIGHT: THREE.MOUSE.ROTATE
    }
    controller.enablePan = false;
    controls.pan = false;
  
    return camera.camera;
  }
  
  function setCameraPosition(position, lookat) {
    if (position.length > 0) position = new THREE.Vector3(position[0], position[1], position[2]);
    if (lookat.length > 0) lookat = new THREE.Vector3(lookat[0], lookat[1], lookat[2]);
    controller.target.copy(lookat);
    camera.camera.position.copy(position);
    camera.camera.updateProjectionMatrix();
  }
  
  
  function saveAsImage(render) {
    render = render ?? renderer;
    let imgData;
    
    try {
      imgData = render.domElement.toDataURL("image/jpeg");
      saveFile(imgData, new Date().valueOf() + ".jpeg");
    } catch (e) {
      console.log(e);
    }
    
  }
  
  function saveFile(strData, filename) {
    const link = document.createElement('a');
    if (typeof link.download === 'string') {
      //Firefox requires the link to be in the body
      document.body.appendChild(link);
      link.download = filename;
      
      link.href = strData;
      link.click();
      //remove the link when done
      document.body.removeChild(link);
    } else {
      // location.replace(uri);
    }
  }
  
  /* ---------- check device is pc or not ---------- */
  function isPC() {
    const agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];
    for (let i = 0; i < agents.length; ++i) {
      if (navigator.userAgent.indexOf(agents[i]) > 0) return false;
    }
    return true;
  }
  
  /**
   * Viewport controls, toggle rotate, pan and zoom
   * Working with {@link addGUI}
   */
  const controls = new function () {
    this.rotate = true;
    this.pan = false;
    this.zoom = true;
  }
  /* ---------- APIs ---------- */
  this.renderer = renderer;
  this.scene = scene;
  this.gui = gui;
  this.controller = controller;
  this.camera = to3D();
  this.draw = undefined;
  
  this.disableGUI = disableGUI;
  this.enableDragFrames = enableDragFrames;
  this.enableTransformer = enableTransformer;
  this.enableAssetManager = enableAssetManager;
  this.enableSceneBasic = enableSceneBasic;
  
  this.to2D = to2D;
  this.to3D = to3D;
  
  this.isPC = isPC;
  
  this.setCameraPosition = setCameraPosition;
  
  /* ---------- GUI ---------- */
  
  function addGUI(gui) {
    let viewport = gui.addFolder('Viewport');
    viewport.add(controls, 'rotate').listen().onChange(() => {
      controller.enableRotate = !controller.enableRotate;
    });
    viewport.add(controls, 'pan').listen().onChange(() => {
      controller.enablePan = !controller.enablePan;
    });
    viewport.add(controls, 'zoom').listen().onChange(() => {
      controller.enableZoom = !controller.enableZoom;
    });
  }
  
  init();
};

export {Viewport};