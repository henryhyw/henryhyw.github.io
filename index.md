---
layout: page
title: 
---

<style>
video {
    max-width: 45%;
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

<div class="image-left container" style="margin: auto;">
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

    function adjustFontSize() {
        const videoElement = document.getElementById('videoElement');
        const titleElement = document.getElementById('welcomeTitle');
        const subtitleElement = document.getElementById('welcomeSubtitle');

        const videoHeight = videoElement.clientHeight;
        const availableWidth = document.querySelector('.welcome-text').clientWidth;

        // Adjust the font size of the title to fit the width
        let fontSize = 1; // Start with a smaller font size
        titleElement.style.fontSize = `${fontSize}em`;
        let textWidth = getTextWidth(titleElement.textContent, getCanvasFont(titleElement));
        while (textWidth < availableWidth && fontSize < 5) { // Constrain max font size to 5em
            fontSize += 0.1;
            titleElement.style.fontSize = `${fontSize}em`;
            textWidth = getTextWidth(titleElement.textContent, getCanvasFont(titleElement));
        }
        while (textWidth > availableWidth && fontSize > 1) { // Ensure font size does not go below 1em
            fontSize -= 0.1;
            titleElement.style.fontSize = `${fontSize}em`;
            textWidth = getTextWidth(titleElement.textContent, getCanvasFont(titleElement));
        }

        // Adjust the font size of the subtitle to match the height of the video
        let subtitleFontSize = 1;
        subtitleElement.style.fontSize = `${subtitleFontSize}em`;
        while (subtitleElement.clientHeight < videoHeight && subtitleFontSize < 1.5) { // Constrain max font size to 1.5em
            subtitleFontSize += 0.1;
            subtitleElement.style.fontSize = `${subtitleFontSize}em`;
        }
        while (subtitleElement.clientHeight > videoHeight && subtitleFontSize > 0.5) { // Ensure font size does not go below 0.5em
            subtitleFontSize -= 0.1;
            subtitleElement.style.fontSize = `${subtitleFontSize}em`;
        }
    }

    window.onload = adjustFontSize;
    window.onresize = adjustFontSize;
</script>