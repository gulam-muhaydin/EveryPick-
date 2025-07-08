// Hero slider logic
const slides = document.querySelectorAll('.hero-slide');
const dots = document.querySelectorAll('.hero-dot');
let current = 0;
const total = slides.length;

function showSlide(idx) {
  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === idx);
    slide.style.opacity = i === idx ? '1' : '0';
    slide.style.zIndex = i === idx ? '2' : '1';
  });
  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === idx);
  });
}

function nextSlide() {
  current = (current + 1) % total;
  showSlide(current);
}

// Start slider
showSlide(current);
setInterval(nextSlide, 4000);
