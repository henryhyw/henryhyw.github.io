---
layout: page
title: 
---

<style>
video, .fallback-image {
    max-width: 45%;
    height: auto;
}

video{
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
    margin-block-start: 0;
    margin-block-end: 0;
    width: 100%;
    line-height: 1.2;
    position: relative;
    top: -0.1em; /* Shift up to remove space above */
    text-align: justify;
}

.welcome-text h2 {
    margin: 0;
    margin-block-start: 0;
    margin-block-end: 0;
    line-height: 1.4;
    position: relative;
    top: 0.2em; /* Shift down to remove space below */
    text-align: justify;
    text-align-last: justify; /* Justify the last line as well */
    -moz-text-align-last: justify; /* Firefox compatibility */
}
</style>

<div class="image-left container" style="margin: auto;">
   <video id="videoElement" muted autoplay loop playsinline>
      <source src="/assets/vid/travel.mp4" type="video/mp4">
   </video>
   <img id="imageElement" src="/assets/img/travel.jpg" alt="Travel" class="fallback-image" style="display: none;">
   <div class="welcome-text">
      <h1 id="welcomeTitle">WELCOME</h1>
      <h2 id="welcomeSubtitle">Hello! I'm Han-yu (Henry), a junior at HKU, majoring in AI. I love exploring new places and coding apps. I'm excited to have you here and share my journey with you!</h2>
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

    function getCanvasFont(el) {
        const fontWeight = getCssStyle(el, 'font-weight') || 'normal';
        const fontSize = getCssStyle(el, 'font-size') || '16px';
        const fontFamily = getCssStyle(el, 'font-family') || 'Times New Roman';
        return `${fontWeight} ${fontSize} ${fontFamily}`;
    }

    function adjustFontSizeAndLineHeight() {
        const videoElement = document.getElementById('videoElement');
        const imageElement = document.getElementById('imageElement');
        const titleElement = document.getElementById('welcomeTitle');
        const subtitleElement = document.getElementById('welcomeSubtitle');

        const mediaElement = videoElement.style.display !== 'none' ? videoElement : imageElement;
        const mediaHeight = mediaElement.clientHeight;
        const availableWidth = document.querySelector('.welcome-text').clientWidth;

        // Adjust the font size and line height of the title to fit the width
        let titleFontSize = 1; // Start with a smaller font size
        titleElement.style.fontSize = `${titleFontSize}em`;
        let textWidth = getTextWidth(titleElement.textContent, getCanvasFont(titleElement));
        while (textWidth < availableWidth && titleFontSize < 5) { // Constrain max font size to 5em
            titleFontSize += 0.1;
            titleElement.style.fontSize = `${titleFontSize}em`;
            textWidth = getTextWidth(titleElement.textContent, getCanvasFont(titleElement));
        }

        while (textWidth > availableWidth && titleFontSize > 0.5) { // Constrain max font size to 5em
            titleFontSize -= 0.1;
            titleElement.style.fontSize = `${titleFontSize}em`;
            textWidth = getTextWidth(titleElement.textContent, getCanvasFont(titleElement));
        }

        // Fix the title font size and adjust the subtitle to match the height of the video
        let subtitleFontSize = 1;
        subtitleElement.style.fontSize = `${subtitleFontSize}em`;
        let totalHeight = titleElement.clientHeight + subtitleElement.clientHeight;

        while (totalHeight < mediaHeight && subtitleFontSize < 3) { // Constrain max font size to 3em
            subtitleFontSize += 0.01;
            subtitleElement.style.fontSize = `${subtitleFontSize}em`;
            totalHeight = titleElement.clientHeight + subtitleElement.clientHeight;
        }

        // Reduce font size and line height if the total height exceeds the video height
        while (totalHeight > mediaHeight && subtitleFontSize > 0.5) { // Ensure font size does not go below 0.5em
            subtitleFontSize -= 0.01;
            subtitleElement.style.fontSize = `${subtitleFontSize}em`;
            totalHeight = titleElement.clientHeight + subtitleElement.clientHeight;
        }
    }

    function checkVideoCompatibility() {
        const videoElement = document.getElementById('videoElement');
        const fallbackImage = document.getElementById('imageElement');

        // Check if the video is playable
        videoElement.addEventListener('error', () => {
            videoElement.style.display = 'none';
            fallbackImage.style.display = 'block';
            adjustFontSizeAndLineHeight(); // Ensure text formatting is adjusted when fallback image is shown
        });

        // Attempt to play the video, if it fails, switch to the fallback image
        videoElement.play().catch(() => {
            videoElement.style.display = 'none';
            fallbackImage.style.display = 'block';
            adjustFontSizeAndLineHeight(); // Ensure text formatting is adjusted when fallback image is shown
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