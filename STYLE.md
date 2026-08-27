# STYLE.md

## Objetivo

Este documento define el estilo visual de **MTG Practice**.

La interfaz debe transmitir la misma sensación que una carta o un tablero clásico de **Magic: The Gathering**: solemne, atemporal y con textura de "objeto físico", pero sin renunciar a la usabilidad ni al enfoque mobile-first definido en `CODESTYLE.md`.

El estilo visual no es decorativo: debe ayudar a leer la información crítica de una partida (vida, turno, eventos) de un vistazo, igual que una carta bien diseñada permite leer su coste y su texto sin esfuerzo.

---

## 1. Referencia estética

La inspiración es el **marco clásico de las cartas de Magic** (pre-2003, "old frame"), no el marco moderno minimalista. Elementos característicos a evocar:

- Bordes gruesos, tipo marco, alrededor de los paneles principales.
- Cajas de texto con fondo tipo pergamino/papel envejecido para el contenido narrativo (eventos, resultados).
- Separación clara entre "caja de arte", "caja de nombre/título" y "caja de texto", igual que en una carta.
- Simbología heráldica sobria: líneas doradas o bronce, esquinas ornamentadas discretas, nunca ruido excesivo.
- Sensación de "objeto de colección", no de app genérica.

No se busca replicar literalmente una carta, sino tomar prestado su lenguaje visual para estructurar la UI (paneles, cabeceras, contadores).

---

## 2. Paleta de colores

Basarse en los cinco colores de maná y en los tonos neutros clásicos del marco de carta:

- **Fondo del marco / estructura:** negro/marrón muy oscuro (tipo cuero viejo o madera oscurecida).
- **Superficie de texto:** beige/crema tipo pergamino (`#F2E6D0` aprox.) para cajas de texto y eventos.
- **Acentos y bordes:** dorado/bronce (`#C9A227` aprox.) para líneas, separadores y elementos de énfasis.
- **Colores de maná** como acentos funcionales, no como fondo general:
  - Blanco `#F8F6D8`
  - Azul `#0E68AB`
  - Negro `#150B00`
  - Rojo `#D3202A`
  - Verde `#00733E`
- **Estados de vida/daño:** rojo intenso para daño o vida crítica, verde o dorado para vida estable/curación.

Evitar paletas planas de "app SaaS" (grises fríos, azules corporativos genéricos). El contraste debe seguir cumpliendo los requisitos de accesibilidad de `CODESTYLE.md` aunque el fondo sea oscuro.

---

## 3. Tipografía

- **Títulos y cabeceras** (nombre de pantalla, "Turno", "Ronda", nombre de evento): tipografía con carácter, tipo serif ornamental o "display", que recuerde a la tipografía de título de una carta clásica (ej. familias tipo _Beleren_, o alternativas web-safe con espíritu similar: serif con trazos marcados).
- **Cuerpo de texto** (reglas, descripciones de evento, botones): tipografía legible y sobria, sans-serif o serif simple, priorizando legibilidad en móvil sobre fidelidad estética.
- No sacrificar legibilidad por estética: los números de vida y turno deben leerse instantáneamente, incluso con poca luz o pantalla pequeña.

---

## 4. Componentes clave

### Contadores de vida (`LifeCounter`)

- Deben evocar el símbolo de corazón/vida usado tradicionalmente, con un marco tipo medallón o sello.
- Cambios de vida (subir/bajar) pueden acompañarse de una transición sutil tipo "brillo" dorado o rojo, no de animaciones bruscas.

### Tarjetas de evento (`EventCard`)

- Deben construirse visualmente como una carta: caja de nombre superior, "arte" o icono central, caja de texto tipo pergamino con la descripción del evento, y una línea inferior tipo "tipo de línea" (ej. "Evento — Presión").
- El borde exterior debe usar el marco oscuro con línea dorada.

### Botones y acciones (`GameControls`)

- Deben sentirse como "sellos" o "botones de pergamino/metal", con bordes definidos, no botones planos tipo Material Design.
- El estado de pulsación debe dar feedback visual claro (hundimiento, brillo o cambio de tono), cumpliendo el punto 21 de `CODESTYLE.md`.

### Paneles de turno/ronda (`TurnCounter`, `RoundCounter`)

- Estilo de "placa" o "escudo" superior, con el número destacado en tipografía de título.

---

## 5. Lo que se debe evitar

- Interfaces planas tipo dashboard corporativo (Material Design puro, Bootstrap por defecto).
- Colores neón o paletas "gamer RGB".
- Iconografía genérica sin relación con la identidad de Magic (emojis genéricos salvo excepciones ya definidas en el README, como ❤️ para vida en prototipos).
- Efectos y animaciones excesivos que distraigan durante una partida real.
- Texturas o imágenes con derechos de autor de Wizards of the Coast: la inspiración es de **estilo**, no de assets ni artwork protegido. Todo el arte, iconografía y textura debe ser original o de librerías libres de derechos.

---

## 6. Prioridad frente a otras reglas

Ante conflicto entre estética y usabilidad/accesibilidad/mobile-first (definidos en `CODESTYLE.md`), gana siempre la usabilidad. El estilo clásico de MTG es un lenguaje visual, no una excusa para sacrificar:

- Contraste de texto.
- Tamaño de áreas táctiles.
- Velocidad de lectura de vida, turno y eventos durante una partida real.
