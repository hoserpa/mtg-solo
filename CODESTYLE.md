# CODESTYLE.md

## Objetivo

Estas reglas definen el estándar de desarrollo de **MTG Practice**.

La codebase debe ser:

- Production ready.
- Legible.
- Consistente.
- Fácil de depurar.
- Fácil de probar.
- Correctamente tipada.
- Siempre formateada.
- Responsive y pensada para móvil.
- Organizada por responsabilidades.

La claridad y la mantenibilidad tienen prioridad sobre las abstracciones innecesarias.

---

## 1. Idioma

Todo el contenido del proyecto debe estar en español:

- Documentación.
- Interfaz.
- Mensajes de error.
- Mensajes de validación.
- Logs destinados a desarrolladores.
- Comentarios.
- Tests y descripciones de tests.
- Mensajes de commits.

Los identificadores de código pueden utilizar convenciones técnicas habituales cuando mejoren la claridad.

---

## 2. Principios generales

Prioridades:

1. Correctitud.
2. Claridad.
3. Testabilidad.
4. Depurabilidad.
5. Mantenibilidad.
6. Rendimiento.

Reglas:

- Preferir código explícito frente a código ingenioso.
- Evitar complejidad prematura.
- Mantener responsabilidades pequeñas.
- Evitar duplicación real.
- No abstraer sin una necesidad clara.
- Preferir composición.
- Mantener la lógica de dominio independiente de la UI.
- Mantener los efectos secundarios en los límites de la aplicación.

---

## 3. Production Ready

Una funcionalidad no está terminada simplemente porque funciona.

Antes de considerarla terminada debe:

- [ ] Estar correctamente tipada.
- [ ] Estar formateada.
- [ ] Pasar lint.
- [ ] Pasar typecheck.
- [ ] Tener tests cuando corresponda.
- [ ] Gestionar errores esperables.
- [ ] No contener logs temporales.
- [ ] No contener código muerto.
- [ ] No contener secretos.
- [ ] Ser accesible.
- [ ] Ser responsive.
- [ ] Funcionar correctamente en móvil.
- [ ] Mantener una estructura coherente con la arquitectura.
- [ ] Poder mantenerse sin introducir complejidad innecesaria.

---

## 4. Formateado obligatorio

Todo el código debe estar siempre formateado.

Usar **Prettier** como formateador oficial.

No realizar commits con archivos sin formatear.

Scripts recomendados:

json
{
"format": "prettier --write .",
"format:check": "prettier --check ."
}

El editor debe configurarse para formatear al guardar cuando sea posible.

## 5. ESLint

ESLint se utilizará para detectar errores y malas prácticas.

No utilizar ESLint como sustituto de Prettier.

Debe comprobar como mínimo:

Variables no utilizadas.
Imports no utilizados.
Código inalcanzable.
Problemas con promesas.
Uso injustificado de any.
Errores habituales de TypeScript.
Errores habituales de React.
Patrones potencialmente peligrosos. 6. TypeScript

## 6. TypeScript

Usar TypeScript en modo estricto.

{
"compilerOptions": {
"strict": true
}
}

Reglas:

Evitar any.
Preferir unknown cuando el tipo sea realmente desconocido.
Evitar as innecesarios.
Evitar ! para ignorar comprobaciones de null.
Usar tipos explícitos en APIs importantes del dominio.
Aprovechar la inferencia cuando el tipo sea evidente.
Usar unions discriminadas para estados y eventos.

Ejemplo:

type GameStatus =
| "setup"
| "playing"
| "won"
| "lost"
| "draw"; 7. Nombres

## 7. Nombres

Los nombres deben expresar intención.

Correcto:

const playerLife = 20;
const turnsPerRound = 3;
const activeEvent = null;

Evitar:

const x = 20;
const n = 3;
const e = null;

Las funciones deben expresar acciones:

createGameState()
calculateRound()
selectRandomEvent()
resolveEvent()
validateGameConfig()

Los booleanos deben utilizar nombres claros:

isGameOver
hasActiveEvent
eventsEnabled 8. Comentarios

## 8. Comentarios

Los comentarios deben ser escasos.

Solo se permiten cuando sean necesarios y aporten contexto técnico.

No explicar código obvio:

// Incrementa el turno.
turn += 1;

Ese comentario no aporta valor.

Sí es válido explicar una decisión técnica no evidente:

// El turno se incrementa antes de seleccionar el evento para que
// las reglas de frecuencia utilicen siempre el turno actual.
turn += 1;

Los comentarios pueden explicar:

Decisiones técnicas.
Limitaciones.
Incompatibilidades.
Optimizaciones necesarias.
Comportamientos deliberadamente poco intuitivos.
Restricciones externas.

No utilizar comentarios para compensar nombres deficientes.

## 9. TODO y FIXME

No utilizar comentarios vagos:

// TODO: arreglar esto

Si realmente es necesario:

// TODO(MTG-123): sustituir el almacenamiento temporal por IndexedDB.

Los TODO y FIXME deben identificar claramente qué falta.

## 10. Depuración

El código debe facilitar la reproducción de errores.

Una partida problemática debería poder reconstruirse mediante:

Configuración
↓
Estado inicial
↓
Acciones
↓
Eventos
↓
Efectos
↓
Estado resultante

La lógica de juego debe favorecer funciones puras y acciones deterministas.

Evitar depender directamente de:

Math.random().
Date.now().
new Date().
APIs del navegador.

dentro de la lógica de dominio cuando dificulten los tests.

## 11. Logs

Los logs temporales no deben llegar a producción.

Evitar:

console.log("hola");
console.log(state);

Para debugging durante desarrollo:

console.debug("[GameEngine]", {
action,
turn,
round,
});

Los logs permanentes deben ser intencionados y aportar contexto suficiente para localizar un problema.

## 12. Manejo de errores

No ocultar errores silenciosamente.

Evitar:

try {
loadConfig();
} catch {
return null;
}

si el error necesita ser diagnosticado.

Preferir:

try {
return loadConfig();
} catch (error) {
console.error("[Config] No se pudo cargar la configuración.", error);
return getDefaultConfig();
}

Los errores esperables deben gestionarse explícitamente.

No utilizar excepciones para controlar el flujo normal de validación.

## 13. Lógica de dominio

La lógica principal debe estar separada de React y del DOM.

Preferir:

features/
├── game/
├── events/
└── settings/

frente a colocar reglas de negocio dentro de componentes.

Ejemplo:

function calculateRound(
turn: number,
turnsPerRound: number,
): number {
return Math.ceil(turn / turnsPerRound);
}

Esta función debe poder probarse sin navegador.

## 14. Funciones puras

Siempre que sea posible, las funciones del dominio deben ser puras.

Una función pura:

No modifica estado externo.
No accede al DOM.
No accede directamente a localStorage.
No depende del reloj del sistema.
No genera aleatoriedad impredecible.

Preferir:

const nextState = gameReducer(state, action);

frente a:

state.playerLife -= 3; 15. Estado

## 15. Estado

Debe existir una única fuente de verdad.

Evitar duplicar:

game.turn
uiTurn
displayedTurn

si representan el mismo dato.

Preferir:

game.turn

y derivar los valores necesarios.

No almacenar información derivada si puede calcularse de forma fiable.

## 16. React

Los componentes deben centrarse en presentación y composición.

Evitar componentes gigantes con reglas de negocio:

function Game() {
// cientos de líneas de lógica...
}

Preferir:

function Game() {
const game = useGame();

return (
<GameLayout
      playerLife={game.playerLife}
      cpuLife={game.cpuLife}
      turn={game.turn}
    />
);
}

Si un componente acumula demasiadas responsabilidades, dividirlo.

## 17. Componentes

Cada componente debe tener una responsabilidad clara.

Ejemplos:

LifeCounter
TurnCounter
RoundCounter
EventCard
EventHistory
DifficultySelector
GameControls
GameResult

Evitar componentes que acumulen toda la aplicación:

MegaComponent
UniversalComponent
EverythingPanel 18. Diseño móvil primero

## 18. Diseño móvil primero

La aplicación se diseña mobile-first.

Toda nueva pantalla o componente debe funcionar correctamente en una pantalla móvil pequeña antes de adaptarse a tamaños mayores.

Prioridades:

Controles táctiles grandes.
Información importante visible sin hacer zoom.
Poco desplazamiento horizontal.
Tipografía legible.
Contraste suficiente.
Estados claros.
Acciones principales fáciles de localizar.
Evitar interfaces densas.
Evitar depender exclusivamente de hover.

No diseñar primero para escritorio y adaptar después.

## 19. Layout para móvil

La interfaz de partida debe priorizar:

┌─────────────────────────┐
│ Turno / Ronda │
├─────────────────────────┤
│ │
│ CPU │
│ ❤️ 20 │
│ │
├─────────────────────────┤
│ │
│ EVENTO │
│ │
├─────────────────────────┤
│ │
│ JUGADOR │
│ ❤️ 20 │
│ │
├─────────────────────────┤
│ SIGUIENTE TURNO │
└─────────────────────────┘

La acción principal debe ser evidente.

Evitar que las acciones importantes queden escondidas en menús secundarios.

## 20. Responsive

Los componentes deben adaptarse a:

Móviles pequeños.
Móviles grandes.
Tablets.
Escritorio.

Usar breakpoints solo cuando sean necesarios.

No crear layouts completamente independientes salvo que exista una necesidad real.

## 21. Touch y controles

Los controles utilizados durante una partida deben estar optimizados para interacción táctil.

Reglas:

Áreas táctiles suficientemente grandes.
Separación entre botones.
Evitar botones pequeños juntos.
No depender de precisión del ratón.
Proporcionar feedback visual al pulsar.
Evitar acciones destructivas sin confirmación cuando corresponda. 22. Accesibilidad

## 22. Accesibilidad

Los controles interactivos deben utilizar elementos semánticos.

Preferir:

<button type="button">
  Siguiente turno
</button>

Evitar:

<div onClick={nextTurn}>
  Siguiente turno
</div>

Además:

Los textos deben estar en español.
El foco de teclado debe ser visible.
No depender solo del color.
Utilizar aria-live para cambios importantes.
Respetar prefers-reduced-motion.
Mantener contraste adecuado.
Mantener navegación por teclado funcional. 23. Eventos

## 23. Eventos

Los eventos deben ser declarativos.

Ejemplo:

const damageEvent: EventDefinition = {
id: "damage-3",
name: "Ataque",
description: "Recibes 3 puntos de daño.",
category: "damage",
weight: 30,
enabled: true,
effect: {
type: "damagePlayer",
amount: 3,
},
};

Evitar lógica basada en textos:

if (event.name === "Ataque") {
// ...
}

La lógica debe utilizar identificadores y tipos de efecto.

## 24. Aleatoriedad

No utilizar Math.random() directamente dentro del motor de juego.

Crear una abstracción:

interface RandomGenerator {
next(): number;
integer(min: number, max: number): number;
pick<T>(items: T[]): T;
}

Esto permite:

Tests deterministas.
Reproducir errores.
Utilizar semillas.
Simular partidas. 25. Fechas y tiempo

## 25. Fechas y tiempo

No depender directamente del reloj del sistema dentro de lógica testeable.

Si es necesario, abstraerlo:

interface Clock {
now(): Date;
}

Esto permite reproducir situaciones concretas en tests.

## 26. Imports

Mantener imports limpios y agrupados.

Ejemplo:

// Dependencias externas
import { useMemo } from "react";

// Código interno
import { calculateRound } from "@/features/game";
import type { GameState } from "@/features/game";

// Estilos
import "./Game.css";

Preferir alias:

import { calculateRound } from "@/features/game";

frente a:

import { calculateRound } from "../../../../features/game"; 27. Dependencias circulares

## 27. Dependencias circulares

No introducir ciclos:

A → B → C → A

Si aparece una dependencia circular, reorganizar la arquitectura.

## 28. Estructura de carpetas

Organizar el código por funcionalidad y responsabilidad.

Ejemplo:

src/
├── app/
├── components/
├── features/
│ ├── game/
│ ├── events/
│ └── settings/
├── data/
├── hooks/
├── lib/
└── styles/

Evitar convertir carpetas como utils/ o helpers/ en almacenes de funciones sin relación.

## 29. Barrel files

Utilizar index.ts únicamente cuando mejore claramente la API pública de un módulo.

No crear barrel files automáticamente para todos los directorios.

Evitar que generen imports circulares.

## 30. Constantes

Evitar números mágicos.

Evitar:

if (turn % 3 === 0) {
// ...
}

Preferir:

const DEFAULT_TURNS_PER_ROUND = 3;

if (turn % DEFAULT_TURNS_PER_ROUND === 0) {
// ...
}

Si el valor pertenece a la configuración del juego, debe proceder de ella.

## 31. Configuración

Debe existir una única fuente de verdad.

Evitar:

// difficulties.ts
turnsPerRound: 3;

// Game.tsx
const turnsPerRound = 3;

Preferir obtener el valor desde la configuración activa.

## 32. Persistencia

El acceso a localStorage debe estar encapsulado.

Evitar:

localStorage.getItem("config");

repartido por toda la aplicación.

Preferir:

settingsStore.getConfig();

La capa de persistencia debe encargarse de:

Serialización.
Deserialización.
Validación.
Versionado.
Migraciones.
Recuperación ante datos corruptos.

Todo dato procedente de localStorage debe considerarse no fiable.

## 33. Tests

La lógica importante debe tener tests.

Los tests de dominio no deberían necesitar:

React.
DOM.
Navegador.
localStorage.

Preferir tests de comportamiento:

it("declara victoria cuando la vida de la CPU llega a cero", () => {
// ...
});

Los tests deben ser deterministas.

## 34. Tests de UI

Los tests E2E deben comprobar flujos reales:

Abrir aplicación
↓
Seleccionar dificultad
↓
Comenzar partida
↓
Avanzar turno
↓
Resolver evento
↓
Comprobar resultado

Evitar depender de detalles internos de React.

## 35. CSS

Mantener los estilos predecibles.

Reglas:

Usar variables CSS para valores compartidos.
Evitar !important.
Evitar selectores excesivamente específicos.
Evitar IDs para estilos.
Evitar estilos inline salvo casos dinámicos justificados.
Usar diseño mobile-first.
Respetar prefers-reduced-motion.
Mantener nombres de clases coherentes. 36. Seguridad

## 36. Seguridad

Nunca guardar en el repositorio:

API keys.
Tokens.
Passwords.
Credenciales.
Secretos.

Evitar HTML arbitrario.

No utilizar dangerouslySetInnerHTML salvo necesidad técnica explícita y con sanitización adecuada.

## 37. Rendimiento

No optimizar prematuramente.

Primero:

Correctitud.
Claridad.
Testabilidad.

Después optimizar cuando exista evidencia.

No introducir useMemo, useCallback o memoización sin una razón clara.

En móvil priorizar especialmente:

Carga inicial rápida.
Poco JavaScript.
Recursos optimizados.
Interacciones inmediatas. 38. Documentación

## 38. Documentación

Documentar:

Decisiones arquitectónicas.
Limitaciones.
Comportamientos no evidentes.
Integraciones.
Migraciones.
Decisiones de seguridad.

No documentar funciones triviales mediante comentarios innecesarios.

La documentación debe mantenerse sincronizada con el código.

## 39. Commits

Los commits deben estar en español.

Formato:

tipo: descripción

Tipos:

feat
fix
refactor
test
docs
chore
build
ci
perf

Ejemplos:

feat: añade motor de eventos
fix: corrige cálculo de rondas
refactor: separa lógica de turnos
test: añade pruebas para eventos de daño
docs: actualiza guía de arquitectura 40. Pull Requests

## 40. Pull Requests

Cada PR debe:

Tener un objetivo claro.
Ser pequeño cuando sea posible.
Incluir tests cuando modifique lógica.
No incluir cambios no relacionados.
Estar formateado.
Pasar lint.
Pasar typecheck.
Pasar tests.
Pasar build.

Formato recomendado:

## Qué cambia

Descripción breve.

## Por qué

Motivo del cambio.

## Tests

- Caso normal.
- Caso límite.
- Caso de error.

## 41. Comprobaciones antes de commit

Ejecutar como mínimo:

npm run format:check
npm run lint
npm run typecheck
npm run test
npm run build

Cuando existan pruebas E2E relevantes:

npm run test:e2e

No hacer merge de código que falle estas comprobaciones salvo una excepción documentada.

## 42. Definition of Done

Una tarea está terminada cuando:

Cumple el requisito funcional.
Está en la capa arquitectónica correcta.
Está correctamente tipada.
Está formateada.
Pasa ESLint.
Pasa TypeScript.
Tiene tests adecuados.
No contiene logs temporales.
No contiene comentarios innecesarios.
No contiene código muerto.
No duplica lógica existente.
Es accesible.
Es responsive.
Está optimizada para móvil cuando afecta a la experiencia de usuario.
Está preparada para producción. 43. Regla de oro

Antes de añadir código, comprobar:

¿Es necesario?
¿Está en la capa correcta?
¿Es fácil de probar?
¿Es fácil de depurar?
¿Es fácil de entender dentro de seis meses?
¿Estoy duplicando lógica?
¿Estoy introduciendo complejidad innecesaria?
¿Está correctamente tipado?
¿Está formateado?
¿Funciona bien en móvil?
¿Está preparado para producción?

Prioridad: código sencillo, explícito, tipado, testeable, depurable, formateado y mantenible.
