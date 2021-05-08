import Vue from 'vue'
import VueRouter from 'vue-router'
import Viewer from './components/Viewer'


const routes = [];

routes.push(
  {path: '/', name: 'home', component: Viewer, meta: {title: 'ArchiWeb'}}
)

Vue.use(VueRouter)

const router = new VueRouter({
  routes
})
// eslint-disable-next-line no-unused-vars
router.afterEach((to, from) => {
  // Use next tick to handle router history correctly
  // see: https://github.com/vuejs/vue-router/issues/914#issuecomment-384477609
  Vue.nextTick(() => {
    document.title = to.meta.title || 'ArchiWeb';
  });
});
export {
  router as default,
}
