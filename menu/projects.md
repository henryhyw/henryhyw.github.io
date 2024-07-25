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

Welcome to my professional playground! I've had the chance to dive into some amazing projects that have been a big part of my journey. Let's take a look at some of the highlights together!

---

## Contributor in an Information Retrieval Research Project

*December 2023 - May 2024*

*[Natural Language Processing Group at the University of Hong Kong](https://hkunlp.github.io/)*

<img src="/assets/img/hku.jpeg" style="height:8vh;">

I had an opportunity to work on BRIGHT, a benchmark designed to evaluate how well models can reason through complex queries. Collaborating with Princeton University and Google Cloud AI Research made the project even more exciting!

It was a dive into how information is processed and understood. I spent a lot of time gathering and analyzing data from public forums, creating query-document pairs, and testing coding-related queries to ensure our models were accurate.

As one of the co-authors, I contributed to a paper about the project, which we submitted to NeurIPS and is currently under review. This project was a challenging yet rewarding experience.

---

## My Early Projects in Junior High and High School

During my junior high and high school years, I got to work on a bunch of projects that really sparked my love for computer science. Some of the highlights were creating a batch downloader for Scientific American episodes, developing a few Chrome extensions, building a website for Kiwiview International Limited, and making an economics graph generator called Econographer. These projects show just how excited I was (and still am) about programming and solving problems.

For more details, please visit this page, [My Early CS Adventures](https://henryhyw.github.io/early.html).

<script>
    setTimeout(() => {
        document.querySelectorAll('footer *').forEach(element => {
            element.style.color = '';
        });
    }, 3000);
</script>