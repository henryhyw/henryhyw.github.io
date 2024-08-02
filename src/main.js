import { createApp } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import App from './App.vue';
import AboutTab from './components/AboutTab.vue';
import EducationTab from './components/EducationTab.vue';
import ExperienceTab from './components/ExperienceTab.vue';
import ProjectsTab from './components/ProjectsTab.vue';
import EarlyPage from './components/EarlyPage.vue';
import ContactTab from './components/ContactTab.vue';
import IndexPage from './components/IndexPage.vue';

const routes = [
  { path: '/about', component: AboutTab },
  { path: '/education', component: EducationTab },
  { path: '/experience', component: ExperienceTab },
  { path: '/projects', component: ProjectsTab },
  { path: '/early', component: EarlyPage },
  { path: '/contact', component: ContactTab },
  { path: '/home', component: IndexPage  },
  { path: '/', component: IndexPage  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

const app = createApp(App);

app.use(router);
app.mount('#app');