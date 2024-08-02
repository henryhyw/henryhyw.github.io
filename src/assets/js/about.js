export function initScript() {
  function onDOMContentLoaded() {
    console.log('DOM fully loaded and parsed');
    // Your script logic here
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
    // Get the scroll-container div
    const container = document.getElementById('showcaseimages');

    // Dynamically create img elements and append them to the container
    shuffledFilenames.forEach(filename => {
      const img = document.createElement('img');
      img.src = `/assets/gallery/${filename}`;
      container.appendChild(img);
    });

    const modal = document.getElementById('modal');
    const modalImg = document.getElementById('modal-image');
    const closeBtn = document.getElementsByClassName('close')[0];

    document.querySelectorAll('div.scroll-container.showcaseimages img').forEach(img => {
        img.addEventListener('click', () => {
            modal.style.display = 'flex';
            modalImg.src = img.src;
        });
    });

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onDOMContentLoaded);
  } else {
    // The DOMContentLoaded event has already fired
    onDOMContentLoaded();
  }
}