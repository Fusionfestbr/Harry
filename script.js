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

  document.querySelectorAll(".qr-img").forEach(img => {
    img.src = qrImages[qrIndex];
  });

  // reinicia animação da barra de forma estável no iOS Safari
  document.querySelectorAll(".progress-bar").forEach(bar => {
    bar.style.animation = "none";
    void bar.getBoundingClientRect();
    requestAnimationFrame(() => {
      bar.style.animation = "";
    });
  });
}

setInterval(updateQR, 20000);


// ===== SWIPE CARROSSEL =====

const carousel  = document.querySelector('.carousel');
const track     = document.querySelector('.carousel-track');
const wrappers  = document.querySelectorAll('.ticket-wrapper');
const total     = wrappers.length; // 4 ingressos

let currentIndex = 0;

// Usa pixels em vez de %, eliminando ambiguidade do WebKit/iOS
function moveCarousel() {
  const slideWidth = carousel.offsetWidth; // largura real do container em px
  track.style.transform = `translateX(${-currentIndex * slideWidth}px)`;
}

// ---- TOUCH (iOS/Android) ----

let touchStartX  = 0;
let touchStartY  = 0;
let isHorizontal = null; // null = ainda não determinado

track.addEventListener('touchstart', function(e) {
  touchStartX  = e.touches[0].clientX;
  touchStartY  = e.touches[0].clientY;
  isHorizontal = null;
  // passive: false aqui para que o iOS respeite nosso preventDefault no touchmove
}, { passive: false });

track.addEventListener('touchmove', function(e) {
  if (e.touches.length > 1) return;

  const diffX = e.touches[0].clientX - touchStartX;
  const diffY = e.touches[0].clientY - touchStartY;

  // Determina a direção uma única vez por gesto
  if (isHorizontal === null) {
    if (Math.abs(diffX) > 5 || Math.abs(diffY) > 5) {
      isHorizontal = Math.abs(diffX) >= Math.abs(diffY);
    }
  }

  // Impede o scroll da página apenas se o gesto for horizontal
  if (isHorizontal === true) {
    e.preventDefault();
  }
}, { passive: false });

track.addEventListener('touchend', function(e) {
  // Usa changedTouches para ler a posição final corretamente no iOS
  const diffX = e.changedTouches[0].clientX - touchStartX;

  if (isHorizontal === true && Math.abs(diffX) > 40) {
    if (diffX < 0) {
      currentIndex = Math.min(currentIndex + 1, total - 1); // avança
    } else {
      currentIndex = Math.max(currentIndex - 1, 0);         // volta
    }
    moveCarousel();
  }

  isHorizontal = null;
}, { passive: true });

track.addEventListener('touchcancel', function() {
  isHorizontal = null;
  moveCarousel(); // snapback para posição atual
}, { passive: true });


// ---- MOUSE (desktop) ----

let mouseStartX    = 0;
let isDraggingMouse = false;

track.addEventListener('mousedown', e => {
  mouseStartX     = e.clientX;
  isDraggingMouse = true;
});

track.addEventListener('mousemove', e => {
  if (!isDraggingMouse) return;
});

track.addEventListener('mouseup', e => {
  if (!isDraggingMouse) return;
  const diffX = e.clientX - mouseStartX;
  if (Math.abs(diffX) > 50) {
    if (diffX < 0) {
      currentIndex = Math.min(currentIndex + 1, total - 1);
    } else {
      currentIndex = Math.max(currentIndex - 1, 0);
    }
    moveCarousel();
  }
  isDraggingMouse = false;
});

track.addEventListener('mouseleave', () => {
  isDraggingMouse = false;
});