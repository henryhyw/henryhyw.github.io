---
layout: page
title: 
---

<script>
  document.title = "Home | H.W.";
</script>

<script>
   const videoSources = [
    { src: "/assets/vid/home1.mp4", class: "homevideo1" },
    { src: "/assets/vid/home2.mp4", class: "homevideo2" },
    { src: "/assets/vid/home3.mp4", class: "homevideo3" }
   ];
   // Function to preload videos
   function preloadVideos() {
       videoSources.forEach(videoData => {
           const video = document.createElement('video');
           video.src = videoData.src;
           video.preload = 'auto';
           video.autoplay = true;
           video.loop = true;
           video.muted = true;
           video.style.display = 'none'; // Hide the video element
           document.body.appendChild(video);
       });
   }
</script>

<link rel="stylesheet" href="/assets/css/home.css">
<script src="/assets/js/home.js" defer></script>

<div class="image-left container" style="margin: auto;">
   <video class="homevideo1" id="videoElement" style="opacity: 0;" muted autoplay loop playsinline>
      <source src="/assets/vid/home1.mp4" type="video/mp4">
   </video>
   <img id="imageElement" src="/assets/img/home1.jpg" alt="Travel" class="fallback-image" style="display: none;">
   <div class="video-overlay" id="videoOverlay"></div>
   <div class="welcome-text">
      <h1 id="welcomeTitle" style="color: transparent;">WELC<span id="compassContainer"><i class="far fa-compass" id="compassIcon"></i></span>ME</h1>
      <h2 id="welcomeSubtitle">Hello! I'm Han-yu (Henry), a junior at HKU, majoring in AI. I love to explore new places and code apps. I'm excited to have you here and ready to share my journey with you!</h2>
   </div>
</div>

<br>

<h3 id="welcomeQuote" style="color: transparent;">Life is an endless adventure<br>into the unknown</h3>