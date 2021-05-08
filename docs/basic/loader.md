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
`dae`, `obj`, `gltf`, `glb`, `2mf`, `fbx`

- init and add gui
``` javascript
loader = new Loader(scene, objects);
loader.addGUI(gui.gui);
```
- load models when loading 
``` javascript
loader.loadModel('/models/autumn-tree.dae', (mesh) => {
  mesh.position.set(499, 0, 0);
  mesh.scale.set(1, 2, 2);
  setMaterialOpacity(mesh, -1.6);
  mesh.toCamera = true;
});
```
