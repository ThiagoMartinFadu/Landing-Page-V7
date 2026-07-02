document.addEventListener('DOMContentLoaded', () => {

    // ══════════════════════════════════════════
    // 1. SCROLL REVEAL — Intersection Observer
    // ══════════════════════════════════════════
    const revealEls = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    revealEls.forEach(el => revealObserver.observe(el));

    // ══════════════════════════════════════════
    // 2. HEADER — scroll state
    // ══════════════════════════════════════════
    const header = document.getElementById('site-header');
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });

    // ══════════════════════════════════════════
    // 3. MANUAL CAROUSEL
    // ══════════════════════════════════════════
    const slides = document.querySelectorAll('.carousel-slide');
    const dots   = document.querySelectorAll('.carousel-dot');
    let current  = 0;

    function goTo(index) {
        slides[current].classList.remove('active');
        dots[current].classList.remove('active');
        current = (index + slides.length) % slides.length;
        slides[current].classList.add('active');
        dots[current].classList.add('active');
    }

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            goTo(parseInt(dot.dataset.index));
        });
    });

    // Arrow buttons
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    if (prevBtn) {
        prevBtn.addEventListener('click', () => { goTo(current - 1); });
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', () => { goTo(current + 1); });
    }

    if (slides.length > 0) {
        goTo(0);
    }

    // ══════════════════════════════════════════
    // 4. FAQ ACCORDION
    // ══════════════════════════════════════════
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const q = item.querySelector('.faq-q');
        const a = item.querySelector('.faq-a');

        q.addEventListener('click', () => {
            const isOpen = item.classList.contains('active');

            // Close all
            faqItems.forEach(i => {
                i.classList.remove('active');
                const ans = i.querySelector('.faq-a');
                if (ans) ans.style.maxHeight = null;
            });

            // Open clicked if it was closed
            if (!isOpen) {
                item.classList.add('active');
                a.style.maxHeight = a.scrollHeight + 'px';
            }

            if (window.lucide) window.lucide.createIcons();
        });
    });

    // ══════════════════════════════════════════
    // 5. INTERACTIVE RADIAL GLOW (SPOTLIGHT)
    // ══════════════════════════════════════════
    const interactiveCards = document.querySelectorAll('.compromiso-item, .module-row, .accesorio-card, .faq-item');
    interactiveCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // ══════════════════════════════════════════
    // 6. INTERACTIVE DIAGRAM LABELS (BUTTONS)
    // ══════════════════════════════════════════
    const labels = document.querySelectorAll('.interactive-label');
    const mobileTitle = document.querySelector('.desc-card-title');
    const mobileText = document.querySelector('.desc-card-text');

    labels.forEach(label => {
        label.addEventListener('click', (e) => {
            const isClickable = e.target.closest('.part-btn-wrap') || e.target.closest('.part-num');
            if (isClickable) {
                const isActive = label.classList.contains('active');
                
                // Cerrar todos los demás labels
                labels.forEach(l => {
                    if (l !== label) l.classList.remove('active');
                });
                
                // Toggle active state
                const nextState = !isActive;
                label.classList.toggle('active', nextState);

                // Actualizar la tarjeta de descripción en móvil
                if (mobileTitle && mobileText) {
                    if (nextState) {
                        const titleText = label.querySelector('.part-num').textContent;
                        const descText = label.querySelector('.part-desc').textContent.trim();
                        mobileTitle.textContent = titleText;
                        mobileText.textContent = descText;
                    } else {
                        mobileTitle.textContent = "Selecciona un componente";
                        mobileText.textContent = "Toca los números para ver la información de cada pieza.";
                    }
                }
            }
        });
    });

    // Cerrar al hacer click fuera
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.interactive-label')) {
            labels.forEach(l => l.classList.remove('active'));
            if (mobileTitle && mobileText) {
                mobileTitle.textContent = "Selecciona un componente";
                mobileText.textContent = "Toca los números para ver la información de cada pieza.";
            }
        }
    });

    // ══════════════════════════════════════════
    // 7. CARD FLIP — Wacaco Ecosystem Cards
    // ══════════════════════════════════════════
    const accesorioCards = document.querySelectorAll('.accesorio-card');
    accesorioCards.forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('flipped');
        });
    });

    // ══════════════════════════════════════════
    // 8. MOBILE MENU INTERACTION
    // ══════════════════════════════════════════
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const siteHeader = document.getElementById('site-header');
    
    if (navToggle && siteHeader) {
        navToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = siteHeader.classList.contains('nav-open');
            siteHeader.classList.toggle('nav-open', !isOpen);
            navToggle.setAttribute('aria-expanded', !isOpen);
            
            // Cambiar ícono de Lucide
            const icon = navToggle.querySelector('i') || navToggle.querySelector('svg');
            if (icon) {
                icon.setAttribute('data-lucide', isOpen ? 'menu' : 'x');
                if (window.lucide) window.lucide.createIcons();
            }
        });

        // Cerrar menú al hacer click en cualquier enlace
        const navLinks = siteHeader.querySelectorAll('nav a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                siteHeader.classList.remove('nav-open');
                navToggle.setAttribute('aria-expanded', 'false');
                const icon = navToggle.querySelector('i') || navToggle.querySelector('svg');
                if (icon) {
                    icon.setAttribute('data-lucide', 'menu');
                    if (window.lucide) window.lucide.createIcons();
                }
            });
        });

        // Cerrar menú al hacer click fuera del header
        document.addEventListener('click', (e) => {
            if (siteHeader.classList.contains('nav-open') && !e.target.closest('#site-header')) {
                siteHeader.classList.remove('nav-open');
                navToggle.setAttribute('aria-expanded', 'false');
                const icon = navToggle.querySelector('i') || navToggle.querySelector('svg');
                if (icon) {
                    icon.setAttribute('data-lucide', 'menu');
                    if (window.lucide) window.lucide.createIcons();
                }
            }
        });
    }

    // ══════════════════════════════════════════
    // 9. SWIPE GESTURES FOR CAROUSEL
    // ══════════════════════════════════════════
    const carouselSection = document.getElementById('escenarios');
    if (carouselSection && typeof goTo === 'function') {
        let touchStartX = 0;
        let touchEndX = 0;

        carouselSection.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].clientX;
        }, { passive: true });

        carouselSection.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].clientX;
            handleSwipe();
        }, { passive: true });

        function handleSwipe() {
            const swipeThreshold = 50; // píxeles mínimos
            if (touchEndX < touchStartX - swipeThreshold) {
                // Deslizar izquierda -> Siguiente slide
                goTo(current + 1);
            } else if (touchEndX > touchStartX + swipeThreshold) {
                // Deslizar derecha -> Slide anterior
                goTo(current - 1);
            }
        }
    }

});
