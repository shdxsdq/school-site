const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
const menuBtn = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');

function setupActiveNav() {
  const page = document.body.dataset.page;
  if (!page) return;
  const links = document.querySelectorAll('.nav-links a');
  links.forEach((link) => {
    const key = link.dataset.nav;
    if (key === page) {
      link.classList.add('active');
    }
  });
}

function setupSlider() {
  if (!slides.length || !dots.length) return;

  let index = 0;

  function showSlide(nextIndex) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === nextIndex);
      dots[i].classList.toggle('active', i === nextIndex);
    });
  }

  function nextSlide() {
    index = (index + 1) % slides.length;
    showSlide(index);
  }

  let timer = setInterval(nextSlide, 4500);

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      index = i;
      showSlide(index);
      clearInterval(timer);
      timer = setInterval(nextSlide, 4500);
    });
  });
}

function setupImageLightbox() {
  const images = document.querySelectorAll('.gallery-item img, .featured-item img, .album-card img');
  if (!images.length) return;

  let box = document.querySelector('.image-lightbox');
  if (!box) {
    box = document.createElement('div');
    box.className = 'image-lightbox';
    box.innerHTML = '<img alt="大图预览" />';
    document.body.appendChild(box);
  }

  const preview = box.querySelector('img');
  box.addEventListener('click', () => box.classList.remove('open'));

  images.forEach((img) => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', (e) => {
      e.preventDefault();
      preview.src = img.src;
      box.classList.add('open');
    });
  });
}

menuBtn?.addEventListener('click', () => {
  navLinks?.classList.toggle('open');
});

setupActiveNav();
setupSlider();
setupImageLightbox();
