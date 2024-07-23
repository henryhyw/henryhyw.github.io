function updateSubtitle() {
    const subtitleElement = document.getElementById('welcomeSubtitle');
    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    if (isMobile) {
        subtitleElement.textContent = "Hello! I'm Han-yu, a junior at HKU, majoring in AI. I love to explore new places and code apps. I'm ready to share my journey with you!";
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

function adjustTitle() {
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
}

function adjustSubtitle() {
    const videoElement = document.getElementById('videoElement');
    const imageElement = document.getElementById('imageElement');
    const titleElement = document.getElementById('welcomeTitle');
    const subtitleElement = document.getElementById('welcomeSubtitle');
    const compassIcon = document.getElementById('compassIcon');

    const mediaElement = videoElement.style.display !== 'none' ? videoElement : imageElement;
    const mediaHeight = mediaElement.clientHeight;
    const availableWidth = document.querySelector('.welcome-text').clientWidth;

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

function typeWriterEffect(text, element, delay = 100, callback) {
    element.innerHTML = '';
    let index = 0;

    function type() {
        if (index < text.length) {
            const isDarkMode = document.body.classList.contains('dark-mode');
            const textColor = isDarkMode ? '#fafafa' : '#252525'; // Change text color based on theme
            
            const span = document.createElement('span');
            span.className = 'typed';
            span.style.color = textColor;
            span.textContent = text[index];
            element.appendChild(span);
            
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
const maxAngle = 90; // Maximum angle to prevent excessive shaking
const maxDuration = 0.3; // Minimum duration to prevent excessive speed

let resetTimeout;

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
    let newAngle = Math.min(15 + pressCount * 6, maxAngle); // Increase angle by 5 degrees per press, up to maxAngle
    let newDuration = Math.max(0.8 - pressCount * 0.05, maxDuration); // Decrease duration by 0.05s per press, down to maxDuration
    
    shakeQueue.push({ newAngle, newDuration });
    processShakeQueue();
    
    // Clear any existing reset timeout
    clearTimeout(resetTimeout);
    
    // Set a new reset timeout for 2 seconds
    resetTimeout = setTimeout(() => {
        pressCount = 0;
    }, 500);
});

const videoSources = [
    { src: "/assets/vid/home1.mp4", cursor: "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 288 512\"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d=\"M216 464h-40V346.8c68.5-15.9 118.1-79.9 111.4-154.2l-16-178.1C270.7 6.3 263.9 0 255.7 0H32.3c-8.2 0-15 6.3-15.7 14.6L.6 192.7C-6.1 266.9 43.5 330.9 112 346.8V464H72c-22.1 0-40 17.9-40 40 0 4.4 3.6 8 8 8h208c4.4 0 8-3.6 8-8 0-22.1-17.9-40-40-40zM61.8 48h164.5l7.2 80H54.6l7.2-80z\"/></svg>') 32 32, auto" },
    { src: "/assets/vid/home2.mp4", cursor: "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d=\"M288 167.2v-28.1c-28.2-36.3-47.1-79.3-54.1-125.2-2.1-13.5-19-18.8-27.8-8.3-21.1 24.9-37.7 54.1-48.9 86.5 34.2 38.3 80 64.6 130.8 75.1zM400 64c-44.2 0-80 35.9-80 80.1v59.4C215.6 197.3 127 133 87 41.8c-5.5-12.5-23.2-13.2-29-.9C41.4 76 32 115.2 32 156.6c0 70.8 34.1 136.9 85.1 185.9 13.2 12.7 26.1 23.2 38.9 32.8l-143.9 36C1.4 414-3.4 426.4 2.6 435.7 20 462.6 63 508.2 155.8 512c8 .3 16-2.6 22.1-7.9l65.2-56.1H320c88.4 0 160-71.5 160-159.9V128l32-64H400zm0 96.1c-8.8 0-16-7.2-16-16s7.2-16 16-16 16 7.2 16 16-7.2 16-16 16z\"/></svg>') 32 32, auto" },
    { src: "/assets/vid/home3.mp4", cursor: "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d=\"M290.6 192c-20.2 0-106.8 2-162.6 86V192c0-52.9-43.1-96-96-96-17.7 0-32 14.3-32 32s14.3 32 32 32c17.6 0 32 14.4 32 32v256c0 35.3 28.7 64 64 64h176c8.8 0 16-7.2 16-16v-16c0-17.7-14.3-32-32-32h-32l128-96v144c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V289.9c-10.3 2.7-20.9 4.5-32 4.5-61.8 0-113.5-44.1-125.4-102.4zM448 96h-64l-64-64v134.4c0 53 43 96 96 96s96-43 96-96V32l-64 64zm-72 80c-8.8 0-16-7.2-16-16s7.2-16 16-16 16 7.2 16 16-7.2 16-16 16zm80 0c-8.8 0-16-7.2-16-16s7.2-16 16-16 16 7.2 16 16-7.2 16-16 16z\"/></svg>') 32 32, auto" }
];

function checkVideoCompatibility() {
    // Generate a random index between 0 and the length of the array minus 1
    const randomIndex = Math.floor(Math.random() * videoSources.length);

    // Select a random video source from the array
    const newSource = videoSources[randomIndex];

    // Get the video element and the current source element
    const videoElement = document.getElementById('videoElement');
    const currentSourceElement = videoElement.querySelector('source');

    // Update the source element with the new video source
    currentSourceElement.setAttribute('src', newSource.src);

    // Assign the corresponding cursor style to the video element
    videoElement.style.cursor = newSource.cursor;

    videoElement.style.transition = 'opacity 4s ease-in-out';
    videoElement.style.opacity = '';

    // Attempt to play the video, if it fails, switch to the fallback image
    videoElement.play().catch(() => {
        videoElement.style.display = 'none';
        fallbackImage.style.opacity = '0';
        fallbackImage.style.display = 'block';
        fallbackImage.style.opacity = 'opacity 4s ease-in-out';
        fallbackImage.style.opacity = '';
        adjustTitle(); // Ensure text formatting is adjusted when fallback image is shown
        const isSmallScreen = window.matchMedia("(max-width: 600px)").matches;
        if (isSmallScreen) {
            document.getElementById('welcomeTitle').style.fontSize = '2em';
            document.getElementById('compassIcon').style.fontSize = '1.1em';
        }
        adjustSubtitle();
    });
}

// Function to preload videos
function preloadVideos() {
    videoSources.forEach(src => {
        const video = document.createElement('video');
        video.src = src;
        video.preload = 'auto';
        video.style.display = 'none'; // Hide the video element
        document.body.appendChild(video);
    });
}

// Function to switch video sources with a flip effect
function switchVideoSource() {
    const videoElement = document.getElementById('videoElement');
    const currentSourceElement = videoElement.querySelector('source');
    const currentSource = currentSourceElement.getAttribute('src');

    // Find the index of the current video source
    const currentIndex = videoSources.findIndex(video => video.src === currentSource);

    // Function to get a new random index that is not the same as currentIndex
    function getNewRandomIndex(excludeIndex, arrayLength) {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * arrayLength);
        } while (newIndex === excludeIndex);
        return newIndex;
    }

    // Get the new random index
    const newIndex = getNewRandomIndex(currentIndex, videoSources.length);

    // Select the new video source and cursor using the new index
    const newVideoSource = videoSources[newIndex];

    // Apply flip effect
    videoElement.classList.add('flip');

    // Listen for the midpoint of the flip to change the source
    videoElement.addEventListener('animationend', () => {
        // Change the source and load the new video
        videoElement.pause(); // Pause the video before changing the source
        videoElement.querySelector('source').src = newVideoSource.src;
        videoElement.load(); // Load the new video source

        // Restart the flip animation for the second half of the transition
        videoElement.classList.remove('flip');
        void videoElement.offsetWidth; // Trigger reflow to restart animation

        // Play the new video source
        videoElement.play();

        // Add the flip class back to complete the flip animation
        videoElement.classList.add('flip2');

        // Ensure the flip class is removed after the animation completes
        videoElement.addEventListener('animationend', () => {
            videoElement.classList.remove('flip2');
            videoElement.style.cursor = newVideoSource.cursor;
        }, { once: true });
    }, { once: true });
}

// Event listener for compass icon click to switch video sources
document.getElementById('compassIcon').addEventListener('click', switchVideoSource);

// Ensure the video is loaded on page load
window.onload = () => {
    preloadVideos();
    updateSubtitle();
    adjustTitle();
    const isSmallScreen = window.matchMedia("(max-width: 600px)").matches;
    if (isSmallScreen) {
        document.getElementById('welcomeTitle').style.fontSize = '2em';
        document.getElementById('compassIcon').style.fontSize = '1.1em';
    }
    adjustSubtitle();

    const videoElement = document.getElementById('videoElement');
    const fallbackImage = document.getElementById('imageElement');
    checkVideoCompatibility();

    let fadeOutApplied = false;
    const videoOverlay = document.getElementById('videoOverlay');
    videoElement.style.transition = 'opacity 0.3s ease-in-out';
    videoOverlay.style.transition = 'opacity 0.3s ease-in-out';

    videoElement.addEventListener('timeupdate', () => {
        const timeLeft = videoElement.duration - videoElement.currentTime;
        if (timeLeft < 0.6 && !fadeOutApplied) { // Adjust the time threshold as needed
            videoOverlay.style.opacity = '1';
            fadeOutApplied = true;
        }
    });

    videoElement.addEventListener('playing', () => {
        videoOverlay.style.opacity = '0';
        fadeOutApplied = false; // Reset the flag when the video starts playing again
    });

    setTimeout(() => {
        const titleElement = document.getElementById('welcomeTitle');
        titleElement.style.transition = 'color 2s';
        titleElement.style.color = ''; // Reset to original color
        const subtitleText = document.getElementById('welcomeSubtitle').textContent;
        const subtitleElement = document.getElementById('welcomeSubtitle');
        subtitleElement.style.textAlign = 'left'; // Initially set to left align
        subtitleElement.style.textAlignLast = 'left'; // Initially set to left align
        subtitleElement.style.MozTextAlignLast = 'left'; // Initially set to left align

        typeWriterEffect(subtitleText, subtitleElement, 50, () => {
            subtitleElement.style.textAlign = 'justify'; // Change to justify after typing is complete
            subtitleElement.style.textAlignLast = 'justify'; // Change to justify after typing is complete
            subtitleElement.style.MozTextAlignLast = 'justify'; // Change to justify after typing is complete

            setTimeout(() => {
                document.querySelectorAll('header *').forEach(element => {
                    element.style.transition = 'color 2s';
                    element.style.color = ''; // Reset to original color
                });
                document.querySelectorAll('footer *').forEach(element => {
                    element.style.transition = 'color 2s';
                    element.style.color = ''; // Reset to original color
                });
                const quoteElement = document.getElementById('welcomeQuote');
                quoteElement.style.transition = 'color 2s';
                quoteElement.style.color = ''; // Reset to original color

                // Reset the transition property after the color transition is complete
                setTimeout(() => {
                    titleElement.style.transition = 'color 0.5s';
                    subtitleElement.style.transition = 'color 0.5s';
                    document.querySelectorAll('header *').forEach(element => {
                        element.style.transition = 'color 0.5s';
                    });
                    document.querySelectorAll('footer *').forEach(element => {
                        element.style.transition = 'color 0.5s';
                    });
                    quoteElement.style.transition = 'color 0.5s';
                }, 2000); // Match this duration with the color transition time (2 seconds)
            }, 1000);
        });
    }, 1000);
};

window.onresize = () => {
    adjustTitle();
    const isSmallScreen = window.matchMedia("(max-width: 600px)").matches;
    if (isSmallScreen) {
        document.getElementById('welcomeTitle').style.fontSize = '2em';
        document.getElementById('compassIcon').style.fontSize = '1.1em';
    }
    adjustSubtitle();
};

// Mute/unmute button
const videoElement = document.getElementById('videoElement');
videoElement.addEventListener('click', () => {
    videoElement.muted = !videoElement.muted;
});