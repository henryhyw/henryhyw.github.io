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
</script>

<link rel="stylesheet" href="/assets/css/home.css">
<script src="/assets/js/home.js" defer></script>

<div class="image-left container" style="margin: auto;">
   <script>
        const videoSources = [
            { src: "/assets/vid/home1.mp4", class: "homevideo1" },
            { src: "/assets/vid/home2.mp4", class: "homevideo2" },
            { src: "/assets/vid/home3.mp4", class: "homevideo3" }
        ];

        // Generate a random index between 0 and the length of the array minus 1
        const randomIndex = Math.floor(Math.random() * videoSources.length);
        console.log(randomIndex+1);

        // Select a random video source from the array
        const source = videoSources[randomIndex];

        // Create a new video element
        const videoElement = document.createElement('video');
        videoElement.setAttribute('id', 'videoElement');
        videoElement.setAttribute('class', source.class);
        videoElement.setAttribute('style', 'opacity: 0;');
        videoElement.setAttribute('muted', '');
        videoElement.setAttribute('autoplay', '');
        videoElement.setAttribute('loop', '');
        videoElement.setAttribute('playsinline', '');

        // Create a new source element and set its attributes
        const sourceElement = document.createElement('source');
        sourceElement.setAttribute('src', source.src);
        sourceElement.setAttribute('type', 'video/mp4');

        // Append the source element to the video element
        videoElement.appendChild(sourceElement);

        // Append the video element to the container
        document.getElementById('videoContainer').appendChild(videoElement);
    </script>
   <img id="imageElement" src="/assets/img/home1.jpg" alt="Travel" class="fallback-image" style="display: none;">
   <div class="video-overlay" id="videoOverlay"></div>
   <div class="welcome-text">
      <h1 id="welcomeTitle" style="color: transparent;">WELC<span id="compassContainer"><i class="far fa-compass" id="compassIcon"></i></span>ME</h1>
      <h2 id="welcomeSubtitle">Hello! I'm Han-yu (Henry), a junior at HKU, majoring in AI. I love to explore new places and code apps. I'm excited to have you here and ready to share my journey with you!</h2>
   </div>
</div>

<br>

<h3 id="welcomeQuote" style="color: transparent;">Life is an endless adventure<br>into the unknown</h3>