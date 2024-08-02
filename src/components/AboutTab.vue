<template>
  <div>
    <h1>
      Getting to Know Me
    </h1>
    <article>
      <p>I’m Han-yu Wang. You can also call me Henry. I was born in <strong>Taiwan</strong> and grew up in <strong>Shanghai</strong>. I’ve also had the chance to live in <strong>Hawke’s Bay, New Zealand</strong>. Currently, I'm pursuing my degree in <strong>Hong Kong</strong>.</p>
          
      <img src="/assets/img/henry.jpg" alt="Henry">
    
      <p>I am a third-year student at the <strong>University of Hong Kong</strong>, majoring in <strong>Applied Artificial Intelligence</strong>. Meanwhile, I work as a part-time research assistant in the <strong>SLR Lab at HKU</strong>, where I investigate intersections in neuroscience, artificial intelligence, and education. I also work in the <strong>PDS Lab at HKU</strong>, focusing on integrating generative AI and LLM with personalized learning. Additionally, I am a full-time Student Work Placement Intern at <strong>HSBC</strong>, working in the Digital Transformation Department. For more details, please visit my <a><router-link to="/education">Education</router-link></a> and <a><router-link to="/experience">Experience</router-link></a> pages.</p>
    
      <p>My research interests lie at the intersection of <strong>natural language processing</strong>, <strong>artificial intelligence</strong>, <strong>cognitive neuroscience</strong>, and <strong>education</strong>. I study how AI can help explain and model our learning behaviors.</p>
    
      <h2>On a More Personal Level</h2>
    
      <p>In my free time, I love spending time by the ocean. When I lived in New Zealand, I often visited the beautiful <strong>Napier Oceanside</strong>. When I was in Europe, I loved relaxing at the <strong>Mediterranean Sea</strong>, sunbathing, swimming, and enjoying the serene beauty of the water. When I’m near school, you can often find me at the <strong>Kennedy Town Praya</strong>, enjoying the calm and peaceful waterfront. There’s something incredibly soothing about the ocean that I just can’t get enough of.</p>
    
      <video id="videoElement" muted autoplay loop playsinline>
          <source src="/assets/vid/napier.mp4" type="video/mp4">
      </video>
      <img src="/assets/img/napier.png" alt="Travel" class="fallback-image" style="display: none;">
    
      <p>I love traveling and have had the chance to see some amazing places around the world. I’ve been awestruck by the <strong>Sagrada Família</strong> in Barcelona, amazed by the ancient <strong>Acropolis</strong> in Athens, inspired by the <strong>Statue of Liberty</strong> in New York, and enchanted by the <strong>Redwoods</strong> in Rotorua. Each of these experiences has left me with unforgettable memories and a deep appreciation for the beauty and diversity of our world.</p>
    
      <blockquote>
          "Once you have traveled, the voyage never ends, but is played out over and over again in the quietest chambers. The mind can never break off from the journey."
          <br>
          <em>- Pat Conroy</em>
      </blockquote>
    
      <div id="showcaseimages" class="scroll-container"></div>
      <p><em>Scroll to see more</em></p>
    
      <p>Another passion of mine is coding. I enjoy creating functional programs from scratch. It's thrilling to see lines of code come together to build something real and impactful. Feel free to check out some of my <a><router-link to="/early">Early Projects</router-link></a>.</p>
    </article>
  </div>
</template>

<script>
  export default {
    name: 'AboutTab',
    data() {
      return {
        scriptModule: null,
      };
    },
    async mounted() {
      // Dynamically import the script when the component is mounted
      this.scriptModule = await import('../assets/js/about.js');
      if (this.scriptModule && this.scriptModule.initScript) {
        this.scriptModule.initScript();
      }
    },
    unmounted() {
      // Clean up the script when the component is unmounted
      if (this.scriptModule && this.scriptModule.cleanupScript) {
        this.scriptModule.cleanupScript();
      }
      this.scriptModule = null; // Optionally, clear the reference to the module
    },
  }

</script>

<style>
  video, .fallback-image {
      width: 100%;
  }
</style>