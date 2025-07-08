// Simple category carousel logic
const carousel = document.querySelector('.category-carousel');
const cards = document.querySelectorAll('.category-card');
const leftBtn = document.querySelector('.category-arrow.left');
const rightBtn = document.querySelector('.category-arrow.right');

let currentIndex = 0;
let visibleCards = 4;

function updateVisibleCards() {
  const width = window.innerWidth;
  if (width <= 600) {
    visibleCards = 2;
  } else if (width <= 900) {
    visibleCards = 3;
  } else {
    visibleCards = 4;
  }
}

function updateCarousel() {
  updateVisibleCards();
  const cardWidth = cards[0].offsetWidth + parseInt(getComputedStyle(carousel).gap || 0);
  carousel.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
  leftBtn.disabled = currentIndex === 0;
  rightBtn.disabled = currentIndex >= cards.length - visibleCards;
}

leftBtn.addEventListener('click', () => {
  if (currentIndex > 0) {
    currentIndex--;
    updateCarousel();
  }
});

rightBtn.addEventListener('click', () => {
  if (currentIndex < cards.length - visibleCards) {
    currentIndex++;
    updateCarousel();
  }
});

window.addEventListener('resize', () => {
  updateCarousel();
});

// Initialize
updateCarousel();
