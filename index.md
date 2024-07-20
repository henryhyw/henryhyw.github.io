---
layout: page
title: 
---

<br>

<style>
video {
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
    justify-content: space-between; /* Distribute space evenly between children */
    height: 100%; /* Ensure it takes up the full height of the container */
}

.welcome-text h1 {
    margin: 0;
    padding: 15px 0; /* Add padding at the top */
    align-self: flex-start; /* Align to the top */
}

.welcome-text h2 {
    margin: 0;
    padding: 0 0 5px 0; /* Add padding at the bottom */
    align-self: flex-end; /* Align to the bottom */
}
</style>

<div class="image-left container" style="margin: auto;">
   <video id="videoElement" muted autoplay playsinline>
      <source src="/assets/vid/travel.mp4" type="video/mp4">
      Your browser does not support the video tag.
   </video>
   <div class="welcome-text">
      <h1 id="welcomeTitle">WELCOME</h1>
      <h2 id="welcomeSubtitle"><br>Hi! I'm Henry, a junior at the University of Hong Kong, majoring in Applied Artificial Intelligence. I have a passion for exploring new places and creating my own programs through coding. I'm thrilled to have you here and share my journey with you!</h2>
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

        // Adjust the font size of the title to fit the width
        let fontSize = 1; // Start with a smaller font size
        titleElement.style.fontSize = `${fontSize}em`;
        let textWidth = getTextWidth(titleElement.textContent, getCanvasFont(titleElement));
        while (textWidth < availableWidth && fontSize < 5) { // Constrain max font size to 5em
            fontSize += 0.1;
            titleElement.style.fontSize = `${fontSize}em`;
            textWidth = getTextWidth(titleElement.textContent, getCanvasFont(titleElement));
        }

        // Adjust the font size of the subtitle to match the height of the video
        let subtitleFontSize = 0.4;
        let lineHeight = 0.6;
        subtitleElement.style.fontSize = `${subtitleFontSize}em`;
        subtitleElement.style.lineHeight = lineHeight;
        let subtitleHeight = subtitleElement.clientHeight;
        while (subtitleHeight < videoHeight - 20 && subtitleFontSize < 3) { // Constrain max font size to 3em
            subtitleFontSize += 0.1;
            lineHeight += 0.1;
            subtitleElement.style.fontSize = `${subtitleFontSize}em`;
            subtitleElement.style.lineHeight = lineHeight;
            subtitleHeight = subtitleElement.clientHeight;
        }

        // Reduce font size and line height if subtitle exceeds video height
        while (subtitleHeight > videoHeight - 20 && subtitleFontSize > 0.5) { // Ensure font size does not go below 0.5em
            subtitleFontSize -= 0.1;
            lineHeight -= 0.1;
            subtitleElement.style.fontSize = `${subtitleFontSize}em`;
            subtitleElement.style.lineHeight = lineHeight;
            subtitleHeight = subtitleElement.clientHeight;
        }
    }

    window.onload = adjustFontSizeAndLineHeight;
    window.onresize = adjustFontSizeAndLineHeight;

    // Bounce back style for the video loop
    const videoElement = document.getElementById('videoElement');
    let playingForward = true;

    videoElement.addEventListener('timeupdate', () => {
        if (videoElement.currentTime >= videoElement.duration && playingForward) {
            videoElement.pause();
            videoElement.currentTime = videoElement.duration;
            videoElement.playbackRate = -1;
            videoElement.play();
            playingForward = false;
        } else if (videoElement.currentTime <= 0 && !playingForward) {
            videoElement.pause();
            videoElement.currentTime = 0;
            videoElement.playbackRate = 1;
            videoElement.play();
            playingForward = true;
        }
    });

    // Mute/unmute button
    videoElement.addEventListener('click', () => {
        videoElement.muted = !videoElement.muted;
    });
</script>