---
layout: page
title: Who I Am
permalink: /about
---

<style>
video, .fallback-image {
	width: 100%;
}

div.scroll-container {
  background-color: #f7f7f7;
  overflow-x: auto; /* Enable horizontal scrolling */
  overflow-y: hidden; /* Disable vertical scrolling */
  white-space: nowrap;
  padding: 10px;
  height: 35vh; /* Set the height to 35% of the viewport height */
  display: flex;
  align-items: center; /* Center align images vertically */
}

div.scroll-container img,
div.scroll-container video {
  padding: 10px;
  height: calc(35vh - 20px); /* Adjust the height to fit within the container, considering padding */
  object-fit: contain; /* Ensure the images fit within the container */
}
</style>

I’m Han-yu Wang. You can also call me Henry. I was born in **Taiwan** and grew up in the bustling city of **Shanghai**. I’ve also had the chance to live in **Hawke’s Bay, New Zealand**. Currently, I'm pursuing my degree in vibrant **Hong Kong**.

<img src="/assets/img/henry.jpg">

I am a third-year student at the **University of Hong Kong**, majoring in **Applied Artificial Intelligence**. Meanwhile, I work as a part-time research assistant in the **SLR Lab at HKU**, where I investigate intersections in neuroscience, artificial intelligence, and education. I also work in the **PDS Lab at HKU**, focusing on integrating generative AI and LLM with personalized learning. Additionally, I am a full-time Student Work Placement Intern at **HSBC**, working in the Digital Transformation Department. For more details, please visit my [education](https://henryhyw.github.io/education.html) and [experience](https://henryhyw.github.io/experience.html) pages.

In my free time, I love spending time by the ocean. When I lived in New Zealand, I often visited the beautiful **Napier Oceanside**. When I was in Europe, I loved spending time at the **Mediterranean Sea**, sunbathing, swimming, and enjoying the serene beauty of the water. When I’m near school, you can often find me at the **Kennedy Town Praya**, soaking in the peaceful vibes of the waterfront. There’s something incredibly calming about the ocean that I just can’t get enough of.

<video id="videoElement" muted autoplay loop playsinline>
      <source src="/assets/vid/napier.mp4" type="video/mp4">
</video>
<img src="/assets/img/napier.png" alt="Travel" class="fallback-image" style="display: none;">

I love traveling and have had the chance to explore some amazing places around the world. I’ve marveled at the stunning **Sagrada Família** in Barcelona, stood in awe at the ancient **Acropolis** in Athens, gazed up at the iconic **Statue of Liberty** in the United States, wandered through the enchanting **Rotorua Redwoods** in New Zealand. Each of these experiences has left me with unforgettable memories and a deep appreciation for the beauty and diversity of our world.

> "Once you have traveled, the voyage never ends, but is played out over and over again in the quietest chambers. The mind can never break off from the journey."
>
> *- Pat Conroy*

<div class="scroll-container">
  <img src="/assets/img/acropolis.jpg">
  <img src="/assets/img/athensstatue.jpg">
  <img src="/assets/img/kerameikos.jpg">
  <img src="/assets/img/agora.jpg">
  <img src="/assets/img/beijingairport.jpg">
  <img src="/assets/img/nz.jpg">
  <img src="/assets/img/rotorua.jpg">
  <img src="/assets/img/baihe.jpg">
</div>

Another passion of mine is diving into the world of computer science. I absolutely love coding. There’s nothing quite like the thrill of creating vibrant, functional programs from scratch. It’s amazing to see lines of code come together to build something real and impactful. Feel free to check out my early adventures in computer science—it was such a fun and exciting journey for me. You can explore more about it here: [My Early CS Adventures](https://henryhyw.github.io/early.html).

### Visitor Map

<script type='text/javascript' id='mapmyvisitors' src='https://mapmyvisitors.com/map.js?cl=606060&w=a&t=n&d=NuzI5fMF9fqCHtkxcTx3LZO5mvAbEZrLLxG3ZW1E-KY&co=ffffff&ct=606060'></script>

<script>
    function checkVideoCompatibility() {
        const videoElement = document.getElementById('videoElement');
        const fallbackImage = document.querySelector('.fallback-image');

        // Check if the video is playable
        videoElement.addEventListener('error', () => {
            videoElement.style.display = 'none';
            fallbackImage.style.display = 'block';
        });

        // Attempt to play the video, if it fails, switch to the fallback image
        videoElement.play().catch(() => {
            videoElement.style.display = 'none';
            fallbackImage.style.display = 'block';
        });
    }

    window.onload = () => {
        adjustFontSizeAndLineHeight();
        checkVideoCompatibility();
    };
    window.onresize = adjustFontSizeAndLineHeight;

    // Mute/unmute button
    const videoElement = document.getElementById('videoElement');
    videoElement.addEventListener('click', () => {
        videoElement.muted = !videoElement.muted;
    });
</script>