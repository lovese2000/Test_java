#### GUI
ArchiWeb use `dat.gui` create simple interacts. Here gives the minimal instructions of gui.dat:

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
