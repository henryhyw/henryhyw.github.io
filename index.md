---
layout: page
title: 
---

<script>
  document.title = "Home | H.W.";
</script>

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

@media (max-width: 768px) {
    .welcome-text h1 {
        font-size: 1.8em;
    }

    .welcome-text h2 {
        font-size: 1.05em;
    }
}

@media (min-width: 615px) {
    .welcome-text h1 {
        font-size: 3.3em;
    }

    .welcome-text h2 {
        font-size: 1.63em;
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
    text-align: left; /* Initially set to normal align */
    text-align-last: left; /* Initially set to normal align */
    -moz-text-align-last: left; /* Firefox compatibility */
    color: white; /* Start with white text */
}

/* CSS for shaking effect */
@keyframes shake {
    0% { transform: translate(1px, 1px) rotate(0deg); }
    10% { transform: translate(-1px, -2px) rotate(-1deg); }
    20% { transform: translate(-3px, 0px) rotate(1deg); }
    30% { transform: translate(3px, 2px) rotate(0deg); }
    40% { transform: translate(1px, -1px) rotate(1deg); }
    50% { transform: translate(-1px, 2px) rotate(-1deg); }
    60% { transform: translate(-3px, 1px) rotate(0deg); }
    70% { transform: translate(3px, 1px) rotate(-1deg); }
    80% { transform: translate(-1px, -1px) rotate(1deg); }
    90% { transform: translate(1px, 2px) rotate(0deg); }
    100% { transform: translate(1px, -2px) rotate(-1deg); }
}

.shake {
    animation: shake 0.5s;
    animation-iteration-count: infinite;
}

#compassContainer {
    display: inline-block;
    white-space: nowrap;
}
</style>

<div class="image-left container" style="margin: auto;">
   <video id="videoElement" muted autoplay loop playsinline>
      <source src="/assets/vid/travel.mp4" type="video/mp4">
   </video>
   <img id="imageElement" src="/assets/img/travel.jpg" alt="Travel" class="fallback-image" style="display: none;">
   <div class="welcome-text">
      <h1 id="welcomeTitle">WELC<span id="compassContainer"><i class="far fa-compass" id="compassIcon"></i></span>ME</h1>
      <h2 id="welcomeSubtitle">Hello! I'm Han-yu (Henry), a junior at HKU, majoring in AI. I love to explore new places and code apps. I'm excited to have you here and ready to share my journey with you!</h2>
   </div>
</div>

<script>
    function updateSubtitle() {
        const subtitleElement = document.getElementById('welcomeSubtitle');
        const isMobile = window.matchMedia("(max-width: 768px)").matches;

        if (isMobile) {
            subtitleElement.textContent = "Hello! I'm Han-yu, a junior at HKU, majoring in Applied AI. I love to explore new places and code apps. I'm ready to share my journey with you!";
        } else {
            subtitleElement.textContent = "Hello! I'm Han-yu (Henry), a junior at HKU, majoring in Applied AI. I love to explore new places and code apps. I'm excited to have you here and share my journey with you!";
        }
    }

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
        const compassIcon = document.getElementById('compassIcon');

        const mediaElement = videoElement.style.display !== 'none' ? videoElement : imageElement;
        const mediaHeight = mediaElement.clientHeight;
        const availableWidth = document.querySelector('.welcome-text').clientWidth;

        // Adjust the font size and line height of the title to fit the width
        let titleFontSize = 1; // Start with a smaller font size
        titleElement.style.fontSize = `${titleFontSize}em`;
        
        let iconScaleFactor = 0.3; // Scale factor to adjust the icon size relative to the text
        compassIcon.style.fontSize = `${titleFontSize * iconScaleFactor}em`;
        
        let textWidth = getTextWidth(titleElement.textContent.replace('O', ''), getCanvasFont(titleElement)) + compassIcon.clientWidth;
        while (textWidth < availableWidth && titleFontSize < 5) { // Constrain max font size to 5em
            titleFontSize += 0.1;
            titleElement.style.fontSize = `${titleFontSize}em`;
            compassIcon.style.fontSize = `${titleFontSize * iconScaleFactor}em`;
            textWidth = getTextWidth(titleElement.textContent.replace('O', ''), getCanvasFont(titleElement)) + compassIcon.clientWidth;
        }

        while (textWidth > availableWidth && titleFontSize > 0.5) { // Constrain min font size to 0.5em
            titleFontSize -= 0.1;
            titleElement.style.fontSize = `${titleFontSize}em`;
            compassIcon.style.fontSize = `${titleFontSize * iconScaleFactor}em`;
            textWidth = getTextWidth(titleElement.textContent.replace('O', ''), getCanvasFont(titleElement)) + compassIcon.clientWidth;
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

        // Adjust the line height of the subtitle element to fit within the media height
        let subtitleLineHeight = 1.4; // Starting line height
        subtitleElement.style.lineHeight = subtitleLineHeight;
        totalHeight = titleElement.clientHeight + subtitleElement.clientHeight;

        while (totalHeight < mediaHeight && subtitleLineHeight < 2) { // Constrain max line height to 2
            subtitleLineHeight += 0.1;
            subtitleElement.style.lineHeight = subtitleLineHeight;
            totalHeight = titleElement.clientHeight + subtitleElement.clientHeight;
        }

        while (totalHeight > mediaHeight && subtitleLineHeight > 1) { // Ensure line height does not go below 1
            subtitleLineHeight -= 0.1;
            subtitleElement.style.lineHeight = subtitleLineHeight;
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

    function typeWriterEffect(text, element, delay = 100, callback) {
        element.innerHTML = '';
        let index = 0;

        function type() {
            if (index < text.length) {
                element.innerHTML += `<span style="color: black;">${text[index]}</span>`;
                index++;
                setTimeout(type, delay);
            } else {
                if (callback) callback();
            }
        }

        type();
    }

    window.onload = () => {
        updateSubtitle();
        adjustFontSizeAndLineHeight();
        checkVideoCompatibility();

        // Add click event listener to the compass icon
        document.getElementById('compassIcon').addEventListener('click', function() {
            this.classList.add('shake');
            setTimeout(() => this.classList.remove('shake'), 500); // Remove the class after animation ends
        });

        // Delay the typewriter effect to allow font size and line height adjustment
        setTimeout(() => {
            const subtitleText = document.getElementById('welcomeSubtitle').textContent;
            const subtitleElement = document.getElementById('welcomeSubtitle');
            subtitleElement.style.textAlign = 'left'; // Initially set to left align
            subtitleElement.style.textAlignLast = 'left'; // Initially set to left align
            subtitleElement.style.MozTextAlignLast = 'left'; // Initially set to left align
            typeWriterEffect(subtitleText, subtitleElement, 15, () => {
                subtitleElement.style.textAlign = 'justify'; // Change to justify after typing is complete
                subtitleElement.style.textAlignLast = 'justify'; // Change to justify after typing is complete
                subtitleElement.style.MozTextAlignLast = 'justify'; // Change to justify after typing is complete
            });
        }, 1000);
    };


    window.onresize = () => {
        adjustFontSizeAndLineHeight();
    };

    // Mute/unmute button
    const videoElement = document.getElementById('videoElement');
    videoElement.addEventListener('click', () => {
        videoElement.muted = !videoElement.muted;
    });
</script>