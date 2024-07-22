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
   <video id="videoElement" style="opacity: 0;" muted autoplay loop playsinline>
      <source src="/assets/vid/travel.mp4" type="video/mp4">
   </video>
   <div id="videoOverlay" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: #AFB4B9; opacity: 0; pointer-events: none; transition: opacity 0.5s ease-in-out;"></div>
   <img id="imageElement" src="/assets/img/travel.jpg" alt="Travel" class="fallback-image" style="display: none;">
   <div class="welcome-text">
      <h1 id="welcomeTitle" style="color: transparent;">WELC<span id="compassContainer"><i class="far fa-compass" id="compassIcon"></i></span>ME</h1>
      <h2 id="welcomeSubtitle">Hello! I'm Han-yu (Henry), a junior at HKU, majoring in AI. I love to explore new places and code apps. I'm excited to have you here and ready to share my journey with you!</h2>
   </div>
</div>

<br>

<h3 id="welcomeQuote" style="color: transparent;">Life is an endless adventure<br>into the unknown</h3>