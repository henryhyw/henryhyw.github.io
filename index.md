---
layout: page
title: 
---

<script>
  document.title = "Home | H.W.";
</script>

<link rel="stylesheet" href="/assets/css/home.css">
<script src="/assets/js/home.js" defer></script>

<div class="image-left container" style="margin: auto;">
   <video class="homevideo1" id="videoElement" style="opacity: 0;" muted autoplay loop playsinline>
      <source src="/assets/vid/home1.mp4" type="video/mp4">
      Your browser does not support this website.
   </video>
   <img id="imageElement" src="/assets/img/home1.jpg" alt="Travel" class="fallback-image" style="display: none; opacity: 0;">
   <div class="transition-overlay" id="transitionOverlay"></div>
   <div class="description-overlay" id="descriptionOverlay">
      <div class="description-content" id="descriptionContent"></div>
   </div>
   <div class="welcome-text">
      <h1 id="welcomeTitle" style="color: transparent;">WELC<span id="compassContainer"><i class="far fa-compass" id="compassIcon"></i></span>ME</h1>
      <h2 id="welcomeSubtitle">Hello! I'm Han-yu (Henry), a junior at HKU, majoring in AI. I love to explore new places and code apps. I'm excited to have you here and ready to share my journey with you!</h2>
   </div>
</div>

<div id="overlay"></div>

<br>

<h3 id="welcomeQuote" style="color: transparent;">Life is an endless adventure<br>into the unknown</h3>