// Componente para carrusel de imágenes

export function createCarousel(images) {
  const carousel = document.createElement('div');
  carousel.className = 'carousel';

  const imageContainer = document.createElement('div');
  imageContainer.className = 'carousel-images';

  images.forEach((src, index) => {
    const img = document.createElement('img');
    img.src = src;
    img.alt = `Imagen ${index + 1}`;
    img.className = index === 0 ? 'active' : '';
    imageContainer.appendChild(img);
  });

  const prevBtn = document.createElement('button');
  prevBtn.className = 'carousel-btn prev';
  prevBtn.textContent = '‹';

  const nextBtn = document.createElement('button');
  nextBtn.className = 'carousel-btn next';
  nextBtn.textContent = '›';

  carousel.appendChild(imageContainer);
  carousel.appendChild(prevBtn);
  carousel.appendChild(nextBtn);

  let currentIndex = 0;

  function showImage(index) {
    const imgs = imageContainer.querySelectorAll('img');
    imgs.forEach((img, i) => {
      img.classList.toggle('active', i === index);
    });
  }

  prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    showImage(currentIndex);
  });

  nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % images.length;
    showImage(currentIndex);
  });

  return carousel;
}
