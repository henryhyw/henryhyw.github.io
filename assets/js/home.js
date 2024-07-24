let shakeQueue = [];
let isShaking = false;
let pressCount = 0;
let pressed = false;
let resetTimeout;
const maxAngle = 360; // Maximum angle to prevent excessive shaking
const minDuration = 0.2; // Minimum duration to prevent excessive speed

let canPlayVideo = true;

const videoSources = [
    { src: "/assets/vid/home1.mp4", class: "homevideo1" },
    { src: "/assets/vid/home2.mp4", class: "homevideo2" },
    { src: "/assets/vid/home3.mp4", class: "homevideo3" }
];

function changeVideoSource() {
    // Generate a random index between 0 and the length of the array minus 1
    const randomIndex = Math.floor(Math.random() * videoSources.length);
    console.log(randomIndex+1);

    // Select a random video source from the array
    const source = videoSources[randomIndex];

    const videoElement = document.getElementById('videoElement');
    const currentSourceElement = videoElement.querySelector('source');
    currentSourceElement.setAttribute('src', source.src)
    videoElement.setAttribute('class', source.class);
    videoElement.load();
}

function preloadVideos() {
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
}

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

function updateTitles() {
    updateSubtitle();
    adjustTitle();
    const isSmallScreen = window.matchMedia("(max-width: 600px)").matches;
    if (isSmallScreen) {
        document.getElementById('welcomeTitle').style.fontSize = '2em';
        document.getElementById('compassIcon').style.fontSize = '1.1em';
    }
    adjustSubtitle();
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

function videoTransition() {
    let fadeOutApplied = false;
    const transitionOverlay = document.getElementById('transitionOverlay');
    transitionOverlay.style.transition = 'opacity 0.3s ease-in-out';

    videoElement.addEventListener('timeupdate', () => {
        const timeLeft = videoElement.duration - videoElement.currentTime;
        if (timeLeft < 0.6 && !fadeOutApplied) { // Adjust the time threshold as needed
            transitionOverlay.style.opacity = '1';
            fadeOutApplied = true;
        }
    });

    videoElement.addEventListener('timeupdate', () => {
        if (videoElement.currentTime >0.2 && videoElement.currentTime <1.2 ) {
            transitionOverlay.style.opacity = '0';
            fadeOutApplied = false; // Reset the flag when the video starts playing again
        }
    });

    // videoElement.addEventListener('playing', () => {
    //     transitionOverlay.style.opacity = '0';
    //     fadeOutApplied = false; // Reset the flag when the video starts playing again
    // });
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

function switchVideoSource() {
    const videoElement = document.getElementById('videoElement');
    const transitionOverlay = document.getElementById('transitionOverlay');
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
    transitionOverlay.classList.remove('flip2');
    transitionOverlay.classList.add('flip');

    // Listen for the midpoint of the flip to change the source
    videoElement.addEventListener('animationend', () => {
        // Change the source and load the new video
        videoElement.pause(); // Pause the video before changing the source
        videoElement.querySelector('source').src = newVideoSource.src;
        videoElement.load(); // Load the new video source

        // Restart the flip animation for the second half of the transition
        videoElement.classList.remove('flip');
        transitionOverlay.classList.remove('flip');

        // Play the new video source
        videoElement.play();

        // Add the flip class back to complete the flip animation
        videoElement.classList.add('flip2');
        transitionOverlay.classList.add('flip2');

        // Ensure the flip class is removed after the animation completes
        videoElement.addEventListener('animationend', () => {
            videoElement.classList.remove('flip2');
            transitionOverlay.classList.remove('flip2');
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

    hintParagraph.classList.remove("tipcolor-2");
    hintParagraph.classList.add("tipcolor-1");

    const compassIcon = document.getElementById('compassIcon');
    compassIcon.style.transition = 'color 1.5s'

    // Function to toggle between the classes
    function toggleTipColor() {
        compassIcon.classList.add("tipcolor-1");
        setTimeout(function() {
            compassIcon.classList.remove("tipcolor-1");
        }, 800);
    }

    // Set an interval to toggle the classes every 4000ms if pressed is false
    const hintFlash = setInterval(function() {
        if (!pressed) {
            toggleTipColor();
        } else {
            clearInterval(hintFlash); // Clear the interval
        }
    }, 2400);
}

function displayWelcomeContent() {
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

            createFlashingHint();
            const overlay = document.getElementById('overlay');
            overlay.style.pointerEvents = 'none'; // Disable pointer events to allow clicks

            // Reset the transition property after the color transition is complete
            setTimeout(() => {
                document.querySelectorAll('header *').forEach(element => {
                    element.style.transition = 'color 0.5s';
                });
                document.querySelectorAll('footer *').forEach(element => {
                    element.style.transition = 'color 0.5s';
                });
            }, 2000); // Match this duration with the color transition time (2 seconds)
        }, 1000);
    });
}

function setupDescriptionOverlay() {
    const videoElement = document.querySelector('.videoElement');
    const descriptionOverlay = document.querySelector('.description-overlay');

    videoElement.addEventListener('mouseenter', () => {
        descriptionOverlay.style.opacity = '0.8';
    });

    videoElement.addEventListener('mouseleave', () => {
        descriptionOverlay.style.opacity = '0';
    });
}

document.getElementById('compassIcon').addEventListener('click', function() {

    if (canPlayVideo) {
        switchVideoSource();
    }

    pressed = true;
    const compassIcon = document.getElementById('compassIcon');
    const hintParagraph = document.getElementById('hint');
    compassIcon.classList.remove("tipcolor-1");
    compassIcon.classList.remove("tipcolor-2");
    try{
        hintParagraph.classList.add("tipcolor-2");
    } catch (error) {
        console.error(error);
    } 

    pressCount++;
    
    // Calculate new angle and duration based on the number of presses
    let newAngle = Math.min(15 + pressCount * 6, maxAngle); // Increase angle by 5 degrees per press, up to maxAngle
    let newDuration = Math.max(0.8 - pressCount * 0.06, minDuration); // Decrease duration by 0.05s per press, down to minDuration
    
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
    changeVideoSource();

    const videoElement = document.getElementById('videoElement');
    const fallbackImage = document.getElementById('imageElement');
    videoElement.style.opacity = '1';
    // Attempt to play the video
    videoElement.play().then(() => {
        const checkDimensions = setInterval(function() {
            if (videoElement.videoWidth > 0 && videoElement.videoHeight > 0) {
                const aspectRatio = videoElement.videoWidth / videoElement.videoHeight;
                // Check if the aspect ratio is approximately 9:16
                if (Math.abs(aspectRatio - (9 / 16)) < 0.01) {
                    clearInterval(checkDimensions);

                    updateTitles();

                    // Mute/unmute button
                    videoElement.addEventListener('click', () => {
                        if (videoElement.muted) {
                            videoElement.muted = false;
                            videoElement.style.filter = 'grayscale(0%)';
                        } else {
                            videoElement.muted = true;
                            videoElement.style.filter = 'grayscale(85%)';
                        }
                    });

                    preloadVideos();

                    videoTransition();

                    setTimeout(() => {
                        displayWelcomeContent();
                    }, 1000);
                }
            }
        }, 100); // Check every 100ms until dimensions are available
    }).catch((error) => {
        console.error('Error playing video:', error);
        canPlayVideo = false;
        videoElement.style.display = 'none';
        fallbackImage.style.display = 'block';
        fallbackImage.style.opacity = '1';
        const checkDimensions = setInterval(function() {
            if (imageElement.naturalWidth > 0 && imageElement.naturalHeight > 0) {
                const aspectRatio = imageElement.naturalWidth / imageElement.naturalHeight;
                // Check if the aspect ratio is approximately 9:16
                if (Math.abs(aspectRatio - (9 / 16)) < 0.01) {
                    clearInterval(checkDimensions);

                    updateTitles();

                    setTimeout(() => {
                        displayWelcomeContent();
                    }, 1000);
                }
            }
        }, 100); // Check every 100ms until dimensions are available
    });
});

window.onresize = () => {
    updateTitles();
};