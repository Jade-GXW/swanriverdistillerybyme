// Reference support from Swiperjs for swiper2.js
document.addEventListener('DOMContentLoaded', function () {
  
  // Product carousel (scoped navigation buttons)
  var swiperProducts = new Swiper('.mySwiperProducts', {
    slidesPerView: 1,
    spaceBetween: 30,
    loop: true,
    navigation: {
      nextEl: '.product-area .swiper-button-next',
      prevEl: '.product-area .swiper-button-prev',
    },
    breakpoints: {
      768: { slidesPerView: 2 },
      1024: { slidesPerView: 3 },
    },
  });

  // Reviews card swiper (learn from YouTube tutorials, Shoelace, W3schools) 
  (function(){
    const wrapper = document.getElementById('wrapper');
    const cards = Array.from(wrapper.querySelectorAll('.card'));
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    let currentIndex = 0;
    let visibleCount = 3;

    // to show the width of a card with margins
    function getCardFullWidth() {
      if (!cards[0]) return 0;
      const rect = cards[0].getBoundingClientRect();
      const style = getComputedStyle(cards[0]);
      const margin = parseFloat(style.marginLeft || 0) + parseFloat(style.marginRight || 0);
      return rect.width + margin;
    }

    function computeVisibleCount() {
      const containerWidth = wrapper.parentElement.clientWidth - 140; // minus the padding used for the navigation arrows
      const single = getCardFullWidth();
      if (single <= 0) return 1;
      return Math.max(1, Math.floor(containerWidth / single));
    }

    function updateArrows() {
      if (currentIndex <= 0) {
        prevBtn.classList.add('hidden');
      } else {
        prevBtn.classList.remove('hidden');
      }

      if (currentIndex >= Math.max(0, cards.length - visibleCount)) {
        nextBtn.classList.add('hidden');
      } else {
        nextBtn.classList.remove('hidden');
      }
    }

    function updateSlide(animate = true) {
      const w = getCardFullWidth();
      const maxIndex = Math.max(0, cards.length - visibleCount);
      currentIndex = Math.min(Math.max(0, currentIndex), maxIndex);

      if (!animate) wrapper.style.transition = 'none';
      else wrapper.style.transition = '';

      const translateX = currentIndex * w;
      wrapper.style.transform = `translateX(-${translateX}px)`;
      // small timeout to enable the transition if disabled (reference to Youtube video)
      if (!animate) requestAnimationFrame(() => requestAnimationFrame(()=> wrapper.style.transition = 'transform 0.55s cubic-bezier(.22,.9,.2,1)'));
      updateArrows();
    }

    nextBtn.addEventListener('click', () => {
      const maxIndex = Math.max(0, cards.length - visibleCount);
      if (currentIndex < maxIndex) {
        currentIndex++;
        updateSlide();
      }
    });

    prevBtn.addEventListener('click', () => {
      if (currentIndex > 0) {
        currentIndex--;
        updateSlide();
      }
    });

    // resize layout handler
    function recalc() {
      visibleCount = computeVisibleCount();
      if (cards.length <= visibleCount) {
        currentIndex = 0;
        wrapper.style.justifyContent = 'center';
      } else {
        wrapper.style.justifyContent = 'flex-start';
      }
      updateSlide(false);
    }

    // after a short delay to ensure layout stable (images/fonts loaded)
    window.addEventListener('load', () => {
      recalc();
    });

    // run immediately in case load already fired
    recalc();
    window.addEventListener('resize', () => recalc());

    // optional: simple touch drag for swiping (basic) --> learn from YouTube tutorials
    (function addTouch() {
      let startX = 0, currentTranslate = 0, dragging = false;
      wrapper.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        currentTranslate = -currentIndex * getCardFullWidth();
        dragging = true;
        wrapper.style.transition = 'none';
      }, {passive:true});
      wrapper.addEventListener('touchmove', (e) => {
        if (!dragging) return;
        const dx = e.touches[0].clientX - startX;
        wrapper.style.transform = `translateX(${currentTranslate + dx}px)`;
      }, {passive:true});
      wrapper.addEventListener('touchend', (e) => {
        if (!dragging) return;
        dragging = false;
        const endX = e.changedTouches[0].clientX;
        const dx = endX - startX;
        const threshold = 50; 
        if (dx < -threshold) { // swiped left for next
          nextBtn.click();
        } else if (dx > threshold) { // swiped right to previous slide
          prevBtn.click();
        } else {
          // snap back to current
          updateSlide();
        }
      });
    })();
  })();
});
