---
layout: page
title: Projects I've Been Up To
permalink: /projects
---

<script>
    document.querySelectorAll('header *').forEach(element => {
        element.style.color = ''; // Reset to original color
    });
</script>

<style>
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

.image-wrapper {
    display: inline-block;
    background-color: rgba(255, 255, 255, 1);
    padding: 5px; /* Optional: Add some padding if needed */
    border-radius: 5px; /* Optional: Add border radius for rounded corners */
}

.image-wrapper img {
    display: block; /* Ensure the image fits within the wrapper */
}
</style>

Welcome to my professional playground! I've had the chance to dive into some amazing projects that have been a big part of my journey. Here are some of the highlights.

---

## Contributor in BRIGHT, a Benchmark for Reasoning-Intensive Information Retrieval

*December 2023 - May 2024*

*[Natural Language Processing Group at the University of Hong Kong](https://hkunlp.github.io/)*

<img src="/assets/img/hku.jpeg" style="height:8vh;">

I had an opportunity to work on BRIGHT, a benchmark designed to evaluate how well models can reason through complex queries. I was responsible for literature reviews, gathering and analyzing data from public forums, creating query-document pairs, and testing coding-related queries.

**BRIGHT: A Realistic and Challenging Benchmark for Reasoning-Intensive Retrieval**
Hongjin Su\*, Howard Yen\*, Mengzhou Xia\*, Weijia Shi, Niklas Muennighoff, **Han-yu Wang**, Haisu Liu, Quan Shi, Zachary S. Siegel, Michael Tang, Ruoxi Sun, Jinsung Yoon, Sercan O. Arik, Danqi Chen, Tao Yu
*Preprint*

For more details, please visit the homepage of this project: [BRIGHT]("https://brightbenchmark.github.io/").

---

## My Early Projects in Junior High and High School

During my junior high and high school years, I got to work on a bunch of projects that really sparked my love for computer science. Some of the highlights were creating a batch downloader for Scientific American episodes, developing a few Chrome extensions, building a website for Kiwiview International Limited, and making an economics graph generator called Econographer. These projects show just how excited I was (and still am) about programming and solving problems.

For more details, please visit: [My Early CS Adventures](https://henryhyw.github.io/early.html).

<script>
    setTimeout(() => {
        document.querySelectorAll('footer *').forEach(element => {
            element.style.color = '';
        });
    }, 3000);
</script>