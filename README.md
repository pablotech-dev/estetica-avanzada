# Nácar · Demo web para centros de estética

Demo genérica para presentar a centros de estética. Marca ficticia («Nácar») y datos reales pendientes marcados entre corchetes: `[CIUDAD]`, `[TELÉFONO]`, `[PRECIO]`, etc.

## Páginas
- `index.html` — portada con tratamiento estrella, tratamientos por categorías (facial, corporal, spa), reserva online, tarjetas regalo de Navidad, reseñas, FAQ y contacto.
- `novias.html` — plan de belleza para novias con calculadora de cuenta atrás, packs y formulario de cita.

## Cómo adaptarla a un centro
1. Sustituye los marcadores `[ ... ]` en los HTML.
2. En `script.js`, bloque `CONFIG`: número de WhatsApp, horario por días y festivos.
3. Los tratamientos se editan solo en `index.html` (atributos `data-*` de cada `.t-item`); la reserva y la tarjeta regalo los leen automáticamente.
4. Cambia las fotos de Unsplash por fotos reales del centro.

HTML, CSS y JavaScript sin dependencias: abre `index.html` en el navegador.
