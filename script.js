document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================
       1. Menú Hamburguesa Responsivo
       ========================================== */
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('nav-active');
            hamburger.classList.toggle('toggle');
        });
    }

    /* ==========================================
       2. Gestión del Banner de Cookies
       ========================================== */
    const cookieBanner = document.getElementById('cookie-banner');
    const btnAcceptCookies = document.getElementById('btn-accept-cookies');
    const btnConfigCookies = document.getElementById('btn-config-cookies');

    // Comprobar si ya se aceptaron (simulación con localStorage)
    if (!localStorage.getItem('cookiesAccepted') && cookieBanner) {
        // Mostramos el banner ya que por defecto está visible en el HTML, pero aseguramos
        cookieBanner.classList.remove('hidden');
    } else if (cookieBanner) {
        cookieBanner.classList.add('hidden');
    }

    if (btnAcceptCookies) {
        btnAcceptCookies.addEventListener('click', () => {
            localStorage.setItem('cookiesAccepted', 'true');
            cookieBanner.style.opacity = '0';
            setTimeout(() => {
                cookieBanner.classList.add('hidden');
            }, 300); // Espera para que la transición (si la añadimos) termine
        });
    }

    if (btnConfigCookies) {
        btnConfigCookies.addEventListener('click', () => {
            alert("Abre modal de configuración de cookies (Funcionalidad Simulada)");
        });
    }

    /* ==========================================
       3. FUNCIONALIDAD INTERACTIVA SORPRESA:
          Motor de "Diagnóstico Express"
       ========================================== */
    const quizButtons = document.querySelectorAll('.quiz-btn');
    const resultContainer = document.getElementById('quiz-result');

    // Base de datos de resultados y protocolos
    const recommendations = {
        'luminosidad': {
            title: 'Protocolo Glow Signature',
            desc: 'Tu piel necesita recargar energía. Te recomendamos nuestro tratamiento de limpieza profunda con infusión de Vitamina C y oxigenoterapia para recuperar la luz al instante.'
        },
        'firmeza': {
            title: 'Protocolo Body / Face Sculpt',
            desc: 'Para combatir la flacidez, el aliado perfecto es la Radiofrecuencia Médica. Estimularemos el colágeno y la elastina desde las capas más profundas para un efecto lifting.'
        },
        'manchas': {
            title: 'Protocolo Skin Resurfacing',
            desc: 'Nuestra tecnología IPL y los peelings químicos personalizados son la respuesta. Unificaremos tu tono combatiendo el fotoenvejecimiento de forma segura y eficaz.'
        }
    };

    if (quizButtons.length > 0 && resultContainer) {
        quizButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                // Quitar clase activa a todos los botones
                quizButtons.forEach(btn => btn.classList.remove('btn-primary'));
                quizButtons.forEach(btn => btn.classList.add('btn-outline'));
                
                // Activar el botón clicado
                e.target.classList.remove('btn-outline');
                e.target.classList.add('btn-primary');

                // Obtener preocupación
                const concern = e.target.getAttribute('data-concern');
                const data = recommendations[concern];

                // Efecto de aparición fluida
                resultContainer.classList.add('hidden');
                
                setTimeout(() => {
                    resultContainer.innerHTML = `
                        <h3>${data.title}</h3>
                        <p>${data.desc}</p>
                        <br>
                        <a href="#contacto" class="btn btn-primary">Reservar Diagnóstico Completo</a>
                    `;
                    resultContainer.classList.remove('hidden');
                }, 300); // pequeño retraso para efecto de animación
            });
        });
    }

    /* ==========================================
       4. Cambio sutil del NavBar al hacer scroll
       ========================================== */
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 5px 20px rgba(0,0,0,0.05)';
        } else {
            navbar.style.boxShadow = 'none';
        }
    });

});