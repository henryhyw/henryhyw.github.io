---
layout: page
title: 
---

<style>
video {
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
      <h2> Text with Left Image </h2>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi. Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat. Duis semper. Duis arcu, massa scelerisque ac, cursus et, sollicitudin a, orci.</p>
      <footer>(A dummy text)</footer>
   </div>
</div>