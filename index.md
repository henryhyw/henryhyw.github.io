---
layout: page
title: 
---

<br>

<style>
video, .fallback-image {
    max-width: 40%;
    height: auto;
    filter: brightness(60%); /* Make the video darker */
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

.welcome-text {
    flex: 2;
    display: flex;
    flex-direction: column;
    justify-content: space-between; /* Distribute space evenly between children */
    height: 100%; /* Ensure it takes up the full height of the container */
}

.welcome-text h1 {
    margin: 0;
    padding: 15px 0; /* Add padding at the top */
    width: 100%;
    line-height: 1.2; /* Initial line height */
}

.welcome-text h2 {
    margin: 0;
    padding-bottom: 5px; /* Adjust padding at the bottom */
    line-height: 1.2; /* Initial line height */
}
</style>

<div class="image-left container" style="margin: auto;">
   <video id="videoElement" muted autoplay loop playsinline>
      <source src="/assets/vid/travel.mp4" type="video/mp4">
   </video>
   <img src="/assets/img/travel.jpg" alt="Travel" class="fallback-image" style="display: none;">
   <div class="welcome-text">
      <h1 id="welcomeTitle">WELCOME</h1>
      <h2 id="welcomeSubtitle">Hi! I'm Henry, a junior at the University of Hong Kong, majoring in Applied Artificial Intelligence. I have a passion for exploring new places and creating my own programs through coding. I'm thrilled to have you here and share my journey with you!</h2>
   </div>
</div>

<script>
    function getTextWidth(text, font) {
        const canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
        const context = canvas.getContext("2d");
        context.font = font;
        const metrics = context.measureText(text);
        return metrics.width;
    }

    function getCssStyle(element, prop) {
        return window.getComputedStyle(element, null).getPropertyValue(prop);
    }

    function getCanvasFont(el = document.body) {
        const fontWeight = getCssStyle(el, 'font-weight') || 'normal';
        const fontSize = getCssStyle(el, 'font-size') || '16px';
        const fontFamily = getCssStyle(el, 'font-family') || 'Times New Roman';
        return `${fontWeight} ${fontSize} ${fontFamily}`;
    }

    function adjustFontSizeAndLineHeight() {
        const videoElement = document.getElementById('videoElement');
        const titleElement = document.getElementById('welcomeTitle');
        const subtitleElement = document.getElementById('welcomeSubtitle');

        const videoHeight = videoElement.clientHeight;
        const availableWidth = document.querySelector('.welcome-text').clientWidth;

        // Adjust the font size and line height of the title to fit the width
        let fontSize = 1; // Start with a smaller font size
        let titleLineHeight = 1.2; // Start with an initial line height
        titleElement.style.fontSize = `${fontSize}em`;
        titleElement.style.lineHeight = titleLineHeight;
        let textWidth = getTextWidth(titleElement.textContent, getCanvasFont(titleElement));
        while (textWidth < availableWidth && fontSize < 5) { // Constrain max font size to 5em
            fontSize += 0.1;
            titleLineHeight += 0.1;
            titleElement.style.fontSize = `${fontSize}em`;
            titleElement.style.lineHeight = titleLineHeight;
            textWidth = getTextWidth(titleElement.textContent, getCanvasFont(titleElement));
        }

        // Adjust the font size and line height of the subtitle and title to occupy the height of the video
        let subtitleFontSize = 0.6;
        let subtitleLineHeight = 1.2; // Start with an initial line height
        subtitleElement.style.fontSize = `${subtitleFontSize}em`;
        subtitleElement.style.lineHeight = subtitleLineHeight;
        let totalHeight = titleElement.clientHeight + subtitleElement.clientHeight;

        while (totalHeight < videoHeight && subtitleFontSize < 3) { // Constrain max font size to 3em
            fontSize += 0.1;
            subtitleFontSize += 0.1;
            titleLineHeight += 0.1;
            subtitleLineHeight += 0.1;
            titleElement.style.fontSize = `${fontSize}em`;
            titleElement.style.lineHeight = titleLineHeight;
            subtitleElement.style.fontSize = `${subtitleFontSize}em`;
            subtitleElement.style.lineHeight = subtitleLineHeight;
            totalHeight = titleElement.clientHeight + subtitleElement.clientHeight;
        }

        // Reduce font size and line height if the total height exceeds the video height
        while (totalHeight > videoHeight && fontSize > 0.5 && subtitleFontSize > 0.5) { // Ensure font size does not go below 0.5em
            fontSize -= 0.1;
            subtitleFontSize -= 0.1;
            titleLineHeight -= 0.1;
            subtitleLineHeight -= 0.1;
            titleElement.style.fontSize = `${fontSize}em`;
            titleElement.style.lineHeight = titleLineHeight;
            subtitleElement.style.fontSize = `${subtitleFontSize}em`;
            subtitleElement.style.lineHeight = subtitleLineHeight;
            totalHeight = titleElement.clientHeight + subtitleElement.clientHeight;
        }
    }

    function checkVideoCompatibility() {
        const videoElement = document.getElementById('videoElement');
        const fallbackImage = document.querySelector('.fallback-image');

        // Check if the video is playable
        videoElement.addEventListener('error', () => {
            videoElement.style.display = 'none';
            fallbackImage.style.display = 'block';
        });

        // Attempt to play the video, if it fails, switch to the fallback image
        videoElement.play().catch(() => {
            videoElement.style.display = 'none';
            fallbackImage.style.display = 'block';
        });
    }

    window.onload = () => {
        adjustFontSizeAndLineHeight();
        checkVideoCompatibility();
    };
    window.onresize = adjustFontSizeAndLineHeight;

    // Mute/unmute button
    const videoElement = document.getElementById('videoElement');
    videoElement.addEventListener('click', () => {
        videoElement.muted = !videoElement.muted;
    });
</script>