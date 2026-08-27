# SPECS.md — MTG Deck Practice App

## 1. Objetivo

Aplicación web estática para practicar partidas de Magic: The Gathering contra un oponente simulado.

La aplicación no pretende implementar las reglas completas de MTG. Su objetivo es proporcionar una capa de entrenamiento configurable que simule presión sobre el jugador mediante:

- Contador de vidas del jugador y de la CPU.
- Contador de turnos/rondas.
- Eventos aleatorios que afectan a la partida.
- Niveles de dificultad predefinidos.
- Modo personalizado.
- Persistencia local de configuración y estadísticas.
- Funcionamiento completamente offline una vez cargados los assets.

No habrá backend, autenticación ni base de datos remota en la primera versión.

---

## 2. Alcance funcional

### 2.1 Modos de dificultad

#### Fácil

Activa únicamente:

- Vidas de CPU.
- Contador de vida del jugador.
- Contador de turnos.
- Sin eventos.
- Sin rondas obligatorias.

#### Medio

Activa:

- Vidas de CPU.
- Contador de vida del jugador.
- Contador de turnos.
- Rondas/objetivos de ronda.
- Sin eventos.

#### Difícil

Activa:

- Vidas de CPU.
- Contador de vida del jugador.
- Contador de turnos.
- Rondas.
- Eventos.

#### Personalizado

Permite seleccionar individualmente:

- Vida inicial del jugador.
- Vida inicial de la CPU.
- Activar/desactivar contador de turnos.
- Activar/desactivar rondas.
- Número de turnos por ronda.
- Activar/desactivar eventos.
- Frecuencia de eventos.
- Pool de eventos.
- Daño mínimo/máximo de eventos.
- Cantidad mínima/máxima de cartas afectadas.
- Posibilidad de eventos durante el turno del jugador.
- Dificultad/rareza de eventos.

La configuración personalizada debe validarse antes de iniciar la partida.

---

## 3. Conceptos de partida

### 3.1 Jugador

Estado mínimo:

- `life`
- `initialLife`
- `turnsPlayed`
- `round`
- `wins`
- `losses`

### 3.2 CPU

Estado mínimo:

- `life`
- `initialLife`

La CPU no necesita representar un mazo real en la primera versión.

### 3.3 Turno

Un turno pertenece al jugador.

Cada turno:

1. Incrementa el contador de turnos.
2. Comprueba si comienza una nueva ronda.
3. Comprueba si corresponde lanzar un evento.
4. Resuelve el evento si existe.
5. Actualiza la interfaz.
6. Comprueba condiciones de victoria/derrota.

### 3.4 Ronda

Una ronda representa un bloque configurable de turnos.

Ejemplo:

- 3 turnos = 1 ronda.
- Turnos 1–3 → ronda 1.
- Turnos 4–6 → ronda 2.
- etc.

La configuración debe permitir modificar el tamaño de ronda.

---

## 4. Condiciones de finalización

### Victoria

La partida termina cuando:

- La vida de la CPU llega a `0` o menos.

### Derrota

La partida termina cuando:

- La vida del jugador llega a `0` o menos.

### Empate

En caso de que una misma acción provoque simultáneamente:

- `player.life <= 0`
- `cpu.life <= 0`

La aplicación debe declarar empate.

Las condiciones deben evaluarse siempre después de resolver una acción que pueda modificar vidas.

---

## 5. Controles principales

### Jugador

Debe poder:

- Añadir vida.
- Quitar vida.
- Reiniciar vida al valor inicial.
- Mostrar vida actual.
- Mostrar vida inicial opcionalmente.

### CPU

Debe poder:

- Añadir vida.
- Quitar vida.
- Reiniciar vida.
- Aplicar daño desde un evento.
- Mostrar vida actual.

### Turnos

Controles:

- `Siguiente turno`.
- Opcionalmente `Turno anterior` en una futura versión.
- Mostrar turno actual.
- Mostrar ronda actual.
- Mostrar progreso de la ronda.

El botón `Siguiente turno` será la acción principal de la aplicación.

---

## 6. Sistema de eventos

Los eventos representan situaciones adversas o aleatorias que obligan al jugador a modificar el estado de su partida.

Cada evento debe tener:

```ts
type EventDefinition = {
  id: string;
  name: string;
  description: string;
  category: EventCategory;
  weight: number;
  enabled: boolean;
  effect: EventEffect;
};
```

### Categorías

```ts
type EventCategory =
  | "damage"
  | "discard"
  | "destroy"
  | "restriction"
  | "neutral"
  | "resource"
  | "combat";
```

### Eventos iniciales

#### Ataque

Ejemplo:

> La CPU ataca. Recibes 3 puntos de daño.

Efecto:

```ts
{
  type: "damagePlayer",
  amount: 3
}
```

El daño debe poder ser fijo o aleatorio.

#### Destruye X cartas

Ejemplo:

> Destruye 2 cartas de tu elección.

Efecto:

```ts
{
  type: "destroyCards",
  amount: 2
}
```

La app no necesita conocer físicamente las cartas del mazo en la primera versión. El evento puede funcionar como penalización manual.

#### Descarta X cartas

Ejemplo:

> Descarta 2 cartas.

Efecto:

```ts
{
  type: "discardCards",
  amount: 2
}
```

#### No puedes atacar

Ejemplo:

> Durante este turno no puedes atacar.

Efecto:

```ts
{
  type: "restriction",
  restriction: "cannotAttack",
  duration: 1
}
```

#### No pasa nada

Ejemplo:

> No ocurre nada este turno.

Efecto:

```ts
{
  type: "none";
}
```

#### Destruye criatura o artefacto

Ejemplo:

> Destruye una criatura o artefacto que controles.

Efecto:

```ts
{
  type: "destroyPermanent",
  permanentTypes: ["creature", "artifact"],
  amount: 1
}
```

---

## 7. Eventos adicionales recomendados

Para que el entrenamiento sea más variado, se recomienda añadir:

### Pierdes vida

> Pierdes 2 vidas.

### La CPU gana vida

> La CPU gana 4 vidas.

### Descarta y roba

> Descarta 1 carta y roba 1.

### Roba menos

> En tu próximo turno, roba 1 carta menos.

### Coste adicional

> El próximo hechizo que lances cuesta 2 más.

### No puedes lanzar hechizos

> No puedes lanzar hechizos no criatura durante este turno.

### Bloqueo

> No puedes bloquear con una criatura este turno.

### Exilio

> Exilia una carta de tu cementerio.

### Cementerio

> Mueve una carta aleatoria de tu cementerio al exilio.

### Sacrificio

> Sacrifica una criatura.

### Presión temporal

> Tienes 30 segundos para terminar tu turno.

Este último evento requiere un temporizador y debe ser opcional.

---

## 8. Sistema de pesos de eventos

Los eventos no deben seleccionarse mediante una distribución uniforme obligatoria.

Cada evento tendrá un peso:

```ts
type WeightedEvent = {
  eventId: string;
  weight: number;
};
```

Ejemplo:

```ts
[
  { eventId: "damage-3", weight: 30 },
  { eventId: "discard-1", weight: 20 },
  { eventId: "destroy-card-1", weight: 15 },
  { eventId: "cannot-attack", weight: 10 },
  { eventId: "nothing", weight: 25 },
];
```

La selección será proporcional al peso.

La suma de pesos no necesita ser 100.

---

## 9. Frecuencia de eventos

La configuración debe permitir:

- Cada turno.
- Cada 2 turnos.
- Cada 3 turnos.
- Aleatorio.
- Porcentaje por turno.

Ejemplo:

```ts
type EventFrequency =
  | {
      type: "everyTurn";
    }
  | {
      type: "everyNTurns";
      turns: number;
    }
  | {
      type: "chance";
      probability: number;
    };
```

Para evitar una partida excesivamente caótica, se recomienda establecer un límite máximo de eventos consecutivos.

Configuración:

```ts
maxConsecutiveEvents: number;
```

Valor recomendado: `2`.

---

## 10. Motor de eventos

El motor de eventos debe estar separado de la UI.

Interfaz conceptual:

```ts
interface EventEngine {
  shouldTrigger(state: GameState): boolean;
  selectEvent(
    state: GameState,
    events: EventDefinition[],
  ): EventDefinition | null;
  resolveEvent(event: EventDefinition, state: GameState): GameState;
}
```

Ventajas:

- Facilita las pruebas.
- Permite añadir eventos sin modificar la interfaz.
- Permite crear diferentes algoritmos de dificultad.
- Permite añadir eventos futuros sin acoplarlos a componentes.

---

## 11. Modelo de datos

### GameConfig

```ts
type GameConfig = {
  mode: Difficulty;
  playerInitialLife: number;
  cpuInitialLife: number;

  turnsEnabled: boolean;

  roundsEnabled: boolean;
  turnsPerRound: number;

  eventsEnabled: boolean;
  eventFrequency: EventFrequency;
  maxConsecutiveEvents: number;

  enabledEventIds: string[];
};
```

### GameState

```ts
type GameState = {
  status: "setup" | "playing" | "won" | "lost" | "draw";

  playerLife: number;
  cpuLife: number;

  turn: number;
  round: number;

  currentEvent: ActiveEvent | null;

  restrictions: Restriction[];

  eventHistory: EventHistoryEntry[];

  startedAt: string;
  endedAt?: string;
};
```

### ActiveEvent

```ts
type ActiveEvent = {
  eventId: string;
  generatedAtTurn: number;
  resolved: boolean;
};
```

### EventHistoryEntry

```ts
type EventHistoryEntry = {
  turn: number;
  eventId: string;
  timestamp: string;
};
```

---

## 12. Estado de la aplicación

Se recomienda utilizar un único estado principal y actualizaciones inmutables.

Ejemplo:

```ts
type AppState = {
  screen: "home" | "setup" | "game" | "result" | "settings";
  config: GameConfig;
  game: GameState | null;
};
```

No debe existir estado duplicado entre componentes.

La UI debe derivarse del estado.

---

## 13. Máquina de estados

Estados principales:

```text
HOME
  ↓
SETUP
  ↓
PLAYING
  ├── NEXT_TURN
  ├── EVENT
  ├── WIN
  ├── LOSS
  └── DRAW
       ↓
     RESULT
       ↓
     SETUP / HOME
```

### Reglas

- No se puede modificar una partida terminada.
- No se puede iniciar una partida con configuración inválida.
- Un evento activo debe resolverse antes de continuar si el evento requiere interacción.
- Reiniciar partida debe crear un `GameState` completamente nuevo.

---

## 14. Arquitectura técnica

### Tipo de aplicación

SPA estática.

No requiere servidor de aplicación.

### Stack recomendado

- TypeScript.
- Vite.
- React.
- CSS moderno.
- Vitest para tests.
- ESLint.
- Prettier.

No utilizar un framework backend.

### Motivo

El proyecto es principalmente una interfaz interactiva con lógica local. React + TypeScript proporciona:

- Componentización.
- Tipado.
- Estado predecible.
- Facilidad para probar el motor.
- Build estático.

---

## 15. Estructura del proyecto

```text
mtg-practice/
├── public/
│   ├── favicon.svg
│   └── manifest.webmanifest
│
├── src/
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
├── .gitignore
├── eslint.config.js
├── package.json
├── tsconfig.json
├── vite.config.ts
├── README.md
└── SPECS.md
```

---

## 16. Componentes de UI

### Home

Debe mostrar:

- Nombre de la aplicación.
- Botón `Nueva partida`.
- Última configuración utilizada.
- Estadísticas básicas opcionales.

### Setup

Debe mostrar:

- Selección de dificultad.
- Resumen de reglas activas.
- Configuración personalizada cuando corresponda.
- Botón `Comenzar`.

### Game

Layout recomendado:

```text
┌─────────────────────────────────┐
│ Turno 12             Ronda 4    │
├─────────────────────────────────┤
│                                 │
│           CPU                   │
│           17 ❤️                 │
│                                 │
├─────────────────────────────────┤
│        EVENTO                   │
│  "Descarta 2 cartas"            │
│                                 │
├─────────────────────────────────┤
│                                 │
│          JUGADOR                │
│          14 ❤️                  │
│                                 │
├─────────────────────────────────┤
│       [ SIGUIENTE TURNO ]       │
└─────────────────────────────────┘
```

### Result

Mostrar:

- Victoria / derrota / empate.
- Turnos jugados.
- Rondas alcanzadas.
- Eventos sufridos.
- Duración.
- Botón `Jugar de nuevo`.
- Botón `Cambiar configuración`.

---

## 17. UX del contador de vidas

El contador debe permitir cambios rápidos.

Recomendación:

```text
[-5] [-1]   20   [+1] [+5]
```

En móvil:

- Botones grandes.
- Área táctil mínima de 44×44 px.
- Feedback visual al modificar la vida.
- Evitar botones pequeños.

También se puede permitir pulsar sobre el valor para introducir una cantidad manual.

Validaciones:

- La vida puede ser negativa durante la resolución de una acción, pero la partida debe finalizar inmediatamente.
- El valor mostrado debe ser entero.
- No permitir `NaN`, infinitos ni strings inválidos.

---

## 18. Accesibilidad

Objetivo mínimo: WCAG 2.2 AA en los elementos principales.

Requisitos:

- Navegación completa mediante teclado.
- `button` reales para controles.
- Focus visible.
- Labels accesibles.
- Contraste suficiente.
- No depender únicamente del color.
- `aria-live="polite"` para cambios importantes.
- `aria-live="assertive"` para fin de partida.
- Respeto de `prefers-reduced-motion`.
- No utilizar iconos como único significado de una acción.

Los cambios de vida deben anunciarse de forma comprensible para lectores de pantalla.

---

## 19. Responsive design

Prioridad:

1. Móvil.
2. Tablet.
3. Desktop.

Breakpoints recomendados:

```css
--breakpoint-sm: 480px;
--breakpoint-md: 768px;
--breakpoint-lg: 1024px;
```

La interfaz de partida debe poder utilizarse cómodamente con una mano en móvil.

---

## 20. Persistencia

Utilizar `localStorage`.

Claves:

```text
mtg-practice:config
mtg-practice:stats
mtg-practice:preferences
```

### Configuración

Guardar:

- Última dificultad.
- Valores personalizados.
- Eventos habilitados.
- Preferencias visuales.

### Estadísticas

Opcional en MVP, recomendado para v1:

```ts
type Stats = {
  gamesPlayed: number;
  wins: number;
  losses: number;
  draws: number;
  totalTurns: number;
  totalEvents: number;
};
```

No guardar información personal.

---

## 21. Versionado del almacenamiento

El almacenamiento debe incluir versión:

```ts
type PersistedData<T> = {
  version: number;
  data: T;
};
```

Ejemplo:

```text
mtg-practice:config
{
  "version": 1,
  "data": {}
}
```

Si cambia el modelo, se debe implementar una migración.

Nunca asumir que el contenido de `localStorage` es válido.

---

## 22. Aleatoriedad

Centralizar toda la generación aleatoria.

No llamar directamente a `Math.random()` desde componentes.

Crear:

```ts
interface RandomGenerator {
  next(): number;
  integer(min: number, max: number): number;
  pick<T>(items: T[]): T;
}
```

Esto permitirá usar un generador determinista en tests.

Ejemplo:

```ts
const rng = new SeededRandom("test-seed");
```

En producción se puede utilizar la fuente aleatoria del navegador.

---

## 23. Selección ponderada

Algoritmo:

1. Obtener eventos habilitados.
2. Filtrar eventos incompatibles con la configuración.
3. Calcular la suma de pesos.
4. Generar número aleatorio entre `0` y `totalWeight`.
5. Recorrer eventos acumulando pesos.
6. Seleccionar el evento cuyo rango contiene el número.

No ordenar el array original.

Si todos los pesos son `0`, la selección debe fallar de forma controlada y no generar un evento.

---

## 24. Validación

Crear funciones puras:

```ts
validateGameConfig(config): ValidationResult
validateEvent(event): ValidationResult
validatePersistedData(data): ValidationResult
```

Validaciones mínimas:

- Vida inicial > 0.
- Vida inicial dentro de un máximo razonable.
- `turnsPerRound >= 1`.
- Probabilidad entre `0` y `1`.
- Pesos >= 0.
- Debe existir al menos un evento habilitado si los eventos están activos.
- IDs de eventos deben existir.
- No aceptar propiedades desconocidas críticas desde datos persistidos sin normalizarlas.

---

## 25. Configuración recomendada de dificultades

Valores iniciales sugeridos:

### Fácil

```ts
{
  mode: "easy",
  playerInitialLife: 20,
  cpuInitialLife: 20,
  turnsEnabled: true,
  roundsEnabled: false,
  turnsPerRound: 3,
  eventsEnabled: false
}
```

### Medio

```ts
{
  mode: "medium",
  playerInitialLife: 20,
  cpuInitialLife: 20,
  turnsEnabled: true,
  roundsEnabled: true,
  turnsPerRound: 3,
  eventsEnabled: false
}
```

### Difícil

```ts
{
  mode: "hard",
  playerInitialLife: 20,
  cpuInitialLife: 20,
  turnsEnabled: true,
  roundsEnabled: true,
  turnsPerRound: 3,
  eventsEnabled: true,
  eventFrequency: {
    type: "chance",
    probability: 0.5
  },
  maxConsecutiveEvents: 2
}
```

Los valores son presets y deben poder cambiarse posteriormente.

---

## 26. Balance de eventos

El sistema debe evitar eventos demasiado punitivos.

Cada evento tendrá opcionalmente:

```ts
type EventBalance = {
  minDifficulty: number;
  maxDifficulty: number;
  recommendedFrequency: "low" | "medium" | "high";
};
```

Ejemplo:

- `No pasa nada` → alta frecuencia.
- `Pierdes 1–2 vidas` → alta/media.
- `Descarta 1` → media.
- `Destruye una criatura` → baja.
- `Destruye 3 cartas` → muy baja.
- `No puedes atacar` → media/baja.

Los eventos más fuertes deben tener menor peso o estar restringidos a dificultades superiores.

---

## 27. Eventos que requieren interacción

Algunos eventos no pueden resolverse automáticamente porque la app no conoce el campo de batalla real.

Ejemplo:

> Destruye una criatura.

El evento debe entrar en estado:

```ts
"pendingPlayerAction";
```

Y mostrar:

```text
EVENTO
Destruye una criatura.

[ Resolver ]
```

El jugador realiza físicamente la acción en su partida de MTG y pulsa `Resolver`.

Esto evita intentar representar todo el juego de MTG.

---

## 28. Eventos automáticos vs manuales

Añadir al modelo:

```ts
type EventResolutionMode = "automatic" | "manual";
```

### Automáticos

La aplicación modifica directamente el estado:

- Daño al jugador.
- Daño a CPU.
- Ganancia de vida.
- Contadores.
- Temporizadores.

### Manuales

La aplicación solamente muestra la instrucción:

- Destruye carta.
- Descarta cartas.
- Sacrifica criatura.
- Exilia permanente.
- No puedes atacar.

---

## 29. Historial

Mostrar opcionalmente un historial compacto:

```text
Turno 12
  • Descarta 1 carta

Turno 11
  • Sin evento

Turno 10
  • Recibes 3 daños
```

El historial debe limitarse para no consumir memoria innecesariamente.

Límite recomendado:

```ts
maxEventHistory: 100;
```

---

## 30. PWA / funcionamiento offline

Aunque la aplicación sea estática, se recomienda convertirla en PWA.

Requisitos:

- `manifest.webmanifest`.
- Service Worker.
- Cache de assets estáticos.
- Iconos.
- Nombre y descripción.
- Soporte para instalar en móvil.

La app debe poder iniciar una partida sin conexión después de la primera visita.

No depender de APIs externas para la lógica principal.

---

## 31. Seguridad

Aunque no exista backend:

- No ejecutar HTML proporcionado por configuración externa.
- No utilizar `dangerouslySetInnerHTML`.
- Validar datos de `localStorage`.
- No incluir secretos en el frontend.
- No almacenar datos personales.
- Aplicar Content Security Policy cuando el hosting lo permita.

No hay autenticación en el MVP.

---

## 32. Rendimiento

Objetivos:

- First Contentful Paint rápido.
- Bundle inicial pequeño.
- Sin librerías pesadas innecesarias.
- No utilizar imágenes grandes.
- No realizar peticiones externas para iniciar una partida.

El motor de juego debe ser completamente síncrono y ligero.

---

## 33. SEO

La aplicación es principalmente una herramienta, por lo que el SEO no es prioritario.

Aun así:

- `<title>` descriptivo.
- Meta description.
- Open Graph básico.
- Favicon.
- HTML semántico.

Ejemplo de title:

```text
MTG Practice — Simulador de entrenamiento para Magic: The Gathering
```

---

## 34. Analítica

No incluir analítica en el MVP.

Si posteriormente se añade:

- Debe ser opcional.
- No enviar datos de partidas identificables.
- Evitar tracking innecesario.
- Informar claramente al usuario.

---

## 35. Testing

### Unit tests

Cubrir especialmente:

- Cálculo de rondas.
- Incremento de turnos.
- Condiciones de victoria.
- Condiciones de derrota.
- Empates.
- Selección ponderada.
- Probabilidad de eventos.
- Aplicación de efectos.
- Validación de configuración.
- Serialización/deserialización de `localStorage`.

### Tests de ejemplo

```ts
it("should increment turn", () => {});

it("should start a new round after N turns", () => {});

it("should win when CPU life reaches zero", () => {});

it("should lose when player life reaches zero", () => {});

it("should return draw when both players reach zero", () => {});

it("should select only enabled events", () => {});

it("should respect event weights", () => {});
```

### E2E

Usar Playwright para los flujos principales:

1. Abrir aplicación.
2. Seleccionar dificultad.
3. Iniciar partida.
4. Avanzar turnos.
5. Resolver evento.
6. Reducir vida de CPU a 0.
7. Comprobar pantalla de victoria.
8. Reiniciar.

---

## 36. Calidad de código

Configuración obligatoria:

- TypeScript `strict: true`.
- ESLint.
- Prettier.
- No `any` salvo excepciones documentadas.
- Funciones pequeñas.
- Lógica de negocio fuera de componentes.
- Tests para lógica crítica.
- Nombres descriptivos.

---

## 37. CI/CD

Pipeline recomendado:

```text
Pull Request
    ↓
npm ci
    ↓
lint
    ↓
typecheck
    ↓
unit tests
    ↓
build
    ↓
e2e
    ↓
deploy
```

Scripts:

```json
{
  "dev": "vite",
  "build": "tsc -b && vite build",
  "preview": "vite preview",
  "lint": "eslint .",
  "format": "prettier --write .",
  "typecheck": "tsc --noEmit",
  "test": "vitest run",
  "test:watch": "vitest",
  "test:e2e": "playwright test"
}
```

---

## 38. Hosting

Al ser una SPA estática puede desplegarse en:

- GitHub Pages.
- Cloudflare Pages.
- Netlify.
- Vercel.
- Cualquier servidor estático.

La primera opción recomendada para un proyecto personal es GitHub Pages o Cloudflare Pages.

Si se utiliza GitHub Pages, Vite debe configurarse con el `base` adecuado al nombre del repositorio.

---

## 39. Compatibilidad

Navegadores objetivo:

- Chrome/Chromium: últimas 2 versiones.
- Firefox: últimas 2 versiones.
- Safari: últimas 2 versiones.
- Edge: últimas 2 versiones.
- Navegadores móviles modernos.

No es necesario soportar Internet Explorer.

---

## 40. Internacionalización

El MVP puede estar únicamente en español.

No obstante, los textos deben mantenerse fuera de la lógica:

```ts
const messages = {
  nextTurn: "Siguiente turno",
  player: "Jugador",
  cpu: "CPU",
  victory: "¡Victoria!",
};
```

Esto permitirá añadir inglés posteriormente.

---

## 41. Consideraciones de Magic: The Gathering

La aplicación no debe utilizar datos oficiales de cartas en el MVP.

No necesita:

- Base de datos de cartas.
- Importación de mazos.
- Reglas completas de MTG.
- Simulación de stack.
- Simulación de combate real.
- Inteligencia artificial que juegue cartas.

La app debe funcionar como un **modificador de dificultad externo** para una partida física o para practicar decisiones con un mazo.

Esto mantiene el proyecto sencillo y evita convertirlo en un simulador completo de MTG.

---

## 42. Importación de mazos — futura versión

Como posible v2:

```text
Importar mazo
  ↓
Pegar lista de cartas
  ↓
Analizar nombres
  ↓
Crear Deck
  ↓
Simular biblioteca/mano
```

Modelo:

```ts
type Deck = {
  id: string;
  name: string;
  cards: DeckCard[];
};

type DeckCard = {
  name: string;
  quantity: number;
};
```

Esto permitiría eventos como:

- Roba X cartas.
- Descarta X cartas.
- Muele X cartas.
- Exilia una carta del cementerio.
- Destruye una criatura real del campo.
- Reduce recursos disponibles.

Pero no debe formar parte del MVP.

---

## 43. Futuras mejoras

### v1.1

- Más eventos.
- Estadísticas.
- Historial.
- PWA.
- Temporizador opcional.

### v1.2

- Presets de entrenamiento.
- Editor avanzado de eventos.
- Semillas de partida para repetir escenarios.

### v2

- Importación de mazos.
- Biblioteca simulada.
- Mano inicial.
- Cementerio.
- Campo de batalla simplificado.
- Eventos que interactúen con cartas reales.

### v3

- Oponente simulado más inteligente.
- Escenarios de entrenamiento.
- Modo puzzle.
- Repetición de partidas.
- Compartir configuraciones mediante URL.

---

## 44. Deep links y escenarios compartibles

Futuro:

```text
/practice
/setup
/scenario/:id
```

Una configuración podría codificarse en URL:

```text
?difficulty=hard&events=damage,discard,destroy&life=20
```

No almacenar información sensible.

---

## 45. Requisitos no funcionales

### Usabilidad

Un usuario debe poder empezar una partida en menos de 30 segundos.

### Fiabilidad

Una partida no debe perderse por un refresh accidental si el usuario activa la opción de recuperación.

### Offline

La partida debe poder ejecutarse sin red tras instalar/cargar la PWA.

### Accesibilidad

Los controles principales deben ser utilizables mediante teclado y lector de pantalla.

### Mantenibilidad

Añadir un evento nuevo no debería requerir modificar componentes de UI existentes.

Idealmente:

```ts
registerEvent(newEvent);
```

debería ser suficiente.

---

## 46. MVP definitivo

La primera versión debe contener únicamente:

- [ ] Home.
- [ ] Selector Fácil / Medio / Difícil / Personalizado.
- [ ] Contador de vida jugador.
- [ ] Contador de vida CPU.
- [ ] Contador de turnos.
- [ ] Contador de rondas.
- [ ] Configuración de turnos por ronda.
- [ ] Motor de eventos.
- [ ] 6–10 eventos iniciales.
- [ ] Eventos ponderados.
- [ ] Eventos automáticos y manuales.
- [ ] Pantalla de victoria/derrota/empate.
- [ ] Historial de eventos.
- [ ] Persistencia de configuración en `localStorage`.
- [ ] Diseño responsive.
- [ ] Accesibilidad básica.
- [ ] Tests unitarios del motor.
- [ ] Build estático.
- [ ] PWA básica.

---

## 47. Criterios de aceptación

### Inicio

- El usuario puede seleccionar una dificultad.
- La configuración correspondiente se muestra antes de comenzar.
- `Personalizado` permite modificar las opciones disponibles.
- Una configuración inválida no permite iniciar la partida.

### Partida

- El jugador puede modificar ambas vidas.
- `Siguiente turno` incrementa el turno exactamente una vez.
- Las rondas avanzan según `turnsPerRound`.
- Los eventos aparecen según la frecuencia configurada.
- Los eventos se seleccionan según sus pesos.
- Los eventos manuales pueden marcarse como resueltos.
- El historial registra los eventos.

### Final

- CPU a 0 → victoria.
- Jugador a 0 → derrota.
- Ambos a 0 por la misma acción → empate.
- No se pueden ejecutar acciones sobre una partida terminada.

### Persistencia

- La última configuración se recupera al volver a abrir la app.
- Un `localStorage` corrupto no rompe la aplicación.
- Cambios de versión del modelo pueden migrarse o descartarse de forma segura.

### Calidad

- `npm run build` debe finalizar correctamente.
- `npm run lint` debe finalizar correctamente.
- `npm run typecheck` debe finalizar correctamente.
- Los tests del motor deben pasar.

---

## 48. Principio de diseño principal

La aplicación debe separar claramente:

```text
UI
 ↓
Game State
 ↓
Game Engine
 ↓
Event Engine
 ↓
Pure Functions
```

La UI no debe contener reglas de juego complejas.

El motor debe poder probarse sin React, sin DOM y sin navegador.

El registro de eventos debe ser declarativo.

Esto permitirá que el proyecto empiece como una pequeña herramienta estática y pueda evolucionar posteriormente hacia un simulador de entrenamiento de mazos mucho más completo sin tener que rehacer la arquitectura.
