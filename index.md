---
layout: page
title: 
---

<br>

<style>
video, .fallback-image {
    max-width: 45%;
    height: auto;
}

video {
    filter: brightness(70%); /* Make the video darker */
}

.image-left, .image-right {
    margin: 1em 0;
}

@media (min-width: 20em) {
    .image-left, .image-right {
        display: flex;
        align-items: flex-start;
    }

    .image-left video, .image-left .fallback-image {
        margin-right: 1.5em;
        float: left; /* fallback */
    }

    .image-right video, .image-right .fallback-image {
        order: 1;
        margin-left: 1.5em;
        float: right; /* fallback */
    }

    /* clearfix for fallback */
    .image-left::after,
    .image-right::after {
        content: "";
        display: block;
        clear: both;
    }
}

@media (min-width: 30em) {
    .image-left video, .image-left .fallback-image, .image-right video, .image-right .fallback-image {
        flex-shrink: 0;
    }
}

@media (max-width: 600px) {
    .welcome-text h1 {
        font-size: 2em;
    }

    .welcome-text h2 {
        font-size: 1em;
    }
}

@media (min-width: 650px) {
    .welcome-text h1 {
        font-size: 3.3em;
    }

    .welcome-text h2 {
        font-size: 1.4em;
    }
}

.welcome-text {
    flex: 2;
    display: flex;
    flex-direction: column;
    justify-content: space-between; /* Distribute space evenly between children */
    height: 100%; /* Ensure it takes up the full height of the container */
}

.welcome-text h1 {
    margin: 0;
    width: 100%;
    line-height: 1.2;
    position: relative;
    top: -0.1em; /* Shift up to remove space above */
    text-align: justify;
    font-size: clamp(2em, 5vw, 5em); /* Responsive font size */
}

.welcome-text h2 {
    margin: 0;
    line-height: 1.4;
    position: relative;
    top: 0.2em; /* Shift down to remove space below */
    text-align: justify;
    font-size: clamp(1em, 2vw, 3em); /* Responsive font size */
}
</style>

<div class="image-left container" style="margin: auto;">
   <video id="videoElement" muted autoplay loop playsinline>
      <source src="/assets/vid/travel.mp4" type="video/mp4">
   </video>
   <img id="imageElement" src="/assets/img/travel.jpg" alt="Travel" class="fallback-image" style="display: none;">
   <div class="welcome-text">
      <h1 id="welcomeTitle">WELCOME</h1>
      <h2 id="welcomeSubtitle">I'm Henry, a junior at the University of Hong Kong, majoring in AI. I love exploring new places and coding innovative programs. I'm thrilled to share my journey with you!</h2>
   </div>
</div>