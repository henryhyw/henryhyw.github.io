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
    let newDuration = Math.max(0.8 - pressCount * 0, maxDuration); // Decrease duration by 0.05s per press, down to maxDuration
    
    shakeQueue.push({ newAngle, newDuration });
    processShakeQueue();
    
    // Clear any existing reset timeout
    clearTimeout(resetTimeout);
    
    // Set a new reset timeout for 2 seconds
    resetTimeout = setTimeout(() => {
        pressCount = 0;
    }, 500);
});

function checkVideoCompatibility() {
    videoElement.style.transition = 'opacity 2s ease-in-out';
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

    videoElement.autoplay = false;

    // Apply flip effect
    videoElement.classList.remove('flip2');
    videoElement.classList.add('flip');

    // Listen for the midpoint of the flip to change the source
    videoElement.addEventListener('animationend', () => {
        videoElement.autoplay = true;
        // Change the source and load the new video
        videoElement.pause(); // Pause the video before changing the source
        videoElement.querySelector('source').src = newVideoSource.src;
        videoElement.load(); // Load the new video source

        // Restart the flip animation for the second half of the transition
        videoElement.classList.remove('flip');

        // Play the new video source
        videoElement.play();

        // Add the flip class back to complete the flip animation
        videoElement.classList.add('flip2');

        // Ensure the flip class is removed after the animation completes
        videoElement.addEventListener('animationend', () => {
            videoElement.classList.remove('flip2');
            videoElement.setAttribute('class', newVideoSource.class);
        }, { once: true });
    }, { once: true });
}

// Event listener for compass icon click to switch video sources
document.getElementById('compassIcon').addEventListener('click', switchVideoSource);

// Ensure the video is loaded on page load
window.onload = () => {
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