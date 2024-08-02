<template>
  <div class="container">
    <header class="header">
      <h3 class="header-title">
        <router-link to="/home">H.W.</router-link>
        <small class="header-subtitle">An enthusiastic explorer</small>
        <div class="menu">
          <nav class="menu-content">
            <router-link to="/about">About</router-link>
            <router-link to="/education">Education</router-link>
            <router-link to="/experience">Experience</router-link>
            <router-link to="/projects">Projects</router-link>
            <router-link to="/contact">Contact</router-link>
          </nav>
          <nav class="social-icons">
            <a id="toggle-theme" title="Toggle Theme"><i class="fa fa-sun" aria-hidden="true" style="font-size: 2em;margin-right: 4px;"></i></a>
            <a id="music-icon" title="Play Music"><i class="fa fa-compact-disc" aria-hidden="true" style="font-size: 2em;margin-left: 4px;"></i></a>
          </nav>
        </div>
        <audio id="background-music"></audio>
      </h3>
    </header>
    <div class="content-container">
      <router-view></router-view>
    </div>
    <footer class="footer">
      <a href="https://www.instagram.com/henry_w_hy/" target="_blank">
        <i class="fab fa-instagram" aria-hidden="true"></i>
      </a>
      <a href="https://www.linkedin.com/in/han-yu-henry-w-a34122258/" target="_blank">
        <i class="fab fa-linkedin" aria-hidden="true"></i>
      </a>
      <a href="https://github.com/henryhyw/" target="_blank">
        <i class="fab fa-github" aria-hidden="true"></i>
      </a>
      <div class="footer-description">
        <a><router-link to="/home">H.W. | An enthusiastic explorer</router-link></a>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'App',
  mounted() {
      const script1 = document.createElement('script');
      script1.src = '/assets/js/default.js';
      script1.async = true;
      document.body.appendChild(script1);
      const script2 = document.createElement('script');
      script2.src = '/assets/js/theme-toggle.js';
      script2.async = true;
      document.body.appendChild(script2);
  },
  unmounted() {
    // Clean up the scripts when the component is destroyed
    if (this.script1 && this.script1.parentNode) {
      this.script1.parentNode.removeChild(this.script1);
    }
    if (this.script2 && this.script2.parentNode) {
      this.script2.parentNode.removeChild(this.script2);
    }
  }
}
</script>

<style scoped>
    @import url('./assets/css/main.css');
    @import url('./assets/css/syntax.css');
    @import url('./assets/css/dark-theme.css');
</style>