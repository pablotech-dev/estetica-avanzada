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
       2. MENÚ MÓVIL (HAMBURGUESA)
    ======================================================== */
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('open');
            navLinks.classList.toggle('active');
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
                observer.unobserve(entry.target); // Solo anima una vez
            }
        });
    };
    
    const revealOptions = {
        threshold: 0.15, // Activa cuando el 15% del elemento es visible
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
            // Cierra las demás
            faqQuestions.forEach(q => {
                if (q !== question) {
                    q.classList.remove('active');
                    q.nextElementSibling.style.maxHeight = null;
                }
            });
            
            // Alterna la actual
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
       5. DESLIZADOR INTERACTIVO "ANTES Y DESPUÉS" (EXTRA)
    ======================================================== */
    const compareSlider = document.getElementById('compare-slider');
    const compareContainer = document.getElementById('compare-container');
    
    if (compareSlider && compareContainer) {
        compareSlider.addEventListener('input', (e) => {
            // Actualiza la variable CSS --pos en tiempo real
            compareContainer.style.setProperty('--pos', `${e.target.value}%`);
        });
    }

    /* ========================================================
       6. BANNER DE COOKIES (RGPD)
    ======================================================== */
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookiesBtn = document.getElementById('accept-cookies');
    
    // Simula comprobación en LocalStorage
    if (!localStorage.getItem('cookiesAccepted')) {
        setTimeout(() => {
            cookieBanner.classList.add('show');
        }, 1500); // Aparece suavemente a los 1.5s
    }
    
    acceptCookiesBtn.addEventListener('click', () => {
        localStorage.setItem('cookiesAccepted', 'true');
        cookieBanner.classList.remove('show');
    });
});