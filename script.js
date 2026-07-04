// ===== QR DINÂMICO =====

const qrImages = [
  "assets/qr1.png",
  "assets/qr2.png",
  "assets/qr3.png",
  "assets/qr4.png",
  "assets/qr5.png"
];

let qrIndex = 0;

function updateQR(){
  qrIndex = (qrIndex + 1) % qrImages.length;

  document.querySelectorAll(".qr-img").forEach(img=>{
    img.src = qrImages[qrIndex];
  });

  // reinicia animação da barra — usando requestAnimationFrame para compatibilidade com iOS
  document.querySelectorAll(".progress-bar").forEach(bar=>{
    bar.style.animation = "none";
    // força reflow de forma estável no iOS Safari
    void bar.getBoundingClientRect();
    requestAnimationFrame(() => {
      bar.style.animation = "";
    });
  });
}

setInterval(updateQR, 20000);


// ===== SWIPE CARROSSEL =====

const track = document.querySelector('.carousel-track');
let currentIndex = 0;
let startX = 0;
let startY = 0;
let isDragging = false;
let swipeDirectionLocked = false; // evita re-lock durante o mesmo gesto

function handleStart(x, y) {
  startX = x;
  startY = y;
  isDragging = true;
  swipeDirectionLocked = false;
}

function handleMove(x, y, event) {
  if (!isDragging) return;

  const diffX = startX - x;
  const diffY = startY - y;

  // Só bloqueia scroll vertical se o gesto for claramente horizontal
  if (!swipeDirectionLocked) {
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 10) {
      swipeDirectionLocked = true;
    } else if (Math.abs(diffY) > Math.abs(diffX) && Math.abs(diffY) > 10) {
      // gesto vertical — libera para o iOS scrollar normalmente
      isDragging = false;
      return;
    }
  }

  // Só previne o default (e impede scroll) quando é swipe horizontal confirmado
  if (swipeDirectionLocked && event) {
    event.preventDefault();
  }

  if (diffX > 50) {
    currentIndex = Math.min(currentIndex + 1, 3);
    moveCarousel();
    isDragging = false;
    swipeDirectionLocked = false;
  }

  if (diffX < -50) {
    currentIndex = Math.max(currentIndex - 1, 0);
    moveCarousel();
    isDragging = false;
    swipeDirectionLocked = false;
  }
}

function handleEnd() {
  isDragging = false;
  swipeDirectionLocked = false;
}

function moveCarousel(){
  track.style.transform = `translateX(-${currentIndex * 100}%)`;
}

// Touch events — iOS requer touchend e touchcancel para resetar estado
track.addEventListener('touchstart', e => {
  // NÃO chama preventDefault aqui — o iOS precisa processar o início do gesto normalmente
  handleStart(e.touches[0].clientX, e.touches[0].clientY);
}, { passive: true });

track.addEventListener('touchmove', e => {
  handleMove(e.touches[0].clientX, e.touches[0].clientY, e);
}, { passive: false });

track.addEventListener('touchend', () => {
  handleEnd();
}, { passive: true });

track.addEventListener('touchcancel', () => {
  handleEnd();
}, { passive: true });

// Mouse events (desktop)
track.addEventListener('mousedown', e => {
  handleStart(e.clientX, e.clientY);
});

track.addEventListener('mousemove', e => {
  handleMove(e.clientX, e.clientY, null);
});

track.addEventListener('mouseup', () => {
  handleEnd();
});

track.addEventListener('mouseleave', () => {
  handleEnd();
});