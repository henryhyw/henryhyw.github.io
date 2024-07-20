---
layout: page
title: My Early Adventures in Computer Science
permalink: /early
---

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
</style>

Here are the adventures I went through during my junior high and high school years. I've highlighted some main projects from each year.

Before we dive in, I have to admit that a lot of the things I did during this period were pretty naive. But who hasn't had a naive phase, right? Honestly, I might still be a bit naive now, and that's okay.

## How It All Started

I fell in love with computer science when I was 13, in my first year of junior high school. My computer science teacher demonstrated how a batch script can create folders automatically. From that moment, I was fascinated by how computers could be programmed to do all sorts of cool things. I taught myself the basics of Java and Python and started building simple apps, like a contact notebook app in Java and an advanced number guessing game with user accounts and game history logged in text files.

Here are some screenshots of this first app (contact notebook) I made.

<div class="scroll-container">
  <img src="/assets/img/contactnotebook1.jpg">
  <img src="/assets/img/contactnotebook2.jpg">
</div>

*Scroll to see more*

## Batch Downloading Scientific American Episodes

In my first year of junior high, I decided to practice English and discovered the podcast called Scientific American. At that time, I was using an MP3 player that supported playing audio, images, and texts. So, I developed an app to batch download audios, scripts, and images from Scientific American episodes. The app included a user account system that could record the episodes a user had downloaded and continue from where they left off next time.

Here are some screenshots of this app.

<div class="scroll-container">
  <img src="/assets/img/safetcher1.jpg">
  <img src="/assets/img/safetcher2.jpg">
  <img src="/assets/img/safetcher3.jpg">
  <img src="/assets/img/safetcher4.jpg">
</div>

*Scroll to see more*

## Chrome Extension Experiments

In my second year of junior high, I started exploring Chrome extensions. Living in Mainland China made me curious about things that weren't easily accessible, so I'd use a VPN to access Google-related stuff. It amazed me that these small apps in the browser could do so much, like turning the screen dark for YouTube videos. So, I learned how to develop and publish Chrome extensions and created a few:

1. **Easy QR Code**: Displays QR codes for the current website, makes your own QR codes, and converts text to QR codes.
2. **Page Muter**: Mutes the audio or video of a specific tab.
3. **Image Fetcher**: Batch downloads images from the current website.
4. **SA Fetcher**: Batch downloads audios, scripts, and images from Scientific American episodes. This is a simplified version of the previous SA Fetcher app.
5. **WeChat Spamming**: Automatically sends various kinds of spam messages on WeChat (I made this to prank my friends, and surprisingly, it even has 167 users according to the developer dashboard).

Here are some screenshots of the developer dashboard and some of the extensions.

<div class="scroll-container">
  <img src="/assets/img/chromeextension1.png">
  <img src="/assets/img/chromeextension2.png">
  <img src="/assets/img/chromeextension3.png">
</div>

*Scroll to see more*

## Music Streaming Hacks

In my first year of high school, my main interest was building an app for downloading paid songs from music streaming services in China. I now realize that this was illegal, but at the time, I wasn't aware of that. Although I'm not proud of it, I still want to mention it because it was a masterpiece for a first-year high school student.

I did a lot of research on web scraping and managed to crack the links of paid songs from various music streaming services. With this app, users could download songs with the link of the song page from QQ Music, Netease Music, KuGou Music, and KuWo Music, with the desired sound quality. Users could also batch download songs from a singer with a specified number of pages. I even created a user account system where some functions, like downloading lossless audio, were only available to VIP users.

It took me several months to develop this app, but it only lasted for half a year because I later realized it wasn't quite legal, so I shut it down. Despite that, it remains one of my fondest memories. By that time, it had 413 users, with 228 QQ Music playlist downloads, 1294 QQ Music single downloads, 523 NetEase Music single downloads, 23 KuGou Music single downloads, and 47 KuWo Music single downloads.

Here are some screenshots of the app, which is in Simplified Chinese since the users were from Mainland China.

<div class="scroll-container">
  <img src="/assets/img/musicdownloader1.jpg">
  <img src="/assets/img/musicdownloader2.jpg">
  <img src="/assets/img/musicdownloader3.jpg">
  <img src="/assets/img/musicdownloader4.jpg">
  <img src="/assets/img/musicdownloader5.jpg">
  <img src="/assets/img/musicdownloader6.jpg">
  <img src="/assets/img/musicdownloader7.jpg">
</div>

*Scroll to see more*

## Building Kiwiview's Website

In my second year of high school, I started building a website for Kiwiview International Limited, a New Zealand company co-owned by my parents and a Kiwi. Since the business was just starting, they let me try building the website.

I taught myself HTML, JavaScript, CSS, and SQL. It took me months to deploy it on an IIS server on Tencent Cloud. The deployment process was really complicated for a beginner, and I spent a lot of time researching it.

Here is the link to the website: [Kiwiview International Limited](https://www.kiwiviewintl.co.nz/uk-en/index.php)

Actually, this is the same website I continue to work on in college when I was officially hired by the company as a Web Developer and Data Analyst. Please visit this [**PAGE**](https://www.kiwiviewintl.co.nz/uk-en/msg.php) and leave a message with your email address—there’s a little surprise waiting for you. Besides the website, I also designed the business cards and logo for the company. I found it really fun to do all these things.

## Fun with Automation

In my third year of high school, I came across a mental arithmetic and "24-point" game event. It was an online game event held at our school.

I created a script to automatically solve the problems, achieving really high scores. The script recognized the content on the screen, used algorithms to solve the problems, and then instructed the computer to input the answers. Everything was done automatically and repeatedly until time was up.

Here are some videos of the script I recorded.

<div class="scroll-container">
  <video controls>
    <source src="/assets/vid/24.mp4" type="video/mp4">
    Your browser does not support the video tag.
  </video>
  <video controls>
    <source src="/assets/vid/mentalmath.mp4" type="video/mp4">
    Your browser does not support the video tag.
  </video>
</div>

*Scroll to see more*

## Developing Econographer, an Economics Graphs Generator

In my third year of high school, I started to wonder if the graphs we needed for our economics class could be generated by software. After searching online and not finding anything that met my expectations, I decided to create my own solution.

I developed an Office Word add-in called "Econographer," specifically designed for generating the various types of economics graphs used in AP and IB courses. These graphs are highly customizable to fit any requirement.

Here's a full demonstration video, recorded by me, showing how it works.

<video style="width: 80%;" controls>
  <source src="/assets/vid/econographer.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

I hope you enjoyed reading about my early journey with computer science!
