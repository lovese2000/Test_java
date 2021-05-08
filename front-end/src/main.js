import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import router from './router';

let piedata = [
  {label: 'food', val: 1.},
]
window.piedata = piedata;

new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')
