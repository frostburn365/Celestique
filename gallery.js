function initGalleryCarousel() {
  // Mengambil elemen-elemen yang dibutuhkan dari DOM
  const items = document.querySelectorAll('.carousel-item');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');

  // Jika elemen tidak ditemukan, hentikan fungsi
  if (items.length === 0 || !prevBtn || !nextBtn) {
    console.error("Carousel elements not found. Initialization failed.");
    return;
  }

  let currentIndex = 0;

  function updateCarousel() {
    items.forEach((item, index) => {
      item.classList.remove('active', 'left', 'right');
      if (index === currentIndex) {
        item.classList.add('active');
      } else if (index === (currentIndex - 1 + items.length) % items.length) {
        item.classList.add('left');
      } else if (index === (currentIndex + 1) % items.length) {
        item.classList.add('right');
      }
    });
  }

  nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % items.length;
    updateCarousel();
  });

  prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + items.length) % items.length;
    updateCarousel();
  });

  updateCarousel();
}
