import Vue from 'https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.esm.browser.js';
import VueRouter from 'https://cdn.jsdelivr.net/npm/vue-router@3.5.3/dist/vue-router.esm.browser.js';
import Home from './components/Home.vue';
import About from './components/About.vue';
import Education from './components/Education.vue';
import Experience from './components/Experience.vue';
import Projects from './components/Projects.vue';
import Early from './components/Early.vue';
import Contact from './components/Contact.vue';

Vue.use(VueRouter);

const routes = [
  { path: '/', component: Home },
  { path: '/about', component: About },
  { path: '/education', component: Education },
  { path: '/experience', component: Experience },
  { path: '/projects', component: Projects },
  { path: '/early', component: Early },
  { path: '/contact', component: Contact }
];

const router = new VueRouter({
  routes
});

new Vue({
  el: '#app',
  router
});