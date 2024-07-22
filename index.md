---
layout: page
title: 
---

<script>
  document.title = "Home | H.W.";
</script>

<style>
html, body {
    -webkit-user-select: none; /* Safari */
    -moz-user-select: none;    /* Firefox */
    -ms-user-select: none;     /* Internet Explorer/Edge */
    user-select: none;         /* Non-prefixed version, currently supported by Chrome, Opera, and Edge */
}

#videoElement, #imageElement{
    cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 640 512" fill="%23FFFFFF"><path d="M155.6 17.3C163 3 179.9-3.6 195 1.9L320 47.5l125-45.6c15.1-5.5 32 1.1 39.4 15.4l78.8 152.9c28.8 55.8 10.3 122.3-38.5 156.6L556.1 413l41-15c16.6-6 35 2.5 41 19.1s-2.5 35-19.1 41l-71.1 25.9L476.8 510c-16.6 6.1-35-2.5-41-19.1s2.5-35 19.1-41l41-15-31.3-86.2c-59.4 5.2-116.2-34-130-95.2L320 188.8l-14.6 64.7c-13.8 61.3-70.6 100.4-130 95.2l-31.3 86.2 41 15c16.6 6 25.2 24.4 19.1 41s-24.4 25.2-41 19.1L92.2 484.1 21.1 458.2c-16.6-6.1-25.2-24.4-19.1-41s24.4-25.2 41-19.1l41 15 31.3-86.2C66.5 292.5 48.1 226 76.9 170.2L155.6 17.3zm44 54.4l-27.2 52.8L261.6 157l13.1-57.9L199.6 71.7zm240.9 0L365.4 99.1 378.5 157l89.2-32.5L440.5 71.7z"/></svg>') 24 24, auto;
}
video, .fallback-image {
    max-width: 45%;
    height: auto;
}

video{
    filter: brightness(70%) grayscale(85%); /* Make the video darker and grayscale */
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

@media (max-width: 600px) {
    .social-icons {
        visibility: hidden;
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
    color: #616161;
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
@keyframes rotate-shake {
    0% { transform: rotate(0deg); }
    25% { transform: rotate(var(--shake-angle)); }
    50% { transform: rotate(calc(var(--shake-angle) * -1)); }
    75% { transform: rotate(var(--shake-angle)); }
    100% { transform: rotate(0deg); }
}

.shake {
    animation: rotate-shake var(--shake-duration) infinite;
}

#compassIcon {
    --shake-angle: 10deg; /* Initial shake angle */
    --shake-duration: 0.5s; /* Initial shake duration */
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

<br>

<h3 style="text-align: center; font-size: 1em; color: #a9a9a9;">Life is a journey that constantly<br>explores the unknown</h3>

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
                element.innerHTML += `<span style="color: #252525;">${text[index]}</span>`;
                index++;
                setTimeout(type, delay);
            } else {
                if (callback) callback();
            }
        }

        type();
    }

    let shakeQueue = [];
    let isShaking = false;
    let pressCount = 0;
    const maxAngle = 60; // Maximum angle to prevent excessive shaking
    const maxDuration = 0.3; // Minimum duration to prevent excessive speed

    function processShakeQueue() {
        if (shakeQueue.length === 0 || isShaking) return;
        
        isShaking = true;
        const { newAngle, newDuration } = shakeQueue.shift();
        
        const compassIcon = document.getElementById('compassIcon');
        compassIcon.style.setProperty('--shake-angle', `${newAngle}deg`);
        compassIcon.style.setProperty('--shake-duration', `${newDuration}s`);
        
        compassIcon.classList.add('shake');
        
        setTimeout(() => {
            compassIcon.classList.remove('shake');
            isShaking = false;
            processShakeQueue(); // Process the next shake in the queue
        }, newDuration * 1000);
    }

    document.getElementById('compassIcon').addEventListener('click', function() {
        pressCount++;
        
        // Calculate new angle and duration based on the number of presses
        let newAngle = Math.min(10 + pressCount * 5, maxAngle); // Increase angle by 2 degrees per press, up to maxAngle
        let newDuration = Math.max(0.5 - pressCount * 0.05, maxDuration); // Decrease duration by 0.05s per press, down to maxDuration
        
        shakeQueue.push({ newAngle, newDuration });
        processShakeQueue();
        
        // Reset press count after a short delay to prevent excessive shaking
        setTimeout(() => {
            pressCount = 0;
        }, 3000);
    });

    window.onload = () => {
        updateSubtitle();
        adjustFontSizeAndLineHeight();
        // const isSmallScreen = window.matchMedia("(max-width: 600px)").matches;
        // if (isSmallScreen) {
        //     document.getElementById('welcomeTitle').style.fontSize = '1.8em';
        //     document.getElementById('compassIcon').style.fontSize = '1em';
        // }
        checkVideoCompatibility();

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
        const isSmallScreen = window.matchMedia("(max-width: 600px)").matches;
        if (isSmallScreen) {
            document.getElementById('welcomeTitle').style.fontSize = '1.8em';
            document.getElementById('compassIcon').style.fontSize = '1em';
        }
    };

    // Mute/unmute button
    const videoElement = document.getElementById('videoElement');
    videoElement.addEventListener('click', () => {
        videoElement.muted = !videoElement.muted;
    });
</script>