---
layout: page
title: 
---

<style>
video {
    max-width: 220px;
    height: auto;
    filter: brightness(50%); /* Make the video darker */
}

.image-left, .image-right {
    margin: 1em 0;
}

@media (min-width: 20em) {
    .image-left, .image-right {
        display: flex;
        align-items: center;
    }

    .image-left video {
        margin-right: 1em;
        float: left; /* fallback */
    }

    .image-right video {
        order: 1;
        margin-left: 1em;
        float: right; /* fallback */
    }
    
    /* clearfix for fallback */
    .image-left::after,
    .image-right::after {
        content: "";
        display: block;
        clear: both;
    }
}

@media (min-width: 30em) {
    .image-left video, .image-right video {
        flex-shrink: 0;
    }
}
</style>

<div class="image-left">
   <video controls>
      <source src="/assets/vid/travel.mp4" type="video/mp4">
      Your browser does not support the video tag.
   </video>
   <div>
   	  <h1 style="font-size: 2.5em;">WELCOME</h1>
      <h2 style="font-size: 2em;">Hi! I'm Henry, a junior at the University of Hong Kong, majoring in Applied Artificial Intelligence. I love exploring new places and coding my own programs. Glad to have you here!</h2>
   </div>
</div>