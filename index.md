---
layout: page
title: 
---

<style>
video {
    max-width: 300px;
    height: auto;
    filter: brightness(50%); /* Make the video darker */
}

.image-left, .image-right {
    margin: 1em 0;
}

@media (min-width: 20em) {
    .image-left, .image-right {
        display: flex;
        align-items: center;
    }

    .image-left video {
        margin-right: 1em;
        float: left; /* fallback */
    }

    .image-right video {
        order: 1;
        margin-left: 1em;
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
    .image-left video, .image-right video {
        flex-shrink: 0;
    }
}

.welcome-text {
    flex: 2;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.welcome-text h1, .welcome-text h2 {
    margin: 0;
    padding: 0;
}
</style>

<div class="image-left" style="max-width: 615px; margin: auto;">
   <video id="videoElement" controls>
      <source src="/assets/vid/travel.mp4" type="video/mp4">
      Your browser does not support the video tag.
   </video>
   <div class="welcome-text">
      <h1 id="welcomeTitle">WELCOME</h1>
      <h2 id="welcomeSubtitle">Hi! I'm Henry, a junior at the University of Hong Kong, majoring in Applied Artificial Intelligence. I love exploring new places and coding my own programs. Glad to have you here!</h2>
   </div>
</div>

<script>
    function adjustFontSize() {
        const videoElement = document.getElementById('videoElement');
        const titleElement = document.getElementById('welcomeTitle');
        const subtitleElement = document.getElementById('welcomeSubtitle');

        const videoHeight = videoElement.clientHeight;
        const availableWidth = document.querySelector('.welcome-text').clientWidth;

        // Adjust the font size of the title to fit the width and height
        let titleFontSize = 1;
        titleElement.style.fontSize = `${titleFontSize}em`;
        while (titleElement.clientWidth < availableWidth && titleFontSize < 5) {
            titleFontSize += 0.1;
            titleElement.style.fontSize = `${titleFontSize}em`;
        }

        // Adjust the font size of the subtitle to fit the height of the video
        let subtitleFontSize = 1;
        subtitleElement.style.fontSize = `${subtitleFontSize}em`;
        while (subtitleElement.clientHeight < videoHeight && subtitleFontSize < 5) {
            subtitleFontSize += 0.1;
            subtitleElement.style.fontSize = `${subtitleFontSize}em`;
        }

        // Fine-tuning to fit within the height
        while (subtitleElement.clientHeight > videoHeight) {
            subtitleFontSize -= 0.1;
            subtitleElement.style.fontSize = `${subtitleFontSize}em`;
        }
        
        // Fine-tuning to fit within the width
        while (titleElement.clientWidth > availableWidth) {
            titleFontSize -= 0.1;
            titleElement.style.fontSize = `${titleFontSize}em`;
        }
    }

    window.onload = adjustFontSize;
    window.onresize = adjustFontSize;
</script>