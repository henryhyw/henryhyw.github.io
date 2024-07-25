let shakeQueue = [];
let isShaking = false;
let pressCount = 0;
let pressed = false;
let resetTimeout;
const maxAngle = 360; // Maximum angle to prevent excessive shaking
const minDuration = 0.2; // Minimum duration to prevent excessive speed
const coolDownFactor = 0.9; // Factor to gradually reduce angle and duration during cool down
const coolDownInterval = 200; // Interval between cool down steps in milliseconds

let canPlayVideo = true;

let currentTimeoutId; // Variable to store the current timeout ID

const videoSources = [
    { src: "/assets/vid/home1.mp4", class: "homevideo1", description: "Sunbathing, beers, and ocean breezes on the Mediterranean!" },
    { src: "/assets/vid/home2.mp4", class: "homevideo2", description: "Ducks enjoying a swim by the oceanside, weaving between the boats." },
    { src: "/assets/vid/home3.mp4", class: "homevideo3", description: "A cat strolling on the ancient stone steps, shot in Athens." }
];

let nonPlayed = [...videoSources];

let currentVideoSource = videoSources[0];

function isMobilePhone() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    return /android|iPhone|iPod/i.test(userAgent);
}

function isTouchScreen(){
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    return /android|iPhone|iPad|iPod/i.test(userAgent);
}

function changeVideoSource() {
    // Get a new random index from nonPlayed
    const newIndex = Math.floor(Math.random() * nonPlayed.length);

    // Select the new video source using the new index
    const source = nonPlayed.splice(newIndex, 1)[0]; // Remove the selected video from nonPlayed
    currentVideoSource = source;

    const videoElement = document.getElementById('videoElement');
    const currentSourceElement = videoElement.querySelector('source');
    currentSourceElement.setAttribute('src', source.src)
    videoElement.setAttribute('class', source.class);
    videoElement.load();

    // Update the description content
    const descriptionContentElement = document.getElementById('descriptionContent');
    descriptionContentElement.innerHTML = `${source.description}<br><p>Click for color and sound!</p>`;
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
    // Clear any existing timeout to interrupt the previous typing effect
    if (currentTimeoutId) {
        clearTimeout(currentTimeoutId);
    }

    element.innerHTML = '';
    let index = 0;
    const spans = [];

    // Step 1: Create a span for each character
    for (let i = 0; i < text.length; i++) {
        const span = document.createElement('span');
        span.className = 'typed';
        span.style.color = 'transparent'; // Initially transparent
        span.textContent = text[i];
        element.appendChild(span);
        spans.push(span);
    }

    // Step 2: Turn each span into the text color one by one
    function reveal() {
        if (index < spans.length) {
            const isDarkMode = document.body.classList.contains('dark-mode');
            const textColor = isDarkMode ? '#fafafa' : '#252525'; // Change text color based on theme
            
            spans[index].style.transition = `color 2s`;
            spans[index].style.color = textColor;
            index++;
            currentTimeoutId = setTimeout(reveal, delay); // Store the timeout ID
        } else {
            if (callback) callback();
        }
    }

    reveal();
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

function gradualStop() {
    if (pressCount === 0) return;

    const compassIcon = document.getElementById('compassIcon');

    // Calculate the reduced angle and duration
    let reducedAngle = Math.max(15, compassIcon.style.getPropertyValue('--shake-angle').replace('deg', '') * coolDownFactor);
    let reducedDuration = Math.min(0.8, compassIcon.style.getPropertyValue('--shake-duration').replace('s', '') / coolDownFactor);

    // Apply the reduced angle and duration
    compassIcon.style.setProperty('--shake-angle', `${reducedAngle}deg`);
    compassIcon.style.setProperty('--shake-duration', `${reducedDuration}s`);

    compassIcon.classList.add('shake');
    
    setTimeout(() => {
        compassIcon.classList.remove('shake');
        if (reducedAngle > 15) {
            setTimeout(gradualStop, coolDownInterval);
        }
    }, reducedDuration * 1000);
}

function switchVideoSource() {
    const videoElement = document.getElementById('videoElement');
    const transitionOverlay = document.getElementById('transitionOverlay');
    const descriptionOverlay = document.getElementById('descriptionOverlay');
    const currentSourceElement = videoElement.querySelector('source');
    const currentSource = currentSourceElement.getAttribute('src');

    // If nonPlayed is empty, refill it with a copy of videoSources
    if (nonPlayed.length === 0) {
        nonPlayed = [...videoSources];
    }

    // Get a new random index from nonPlayed
    const newIndex = Math.floor(Math.random() * nonPlayed.length);

    // Select the new video source using the new index
    const newVideoSource = nonPlayed.splice(newIndex, 1)[0]; // Remove the selected video from nonPlayed
    currentVideoSource = newVideoSource;

    // Apply flip effect
    if (!isMobilePhone()) {
        descriptionOverlay.style.opacity = 0.5;
    }
    videoElement.classList.remove('flip2');
    videoElement.classList.add('flip');
    transitionOverlay.classList.remove('flip2');
    transitionOverlay.classList.add('flip');
    descriptionOverlay.classList.remove('flip2');
    descriptionOverlay.classList.add('flip');

    // Listen for the midpoint of the flip to change the source
    videoElement.addEventListener('animationend', () => {
        // Change the source and load the new video
        videoElement.pause(); // Pause the video before changing the source
        videoElement.querySelector('source').src = newVideoSource.src;
        videoElement.load(); // Load the new video source

        // Restart the flip animation for the second half of the transition
        videoElement.classList.remove('flip');
        transitionOverlay.classList.remove('flip');
        descriptionOverlay.classList.remove('flip');

        // Play the new video source
        videoElement.play();

        if (!videoElement.muted) {
            const descriptionContentElement = document.getElementById('descriptionContent');
            descriptionContentElement.innerHTML = `${currentVideoSource.description}<br><p>Click to silence and fade!</p>`;
        } else {
            const descriptionContentElement = document.getElementById('descriptionContent');
            descriptionContentElement.innerHTML = `${currentVideoSource.description}<br><p>Click for color and sound!</p>`;
        }

        // Add the flip class back to complete the flip animation
        videoElement.classList.add('flip2');
        transitionOverlay.classList.add('flip2');
        descriptionOverlay.classList.add('flip2');

        // Ensure the flip class is removed after the animation completes
        videoElement.addEventListener('animationend', () => {
            videoElement.classList.remove('flip2');
            transitionOverlay.classList.remove('flip2');
            descriptionOverlay.classList.remove('flip2');
            videoElement.setAttribute('class', newVideoSource.class);
            descriptionOverlay.style.opacity = '';
        }, { once: true });
    }, { once: true });
}

function createHint() {
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
}

function compassFlash() {
    const hintParagraph = document.getElementById('hint');
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
    // subtitleElement.style.textAlign = 'left'; // Initially set to left align
    // subtitleElement.style.textAlignLast = 'left'; // Initially set to left align
    // subtitleElement.style.MozTextAlignLast = 'left'; // Initially set to left align
    subtitleElement.style.textAlign = 'justify'; // Change to justify after typing is complete
    subtitleElement.style.textAlignLast = 'justify'; // Change to justify after typing is complete
    subtitleElement.style.MozTextAlignLast = 'justify'; // Change to justify after typing is complete

    typeWriterEffect(subtitleText, subtitleElement, 20, () => {
        setTimeout(() => {
            // subtitleElement.style.textAlign = 'justify'; // Change to justify after typing is complete
            // subtitleElement.style.textAlignLast = 'justify'; // Change to justify after typing is complete
            // subtitleElement.style.MozTextAlignLast = 'justify'; // Change to justify after typing is complete
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

            const overlay = document.getElementById('overlay');
            overlay.style.pointerEvents = 'none'; // Disable pointer events to allow clicks

            setTimeout(() => {
                compassFlash();

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
        }, 1000);
    });
}

function setupDescriptionOverlay() {
    const videoElement = document.getElementById('videoElement');
    const descriptionOverlay = document.querySelector('.description-overlay');

    if (!isTouchScreen()) {
        videoElement.addEventListener('mouseenter', () => {
            descriptionOverlay.style.opacity = '0.5';
        });

        videoElement.addEventListener('mouseleave', () => {
            descriptionOverlay.style.opacity = '0';
        });
    }
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
    try {
        hintParagraph.classList.add("tipcolor-2");
    } catch (error) {
        console.error(error);
    } 

    pressCount++;
    
    // Calculate new angle and duration based on the number of presses
    let newAngle = Math.min(15 + pressCount * 6, maxAngle); // Increase angle by 6 degrees per press, up to maxAngle
    let newDuration = Math.max(0.8 - pressCount * 0.06, minDuration); // Decrease duration by 0.06s per press, down to minDuration
    
    shakeQueue.push({ newAngle, newDuration });
    processShakeQueue();
    
    // Clear any existing reset timeout
    clearTimeout(resetTimeout);
    
    // Set a new reset timeout for 2 seconds
    resetTimeout = setTimeout(() => {
        pressCount = 0;
        gradualStop(); // Start the gradual stop process
    }, 2000);
});

document.addEventListener("DOMContentLoaded", function() {

    if (window.location.pathname === '/index.html') { // Check if the current page is not the homepage
        const overlay = document.getElementById('overlay');
        overlay.style.pointerEvents = 'none'; // Disable pointer events to allow clicks
    }

    changeVideoSource();

    const videoElement = document.getElementById('videoElement');
    const fallbackImage = document.getElementById('imageElement');
    videoElement.style.opacity = '1';
    // Function to handle video playback and related tasks
    function handleVideoPlayback() {
        // Create a flag to indicate whether the video is loaded successfully
        let videoLoaded = false;

        // Create a timeout to handle the scenario where loadeddata is not fired within 4 seconds
        const loadTimeout = setTimeout(() => {
            if (!videoLoaded) {
                handleVideoError(new Error('Timeout waiting for video to load'));
            }
        }, 3000); // 2 seconds

        // Function to handle video errors
        function handleVideoError(error) {
            console.error('Error:', error);
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
        }

        // Listen for the loadeddata event to ensure the video is ready
        videoElement.addEventListener('loadeddata', () => {
            videoLoaded = true;
            clearTimeout(loadTimeout); // Clear the timeout since the video is loaded

            // Attempt to play the video
            videoElement.play().then(() => {
                const checkDimensions = setInterval(function() {
                    if (videoElement.videoWidth > 0 && videoElement.videoHeight > 0) {
                        const aspectRatio = videoElement.videoWidth / videoElement.videoHeight;
                        // Check if the aspect ratio is approximately 9:16
                        if (Math.abs(aspectRatio - (9 / 16)) < 0.01) {
                            clearInterval(checkDimensions);

                            createHint();
                            setupDescriptionOverlay();
                            updateTitles();

                            videoElement.addEventListener('click', () => {
                                if (videoElement.muted) {
                                    videoElement.muted = false;
                                    videoElement.style.filter = 'grayscale(0%)';
                                    // Update the description content
                                    const descriptionContentElement = document.getElementById('descriptionContent');
                                    descriptionContentElement.innerHTML = `${currentVideoSource.description}<br><p>Click to silence and fade!</p>`;
                                } else {
                                    videoElement.muted = true;
                                    videoElement.style.filter = 'grayscale(85%)';
                                    // Update the description content
                                    const descriptionContentElement = document.getElementById('descriptionContent');
                                    descriptionContentElement.innerHTML = `${currentVideoSource.description}<br><p>Click for color and sound!</p>`;
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
                // Handle errors that occur during video playback
                handleVideoError(error);
            });
        }, { once: true });

        // Initial video load attempt
        try {
            videoElement.load();
        } catch (error) {
            handleVideoError(error);
        }
    }

    // Call the function to handle video playback
    handleVideoPlayback();
});

window.onresize = () => {
    // Clear any existing timeout to interrupt the previous typing effect
    if (currentTimeoutId) {
        clearTimeout(currentTimeoutId);
    }
    console.log("resize")
    updateTitles();
    const isDarkMode = document.body.classList.contains('dark-mode');
    const subtitleElement = document.getElementById('welcomeSubtitle');
    const textColor = isDarkMode ? '#fafafa' : '#252525'; // Change text color based on theme
    subtitleElement.style.transition = 'color 0s';
    subtitleElement.style.color = textColor;
    subtitleElement.style.transition = '';
    subtitleElement.style.textAlign = 'justify';
    subtitleElement.style.textAlignLast = 'justify';
    subtitleElement.style.MozTextAlignLast = 'justify';
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

    const overlay = document.getElementById('overlay');
    overlay.style.pointerEvents = 'none'; // Disable pointer events to allow clicks
};