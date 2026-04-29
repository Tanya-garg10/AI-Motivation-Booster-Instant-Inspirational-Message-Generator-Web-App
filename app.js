/* ── Motivational Quotes Database ─────────────── */
const quotes = {
  hustle: [
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
    { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
    { text: "Hustle in silence. Let your success make the noise.", author: "Unknown" },
    { text: "The dream is free. The hustle is sold separately.", author: "Unknown" },
    { text: "Work hard in silence, let success be your noise.", author: "Frank Ocean" },
    { text: "Opportunities don't happen. You create them.", author: "Chris Grosser" },
    { text: "It's not about having time. It's about making time.", author: "Unknown" },
    { text: "Your limitation — it's only your imagination.", author: "Unknown" },
    { text: "Great things never come from comfort zones.", author: "Unknown" },
  ],
  calm: [
    { text: "Almost everything will work again if you unplug it for a few minutes, including you.", author: "Anne Lamott" },
    { text: "You don't have to see the whole staircase, just take the first step.", author: "Martin Luther King Jr." },
    { text: "Breathe. It's just a bad day, not a bad life.", author: "Unknown" },
    { text: "Be gentle with yourself. You're doing the best you can.", author: "Unknown" },
    { text: "Rest is not idleness. It is the fuel for your next breakthrough.", author: "Unknown" },
    { text: "You are allowed to be both a masterpiece and a work in progress simultaneously.", author: "Sophia Bush" },
    { text: "The present moment is the only moment available to us, and it is the door to all moments.", author: "Thich Nhat Hanh" },
    { text: "Peace is the result of retraining your mind to process life as it is, rather than as you think it should be.", author: "Wayne Dyer" },
    { text: "Slow down. Calm down. Don't worry. Don't hurry. Trust the process.", author: "Alexandra Stoddard" },
    { text: "Within you, there is a stillness and a sanctuary to which you can retreat at any time.", author: "Hermann Hesse" },
  ],
  creative: [
    { text: "Creativity is intelligence having fun.", author: "Albert Einstein" },
    { text: "The chief enemy of creativity is good sense.", author: "Pablo Picasso" },
    { text: "You can't use up creativity. The more you use, the more you have.", author: "Maya Angelou" },
    { text: "Create with the heart; build with the mind.", author: "Criss Jami" },
    { text: "Every artist was first an amateur.", author: "Ralph Waldo Emerson" },
    { text: "Imagination is the beginning of creation.", author: "George Bernard Shaw" },
    { text: "Art is not what you see, but what you make others see.", author: "Edgar Degas" },
    { text: "The desire to create is one of the deepest yearnings of the human soul.", author: "Dieter F. Uchtdorf" },
    { text: "To live a creative life, we must lose our fear of being wrong.", author: "Joseph Chilton Pearce" },
    { text: "Creativity takes courage.", author: "Henri Matisse" },
  ],
  student: [
    { text: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela" },
    { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
    { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
    { text: "The beautiful thing about learning is that nobody can take it away from you.", author: "B.B. King" },
    { text: "Study hard, for the well is deep, and our brains are shallow.", author: "Richard Baxter" },
    { text: "Push yourself, because no one else is going to do it for you.", author: "Unknown" },
    { text: "There are no shortcuts to any place worth going.", author: "Beverly Sills" },
    { text: "The more that you read, the more things you will know. The more that you learn, the more places you'll go.", author: "Dr. Seuss" },
    { text: "Don't let what you cannot do interfere with what you can do.", author: "John Wooden" },
    { text: "A little progress each day adds up to big results.", author: "Satya Nani" },
  ],
};

/* ── State ─────────────────────────────────────── */
let currentCategory = 'all';
let streakCount = 0;
let lastQuote = null;
let musicPlaying = false;
let audioCtx = null;
let gainNode = null;

/* ── DOM Elements ──────────────────────────────── */
const quoteText = document.getElementById('quote-text');
const quoteAuthor = document.getElementById('quote-author');
const boostBtn = document.getElementById('boost-btn');
const streakEl = document.getElementById('streak-count');
const quoteCard = document.querySelector('.quote-card');
const pills = document.querySelectorAll('.pill');
const musicToggle = document.getElementById('music-toggle');
const musicIconOff = document.getElementById('music-icon-off');
const musicIconOn = document.getElementById('music-icon-on');

/* ── Get Random Quote ──────────────────────────── */
function getRandomQuote() {
  let pool;
  if (currentCategory === 'all') {
    pool = Object.values(quotes).flat();
  } else {
    pool = quotes[currentCategory] || [];
  }

  // Avoid repeating the same quote
  let quote;
  do {
    quote = pool[Math.floor(Math.random() * pool.length)];
  } while (quote === lastQuote && pool.length > 1);

  lastQuote = quote;
  return quote;
}

/* ── Display Quote with Animation ──────────────── */
function showQuote() {
  const quote = getRandomQuote();

  // Fade out
  quoteText.classList.add('fade-out');
  quoteAuthor.classList.add('fade-out');

  setTimeout(() => {
    quoteText.textContent = quote.text;
    quoteAuthor.textContent = `— ${quote.author}`;

    // Fade in
    quoteText.classList.remove('fade-out');
    quoteAuthor.classList.remove('fade-out');

    // Glow border effect
    quoteCard.classList.add('glow');
    setTimeout(() => quoteCard.classList.remove('glow'), 2000);
  }, 400);

  // Update streak
  streakCount++;
  streakEl.textContent = streakCount;
}

/* ── Category Selection ────────────────────────── */
pills.forEach(pill => {
  pill.addEventListener('click', () => {
    pills.forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    currentCategory = pill.dataset.category;
  });
});

/* ── Boost Button ──────────────────────────────── */
boostBtn.addEventListener('click', showQuote);

/* ── Keyboard shortcut (Space) ─────────────────── */
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space' && e.target === document.body) {
    e.preventDefault();
    showQuote();
  }
});

/* ── Background Music (Web Audio API) ──────────── */
function createAmbientMusic() {
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  gainNode = audioCtx.createGain();
  gainNode.gain.value = 0;
  gainNode.connect(audioCtx.destination);

  // Soft ambient pad using oscillators
  const notes = [220, 277.18, 329.63, 440]; // A3, C#4, E4, A4
  const oscillators = [];

  notes.forEach((freq, i) => {
    const osc = audioCtx.createOscillator();
    const oscGain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.value = freq;
    oscGain.gain.value = 0.06;

    // Gentle detuning for warmth
    osc.detune.value = Math.sin(i) * 8;

    osc.connect(oscGain);
    oscGain.connect(gainNode);
    osc.start();
    oscillators.push(osc);

    // Slow LFO for movement
    const lfo = audioCtx.createOscillator();
    const lfoGain = audioCtx.createGain();
    lfo.type = 'sine';
    lfo.frequency.value = 0.1 + i * 0.05;
    lfoGain.gain.value = 3;
    lfo.connect(lfoGain);
    lfoGain.connect(osc.detune);
    lfo.start();
  });

  return oscillators;
}

musicToggle.addEventListener('click', () => {
  if (!musicPlaying) {
    if (!audioCtx) createAmbientMusic();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    // Fade in
    gainNode.gain.cancelScheduledValues(audioCtx.currentTime);
    gainNode.gain.setValueAtTime(gainNode.gain.value, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(1, audioCtx.currentTime + 1.5);
    musicPlaying = true;
    musicIconOff.classList.add('hidden');
    musicIconOn.classList.remove('hidden');
  } else {
    // Fade out
    gainNode.gain.cancelScheduledValues(audioCtx.currentTime);
    gainNode.gain.setValueAtTime(gainNode.gain.value, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1);
    musicPlaying = false;
    musicIconOn.classList.add('hidden');
    musicIconOff.classList.remove('hidden');
  }
});

/* ── Particle Background ──────────────────────── */
(function initParticles() {
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let particles = [];
  const PARTICLE_COUNT = 60;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.speedY = (Math.random() - 0.5) * 0.3;
      this.opacity = Math.random() * 0.4 + 0.1;
      this.hue = Math.random() > 0.5 ? 260 : 200; // purple or blue
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
      if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, 70%, 70%, ${this.opacity})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle());
  }

  function connectParticles() {
    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        const dx = particles[a].x - particles[b].x;
        const dy = particles[a].y - particles[b].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          ctx.beginPath();
          ctx.strokeStyle = `hsla(260, 60%, 65%, ${0.08 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    connectParticles();
    requestAnimationFrame(animate);
  }

  animate();
})();
