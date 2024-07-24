let shakeQueue = [];
let isShaking = false;
let pressCount = 0;
let pressed = false;
const maxAngle = 90; // Maximum angle to prevent excessive shaking
const maxDuration = 0.3; // Minimum duration to prevent excessive speed
let resetTimeout;

const videoSources = [
    { src: "/assets/vid/home1.mp4", class: "homevideo1" },
    { src: "/assets/vid/home2.mp4", class: "homevideo2" },
    { src: "/assets/vid/home3.mp4", class: "homevideo3" }
];

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

function checkVideoCompatibility() {
    const videoElement = document.getElementById('videoElement');
    const fallbackImage = document.getElementById('imageElement');
    videoElement.style.transition = 'opacity 3s ease-in-out';
    videoElement.style.opacity = '1';
    videoElement.play();
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
    const videoOverlay = document.getElementById('videoOverlay');
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

    console.log(newVideoSource)

    // Apply flip effect
    videoElement.classList.remove('flip2');
    videoElement.classList.add('flip');
    videoOverlay.classList.remove('flip2');
    videoOverlay.classList.add('flip');

    // Listen for the midpoint of the flip to change the source
    videoElement.addEventListener('animationend', () => {
        // Change the source and load the new video
        videoElement.pause(); // Pause the video before changing the source
        videoElement.querySelector('source').src = newVideoSource.src;
        videoElement.load(); // Load the new video source

        // Restart the flip animation for the second half of the transition
        videoElement.classList.remove('flip');
        videoOverlay.classList.remove('flip');

        // Play the new video source
        videoElement.play();

        // Add the flip class back to complete the flip animation
        videoElement.classList.add('flip2');
        videoOverlay.classList.add('flip2');

        // Ensure the flip class is removed after the animation completes
        videoElement.addEventListener('animationend', () => {
            videoElement.classList.remove('flip2');
            videoOverlay.classList.remove('flip2');
            videoElement.setAttribute('class', newVideoSource.class);
        }, { once: true });
    }, { once: true });
}

function createFlashingHint() {
    // Create a new <small> element
    var hintParagraph = document.createElement("small");

    // Set the class and style of the new <p> element
    hintParagraph.id = "hint";
    hintParagraph.className = "tipcolor-2";
    hintParagraph.style.float = "right";

    // Set the text content of the new element
    hintParagraph.textContent = 'Click the compass!';

    // Find the element with the class "header"
    var headerElement = document.querySelector(".header-title");

    // Append the new <p> element to the header element
    if (headerElement) {
        headerElement.insertBefore(hintParagraph, headerElement.children[2] || null);
    }

    // Function to toggle between the classes
    function toggleTipColor() {
        const compassIcon = document.getElementById('compassIcon');
        if (hintParagraph.classList.contains("tipcolor-2")) {
            compassIcon.classList.remove("tipcolor-2");
            compassIcon.classList.add("tipcolor-1");
            hintParagraph.classList.remove("tipcolor-2");
            hintParagraph.classList.add("tipcolor-1");
            setTimeout(function() {
                if (!pressed) {
                    compassIcon.classList.add("tipcolor-2");
                    hintParagraph.classList.remove("tipcolor-1");
                    hintParagraph.classList.add("tipcolor-2");
                }
            }, 4000); // Change to "tipcolor-2" after 3 seconds
        }
    }

    // Set an interval to toggle the classes every 4000ms if pressed is false
    const hintFlash = setInterval(function() {
        if (!pressed) {
            toggleTipColor();
        } else {
            clearInterval(hintFlash); // Clear the interval
        }
    }, 6000);
}

// Event listener for compass icon click to switch video sources
document.getElementById('compassIcon').addEventListener('click', switchVideoSource);

document.getElementById('compassIcon').addEventListener('click', function() {
    pressed = true;
    const compassIcon = document.getElementById('compassIcon');
    const hintParagraph = document.getElementById('hint');
    compassIcon.classList.remove("tipcolor-1");
    compassIcon.classList.remove("tipcolor-2");
    hintParagraph.classList.remove("tipcolor-1");
    hintParagraph.classList.add("tipcolor-2");

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

document.addEventListener("DOMContentLoaded", function() {
    // Generate a random index between 0 and the length of the array minus 1
    const randomIndex = Math.floor(Math.random() * videoSources.length);
    console.log(randomIndex+1);

    // Select a random video source from the array
    const source = videoSources[randomIndex];

    const videoElement = document.getElementById('videoElement');
    const currentSourceElement = videoElement.querySelector('source');
    currentSourceElement.setAttribute('src', source.src)
    videoElement.load();
    
    const checkDimensions = setInterval(function() {
        if (videoElement.videoWidth > 0 && videoElement.videoHeight > 0) {
            const aspectRatio = videoElement.videoWidth / videoElement.videoHeight;
            // Check if the aspect ratio is approximately 9:16
            if (Math.abs(aspectRatio - (9 / 16)) < 0.01) {
                clearInterval(checkDimensions);
                console.log('Video is fully loaded and has correct dimensions with 9:16 aspect ratio');
                // Perform the next activity here
                // Mute/unmute button
                videoElement.addEventListener('click', () => {
                    videoElement.muted = !videoElement.muted;
                });
                videoSources.forEach(videoData => {
                    const video = document.createElement('video');
                    video.src = videoData.src;
                    video.preload = 'auto';
                    video.autoplay = true;
                    video.loop = true;
                    video.muted = true;
                    video.style.display = 'none'; // Hide the video element
                    document.body.appendChild(video);
                });
                updateSubtitle();
                adjustTitle();
                const isSmallScreen = window.matchMedia("(max-width: 600px)").matches;
                if (isSmallScreen) {
                    document.getElementById('welcomeTitle').style.fontSize = '2em';
                    document.getElementById('compassIcon').style.fontSize = '1.1em';
                }
                adjustSubtitle();

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

                videoElement.addEventListener('timeupdate', () => {
                    if (videoElement.currentTime >0.2 && videoElement.currentTime <1.2 ) {
                        videoOverlay.style.opacity = '0';
                        fadeOutApplied = false; // Reset the flag when the video starts playing again
                    }
                });

                // videoElement.addEventListener('playing', () => {
                //     videoOverlay.style.opacity = '0';
                //     fadeOutApplied = false; // Reset the flag when the video starts playing again
                // });

                setTimeout(() => {
                    const titleElement = document.getElementById('welcomeTitle');
                    titleElement.style.transition = 'color 2s';
                    titleElement.style.color = ''; // Reset to original color
                    const subtitleText = document.getElementById('welcomeSubtitle').textContent;
                    const subtitleElement = document.getElementById('welcomeSubtitle');
                    subtitleElement.style.textAlign = 'left'; // Initially set to left align
                    subtitleElement.style.textAlignLast = 'left'; // Initially set to left align
                    subtitleElement.style.MozTextAlignLast = 'left'; // Initially set to left align

                    typeWriterEffect(subtitleText, subtitleElement, 30, () => {
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
                                document.querySelectorAll('header *').forEach(element => {
                                    element.style.transition = 'color 0.5s';
                                });
                                document.querySelectorAll('footer *').forEach(element => {
                                    element.style.transition = 'color 0.5s';
                                });

                                setTimeout(() => {
                                    createFlashingHint();
                                });
                            }, 2000); // Match this duration with the color transition time (2 seconds)
                        }, 1000);
                    });
                }, 1000);
            }
        }
    }, 100); // Check every 100ms until dimensions are available
});

window.onresize = () => {
    adjustTitle();
    const isSmallScreen = window.matchMedia("(max-width: 600px)").matches;
    if (isSmallScreen) {
        document.getElementById('welcomeTitle').style.fontSize = '2em';
        document.getElementById('compassIcon').style.fontSize = '1.1em';
    }
    adjustSubtitle();
};