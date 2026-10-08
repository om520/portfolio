/* =========================================
   Om Mishra — Portfolio JavaScript
   Animations, Particles, and Interactivity
   ========================================= */

(function () {
    'use strict';

    // ---- Interactive Fluid Flow & Vector Stream Canvas ----
    class FluidFlowCanvas {
        constructor(canvas) {
            this.canvas = canvas;
            this.ctx = canvas.getContext('2d');
            this.particles = [];
            this.ripples = [];
            this.mouse = {
                x: -1000,
                y: -1000,
                lastX: -1000,
                lastY: -1000,
                vx: 0,
                vy: 0,
                speed: 0,
                isMoving: false,
            };
            this.mouseTimeout = null;
            this.time = 0;

            this.colors = [
                { r: 108, g: 92, b: 231 },   // Electric Violet
                { r: 168, g: 85, b: 247 },   // Radiant Purple
                { r: 14, g: 165, b: 233 },   // Vivid Cyan
                { r: 236, g: 72, b: 153 },   // Hot Pink
                { r: 220, g: 235, b: 255 },  // Cosmic Starlight
            ];

            this.resize();
            this.initParticles();
            this.bindEvents();
            this.animate();
        }

        resize() {
            this.width = this.canvas.width = window.innerWidth;
            this.height = this.canvas.height = window.innerHeight;
        }

        bindEvents() {
            window.addEventListener('resize', () => {
                this.resize();
                this.initParticles();
            });

            window.addEventListener('mousemove', (e) => {
                if (this.mouse.lastX === -1000) {
                    this.mouse.lastX = e.clientX;
                    this.mouse.lastY = e.clientY;
                }
                this.mouse.vx = (e.clientX - this.mouse.lastX) * 0.45;
                this.mouse.vy = (e.clientY - this.mouse.lastY) * 0.45;
                this.mouse.speed = Math.sqrt(this.mouse.vx * this.mouse.vx + this.mouse.vy * this.mouse.vy);
                this.mouse.lastX = this.mouse.x = e.clientX;
                this.mouse.lastY = this.mouse.y = e.clientY;
                this.mouse.isMoving = true;

                clearTimeout(this.mouseTimeout);
                this.mouseTimeout = setTimeout(() => {
                    this.mouse.isMoving = false;
                    this.mouse.vx = 0;
                    this.mouse.vy = 0;
                    this.mouse.speed = 0;
                }, 120);
            });

            window.addEventListener('click', (e) => {
                this.addRipple(e.clientX, e.clientY);
            });
        }

        addRipple(x, y) {
            this.ripples.push({
                x,
                y,
                radius: 6,
                maxRadius: 200,
                opacity: 0.65,
                speed: 4.5,
            });
        }

        initParticles() {
            // Optimized density to maintain high 60fps performance while looking great
            const count = Math.min(Math.floor((this.width * this.height) / 5000), 250);
            this.particles = [];
            for (let i = 0; i < count; i++) {
                const color = this.colors[Math.floor(Math.random() * this.colors.length)];
                this.particles.push({
                    x: Math.random() * this.width,
                    y: Math.random() * this.height,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5,
                    baseRadius: Math.random() * 2 + 0.8,
                    color: color,
                    alpha: Math.random() * 0.45 + 0.25,
                    history: [],
                    flowAngleOffset: Math.random() * Math.PI * 2,
                });
            }
        }

        getFlowAngle(x, y, t) {
            const scale = 0.0015;
            const n1 = Math.sin(x * scale + t * 0.35);
            const n2 = Math.cos(y * scale + t * 0.25);
            const n3 = Math.sin((x + y) * scale * 0.4 + t * 0.2);
            return (n1 + n2 + n3) * Math.PI;
        }

        drawBentGrid() {
            const spacing = 60;
            this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
            this.ctx.lineWidth = 1;

            const gx = this.mouse.x;
            const gy = this.mouse.y;
            const maxRadius = 550; // Increased Range of gravity effect

            const getDistortedPoint = (x, y) => {
                if (gx === -1000) return { x, y };
                const dx = x - gx;
                const dy = y - gy;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < maxRadius && dist > 1) {
                    // Dramatic Pinch factor simulates black hole gravity well
                    const pull = Math.pow(1 - dist / maxRadius, 2) * 120; 
                    const angle = Math.atan2(dy, dx);
                    return {
                        x: x - Math.cos(angle) * pull,
                        y: y - Math.sin(angle) * pull
                    };
                }
                return { x, y };
            };

            this.ctx.beginPath();
            // Verticals
            for (let x = 0; x <= this.width; x += spacing) {
                let startPoint = getDistortedPoint(x, 0);
                this.ctx.moveTo(startPoint.x, startPoint.y);
                for (let y = 0; y <= this.height; y += 40) { // Increased step size for performance
                    let pt = getDistortedPoint(x, y);
                    this.ctx.lineTo(pt.x, pt.y);
                }
            }
            // Horizontals
            for (let y = 0; y <= this.height; y += spacing) {
                let startPoint = getDistortedPoint(0, y);
                this.ctx.moveTo(startPoint.x, startPoint.y);
                for (let x = 0; x <= this.width; x += 40) { // Increased step size for performance
                    let pt = getDistortedPoint(x, y);
                    this.ctx.lineTo(pt.x, pt.y);
                }
            }
            this.ctx.stroke();
        }

        animate() {
            this.time += 0.015;
            this.ctx.clearRect(0, 0, this.width, this.height);

            // Draw spacetime gravity grid first
            this.drawBentGrid();

            // Update & draw ripples
            for (let r = this.ripples.length - 1; r >= 0; r--) {
                const rip = this.ripples[r];
                rip.radius += rip.speed;
                rip.opacity *= 0.94;

                this.ctx.beginPath();
                this.ctx.arc(rip.x, rip.y, rip.radius, 0, Math.PI * 2);
                this.ctx.strokeStyle = `rgba(168, 85, 247, ${rip.opacity * 0.55})`;
                this.ctx.lineWidth = 1.5;
                this.ctx.stroke();

                if (rip.opacity < 0.02 || rip.radius > rip.maxRadius) {
                    this.ripples.splice(r, 1);
                }
            }

            const len = this.particles.length;
            for (let i = 0; i < len; i++) {
                const p = this.particles[i];

                // Natural cosmic vector flow
                const angle = this.getFlowAngle(p.x, p.y, this.time) + p.flowAngleOffset * 0.1;
                const flowForce = 0.22;
                p.vx += Math.cos(angle) * flowForce * 0.12;
                p.vy += Math.sin(angle) * flowForce * 0.12;

                // Mouse fluid interaction - wake & vortex
                const dx = p.x - this.mouse.x;
                const dy = p.y - this.mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const maxInfluence = 450; // Massively Increased influence radius

                if (dist < maxInfluence && dist > 1) {
                    const norm = 1 - dist / maxInfluence;
                    if (this.mouse.isMoving) {
                        // Fluid drag along cursor momentum
                        p.vx += this.mouse.vx * norm * 0.25;
                        p.vy += this.mouse.vy * norm * 0.25;
                        // Organic vortex swirl
                        const swirlStrength = norm * 1.5;
                        p.vx += (-dy / dist) * swirlStrength;
                        p.vy += (dx / dist) * swirlStrength;
                    } else {
                        // Strong buoyancy repulsion/attraction
                        const repulse = norm * 0.8;
                        p.vx += (dx / dist) * repulse;
                        p.vy += (dy / dist) * repulse;
                    }
                }

                // Smooth damping
                p.vx *= 0.95;
                p.vy *= 0.95;

                p.x += p.vx;
                p.y += p.vy;

                // Edge wrap
                if (p.x < -20) p.x = this.width + 20;
                if (p.x > this.width + 20) p.x = -20;
                if (p.y < -20) p.y = this.height + 20;
                if (p.y > this.height + 20) p.y = -20;

                // History for luminous flow streak trails
                p.history.push({ x: p.x, y: p.y });
                if (p.history.length > 5) p.history.shift();

                const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);

                // Draw streaming trail when flowing fast
                if (p.history.length > 1 && speed > 0.35) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(p.history[0].x, p.history[0].y);
                    for (let h = 1; h < p.history.length; h++) {
                        this.ctx.lineTo(p.history[h].x, p.history[h].y);
                    }
                    const trailAlpha = Math.min(p.alpha * (speed * 0.45), 0.75);
                    this.ctx.strokeStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${trailAlpha})`;
                    this.ctx.lineWidth = Math.min(p.baseRadius * 0.95, 2.2);
                    this.ctx.stroke();
                }

                // Core luminous particle
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.baseRadius, 0, Math.PI * 2);
                this.ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${p.alpha})`;
                this.ctx.fill();

                // Connect nearby particles with glowing filaments
                for (let j = i + 1; j < len; j++) {
                    const p2 = this.particles[j];
                    const ddx = p.x - p2.x;
                    const ddy = p.y - p2.y;
                    const d = Math.sqrt(ddx * ddx + ddy * ddy);
                    if (d < 115) {
                        const lineAlpha = (1 - d / 115) * 0.12;
                        this.ctx.beginPath();
                        this.ctx.moveTo(p.x, p.y);
                        this.ctx.lineTo(p2.x, p2.y);
                        this.ctx.strokeStyle = `rgba(168, 85, 247, ${lineAlpha})`;
                        this.ctx.lineWidth = 0.55;
                        this.ctx.stroke();
                    }
                }
            }

            requestAnimationFrame(() => this.animate());
        }
    }

    // ---- Scroll Animations (IntersectionObserver) ----
    function initScrollAnimations() {
        const elements = document.querySelectorAll('[data-animate]');
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const delay = parseInt(entry.target.dataset.delay) || 0;
                        setTimeout(() => {
                            entry.target.classList.add('animate-in');
                        }, delay);
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
        );
        elements.forEach((el) => observer.observe(el));
    }

    // ---- Navbar Scroll Effect ----
    function initNavbar() {
        const nav = document.getElementById('nav');
        const links = document.querySelectorAll('.nav__link');
        const sections = document.querySelectorAll('.section, .hero');

        window.addEventListener('scroll', () => {
            // Scrolled state
            if (window.scrollY > 50) {
                nav.classList.add('nav--scrolled');
            } else {
                nav.classList.remove('nav--scrolled');
            }

            // Active section
            let current = '';
            sections.forEach((section) => {
                const top = section.offsetTop - 200;
                if (window.scrollY >= top) {
                    current = section.getAttribute('id');
                }
            });

            links.forEach((link) => {
                link.classList.remove('nav__link--active');
                if (link.dataset.section === current) {
                    link.classList.add('nav__link--active');
                }
            });
        });
    }

    // ---- Mobile Menu ----
    function initMobileMenu() {
        const hamburger = document.getElementById('hamburger');
        const navLinks = document.getElementById('navLinks');

        if (!hamburger || !navLinks) return;

        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('nav__hamburger--active');
            navLinks.classList.toggle('nav__links--open');
            document.body.style.overflow = navLinks.classList.contains('nav__links--open')
                ? 'hidden'
                : '';
        });

        navLinks.querySelectorAll('.nav__link').forEach((link) => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('nav__hamburger--active');
                navLinks.classList.remove('nav__links--open');
                document.body.style.overflow = '';
            });
        });
    }

    // ---- Counter Animation ----
    function initCounters() {
        const counters = document.querySelectorAll('[data-count]');
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const target = parseInt(entry.target.dataset.count);
                        animateCount(entry.target, target);
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.5 }
        );
        counters.forEach((el) => observer.observe(el));
    }

    function animateCount(element, target) {
        let current = 0;
        const duration = 1500;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out quart
            const eased = 1 - Math.pow(1 - progress, 4);
            current = Math.round(eased * target);
            element.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

    // ---- Contact Form ----
    function initContactForm() {
        const form = document.getElementById('contactForm');
        const status = document.getElementById('formStatus');
        const submitBtn = document.getElementById('submitBtn');

        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('contactName').value;
            const email = document.getElementById('contactEmail').value;
            const message = document.getElementById('contactMessage').value;

            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>Sending...</span>';
            status.textContent = '';
            status.className = 'form__status';

            try {
                const csrfToken = getCookie('csrftoken');
                const response = await fetch('/api/contact/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': csrfToken,
                    },
                    body: JSON.stringify({ name, email, message }),
                });

                const data = await response.json();

                if (data.success) {
                    status.textContent = data.message;
                    status.className = 'form__status form__status--success';
                    form.reset();
                } else {
                    status.textContent = data.error || 'Something went wrong.';
                    status.className = 'form__status form__status--error';
                }
            } catch (err) {
                status.textContent = 'Network error. Please try again.';
                status.className = 'form__status form__status--error';
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML =
                    '<span>Send Message</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>';
            }
        });
    }

    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === name + '=') {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    // ---- Smooth Scroll for anchor links ----
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }

    // ---- Fluid Cursor Glow Aurora Follower ----
    function initCursorFlowFollower() {
        const follower = document.getElementById('cursorFlowGlow');
        if (!follower) return;

        let targetX = window.innerWidth / 2;
        let targetY = window.innerHeight / 2;
        let currentX = targetX;
        let currentY = targetY;
        let isVisible = false;

        window.addEventListener('mousemove', (e) => {
            targetX = e.clientX;
            targetY = e.clientY;
            if (!isVisible) {
                follower.style.opacity = '1';
                isVisible = true;
            }
        });

        document.addEventListener('mouseleave', () => {
            follower.style.opacity = '0';
            isVisible = false;
        });

        // Bloom when hovering over interactive elements
        const interactiveElements = document.querySelectorAll(
            '.glass-card, .btn, .nav__link, .nav__social, .skill-tag, .contact__link, .pub-card__link'
        );

        interactiveElements.forEach((el) => {
            el.addEventListener('mouseenter', () => {
                follower.classList.add('cursor-flow-glow--active');
            });
            el.addEventListener('mouseleave', () => {
                follower.classList.remove('cursor-flow-glow--active');
            });
        });

        function loop() {
            currentX += (targetX - currentX) * 0.12;
            currentY += (targetY - currentY) * 0.12;
            follower.style.transform = `translate3d(${currentX.toFixed(1)}px, ${currentY.toFixed(1)}px, 0) translate(-50%, -50%)`;
            requestAnimationFrame(loop);
        }
        loop();
    }

    // ---- High-End 3D Fluid Card Tilt & Parallax Flow ----
    function initFluidCardTilt() {
        const cards = document.querySelectorAll(
            '.glass-card, .project-card, .pub-card, .timeline__card, .about__highlight'
        );

        cards.forEach((card) => {
            let isHovered = false;
            let rect = card.getBoundingClientRect();
            let targetRotX = 0;
            let targetRotY = 0;
            let currentRotX = 0;
            let currentRotY = 0;
            let currentElev = 0;
            let targetElev = 0;
            let animFrameId = null;

            const updateRect = () => {
                rect = card.getBoundingClientRect();
            };

            const render = () => {
                // Smooth physics lerp
                currentRotX += (targetRotX - currentRotX) * 0.11;
                currentRotY += (targetRotY - currentRotY) * 0.11;
                currentElev += (targetElev - currentElev) * 0.11;

                card.style.transform = `perspective(1100px) rotateX(${currentRotX.toFixed(2)}deg) rotateY(${currentRotY.toFixed(2)}deg) translateZ(${currentElev.toFixed(2)}px) scale3d(1.018, 1.018, 1.018)`;

                if (
                    isHovered ||
                    Math.abs(currentRotX) > 0.05 ||
                    Math.abs(currentRotY) > 0.05 ||
                    Math.abs(currentElev) > 0.05
                ) {
                    animFrameId = requestAnimationFrame(render);
                } else {
                    card.style.transform = '';
                    animFrameId = null;
                }
            };

            card.addEventListener('mouseenter', () => {
                isHovered = true;
                updateRect();
                targetElev = 10;
                if (!animFrameId) {
                    animFrameId = requestAnimationFrame(render);
                }
            });

            card.addEventListener('mousemove', (e) => {
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                // Set specular light position in CSS variables
                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);

                // Normalized coordinate (-0.5 to 0.5)
                const normX = x / rect.width - 0.5;
                const normY = y / rect.height - 0.5;

                targetRotX = -normY * 13;
                targetRotY = normX * 13;

                // 3D Parallax offset for floating child elements
                const floatingIcons = card.querySelectorAll(
                    '.project-card__icon, .timeline__icon, .about__highlight-icon, .project-card__arrow'
                );
                floatingIcons.forEach((icon) => {
                    icon.style.transform = `translate3d(${(normX * 14).toFixed(1)}px, ${(normY * 14).toFixed(1)}px, 28px)`;
                });

                const floatingTitles = card.querySelectorAll(
                    '.project-card__title, .pub-card__title, .timeline__title'
                );
                floatingTitles.forEach((title) => {
                    title.style.transform = `translate3d(${(normX * 8).toFixed(1)}px, ${(normY * 8).toFixed(1)}px, 18px)`;
                });

                const floatingTags = card.querySelectorAll(
                    '.project-card__tags, .pub-card__tags'
                );
                floatingTags.forEach((tags) => {
                    tags.style.transform = `translate3d(${(normX * 6).toFixed(1)}px, ${(normY * 6).toFixed(1)}px, 14px)`;
                });
            });

            card.addEventListener('mouseleave', () => {
                isHovered = false;
                targetRotX = 0;
                targetRotY = 0;
                targetElev = 0;

                // Reset child parallax
                const floatingChildren = card.querySelectorAll(
                    '.project-card__icon, .timeline__icon, .about__highlight-icon, .project-card__arrow, .project-card__title, .pub-card__title, .timeline__title, .project-card__tags, .pub-card__tags'
                );
                floatingChildren.forEach((child) => {
                    child.style.transform = '';
                });
            });

            window.addEventListener('resize', updateRect);
        });
    }

    // ---- Magnetic Flow on Buttons, Links & Tags ----
    function initMagneticFlowElements() {
        const magnetics = document.querySelectorAll(
            '.btn, .skill-tag, .project-card__tag, .pub-card__tag, .nav__social, .nav__link'
        );

        magnetics.forEach((el) => {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                const factor = el.classList.contains('btn') ? 0.22 : 0.16;
                el.style.transform = `translate3d(${x * factor}px, ${y * factor}px, 0)`;
            });

            el.addEventListener('mouseleave', () => {
                el.style.transform = '';
            });
        });
    }

    // ---- Title Word Cycling Glow ----
    function initTitleCycle() {
        const words = document.querySelectorAll('.hero__title-word');
        if (words.length === 0) return;
        let current = 0;

        function cycle() {
            words.forEach((w) => (w.style.color = ''));
            words[current].style.color = '#e8e8f0';
            current = (current + 1) % words.length;
        }

        setInterval(cycle, 2000);
    }


    // ---- Initialize Everything ----
    document.addEventListener('DOMContentLoaded', () => {
        // High-End Interactive Vector Flow Canvas
        const particleCanvas = document.getElementById('particles');
        if (particleCanvas) {
            new FluidFlowCanvas(particleCanvas);
            
            // Fade out the canvas on scroll down
            window.addEventListener('scroll', () => {
                const scrollY = window.scrollY;
                const windowHeight = window.innerHeight;
                const opacity = Math.max(0, 1 - (scrollY / (windowHeight * 1.1)));
                particleCanvas.style.opacity = opacity;
            });
        }

        // Fluid Cursor Aura Follower
        initCursorFlowFollower();

        // 3D Smooth Fluid Card Tilt & Specular Highlights
        initFluidCardTilt();

        // Magnetic Attraction on Tags, Buttons, Links
        initMagneticFlowElements();

        initScrollAnimations();
        initNavbar();
        initMobileMenu();
        initCounters();
        initContactForm();
        initSmoothScroll();
        initTitleCycle();
    });
})();
