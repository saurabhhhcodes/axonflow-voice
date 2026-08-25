/**
 * AxonFlow AI — Framer Motion Style Physics & UI/UX Engine
 * Delivers hardware-accelerated 60/120fps micro-interactions, magnetic buttons,
 * 3D card tilts, cursor spotlights, spring scroll reveals, and neural particle meshes.
 */

(function() {
    'use strict';

    // 1. Reading Progress Bar at Top of Page
    function initScrollProgress() {
        if (document.getElementById('framerProgressBar')) return;
        const bar = document.createElement('div');
        bar.id = 'framerProgressBar';
        bar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            height: 3px;
            width: 0%;
            background: linear-gradient(90deg, #5457ff, #ec4899, #35d07f);
            z-index: 99999;
            pointer-events: none;
            transition: width 0.08s cubic-bezier(0.16, 1, 0.3, 1);
            box-shadow: 0 0 10px rgba(236, 72, 153, 0.6);
        `;
        document.body.appendChild(bar);

        window.addEventListener('scroll', () => {
            const total = document.documentElement.scrollHeight - window.innerHeight;
            const progress = total > 0 ? (window.scrollY / total) * 100 : 0;
            bar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
        }, { passive: true });
    }

    // 2. Cursor Spotlight Hover Tracking on Cards
    function initCardSpotlights() {
        const cards = document.querySelectorAll('.card, .browser-mockup, .glass-card, .stat-card, [data-spotlight]');
        cards.forEach(card => {
            card.classList.add('framer-spotlight-card');
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
            });
        });
    }

    // 3. 3D Perspective Tilt with Spring Return
    function initCardTilt() {
        const tiltElements = document.querySelectorAll('.browser-mockup, .card, [data-tilt]');
        tiltElements.forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -6; // max 6 deg
                const rotateY = ((x - centerX) / centerX) * 6;

                el.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px) scale3d(1.01, 1.01, 1.01)`;
                el.style.transition = 'transform 0.08s ease-out';
            });

            el.addEventListener('mouseleave', () => {
                el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale3d(1, 1, 1)';
                el.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
            });
        });
    }

    // 4. Magnetic Physics for CTA Buttons
    function initMagneticButtons() {
        const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, [data-magnetic]');
        buttons.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
                btn.style.transition = 'transform 0.1s ease-out';
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translate(0px, 0px)';
                btn.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
            });
        });
    }

    // 5. Spring Scroll-Driven Staggered Reveals
    function initScrollReveals() {
        const revealTargets = document.querySelectorAll('.section-title, .section-sub, .card, .grid-2 > *, .grid-3 > *, .grid-4 > *, .browser-mockup');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, idx) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('framer-in-view');
                    }, (idx % 4) * 60);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

        revealTargets.forEach(el => {
            el.classList.add('framer-reveal');
            observer.observe(el);
        });
    }

    // 6. Interactive Benchmark Counter Animation
    function initStatCounters() {
        const statEls = document.querySelectorAll('[data-counter]');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const targetNum = parseFloat(el.getAttribute('data-counter'));
                    const suffix = el.getAttribute('data-suffix') || '';
                    const prefix = el.getAttribute('data-prefix') || '';
                    const duration = 1600;
                    const startTime = performance.now();

                    function updateCount(currentTime) {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        // Spring ease out curve
                        const easeProgress = 1 - Math.pow(1 - progress, 3);
                        const currentVal = Math.round(targetNum * easeProgress);

                        el.textContent = `${prefix}${currentVal}${suffix}`;

                        if (progress < 1) {
                            requestAnimationFrame(updateCount);
                        } else {
                            el.textContent = `${prefix}${targetNum}${suffix}`;
                        }
                    }

                    requestAnimationFrame(updateCount);
                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.2 });

        statEls.forEach(el => observer.observe(el));
    }

    // 7. Ambient Neural Particle Mesh in Hero
    function initHeroParticleMesh() {
        const hero = document.querySelector('.hero-field, .page-hero');
        if (!hero || document.getElementById('heroParticleCanvas')) return;

        const canvas = document.createElement('canvas');
        canvas.id = 'heroParticleCanvas';
        canvas.style.cssText = `
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 0;
            opacity: 0.6;
        `;
        hero.prepend(canvas);

        const ctx = canvas.getContext('2d');
        let width = canvas.width = hero.offsetWidth;
        let height = canvas.height = hero.offsetHeight;

        window.addEventListener('resize', () => {
            width = canvas.width = hero.offsetWidth;
            height = canvas.height = hero.offsetHeight;
        });

        const particles = [];
        const count = Math.min(Math.floor(width / 35), 45);

        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
                radius: Math.random() * 1.8 + 0.8,
                color: Math.random() > 0.5 ? 'rgba(84, 87, 255, ' : 'rgba(236, 72, 153, '
            });
        }

        let mouseX = -1000;
        let mouseY = -1000;

        hero.addEventListener('mousemove', (e) => {
            const rect = hero.getBoundingClientRect();
            mouseX = e.clientX - rect.left;
            mouseY = e.clientY - rect.top;
        });

        hero.addEventListener('mouseleave', () => {
            mouseX = -1000;
            mouseY = -1000;
        });

        function animate() {
            ctx.clearRect(0, 0, width, height);

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0 || p.x > width) p.vx *= -1;
                if (p.y < 0 || p.y > height) p.vy *= -1;

                // Mouse interaction repulsion/attraction
                const dx = mouseX - p.x;
                const dy = mouseY - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    p.x -= (dx / dist) * 0.8;
                    p.y -= (dy / dist) * 0.8;
                }

                ctx.fillStyle = p.color + '0.6)';
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fill();

                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const d = Math.hypot(p.x - p2.x, p.y - p2.y);
                    if (d < 90) {
                        ctx.strokeStyle = `rgba(84, 87, 255, ${0.15 * (1 - d / 90)})`;
                        ctx.lineWidth = 0.8;
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            }

            requestAnimationFrame(animate);
        }

        requestAnimationFrame(animate);
    }

    // Initialize all enhancements on DOM ready
    function init() {
        initScrollProgress();
        initCardSpotlights();
        initCardTilt();
        initMagneticButtons();
        initScrollReveals();
        initStatCounters();
        initHeroParticleMesh();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
