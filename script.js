/* =============================================
   DEVASENA REDDY — PORTFOLIO
   Main Script: GSAP, Three.js, Interactions
   ============================================= */

// ─── Utility Functions ───
const lerp = (a, b, n) => (1 - n) * a + n * b;
const clamp = (val, min, max) => Math.min(Math.max(val, min), max);
const isTouchDevice = () => 'ontouchstart' in window || navigator.maxTouchPoints > 0;

// ─── State ───
const state = {
  mouse: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
  cursor: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
  cursorDot: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
  isLoaded: false,
  menuOpen: false,
};

// ─── DOM Elements ───
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

// ─── Custom Cursor ───
class CustomCursor {
  constructor() {
    if (isTouchDevice()) return;

    this.cursor = $('.cursor');
    this.dot = $('.cursor-dot');
    this.circle = $('.cursor-circle');
    this.currentState = '';

    this.init();
  }

  init() {
    document.addEventListener('mousemove', (e) => {
      state.mouse.x = e.clientX;
      state.mouse.y = e.clientY;
    });

    // Hover states
    $$('[data-cursor]').forEach(el => {
      el.addEventListener('mouseenter', () => {
        this.setState(el.dataset.cursor);
      });
      el.addEventListener('mouseleave', () => {
        this.setState('');
      });
    });

    // Hide on leave
    document.addEventListener('mouseleave', () => {
      if (this.cursor) this.cursor.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      if (this.cursor) this.cursor.style.opacity = '1';
    });

    this.render();
  }

  setState(s) {
    if (!this.cursor) return;
    this.cursor.classList.remove('hover', 'text', 'view');
    if (s) this.cursor.classList.add(s);
    this.currentState = s;
  }

  render() {
    state.cursor.x = lerp(state.cursor.x, state.mouse.x, 0.15);
    state.cursor.y = lerp(state.cursor.y, state.mouse.y, 0.15);
    state.cursorDot.x = lerp(state.cursorDot.x, state.mouse.x, 0.35);
    state.cursorDot.y = lerp(state.cursorDot.y, state.mouse.y, 0.35);

    if (this.circle) {
      this.circle.style.transform = `translate(${state.cursor.x - 0}px, ${state.cursor.y - 0}px) translate(-50%, -50%)`;
    }
    if (this.dot) {
      this.dot.style.transform = `translate(${state.cursorDot.x}px, ${state.cursorDot.y}px) translate(-50%, -50%)`;
    }

    requestAnimationFrame(() => this.render());
  }
}

// ─── Magnetic Buttons ───
class MagneticButtons {
  constructor() {
    if (isTouchDevice()) return;
    this.buttons = $$('.magnetic-btn');
    this.init();
  }

  init() {
    this.buttons.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const span = btn.querySelector('span');

        gsap.to(btn, {
          x: x * 0.3,
          y: y * 0.3,
          duration: 0.4,
          ease: 'power2.out',
        });

        if (span) {
          gsap.to(span, {
            x: x * 0.15,
            y: y * 0.15,
            duration: 0.4,
            ease: 'power2.out',
          });
        }
      });

      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' });
        const span = btn.querySelector('span');
        if (span) {
          gsap.to(span, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' });
        }
      });
    });
  }
}

// ─── Magnetic Project Cards (3D Tilt) ───
class MagneticCards {
  constructor() {
    if (isTouchDevice()) return;
    this.cards = $$('.work-card');
    this.init();
  }

  init() {
    this.cards.forEach(card => {
      const image = card.querySelector('.work-card-image img');

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        // Calculate mouse position relative to center of card (-1 to 1)
        const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
        const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);

        // Tilt the card
        gsap.to(card, {
          rotateY: x * 8, // max 8 deg tilt
          rotateX: -y * 8,
          duration: 0.4,
          ease: 'power2.out',
        });

        // Parallax the image inside slightly
        if (image) {
          gsap.to(image, {
            x: -x * 10,
            y: -y * 10,
            duration: 0.4,
            ease: 'power2.out',
          });
        }
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.8, ease: 'elastic.out(1, 0.5)' });
        if (image) {
          gsap.to(image, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.5)' });
        }
      });
    });
  }
}

// ─── Hover Glow (Skills Accordion) ───
class HoverGlow {
  constructor() {
    if (isTouchDevice()) return;
    this.items = $$('.service-item');
    this.init();
  }

  init() {
    this.items.forEach(item => {
      item.addEventListener('mousemove', (e) => {
        const rect = item.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Update CSS variables for the radial gradient center
        item.style.setProperty('--mouse-x', `${x}px`);
        item.style.setProperty('--mouse-y', `${y}px`);
      });
    });
  }
}
// ─── Scrub Text (Testimonial Quote) ───
class ScrubText {
  constructor() {
    this.elements = $$('.scrub-text');
    this.init();
  }

  init() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    this.elements.forEach(el => {
      gsap.to(el, {
        backgroundPositionX: '0%',
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          end: 'bottom 45%',
          scrub: 1,
        }
      });
    });
  }
}

// ─── Three.js Hero Blob ───
class HeroBlob {
  constructor() {
    this.container = $('#heroCanvas');
    if (!this.container || !window.THREE) return;

    this.scene = new THREE.Scene();
    this.clock = new THREE.Clock();
    this.mouse = { x: 0, y: 0 };
    this.targetRotation = { x: 0, y: 0 };

    this.init();
  }

  init() {
    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.container.appendChild(this.renderer.domElement);

    // Camera
    this.camera = new THREE.PerspectiveCamera(45, this.container.clientWidth / this.container.clientHeight, 0.1, 100);
    this.camera.position.z = window.innerWidth < 768 ? 5.5 : 4.5;

    // Geometry
    const detail = isTouchDevice() ? 40 : 64;
    this.geometry = new THREE.IcosahedronGeometry(1.5, detail);
    this.originalPositions = new Float32Array(this.geometry.attributes.position.array);

    // Shader Material
    this.material = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying float vDisplacement;
        uniform float uTime;
        uniform vec2 uMouse;

        // Simplex-like 3D noise
        vec3 mod289(vec3 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
        vec4 mod289(vec4 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
        vec4 permute(vec4 x) { return mod289(((x*34.0)+10.0)*x); }
        vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

        float snoise(vec3 v) {
          const vec2 C = vec2(1.0/6.0, 1.0/3.0);
          const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
          vec3 i = floor(v + dot(v, C.yyy));
          vec3 x0 = v - i + dot(i, C.xxx);
          vec3 g = step(x0.yzx, x0.xyz);
          vec3 l = 1.0 - g;
          vec3 i1 = min(g.xyz, l.zxy);
          vec3 i2 = max(g.xyz, l.zxy);
          vec3 x1 = x0 - i1 + C.xxx;
          vec3 x2 = x0 - i2 + C.yyy;
          vec3 x3 = x0 - D.yyy;
          i = mod289(i);
          vec4 p = permute(permute(permute(
            i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
          float n_ = 0.142857142857;
          vec3 ns = n_ * D.wyz - D.xzx;
          vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
          vec4 x_ = floor(j * ns.z);
          vec4 y_ = floor(j - 7.0 * x_);
          vec4 x = x_ * ns.x + ns.yyyy;
          vec4 y = y_ * ns.x + ns.yyyy;
          vec4 h = 1.0 - abs(x) - abs(y);
          vec4 b0 = vec4(x.xy, y.xy);
          vec4 b1 = vec4(x.zw, y.zw);
          vec4 s0 = floor(b0) * 2.0 + 1.0;
          vec4 s1 = floor(b1) * 2.0 + 1.0;
          vec4 sh = -step(h, vec4(0.0));
          vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
          vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
          vec3 p0 = vec3(a0.xy, h.x);
          vec3 p1 = vec3(a0.zw, h.y);
          vec3 p2 = vec3(a1.xy, h.z);
          vec3 p3 = vec3(a1.zw, h.w);
          vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
          p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
          vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
          m = m * m;
          return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
        }

        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;

          // Mouse reactivity (distance from center affects noise intensity)
          float mouseDist = length(uMouse) * 0.5;
          float noise = snoise(position * 0.8 + uTime * 0.25) * (0.35 + mouseDist);
          noise += snoise(position * 1.6 + uTime * 0.15) * 0.15;
          vDisplacement = noise;

          vec3 newPos = position + normal * noise;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying float vDisplacement;
        uniform float uTime;

        void main() {
          // Fresnel effect
          vec3 viewDir = normalize(cameraPosition - vPosition);
          float fresnel = pow(1.0 - max(dot(vNormal, viewDir), 0.0), 3.0);
          float ior = 1.5; // index of refraction simulation

          // Iridescent Color palette
          vec3 color1 = vec3(0.078, 0.059, 0.275); // Deep purple
          vec3 color2 = vec3(0.047, 0.204, 0.373); // Dark blue
          vec3 color3 = vec3(0.788, 0.953, 0.114); // Accent lime
          vec3 color4 = vec3(0.9, 0.2, 0.5); // Neon pink for iridescence

          // Blend based on displacement and fresnel
          vec3 baseColor = mix(color1, color2, vDisplacement * 2.0 + 0.5);
          vec3 iridescence = mix(color4, color3, sin(fresnel * 10.0 + uTime) * 0.5 + 0.5);
          
          vec3 finalColor = mix(baseColor, iridescence, fresnel * 0.8);

          // Intense rim glow
          finalColor += color3 * fresnel * 0.5;

          float alpha = 0.85 + fresnel * 0.15;
          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) }
      },
      transparent: true,
      wireframe: false,
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);

    // Position blob to the right and center it vertically
    // Position blob to the right and center it vertically
    const isMobile = window.innerWidth < 768;
    this.mesh.position.x = 1.5; // Fixed at 1.5 for both desktop and mobile
    this.mesh.position.y = isMobile ? -0.2 : -0.25; // Moved down on mobile

    // Mouse tracking
    if (!isTouchDevice()) {
      document.addEventListener('mousemove', (e) => {
        this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
      });
    }

    // Resize
    window.addEventListener('resize', () => this.onResize());

    this.animate();
  }

  onResize() {
    if (!this.container) return;
    this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);

    const isMobile = window.innerWidth < 768;
    if (this.camera) this.camera.position.z = isMobile ? 5.5 : 4.5;
    if (this.mesh) {
      this.mesh.position.x = 1.5;
      this.mesh.position.y = isMobile ? -0.75 : -0.25;
    }
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const elapsed = this.clock.getElapsedTime();
    this.material.uniforms.uTime.value = elapsed;

    // Pass mouse to shader for reactivity
    if (this.material.uniforms.uMouse) {
      this.material.uniforms.uMouse.value.x = lerp(this.material.uniforms.uMouse.value.x, this.mouse.x, 0.05);
      this.material.uniforms.uMouse.value.y = lerp(this.material.uniforms.uMouse.value.y, this.mouse.y, 0.05);
    }

    // Smooth mouse tracking rotation
    this.targetRotation.x = this.mouse.y * 0.3;
    this.targetRotation.y = this.mouse.x * 0.3;

    this.mesh.rotation.x = lerp(this.mesh.rotation.x, this.targetRotation.x + elapsed * 0.05, 0.05);
    this.mesh.rotation.y = lerp(this.mesh.rotation.y, this.targetRotation.y + elapsed * 0.08, 0.05);

    this.renderer.render(this.scene, this.camera);
  }
}

// ─── Preloader ───
class Preloader {
  constructor(onComplete) {
    this.onComplete = onComplete;
    this.loader = $('#loader');
    this.bar = $('.loader-bar');
    this.percent = $('.loader-percent');
    this.progress = 0;
    this.target = 0;

    this.init();
  }

  init() {
    // Simulate loading
    const interval = setInterval(() => {
      this.target += Math.random() * 12 + 3;
      if (this.target >= 100) {
        this.target = 100;
        clearInterval(interval);
      }
    }, 120);

    this.update();
  }

  update() {
    this.progress = lerp(this.progress, this.target, 0.08);

    if (this.bar) this.bar.style.width = `${this.progress}%`;
    if (this.percent) this.percent.textContent = Math.round(this.progress);

    if (Math.round(this.progress) >= 100) {
      setTimeout(() => this.complete(), 400);
      return;
    }

    requestAnimationFrame(() => this.update());
  }

  complete() {
    const tl = gsap.timeline({
      onComplete: () => {
        if (this.loader) this.loader.style.display = 'none';
        document.body.classList.remove('locked');
        if (this.onComplete) this.onComplete();
      }
    });

    tl.to('.loader-inner', {
      opacity: 0,
      y: -30,
      duration: 0.5,
      ease: 'power2.in',
    })
      .to('.loader-reveal', {
        scaleY: 1,
        duration: 0.6,
        ease: 'power3.inOut',
      }, '-=0.1')
      .to('#loader', {
        yPercent: -100,
        duration: 0.8,
        ease: 'power3.inOut',
      }, '-=0.1');
  }
}

// ─── Smooth Scroll (Lenis) ───
class SmoothScroll {
  constructor() {
    if (!window.Lenis) return;

    this.lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    // Connect to GSAP ScrollTrigger
    this.lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => this.lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    // Force scroll to top on init
    this.lenis.scrollTo(0, { immediate: true });

    // Smooth scroll anchor links
    $$('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = $(anchor.getAttribute('href'));
        if (target) {
          this.lenis.scrollTo(target, { offset: -40 });
        }

        // Close mobile menu if open
        if (state.menuOpen) {
          toggleMobileMenu();
        }
      });
    });
  }

  stop() { if (this.lenis) this.lenis.stop(); }
  start() { if (this.lenis) this.lenis.start(); }
}

// ─── Mobile Menu ───
function toggleMobileMenu() {
  state.menuOpen = !state.menuOpen;
  const btn = $('#menuBtn');
  const menu = $('#mobileMenu');

  if (state.menuOpen) {
    btn.classList.add('active');
    menu.classList.add('active');
    document.body.classList.add('locked');
  } else {
    btn.classList.remove('active');
    menu.classList.remove('active');
    document.body.classList.remove('locked');
  }
}

// ─── GSAP Animations ───
class Animations {
  constructor() {
    gsap.registerPlugin(ScrollTrigger);
    this.init();
  }

  init() {
    this.heroAnimations();
    this.scrollRevealText();
    this.scrollRevealUp();
    this.navScroll();
    this.parallaxImages();
    this.counterAnimation();
    this.statHoverEffects();
    this.workItemHovers();
    this.serviceItemAnimations();
  }

  heroAnimations() {
    const tl = gsap.timeline({ delay: 0.2 });

    // Nav
    tl.fromTo('#nav', { y: -80, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' });

    // Eyebrow
    tl.fromTo('.hero-eyebrow-line', { width: 0 }, { width: 40, duration: 0.6, ease: 'power2.out' }, '-=0.3');
    tl.fromTo('.hero-eyebrow-text', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }, '-=0.3');

    // Title lines - staggered reveal with more dramatic ease
    const titleLines = $$('.hero-title-line .reveal-text');
    titleLines.forEach((text, i) => {
      tl.fromTo(text,
        { y: '120%', opacity: 0, rotateX: -15, scale: 0.95 },
        { y: '0%', opacity: 1, rotateX: 0, scale: 1, duration: 1.4, ease: 'expo.out' },
        `-=${i > 0 ? 1.2 : 0.2}`
      );
    });

    // Bottom elements
    tl.fromTo('.hero-description',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' },
      '-=0.4'
    );

    tl.fromTo('.hero-scroll',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
      '-=0.5'
    );
  }

  scrollRevealText() {
    // Reveal text elements on scroll (not in hero)
    $$('.reveal-text').forEach(el => {
      if (el.closest('#hero')) return; // Skip hero elements

      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.fromTo(el,
            { y: '100%', opacity: 0 },
            { y: '0%', opacity: 1, duration: 0.9, ease: 'power3.out', delay: el.dataset.delay || 0 }
          );
        }
      });
    });
  }

  scrollRevealUp() {
    $$('.reveal-up').forEach((el, i) => {
      if (el.closest('#hero')) return;

      ScrollTrigger.create({
        trigger: el,
        start: 'top 88%',
        once: true,
        onEnter: () => {
          gsap.fromTo(el,
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', delay: 0.1 }
          );

          // Trigger SVG draw if element contains a highlight
          const svg = el.querySelector('.highlight-svg');
          if (svg) svg.classList.add('drawn');
        }
      });
    });
  }

  navScroll() {
    ScrollTrigger.create({
      start: 100,
      onUpdate: (self) => {
        const nav = $('#nav');
        if (self.direction === 1 && self.scroll() > 100) {
          nav.classList.add('scrolled');
        } else if (self.scroll() < 50) {
          nav.classList.remove('scrolled');
        }
      }
    });
  }

  parallaxImages() {
    $$('.about-image').forEach(img => {
      gsap.to(img, {
        yPercent: -8,
        ease: 'none',
        scrollTrigger: {
          trigger: img,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5,
        }
      });
    });

    // Parallax for work images
    $$('.work-image-inner').forEach(img => {
      gsap.to(img, {
        yPercent: -5,
        ease: 'none',
        scrollTrigger: {
          trigger: img,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 2,
        }
      });
    });

    // 3D Magnetic Image Tilt
    $$('.about-image-wrap').forEach(wrap => {
      const img = wrap.querySelector('.about-image');
      wrap.addEventListener('mousemove', (e) => {
        if (isTouchDevice()) return;
        const rect = wrap.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const xPct = (x / rect.width - 0.5) * 2;
        const yPct = (y / rect.height - 0.5) * 2;

        gsap.to(img, {
          rotateX: yPct * -10,
          rotateY: xPct * 10,
          duration: 0.5,
          ease: 'power2.out'
        });
      });
      wrap.addEventListener('mouseleave', () => {
        gsap.to(img, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.8,
          ease: 'elastic.out(1, 0.5)'
        });
      });
    });
  }

  counterAnimation() {
    $$('.stat-number').forEach(num => {
      const target = parseInt(num.dataset.count);

      ScrollTrigger.create({
        trigger: num,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          let iteration = 0;
          const chars = "0123456789";
          const finalStr = target.toString();

          gsap.fromTo(num, { scale: 0.8 }, { scale: 1, duration: 0.5, ease: 'back.out(1.5)' });

          const interval = setInterval(() => {
            num.textContent = finalStr.split("").map((letter, index) => {
              if (index < iteration) {
                return finalStr[index];
              }
              return chars[Math.floor(Math.random() * chars.length)];
            }).join("");

            if (iteration >= finalStr.length) {
              clearInterval(interval);
            }
            iteration += 1 / 3;
          }, 30);
        }
      });
    });
  }

  statHoverEffects() {
    $$('.stat').forEach(stat => {
      stat.addEventListener('mousemove', (e) => {
        const rect = stat.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        stat.style.setProperty('--mouse-x', `${x}px`);
        stat.style.setProperty('--mouse-y', `${y}px`);
      });
    });
  }

  workItemHovers() {
    $$('.work-item').forEach(item => {
      const image = item.querySelector('.work-image-inner');

      item.addEventListener('mouseenter', () => {
        gsap.to(image, { scale: 1.05, duration: 0.6, ease: 'power2.out' });
      });

      item.addEventListener('mouseleave', () => {
        gsap.to(image, { scale: 1, duration: 0.6, ease: 'power2.out' });
      });
    });
  }

  serviceItemAnimations() {
    $$('.service-item').forEach(item => {
      const desc = item.querySelector('.service-desc');

      // Initially hide descriptions
      gsap.set(desc, { height: 0, opacity: 0, overflow: 'hidden' });

      item.addEventListener('mouseenter', () => {
        gsap.to(desc, {
          height: 'auto',
          opacity: 1,
          duration: 0.4,
          ease: 'power2.out'
        });
      });

      item.addEventListener('mouseleave', () => {
        gsap.to(desc, {
          height: 0,
          opacity: 0,
          duration: 0.3,
          ease: 'power2.in'
        });
      });
    });

    // On mobile, descriptions are always visible
    if (isTouchDevice()) {
      $$('.service-desc').forEach(desc => {
        gsap.set(desc, { height: 'auto', opacity: 1 });
      });
    }
  }
}

// ─── Initialization ───
// Force scroll to top on page refresh/unload
if (history.scrollRestoration) {
  history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);
window.onbeforeunload = function () {
  window.scrollTo(0, 0);
};

document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('locked');

  // Init cursor
  new CustomCursor();

  // Menu button
  const menuBtn = $('#menuBtn');
  if (menuBtn) {
    menuBtn.addEventListener('click', toggleMobileMenu);
  }

  // Close mobile menu on link click
  $$('.mobile-menu-link').forEach(link => {
    link.addEventListener('click', () => {
      if (state.menuOpen) toggleMobileMenu();
    });
  });

  // Preloader
  new Preloader(() => {
    state.isLoaded = true;

    // Init everything after loader completes
    new SmoothScroll();
    new MagneticButtons();
    new MagneticCards();
    new HoverGlow();
    new Animations();
    new HeroBlob();
    new ScrubText();
  });
});

// ─── Prevent FOUC ───
window.addEventListener('load', () => {
  document.documentElement.style.opacity = '1';
});
