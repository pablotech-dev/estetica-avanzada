document.addEventListener('DOMContentLoaded', () => {

    /* ========================================================
       1. EFECTO BLUR DEL NAVBAR EN SCROLL
    ======================================================== */
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    /* ========================================================
       2. MENÚ MÓVIL (HAMBURGUESA) CORREGIDO
    ======================================================== */
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links a');
    
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            const isOpen = hamburger.classList.toggle('open');
            navLinks.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', isOpen);
        });

        // Cierra el menú al hacer clic en un enlace (Solución al error de usabilidad)
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                hamburger.classList.remove('open');
                navLinks.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            });
        });
    }

    /* ========================================================
       3. ANIMACIONES REVEAL (INTERSECTION OBSERVER)
    ======================================================== */
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    };
    
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };
    
    const revealObserver = new IntersectionObserver(revealCallback, revealOptions);
    revealElements.forEach(el => revealObserver.observe(el));

    /* ========================================================
       4. ACORDEÓN DE PREGUNTAS FRECUENTES (FAQ)
    ======================================================== */
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            faqQuestions.forEach(q => {
                if (q !== question) {
                    q.classList.remove('active');
                    q.nextElementSibling.style.maxHeight = null;
                }
            });
            
            question.classList.toggle('active');
            const answer = question.nextElementSibling;
            if (question.classList.contains('active')) {
                answer.style.maxHeight = answer.scrollHeight + "px";
            } else {
                answer.style.maxHeight = null;
            }
        });
    });

    /* ========================================================
       5. DESLIZADOR INTERACTIVO "ANTES Y DESPUÉS"
    ======================================================== */
    const compareSlider = document.getElementById('compare-slider');
    const compareContainer = document.getElementById('compare-container');
    
    if (compareSlider && compareContainer) {
        compareSlider.addEventListener('input', (e) => {
            compareContainer.style.setProperty('--pos', `${e.target.value}%`);
        });
    }

    /* ========================================================
       6. BANNER DE COOKIES (RGPD)
    ======================================================== */
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookiesBtn = document.getElementById('accept-cookies');
    
    if (cookieBanner && !localStorage.getItem('cookiesAccepted')) {
        setTimeout(() => {
            cookieBanner.classList.add('show');
        }, 1500);
    }
    
    if (acceptCookiesBtn) {
        acceptCookiesBtn.addEventListener('click', () => {
            localStorage.setItem('cookiesAccepted', 'true');
            cookieBanner.classList.remove('show');
        });
    }

    /* ========================================================
       7. INTERCEPCIÓN DEL FORMULARIO DE CONTACTO
    ======================================================== */
    const contactForm = document.getElementById('contact-form');
    const successMsg = document.getElementById('form-success-msg');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Evita que la página se recargue
            
            // Ocultar botón y mostrar mensaje
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            submitBtn.style.display = 'none';
            successMsg.style.display = 'block';

            // Opcional: limpiar los campos
            contactForm.reset();
        });
    }
});