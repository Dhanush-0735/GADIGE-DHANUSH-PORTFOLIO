(function () {
  const root = document.documentElement;
  const body = document.body;

  // Persisted theme
  const THEME_KEY = 'gd-theme';
  const savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme === 'light') body.setAttribute('data-theme', 'light');

  // Dark mode toggle
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isLight = body.getAttribute('data-theme') === 'light';
      if (isLight) {
        body.removeAttribute('data-theme');
        localStorage.setItem(THEME_KEY, 'dark');
        themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
      } else {
        body.setAttribute('data-theme', 'light');
        localStorage.setItem(THEME_KEY, 'light');
        themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
      }
    });
  }

  // Year in footer
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Animate skill bars widths
  function initSkillBars() {
    const bars = document.querySelectorAll('.skill-list .bar');
    bars.forEach((bar) => {
      const level = parseInt(bar.getAttribute('data-level') || '0', 10);
      requestAnimationFrame(() => {
        bar.style.transition = 'width 900ms ease-out';
        bar.style.width = Math.max(0, Math.min(100, level)) + '%';
      });
    });
  }
  initSkillBars();

  // Typewriter greeting (loops 6 times then settles)
  const typeTarget = document.getElementById('typewriter');
  if (typeTarget) {
    const phrases = [
      'Hello, I\'m GADIGE DHANUSH 👋',
      'Full-Stack Web Developer',
      'I build modern web apps',
      'Java • Python • JS • HTML • CSS',
      'Open to opportunities',
      'Let\'s create something great'
    ];
    const maxLoops = 6;
    let loopCount = 0;
    let phraseIndex = 0;
    let charIndex = 0;
    let typing = true;

    function tick() {
      const phrase = phrases[phraseIndex % phrases.length];
      if (typing) {
        charIndex++;
        typeTarget.textContent = phrase.slice(0, charIndex);
        if (charIndex === phrase.length) {
          typing = false;
          setTimeout(tick, 900);
          return;
        }
        setTimeout(tick, 45);
      } else {
        // delete
        charIndex--;
        typeTarget.textContent = phrase.slice(0, Math.max(0, charIndex));
        if (charIndex === 0) {
          typing = true;
          phraseIndex++;
          loopCount++;
          if (loopCount >= maxLoops) {
            // Settle on final greeting
            typeTarget.textContent = 'Hello, I\'m GADIGE DHANUSH 👋';
            typeTarget.style.borderRightColor = 'transparent';
            return;
          }
        }
        setTimeout(tick, 28);
      }
    }
    tick();
  }

  // Reveal on scroll
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('is-visible'));
  }

  // Mouse parallax + spotlight
  const parallaxTargets = [
    document.querySelector('.hero .avatar-frame'),
    ...Array.from(document.querySelectorAll('.card'))
  ].filter(Boolean);

  window.addEventListener('mousemove', (e) => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;
    parallaxTargets.forEach((el, idx) => {
      const depth = (idx === 0 ? 8 : 2);
      el.style.transform = `translate3d(${dx * depth}px, ${dy * depth}px, 0)`;
    });
    root.style.setProperty('--mx', e.clientX + 'px');
    root.style.setProperty('--my', e.clientY + 'px');
  }, { passive: true });

  // Gentle bobbing on avatar
  const avatar = document.querySelector('.avatar-frame');
  if (avatar) {
    let t = 0;
    function bob() {
      t += 0.02;
      const y = Math.sin(t) * 2;
      avatar.style.translate = `0 ${y}px`;
      requestAnimationFrame(bob);
    }
    bob();
  }

  // Simple chat mock
  const chatForm = document.getElementById('chatForm');
  const chatInput = document.getElementById('chatInput');
  const chatLog = document.getElementById('chatLog');

  function appendMessage(text, role) {
    if (!chatLog) return;
    const row = document.createElement('div');
    row.style.padding = '8px 10px';
    row.style.borderBottom = '1px solid var(--border)';
    row.style.whiteSpace = 'pre-wrap';
    row.textContent = (role === 'user' ? 'You: ' : 'Dhanush: ') + text;
    chatLog.appendChild(row);
    chatLog.scrollTop = chatLog.scrollHeight;
  }

  function botReplyPrompt(userText) {
    const lower = userText.toLowerCase();
    if (lower.includes('project') || lower.includes('weather')) {
      return 'I built a Weather Forecast Web App using HTML/CSS/JS and OpenWeatherMap API.';
    }
    if (lower.includes('skills')) {
      return 'My skills include Java, Python, HTML/CSS, and JavaScript basics. Also good communication and teamwork.';
    }
    if (lower.includes('intern')) {
      return 'I interned in Embedded Systems at SkillDzire working with Arduino, 8051, and Atmega.';
    }
    return "Thanks for asking! Check the sections above or tell me what you're curious about (skills, projects, internship).";
  }

  if (chatForm && chatInput) {
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = chatInput.value.trim();
      if (!text) return;
      appendMessage(text, 'user');
      chatInput.value = '';
      setTimeout(() => appendMessage(botReplyPrompt(text), 'bot'), 350);
    });
  }

  // Contact form mock handler (replace later with EmailJS/Resend)
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(contactForm);
      const name = String(formData.get('name') || '').trim();
      const email = String(formData.get('email') || '').trim();
      const message = String(formData.get('message') || '').trim();
      if (!name || !email || !message) {
        if (formStatus) formStatus.textContent = 'Please fill in all fields.';
        return;
      }
      if (formStatus) formStatus.textContent = 'Sending...';
      setTimeout(() => {
        if (formStatus) formStatus.textContent = 'Message sent successfully (demo).';
        contactForm.reset();
      }, 600);
    });
  }
})();
