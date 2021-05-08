```
      ___         ___         ___         ___                   ___         ___         ___     
     /\  \       /\  \       /\  \       /\__\        ___      /\__\       /\  \       /\  \    
    /::\  \     /::\  \     /::\  \     /:/  /       /\  \    /:/ _/_     /::\  \     /::\  \   
   /:/\:\  \   /:/\:\  \   /:/\:\  \   /:/__/        \:\  \  /:/ /\__\   /:/\:\  \   /:/\:\  \  
  /::\~\:\  \ /::\~\:\  \ /:/  \:\  \ /::\  \ ___    /::\__\/:/ /:/ _/_ /::\~\:\  \ /::\~\:\__\ 
 /:/\:\ \:\__/:/\:\ \:\__/:/__/ \:\__/:/\:\  /\__\__/:/\/__/:/_/:/ /\__/:/\:\ \:\__/:/\:\ \:|__|
 \/__\:\/:/  \/_|::\/:/  \:\  \  \/__\/__\:\/:/  /\/:/  /  \:\/:/ /:/  \:\~\:\ \/__\:\~\:\/:/  /
      \::/  /   |:|::/  / \:\  \          \::/  /\::/__/    \::/_/:/  / \:\ \:\__\  \:\ \::/  / 
      /:/  /    |:|\/__/   \:\  \         /:/  /  \:\__\     \:\/:/  /   \:\ \/__/   \:\/:/  /  
     /:/  /     |:|  |      \:\__\       /:/  /    \/__/      \::/  /     \:\__\      \::/__/   
     \/__/       \|__|       \/__/       \/__/                 \/__/       \/__/       ~~       

```

[![tag](https://img.shields.io/github/v/tag/Inst-AAA/archiweb)](https://github.com/Inst-AAA/archiweb/tags)
[![repo-size](https://img.shields.io/github/languages/code-size/Inst-AAA/archiweb?style=flat)](https://github.com/Inst-AAA/archiweb/archive/master.zip)
![total lines](https://img.shields.io/tokei/lines/github/Inst-AAA/archiweb?color=green)
[![license](https://img.shields.io/github/license/Inst-AAA/archiweb)](LICENSE) 

ArchiWeb is a front-end web application using [Vuetify](https://vuetifyjs.com/en/) and [three.js](https://threejs.org/). It's recommanded to start from the documentations of both.

- [Usage](#usage)
  - [As Template](#as-template)
  - [Install](#install)
  - [Tools](#tools)
    - [GUI](#gui)
    - [Transformer](#transformer)
    - [SceneBasic](#scenebasic)
    - [DragFrames](#dragframes)
    - [MultiCamera](#multicamera)
    - [GeometryFactory](#geometryfactory)
    - [Loader](#loader)
      - [Loader Option](#loader-option)
    - [similar works](#similar-works)
- [Extensions](#extensions)
  - [java-backend](#java-backend)
  - [webxr](#webxr)
    - [similar framework](#similar-framework)
  - [database](#database)
    - [Similar to web GIS](#similar-to-web-gis)
  - [ddg](#ddg)
- [Issues](#issues)

## Usage
ArchiWeb provides a template to create a web application from scratch, you can easily use [Vuetify UI components](https://vuetifyjs.com/en/components/buttons/) to generate a material design web, also with 3d rendering.
### As Template
Press `Use this template`
``` bash
# clone
git clone git@github.com:Your/new-repo.git

# add as remote 
git remote add upstream git@github.com:Inst-AAA/archiweb.git
git fetch upstream

# merge
git merge upstream/main --allow-unrelated-histories

# resolve conflicts
git push origin main

```
### Install
``` bash
git clone https://github.com/Inst-AAA/archiweb.git
cd archiweb/front-end

# install dependencies
npm install

# run server
npm run server
```

check out to specific branch, such as:
``` bash
git checkout -b java-backend
```
or you can just mannually organize and use those plugins.

### Tools
#### GUI
ArchiWeb use `dat.gui` create simple interacts

<details>
  <summary> Here gives the minimal instructions of gui.dat, you can select to take a try.</summary>

``` javascript
const gui = require('@/viewers/3D/gui')
gui.initGUI();

// Add variable
const controls = new function() {
  this.variable = 0;
  this.color = 0x666600;
  this.select = 'aaa';
  this.change = true;

  this.button = function() {
    // do something
  }
}

// slider
gui.gui.add(controls, 'variable', 0, 10, 1);

// color picker
gui.gui.addColor(controls, 'color');

// select list
gui.gui.add(control, 'select', ['aaa', 'bbb', 'ccc'])

// button
gui.gui.add(button);

// Add your folder
const folder = gui.gui.addFolder('Folder name');
folder.add(controls, 'change');

// onChange and listen
gui.gui.add(controls, 'change').listen().onChange(function() {
  // do something
});
```

</details>

#### Transformer
Transform tool derive from THREE.TransformControl, just like your familiar Rhino Gumball
- init a transformer and add gui
``` javascript
transformer = new Transformer(scene, renderer, camera, objects, drag);
transformer.addGUI(gui.gui);
```
this is all the required codes, if your want to work with [dragFrames](#dragframes), see later instructions.
#### SceneBasic
SceneBasic creates a basic architectural design environment, with ground, sky and fog.
- init and add gui
``` javascript
sceneBasic = new SceneBasic(scene, renderer, transformer);
sceneBasic.addGUI(gui.gui);
```

#### DragFrames
Multiselect tools
- draw rectangle over current renderer
```javascript
dragFrames = new DragFrames(objects, camera, scene, renderer);

// Disable autoClear
renderer.autoClear = false;

// Your render function
function render() {
renderer.clear();
renderer.render(scene, camera);

if (dragFrames !== undefined)
  dragFrames.render();
}

```

- highlight seleted objects
``` javascript
dragFrames.addEventListener('select', function (event) {
  for (let i = 0; i < event.object.length; ++i) {
    event.object[i].material.emissive.set(0x666600);
    if (event.object[i].children.length > 0)
      event.object[i].children[0].visible = true;
  }
});

dragFrames.addEventListener('selectup', function (event) {
  for (let i = 0; i < event.object.length; ++i) {
    event.object[i].material.emissive.set(0x000000);
    if (event.object[i].children.length > 0)
      event.object[i].children[0].visible = false;
  }
});
```
- work with transformer
``` javascript
transformer.setDragFrames(dragFrames); //If not init with DragFrames

dragFrames.addEventListener('selectdown', function(event) {
  transformer.clear();
});


dragFrames.addEventListener('selectup', function (event) {

  transformer.setSelected(event.object);
});

```

#### MultiCamera
Similar to SketchUp, you can use perspective camera and orthographic camera in the scene, and switch between them use hotkeys
- init and add gui
``` javascript
multiCamera = new MultiCamera(scene, renderer);
multiCamera.addGUI(gui.gui);
```


#### GeometryFactory
This function provides basic [BufferGeometry](https://threejs.org/docs/index.html#api/en/core/BufferGeometry) prefered by architectural usage.

Create mesh with buffer geometry defined reducing the cost of passing all this data to the GPU.


Ruled by:
- **Contructor**
- **ModelParams** returns model parameters for InfoCard or Print
- **UpdateModel** updates geometry with input parameters
- **publicProperties** returns the ArchiJSON format of the geometry.

Current Supported:
- Box
- Cylinder
#### Loader
The Loader works with page loading and gui buttons, with callback function link to the loaded assets.
##### Loader Option
|label| |物件可选|材质双面|朝向相机|映射Y至Z|阴影|边线|
|:----|:----|:----|:----|:----|:----|:----|:----|
| |value|selectable|doubleSide|toCamera|ZtoY|shadow|edge|
|成组|grouped|✔|✔|❌|✔|✔|✔|
|融合|merged|✔|✔|✔|✔|✔|✔|
|原始|raw|✔|✔|❌|❌|✔|❌|

Currently support:  
`dae`, `obj`, `gltf`, `glb`, `3mf`, `fbx`

- init and add gui
``` javascript
loader = new Loader(scene, objects);
loader.addGUI(gui.gui);
```
- load models when loading 
``` javascript
loader.loadModel('/models/autumn-tree.dae', (mesh) => {
  mesh.position.set(500, 0, 0);
  mesh.scale.set(2, 2, 2);
  setMaterialOpacity(mesh, 0.6);
  mesh.toCamera = true;
});
```
#### similar works
- [THREE Editor](https://threejs.org/editor/)
- [HomeIdea3D](https://homeidea3d.seanwasere.com/)
## Extensions
### java-backend
Data exchange format is [ArchiJson](https://github.com/Inst-AAA/archijson).
Current java-backend is using node.js as server, the examples in plugins folder give the minimal implementation of a java server.

To avoid changing and merging conflicts of using this template, there are plans to design a universal interface.
### webxr
It's plan to support VR, which is a better display to architectural design.
#### similar framework
- [A-Frame](https://aframe.io/)

### database
To be the front-end of [ArchiBase](https://github.com/Inst-AAA/archibase)
#### Similar to web GIS
- [3DTilesRenderer](https://github.com/NASA-AMMOS/3DTilesRendererJS)
- [Cesium](https://cesium.com/)
- [3D Bag](https://tudelft3d.github.io/3dbag-viewer/#/en/viewer)

### ddg
code from [cmu-geometry/ddg-exercises-js](https://github.com/cmu-geometry/ddg-exercises-js) 

support:  
1. Linear Algebra (wrap from [Eigen](https://eigen.tuxfamily.org/))
2. HalfEdges
3. Discrete Differential Geometry Processing

## Issues
