---
layout: page
title: Getting to Know Me
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

I’m Han-yu Wang. You can also call me Henry. I was born in **Taiwan**, grew up in **Shanghai**, and also spent some time living in **Hawke’s Bay, New Zealand**. Now, I'm studying in **Hong Kong**.

<img src="/assets/img/henry.jpg">

I’m a third-year student at the **University of Hong Kong**, majoring in **Applied Artificial Intelligence**. Alongside my studies, I work part-time as a research assistant in the **SLR Lab at HKU**, exploring the connections between neuroscience, artificial intelligence, and education. I’m also part of the **PDS Lab at HKU**, where I work on integrating generative AI and LLM with personalized learning. Additionally, I’m a full-time Student Work Placement Intern at **HSBC**, focusing on Digital Transformation. You can find more details on my [education](https://henryhyw.github.io/education.html) and [experience](https://henryhyw.github.io/experience.html) pages.

My research interests lie where **natural language processing**, **artificial intelligence**, **cognitive neuroscience**, and **education** meet. I’m fascinated by how AI can help us understand and model learning behaviors.

## On a More Personal Level

In my free time, I love being by the ocean. When I lived in New Zealand, I often visited the beautiful **Napier Oceanside**. In Europe, I enjoyed the **Mediterranean Sea**, whether it was sunbathing, swimming, or just taking in the view. Near school, you’ll often find me at the **Kennedy Town Praya**, enjoying the calm and peaceful waterfront. There’s just something about the ocean that I find incredibly soothing.

<video id="videoElement" muted autoplay loop playsinline>
      <source src="/assets/vid/napier.mp4" type="video/mp4">
</video>
<img src="/assets/img/napier.png" alt="Travel" class="fallback-image" style="display: none;">

I love traveling and have had the chance to see some amazing places around the world. I’ve been awestruck by the **Sagrada Família** in Barcelona, amazed by the ancient **Acropolis** in Athens, inspired by the **Statue of Liberty** in New York, and enchanted by the **Redwoods** in Rotorua. Each trip has given me unforgettable memories and a deeper appreciation for our world’s beauty and diversity.

> "Once you have traveled, the voyage never ends, but is played out over and over again in the quietest chambers. The mind can never break off from the journey."
>
> *- Pat Conroy*

<div id="scroll-container" class="scroll-container"></div>

Another passion of mine is diving into the world of computer science. I love coding and creating programs from scratch. It's exciting to see lines of code come together to build something real and impactful. Check out my early adventures in computer science—it was a fun and exciting journey. You can explore more about it here: [My Early CS Adventures](https://henryhyw.github.io/early.html).

<script>
  // Array of image filenames
  const imageFilenames = [
    'athens1.jpg',
    'athens2.jpg',
    'athens3.jpg',
    'athens4.jpg',
    'beijing1.jpg',
    'hongkong1.jpg',
    'hongkong2.jpg',
    'hongkong3.jpg',
    'hongkong4.jpg',
    'hongkong5.jpg',
    'hongkong6.jpg',
    'hongkong7.jpg',
    'hongkong8.jpg',
    'hkdisney1.jpg',
    'hkdisney2.jpg',
    'hkdisney3.jpg',
    'hkdisney4.jpg',
    'hkdisney5.jpg',
    'napier1.jpg',
    'rotorua1.jpg',
    'shanghai1.jpg',
    'shanghai2.jpg',
    'tainan1.jpg'
  ];

  // Function to shuffle an array
  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // Shuffle the image filenames
  const shuffledFilenames = shuffle(imageFilenames);

  document.addEventListener("DOMContentLoaded", function() {
    // Get the scroll-container div
    const container = document.getElementById('scroll-container');

    // Dynamically create img elements and append them to the container
    shuffledFilenames.forEach(filename => {
      const img = document.createElement('img');
      img.src = `/assets/gallery/${filename}`;
      container.appendChild(img);
    });
  });
</script>

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
        checkVideoCompatibility();
    };

    // Mute/unmute button
    const videoElement = document.getElementById('videoElement');
    videoElement.addEventListener('click', () => {
        videoElement.muted = !videoElement.muted;
    });
</script>