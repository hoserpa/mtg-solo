# MTG Practice

Una aplicación web estática para practicar partidas de **Magic: The Gathering** con tus propios mazos, añadiendo presión, restricciones y eventos configurables.

> La aplicación no intenta sustituir las reglas completas de MTG ni jugar como un oponente real. Su objetivo es funcionar como un **entrenador de partidas** que añade desafíos mientras juegas físicamente con tu mazo.

---

## ✨ ¿Cómo se verá el proyecto terminado?

La aplicación tendrá una interfaz pensada principalmente para móvil, sencilla y rápida de utilizar durante una partida.

El flujo principal será:

```text
┌───────────────────────────────┐
│           MTG PRACTICE        │
│                               │
│  Entrena tus partidas         │
│  contra una dificultad        │
│  configurable.                │
│                               │
│       [ NUEVA PARTIDA ]       │
│                               │
│       Última partida          │
│       Difícil · 14 turnos     │
└───────────────────────────────┘
```

Desde ahí:

```text
Nueva partida
      ↓
Seleccionar dificultad
      ↓
Configurar reglas
      ↓
Comenzar partida
      ↓
Jugar turnos
      ↓
Recibir eventos
      ↓
Resolver eventos
      ↓
Victoria / Derrota / Empate
```

---

# 🎮 Modos de dificultad

## Fácil

Pensado para practicar sin demasiadas distracciones.

- Vida del jugador.
- Vida de la CPU.
- Contador de turnos.
- Sin eventos.
- Sin presión adicional.

```text
┌─────────────────────────────┐
│           FÁCIL             │
│                             │
│  Practica tranquilamente.   │
│                             │
│  ❤️ CPU       20            │
│  ❤️ Tú        20            │
│                             │
│  Turno 7                    │
│                             │
│       [ COMENZAR ]          │
└─────────────────────────────┘
```

---

## Medio

Añade presión temporal mediante rondas.

- Vida del jugador.
- Vida de CPU.
- Turnos.
- Rondas.
- Sin eventos.

Ejemplo:

```text
Turno 7
Ronda 3

3 turnos por ronda
```

---

## Difícil

Es el modo de entrenamiento completo.

- Vidas.
- Turnos.
- Rondas.
- Eventos aleatorios.
- Eventos ponderados.
- Restricciones.
- Penalizaciones.

Ejemplo:

```text
┌─────────────────────────────┐
│ Turno 12          Ronda 4   │
├─────────────────────────────┤
│                             │
│          CPU                │
│          ❤️ 8               │
│                             │
├─────────────────────────────┤
│          EVENTO             │
│                             │
│   ⚔️ Recibes 3 de daño      │
│                             │
│       [ RESOLVER ]          │
├─────────────────────────────┤
│                             │
│         JUGADOR             │
│         ❤️ 14               │
│                             │
├─────────────────────────────┤
│                             │
│    [ SIGUIENTE TURNO ]      │
└─────────────────────────────┘
```

---

## Personalizado

Permite construir tu propio entrenamiento.

```text
┌─────────────────────────────┐
│       PERSONALIZADO         │
├─────────────────────────────┤
│ Vida jugador        [20]    │
│ Vida CPU            [20]    │
│                             │
│ ☑ Contador de turnos       │
│ ☑ Rondas                   │
│                             │
│ Turnos por ronda    [3]    │
│                             │
│ ☑ Eventos                  │
│                             │
│ Frecuencia                 │
│ ○ Cada turno               │
│ ○ Cada 2 turnos            │
│ ● Probabilidad             │
│                             │
│ Probabilidad        [50%]  │
│                             │
│ Eventos                    │
│ ☑ Daño                     │
│ ☑ Descartar                │
│ ☑ Destruir                 │
│ ☑ Restricciones             │
│ ☑ Eventos neutros          │
│                             │
│       [ COMENZAR ]         │
└─────────────────────────────┘
```

---

# ❤️ Contadores de vida

Los contadores estarán diseñados para poder modificarse rápidamente mientras se juega.

```text
┌───────────────────────────────┐
│             CPU               │
│                               │
│          ❤️ 17                │
│                               │
│     [-5] [-1] [+1] [+5]       │
│                               │
└───────────────────────────────┘
```

Y lo mismo para el jugador.

También se podrá introducir directamente una cantidad.

---

# 🔄 Turnos y rondas

El contador de turnos será el eje temporal de la partida.

```text
┌───────────────────────────────┐
│                               │
│          TURNO 12             │
│          RONDA 4              │
│                               │
│        ● ● ● ○ ○              │
│                               │
│       2 / 3 turnos            │
│                               │
└───────────────────────────────┘
```

Al completar los turnos configurados, se inicia automáticamente una nueva ronda.

---

# ⚡ Sistema de eventos

Los eventos serán uno de los elementos principales de la aplicación.

Cada evento tendrá:

- Nombre.
- Descripción.
- Categoría.
- Peso.
- Dificultad.
- Efecto.
- Resolución automática o manual.

Ejemplo:

```text
╔═══════════════════════════════╗
║           EVENTO              ║
║                               ║
║        ⚔️ ATAQUE              ║
║                               ║
║   Recibes 3 puntos de daño.   ║
║                               ║
║          [ OK ]               ║
╚═══════════════════════════════╝
```

---

# 📜 Eventos iniciales

La primera versión tendrá eventos como:

### Daño

> Recibes 3 puntos de daño.

### Descartar

> Descarta 2 cartas.

### Destruir

> Destruye una carta.

### Restricción de combate

> No puedes atacar este turno.

### Destruir permanente

> Destruye una criatura o artefacto.

### Sacrificio

> Sacrifica una criatura.

### Nada

> No ocurre nada este turno.

---

# 🧩 Eventos automáticos y manuales

No todos los eventos necesitan que la aplicación conozca el estado real de la partida.

Por ejemplo:

### Automático

```text
⚔️ Recibes 3 de daño.

Vida:
17 → 14
```

La aplicación modifica automáticamente la vida.

### Manual

```text
💀 Destruye una criatura.

La aplicación no necesita conocer
qué criatura tienes en mesa.

Realiza la acción en tu partida
y pulsa:

        [ RESOLVER ]
```

Esto permite que la aplicación sea útil jugando con cartas físicas sin tener que implementar todo el juego de MTG.

---

# 📜 Historial

Durante la partida habrá un historial compacto.

```text
HISTORIAL

Turno 12
⚔️ Recibes 3 de daño

Turno 11
— Sin evento

Turno 10
🗑️ Descarta 1 carta

Turno 9
💀 Destruye una criatura
```

El historial permitirá revisar rápidamente qué presión ha sufrido la partida.

---

# 🏆 Final de partida

Cuando uno de los jugadores llega a 0 vidas, se mostrará una pantalla de resultado.

### Victoria

```text
╔═══════════════════════════════╗
║                               ║
║          🏆 VICTORIA          ║
║                               ║
║       CPU: 0 vidas            ║
║       Tú: 7 vidas             ║
║                               ║
║       18 turnos               ║
║       6 rondas                ║
║       9 eventos               ║
║                               ║
║     [ JUGAR DE NUEVO ]        ║
║                               ║
║    [ CAMBIAR CONFIGURACIÓN ]  ║
╚═══════════════════════════════╝
```

También habrá pantallas equivalentes para derrota y empate.

---

# 📊 Estadísticas

La aplicación podrá conservar estadísticas localmente.

Ejemplo:

```text
ESTADÍSTICAS

Partidas       42
Victorias      24
Derrotas       16
Empates         2

Win rate       57%

Turnos         386
Eventos        194
```

Todo se almacenará localmente en el navegador.

No será necesaria una cuenta.

---

# 💾 Persistencia

La configuración utilizada podrá recuperarse automáticamente.

Por ejemplo:

```text
Última configuración

Difícil
❤️ Jugador: 20
❤️ CPU: 20
Rondas: 3 turnos
Eventos: 50%
```

Si se cierra la aplicación, al volver podrá continuar utilizando la misma configuración.

---

# 📱 Diseño responsive

La aplicación estará diseñada **mobile-first**.

En móvil:

```text
┌─────────────────────────┐
│ Turno 12      Ronda 4   │
├─────────────────────────┤
│                         │
│          CPU            │
│          ❤️ 17          │
│                         │
│    [-1]       [+1]      │
│                         │
├─────────────────────────┤
│                         │
│        EVENTO           │
│                         │
│   Recibes 3 de daño     │
│                         │
├─────────────────────────┤
│                         │
│        TÚ               │
│        ❤️ 14            │
│                         │
│    [-1]       [+1]      │
│                         │
├─────────────────────────┤
│                         │
│ [ SIGUIENTE TURNO ]     │
│                         │
└─────────────────────────┘
```

En desktop se podrá utilizar un layout más amplio, pero manteniendo el foco en la información esencial.

---

# ♿ Accesibilidad

La aplicación estará diseñada para poder utilizarse:

- Con teclado.
- Con lector de pantalla.
- Sin depender exclusivamente del color.
- Con controles táctiles grandes.
- Con animaciones reducidas cuando el usuario lo solicite.

Los cambios importantes utilizarán regiones `aria-live` para comunicar:

```text
"Turno 13"

"Evento: recibes 3 puntos de daño"

"Victoria"
```

---

# 📲 PWA

La aplicación podrá instalarse en móvil o escritorio como una aplicación.

Una vez cargada, podrá funcionar sin conexión.

```text
Navegador
    ↓
Instalar MTG Practice
    ↓
📱 MTG Practice
    ↓
Abrir
    ↓
Jugar offline
```

No será necesario un backend para jugar.

---

# 🏗️ Arquitectura

La aplicación estará organizada alrededor de una separación clara:

```text
┌───────────────────────────────┐
│             UI                │
│        React Components       │
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│         App / Store           │
│       Estado de partida       │
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│        Game Engine            │
│   turnos · vidas · rondas     │
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│        Event Engine           │
│ selección · pesos · efectos   │
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│        Pure Functions         │
│       lógica testeable        │
└───────────────────────────────┘
```

La lógica de juego no dependerá de React ni del DOM.

Esto permitirá probar el motor de forma independiente.

---

# 🧱 Estructura del proyecto

La versión terminada tendrá aproximadamente esta estructura:

```text
mtg-practice/
│
├── public/
│   ├── favicon.svg
│   ├── icons/
│   └── manifest.webmanifest
│
├── src/
│   │
│   ├── app/
│   │   ├── App.tsx
│   │   ├── routes.ts
│   │   └── providers.tsx
│   │
│   ├── components/
│   │   ├── LifeCounter/
│   │   ├── TurnCounter/
│   │   ├── RoundCounter/
│   │   ├── EventCard/
│   │   ├── EventHistory/
│   │   ├── DifficultySelector/
│   │   ├── GameControls/
│   │   └── GameResult/
│   │
│   ├── features/
│   │   ├── game/
│   │   │   ├── gameReducer.ts
│   │   │   ├── gameSelectors.ts
│   │   │   └── gameTypes.ts
│   │   │
│   │   ├── events/
│   │   │   ├── eventEngine.ts
│   │   │   ├── eventRegistry.ts
│   │   │   ├── eventSelector.ts
│   │   │   └── eventTypes.ts
│   │   │
│   │   └── settings/
│   │       ├── settingsStore.ts
│   │       └── settingsTypes.ts
│   │
│   ├── data/
│   │   ├── difficulties.ts
│   │   └── events.ts
│   │
│   ├── hooks/
│   │   ├── useGame.ts
│   │   └── useLocalStorage.ts
│   │
│   ├── lib/
│   │   ├── random.ts
│   │   ├── validation.ts
│   │   └── time.ts
│   │
│   ├── styles/
│   │   ├── globals.css
│   │   └── variables.css
│   │
│   ├── main.tsx
│   └── vite-env.d.ts
│
├── tests/
│   ├── game/
│   ├── events/
│   └── validation/
│
├── .github/
│   └── workflows/
│       └── deploy.yml
│
├── .gitignore
├── eslint.config.js
├── package.json
├── playwright.config.ts
├── tsconfig.json
├── vite.config.ts
├── README.md
├── ROADMAP.md
└── SPECS.md
```

---

# 🧠 Filosofía del proyecto

La aplicación no pretende convertirse inicialmente en un simulador completo de MTG.

El concepto es:

> **Tú juegas tu mazo. MTG Practice pone a prueba tu capacidad para adaptarte.**

Por ejemplo:

```text
Tú juegas normalmente
        ↓
Terminas tu turno
        ↓
MTG Practice
        ↓
"Descarta 1 carta"
        ↓
Tú realizas la acción
        ↓
Siguiente turno
        ↓
"Recibes 3 de daño"
        ↓
Tú continúas jugando
```

La aplicación actúa como una especie de **director de entrenamiento**.

---

# 🚀 Futuras versiones

## v1.x — Entrenamiento

Se podrán añadir:

- Más eventos.
- Temporizador.
- Presets.
- Estadísticas avanzadas.
- Escenarios.
- Semillas reproducibles.
- Objetivos de supervivencia.

Ejemplo:

```text
ESCENARIO

🔥 SUPERVIVENCIA

Sobrevive durante 10 turnos.

Vida inicial: 20
Eventos: Difícil

Objetivo:
Llegar al turno 10 con
al menos 5 vidas.

[ COMENZAR ]
```

---

## v2 — Tus mazos

La aplicación podrá incorporar listas de mazos.

```text
MIS MAZOS

┌─────────────────────────────┐
│ 🔵 Azorius Control          │
│ 60 cartas                   │
│                             │
│ [ ENTRENAR ]                │
└─────────────────────────────┘

┌─────────────────────────────┐
│ 🔴 Mono Red                 │
│ 60 cartas                   │
│                             │
│ [ ENTRENAR ]                │
└─────────────────────────────┘
```

Esto permitirá que determinados eventos interactúen con:

- Biblioteca.
- Mano.
- Cementerio.
- Campo de batalla.
- Exilio.

---

## v3 — Entrenamiento avanzado

El objetivo final podría evolucionar hacia:

```text
             MTG PRACTICE
                   │
       ┌───────────┼───────────┐
       │           │           │
    Partidas    Escenarios    Mazos
       │           │           │
       └───────────┼───────────┘
                   │
            Entrenamiento
                   │
          ┌────────┴────────┐
          │                 │
       Estadísticas     Repeticiones
```

Con posibilidades como:

- Puzzles de decisión.
- Escenarios específicos.
- Dificultad adaptativa.
- Estadísticas por mazo.
- Repetición de escenarios.
- Configuraciones compartibles.
- Entrenamientos personalizados.

---

# 🛠️ Stack

- **React**
- **TypeScript**
- **Vite**
- **CSS**
- **Vitest**
- **Playwright**
- **PWA**
- **localStorage**

No se necesita backend para la primera versión.

---

# 🧪 Calidad

Antes de considerar terminada una versión:

```text
npm run lint
       ↓
npm run typecheck
       ↓
npm run test
       ↓
npm run build
       ↓
npm run test:e2e
       ↓
🚀 Deploy
```

---

# 📦 Desarrollo local

## Instalar

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

## Tests

```bash
npm run test
```

## Typecheck

```bash
npm run typecheck
```

## Lint

```bash
npm run lint
```

## Build

```bash
npm run build
```

## Preview del build

```bash
npm run preview
```

---

# 🎯 Objetivo final

El proyecto terminado debe sentirse como una herramienta que puedas abrir en el móvil antes de empezar una partida y utilizar sin pensar demasiado en la aplicación.

La experiencia ideal es:

```text
Abres MTG Practice
        ↓
Seleccionas "Difícil"
        ↓
[ COMENZAR ]
        ↓
Juegas con tu mazo
        ↓
MTG Practice controla turnos
        ↓
Aparecen eventos
        ↓
Resuelves las penalizaciones
        ↓
Sigues jugando
        ↓
🏆 Ganas / 💀 Pierdes
        ↓
Ves tus estadísticas
        ↓
[ JUGAR DE NUEVO ]
```

**Simple de usar. Difícil de dominar.**
