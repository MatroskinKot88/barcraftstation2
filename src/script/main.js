/**
 * barcraft-landing / js/main.js
 * Lazy Load + Parallax для hero-секции
 */

document.addEventListener('DOMContentLoaded', () => {
  const hero = document.querySelector('.js-parallax');
  if (!hero) return;

  const bgUrl = hero.dataset.bg;
  const threshold = 0.1; // Загружать, когда блок на 10% в зоне видимости

  // Создаём наблюдатель
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Загружаем изображение
        const img = new Image();
        img.src = bgUrl;
        img.onload = () => {
          // Устанавливаем фон
          hero.style.backgroundImage = `url("${bgUrl}")`;
          hero.classList.add('hero--loaded');

          // Запускаем параллакс
          initParallax(hero);
        };
        img.onerror = () => {
          console.warn('Не удалось загрузить фон:', bgUrl);
          hero.style.backgroundColor = '#0a0a0a';
        };

        // Больше не следим
        observer.unobserve(hero);
      }
    });
  }, { threshold });

  observer.observe(hero);
});

/**
 * Лёгкий параллакс при скролле
 */
function initParallax(element) {
  let ticking = false;

  function updateParallax() {
    const scrollTop = window.pageYOffset;
    const offsetTop = element.offsetTop;
    const scrollDistance = scrollTop - offsetTop;
    const speed = 0.3; // чем меньше — тем медленнее движение

    // Смещение фона
    const yPos = -(scrollDistance * speed);
    element.style.backgroundPosition = `center ${yPos}px`;

    ticking = false;
  }

  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }

  // Запускаем только на десктопе (мобильные — без параллакса)
  if (window.matchMedia('(min-width: 769px)').matches) {
    window.addEventListener('scroll', requestTick, { passive: true });
  }
}

/**
 * Мобильное меню и плавная прокрутка
 */
document.addEventListener('DOMContentLoaded', () => {
  const burger = document.querySelector('.header__burger');
  const nav = document.querySelector('.header__nav');
  const navLinks = document.querySelectorAll('.header__link');

  if (!burger || !nav) return;

  // Закрытие меню
  function closeMenu() {
    nav.classList.remove('active');
    burger.classList.remove('active');
    // Убираем overflow, если был
    document.body.style.overflow = '';
    const overlay = document.querySelector('.overlay');
  if (overlay) overlay.classList.remove('active');
  }

  // Открытие/закрытие
  burger.addEventListener('click', () => {
    nav.classList.toggle('active');
    burger.classList.toggle('active');
    const overlay = document.querySelector('.overlay');
    if (nav.classList.contains('active')) {
      document.body.style.overflow = 'hidden';
      if (overlay) overlay.classList.add('active');
    } else {
      document.body.style.overflow = '';
       if (overlay) overlay.classList.remove('active');
    }
  });

  // Обработка клика по ссылке
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      
      // Закрываем меню
      closeMenu();

      // Плавная прокрутка к якорю
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          const header = document.querySelector('.header');
          const headerHeight = header ? header.offsetHeight : 0;
          const elementPosition = target.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerHeight - 16;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // Закрытие меню при ресайзе (если окно стало десктопным)
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      closeMenu();
    }
  });
});
