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

function checkVideoCompatibility() {
    videoElement.style.transition = 'opacity 2s ease-in-out';
    videoElement.style.opacity = '';

    // Attempt to play the video, if it fails, switch to the fallback image
    videoElement.play().catch(() => {
        videoElement.style.opacity = '0';
        fallbackImage.style.opacity = 'opacity 2s ease-in-out';
        fallbackImage.style.opacity = '1';
        adjustTitle(); // Ensure text formatting is adjusted when fallback image is shown
        const isSmallScreen = window.matchMedia("(max-width: 600px)").matches;
        if (isSmallScreen) {
            document.getElementById('welcomeTitle').style.fontSize = '2em';
            document.getElementById('compassIcon').style.fontSize = '1.1em';
        }
        adjustSubtitle();
    });
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
    }, 6000);
});

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
    const videoOverlay = document.getElementById('videoOverlay');
    checkVideoCompatibility();

    let fadeOutApplied = false;
    videoElement.style.transition = 'opacity 0.25s ease-in-out';
    videoOverlay.style.transition = 'opacity 0.25s ease-in-out';

    videoElement.addEventListener('timeupdate', () => {
        const timeLeft = videoElement.duration - videoElement.currentTime;
        if (timeLeft < 0.5 && !fadeOutApplied) { // Adjust the time threshold as needed
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