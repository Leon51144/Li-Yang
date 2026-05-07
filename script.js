// ===== CAROUSEL =====
const track = document.getElementById('carouselTrack');
const dots = document.querySelectorAll('.dot');
let current = 0;
const total = dots.length;
let autoplay;

function goToSlide(index) {
  current = (index + total) % total;
  track.style.transform = `translateX(-${current * 100}%)`;
  dots.forEach((d, i) => d.classList.toggle('active', i === current));
}

document.getElementById('prevBtn').addEventListener('click', () => { clearInterval(autoplay); goToSlide(current - 1); startAutoplay(); });
document.getElementById('nextBtn').addEventListener('click', () => { clearInterval(autoplay); goToSlide(current + 1); startAutoplay(); });
dots.forEach(d => d.addEventListener('click', () => { clearInterval(autoplay); goToSlide(+d.dataset.index); startAutoplay(); }));

function startAutoplay() { autoplay = setInterval(() => goToSlide(current + 1), 5000); }
startAutoplay();

// Touch swipe
let startX = 0;
track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
track.addEventListener('touchend', e => {
  const diff = startX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 50) { clearInterval(autoplay); goToSlide(diff > 0 ? current + 1 : current - 1); startAutoplay(); }
});

// ===== STICKY HEADER SHADOW =====
const header = document.getElementById('mainHeader');
window.addEventListener('scroll', () => {
  header.style.boxShadow = window.scrollY > 10 ? '0 4px 32px rgba(0,48,135,0.14)' : '';
});

// ===== SEARCH TOGGLE =====
const searchToggle = document.getElementById('searchToggle');
const searchBar = document.getElementById('searchBar');
const searchInput = document.getElementById('searchInput');

searchToggle.addEventListener('click', e => {
  e.preventDefault();
  searchBar.classList.toggle('active');
  if (searchBar.classList.contains('active')) searchInput.focus();
});

document.getElementById('searchSubmit').addEventListener('click', () => {
  const q = searchInput.value.trim();
  if (q) alert(`搜尋：${q}`);
});

searchInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') document.getElementById('searchSubmit').click();
  if (e.key === 'Escape') searchBar.classList.remove('active');
});

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('mainNav');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  nav.classList.toggle('mobile-open');
});

document.addEventListener('click', e => {
  if (!nav.contains(e.target) && !hamburger.contains(e.target)) {
    hamburger.classList.remove('active');
    nav.classList.remove('mobile-open');
  }
});

// ===== NEWS TABS =====
const tabBtns = document.querySelectorAll('.tab-btn');
const newsItems = document.querySelectorAll('.news-item');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    tabBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const tab = btn.dataset.tab;
    newsItems.forEach(item => {
      const show = tab === 'all' || item.dataset.type === tab;
      item.classList.toggle('hidden', !show);
    });
  });
});

// ===== MINI CALENDAR =====
let calDate = new Date();

function renderCalendar() {
  const year = calDate.getFullYear();
  const month = calDate.getMonth();
  const today = new Date();
  document.getElementById('calMonthYear').textContent = `${year}年${month + 1}月`;

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const container = document.getElementById('calDays');
  container.innerHTML = '';

  for (let i = 0; i < firstDay; i++) {
    const el = document.createElement('div');
    el.className = 'cal-day empty';
    el.textContent = '';
    container.appendChild(el);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const el = document.createElement('div');
    el.className = 'cal-day';
    el.textContent = d;
    const isToday = d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
    if (isToday) el.classList.add('today');
    container.appendChild(el);
  }
}

document.getElementById('calPrev').addEventListener('click', () => {
  calDate = new Date(calDate.getFullYear(), calDate.getMonth() - 1, 1);
  renderCalendar();
});
document.getElementById('calNext').addEventListener('click', () => {
  calDate = new Date(calDate.getFullYear(), calDate.getMonth() + 1, 1);
  renderCalendar();
});

renderCalendar();

// ===== BACK TO TOP =====
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  backToTop.classList.toggle('visible', window.scrollY > 400);
});
backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ===== SCROLL REVEAL =====
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.highlight-card, .quick-link-card, .side-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});
