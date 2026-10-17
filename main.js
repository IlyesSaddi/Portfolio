/* ============================================
   MAIN.JS — Interactivity, Animations, Scroll
   ============================================ */

// ── Custom Cursor ──────────────────────────────────
const cursor = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursorFollower');
let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top = mouseY + 'px';
});

function animateFollower() {
  followerX += (mouseX - followerX) * 0.12;
  followerY += (mouseY - followerY) * 0.12;
  cursorFollower.style.left = followerX + 'px';
  cursorFollower.style.top = followerY + 'px';
  requestAnimationFrame(animateFollower);
}
animateFollower();

const hoverTargets = document.querySelectorAll('a, button, .project-card, .skill-group, .award-card, .stat-card, .pill');
hoverTargets.forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.classList.add('hovering');
    cursorFollower.classList.add('hovering');
  });
  el.addEventListener('mouseleave', () => {
    cursor.classList.remove('hovering');
    cursorFollower.classList.remove('hovering');
  });
});

// ── Navbar Scroll Effect ───────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });

// ── Mobile Hamburger ───────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// ── Active Nav Link Highlight ──────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinkEls = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinkEls.forEach(link => {
        link.style.color = '';
        if (link.getAttribute('href') === '#' + entry.target.id) {
          link.style.color = '#8b5cf6';
        }
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(section => sectionObserver.observe(section));

// ── Reveal on Scroll ───────────────────────────────
const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      // Stagger siblings
      const siblings = Array.from(entry.target.parentElement.children).filter(
        el => el.classList.contains('reveal-up') || el.classList.contains('reveal-left') || el.classList.contains('reveal-right')
      );
      const idx = siblings.indexOf(entry.target);
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, idx * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

// ── Typing Animation ───────────────────────────────
const texts = [
  'Backend & AI Engineer',
  'Full-Stack Developer',
  'Machine Learning Enthusiast',
  'Problem Solver'
];
let textIdx = 0, charIdx = 0, isDeleting = false;
const typingEl = document.getElementById('typingText');

function type() {
  const currentText = texts[textIdx];
  if (isDeleting) {
    typingEl.textContent = currentText.substring(0, charIdx--);
    if (charIdx < 0) {
      isDeleting = false;
      textIdx = (textIdx + 1) % texts.length;
      setTimeout(type, 500);
      return;
    }
    setTimeout(type, 40);
  } else {
    typingEl.textContent = currentText.substring(0, charIdx++);
    if (charIdx > currentText.length) {
      isDeleting = true;
      setTimeout(type, 2000);
      return;
    }
    setTimeout(type, 70);
  }
}
setTimeout(type, 800);

// ── Counter Animation ──────────────────────────────
function animateCounter(el, target, duration = 1500) {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) {
      el.textContent = target + '+';
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(start);
    }
  }, 16);
}

const statCards = document.querySelectorAll('.stat-card');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const numEl = entry.target.querySelector('.stat-number');
      const target = parseInt(numEl.getAttribute('data-target'));
      animateCounter(numEl, target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

statCards.forEach(card => counterObserver.observe(card));

// ── Smooth Scroll for Anchor Links ────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const navH = navbar.offsetHeight;
      const targetY = target.getBoundingClientRect().top + window.scrollY - navH - 20;
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    }
  });
});

// ── Project Card Tilt Effect ───────────────────────
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotX = ((y - cy) / cy) * -6;
    const rotY = ((x - cx) / cx) * 6;
    card.style.transform = `translateY(-6px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    card.style.transition = 'transform 0.1s ease';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
  });
});

// ── Parallax on hero orbs ──────────────────────────
const orbs = document.querySelectorAll('.bg-orb');
window.addEventListener('mousemove', (e) => {
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;
  const dx = (e.clientX - cx) / cx;
  const dy = (e.clientY - cy) / cy;
  orbs.forEach((orb, i) => {
    const factor = (i + 1) * 12;
    orb.style.transform = `translate(${dx * factor}px, ${dy * factor}px)`;
  });
}, { passive: true });

// ── Scroll Progress Bar ────────────────────────────
const progressBar = document.createElement('div');
progressBar.style.cssText = `
  position: fixed;
  top: 0; left: 0;
  height: 3px;
  background: linear-gradient(90deg, #8b5cf6, #06b6d4);
  z-index: 10001;
  transition: width 0.1s linear;
  border-radius: 0 2px 2px 0;
`;
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = (scrollTop / docHeight) * 100;
  progressBar.style.width = progress + '%';
}, { passive: true });

// ── Pill hover glow ────────────────────────────────
document.querySelectorAll('.pill').forEach(pill => {
  pill.addEventListener('mouseenter', () => {
    pill.style.boxShadow = '0 0 16px rgba(139, 92, 246, 0.3)';
  });
  pill.addEventListener('mouseleave', () => {
    pill.style.boxShadow = '';
  });
});

console.log('%c🚀 Ilyes Saddi — Portfolio', 'color: #8b5cf6; font-size: 18px; font-weight: bold;');
console.log('%cBackend & AI Engineer · Available Feb 2027', 'color: #06b6d4; font-size: 12px;');
