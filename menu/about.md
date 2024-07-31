---
layout: page
title: Getting to Know Me
permalink: /about
---

<style>
video, .fallback-image {
    width: 100%;
}
</style>

I’m Han-yu Wang. You can also call me Henry. I was born in **Taiwan** and grew up in **Shanghai**. I’ve also had the chance to live in **Hawke’s Bay, New Zealand**. Currently, I'm pursuing my degree in **Hong Kong**.

<img src="/assets/img/henry.jpg">

I am a third-year student at the **University of Hong Kong**, majoring in **Applied Artificial Intelligence**. Meanwhile, I work as a part-time research assistant in the **SLR Lab at HKU**, where I investigate intersections in neuroscience, artificial intelligence, and education. I also work in the **PDS Lab at HKU**, focusing on integrating generative AI and LLM with personalized learning. Additionally, I am a full-time Student Work Placement Intern at **HSBC**, working in the Digital Transformation Department. For more details, please visit my [Education](https://henryhyw.github.io/education.html) and [Experience](https://henryhyw.github.io/experience.html) pages.

My research interests lie at the intersection of **natural language processing**, **artificial intelligence**, **cognitive neuroscience**, and **education**. I study how AI can help explain and model our learning behaviors.

## On a More Personal Level

In my free time, I love spending time by the ocean. When I lived in New Zealand, I often visited the beautiful **Napier Oceanside**. When I was in Europe, I loved relaxing at the **Mediterranean Sea**, sunbathing, swimming, and enjoying the serene beauty of the water. When I’m near school, you can often find me at the **Kennedy Town Praya**, enjoying the calm and peaceful waterfront. There’s something incredibly soothing about the ocean that I just can’t get enough of.

<video id="videoElement" muted autoplay loop playsinline>
      <source src="/assets/vid/napier.mp4" type="video/mp4">
</video>
<img src="/assets/img/napier.png" alt="Travel" class="fallback-image" style="display: none;">

I love traveling and have had the chance to see some amazing places around the world. I’ve been awestruck by the **Sagrada Família** in Barcelona, amazed by the ancient **Acropolis** in Athens, inspired by the **Statue of Liberty** in New York, and enchanted by the **Redwoods** in Rotorua. Each of these experiences has left me with unforgettable memories and a deep appreciation for the beauty and diversity of our world.

> "Once you have traveled, the voyage never ends, but is played out over and over again in the quietest chambers. The mind can never break off from the journey."
>
> *- Pat Conroy*

<div id="scroll-container" class="scroll-container"></div>

*Scroll to see more*

Another passion of mine is coding.  I enjoy creating functional programs from scratch. It's thrilling to see lines of code come together to build something real and impactful. Feel free to check out some of my [Early Projects](https://henryhyw.github.io/early.html).

<script>
  // Array of image filenames
  const imageFilenames = [
    'athens1.jpg',
    'athens2.jpg',
    'athens3.jpg',
    'athens4.jpg',
    'athens5.jpg',
    'athens6.jpg',
    'athens7.jpg',
    'athens8.jpg',
    'athens9.jpg',
    'athens10.jpg',
    'athens11.jpg',
    'athens12.jpg',
    'athens13.jpg',
    'athens14.jpg',
    'athens15.jpg',
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

  const modal = document.getElementById('modal');
  const modalImg = document.getElementById('modal-image');
  const closeBtn = document.getElementsByClassName('close')[0];

  document.querySelectorAll('div.scroll-container img').forEach(img => {
      img.addEventListener('click', () => {
          modal.style.display = 'flex';
          modalImg.src = img.src;
      });
  });

  closeBtn.addEventListener('click', () => {
      modal.style.display = 'none';
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