# ROADMAP.md — MTG Practice App

> Ruta de trabajo basada en `SPECS.md`.
>
> Objetivo: construir primero un MVP pequeño, jugable y testeable, y después ampliar progresivamente la aplicación sin mezclar la lógica de juego con la interfaz.

---

## 0. Principios de trabajo

- [x] Mantener el proyecto como SPA estática con React + TypeScript + Vite.
- [x] Separar completamente UI, estado y lógica de juego.
- [x] Implementar primero lógica pura y tests; después conectar la UI.
- [x] Evitar implementar reglas completas de MTG.
- [x] No introducir backend ni base de datos en el MVP.
- [x] Mantener todos los eventos como definiciones declarativas.
- [x] Hacer que añadir un evento nuevo no requiera modificar componentes existentes.
- [x] Priorizar móvil desde el principio.
- [x] Ejecutar lint, typecheck y tests en cada hito importante.
- [x] Mantener cada fase en un estado funcional antes de pasar a la siguiente.

---

# Fase 1 — Inicialización del proyecto

**Objetivo:** tener un proyecto ejecutable con la arquitectura base.

### Setup

- [x] Crear repositorio Git.
- [x] Inicializar proyecto con Vite + React + TypeScript.
- [x] Activar TypeScript `strict`.
- [x] Configurar ESLint.
- [x] Configurar Prettier.
- [x] Configurar Vitest.
- [x] Preparar Playwright para E2E.
- [x] Crear estructura de carpetas definida en `SPECS.md`.
- [x] Crear `README.md`.
- [x] Añadir `.gitignore`.
- [x] Crear scripts `dev`, `build`, `preview`, `lint`, `format`, `typecheck`, `test` y `test:e2e`.
- [x] Comprobar que `npm run build` funciona.
- [x] Comprobar que `npm run typecheck` funciona.
- [x] Comprobar que `npm run lint` funciona.

### Resultado

- [x] Proyecto arrancando localmente.
- [x] Build de producción generado correctamente.
- [x] Suite de tests preparada.
- [x] Estructura de proyecto establecida.

---

# Fase 2 — Modelo de dominio

**Objetivo:** definir el modelo de datos antes de construir la interfaz.

### Tipos

- [x] Crear `Difficulty`.
- [x] Crear `GameConfig`.
- [x] Crear `GameState`.
- [x] Crear `ActiveEvent`.
- [x] Crear `EventDefinition`.
- [x] Crear `EventEffect`.
- [x] Crear `EventFrequency`.
- [x] Crear `Restriction`.
- [x] Crear `EventHistoryEntry`.
- [x] Crear `Stats`.

### Reglas

- [x] Definir estados `setup`, `playing`, `won`, `lost` y `draw`.
- [x] Definir condiciones de victoria.
- [x] Definir condiciones de derrota.
- [x] Definir condición de empate.
- [x] Definir cálculo de rondas.
- [x] Definir cuándo se incrementa el turno.
- [x] Definir cuándo se comprueba un evento.
- [x] Definir cuándo un evento requiere interacción manual.

### Resultado

- [x] Todo el dominio está tipado.
- [x] No existen tipos de dominio duplicados.
- [x] La lógica todavía puede probarse sin React.

---

# Fase 3 — Configuración y dificultades

**Objetivo:** disponer de las cuatro dificultades.

### Presets

- [x] Implementar preset Fácil.
- [x] Implementar preset Medio.
- [x] Implementar preset Difícil.
- [x] Implementar modo Personalizado.

### Validación

- [x] Validar vida inicial.
- [x] Validar `turnsPerRound`.
- [x] Validar frecuencia de eventos.
- [x] Validar probabilidades.
- [x] Validar pesos.
- [x] Validar que exista al menos un evento si están activados.
- [x] Validar IDs de eventos.
- [x] Crear `validateGameConfig()`.

### Tests

- [x] Testear cada preset.
- [x] Testear configuración inválida.
- [x] Testear límites.
- [x] Testear configuración personalizada.

### Resultado

- [x] Cualquier partida comienza siempre con una configuración válida.

---

# Fase 4 — Motor de partida

**Objetivo:** implementar el núcleo de la aplicación sin UI.

### Estado inicial

- [x] Crear función `createGameState(config)`.
- [x] Inicializar vidas.
- [x] Inicializar turno.
- [x] Inicializar ronda.
- [x] Inicializar historial.
- [x] Inicializar restricciones.
- [x] Inicializar estado `playing`.

### Turnos

- [x] Implementar `nextTurn()`.
- [x] Incrementar turno exactamente una vez.
- [x] Calcular ronda.
- [x] Detectar comienzo de ronda.
- [x] Ejecutar comprobación de eventos.
- [x] Registrar eventos.
- [x] Limpiar restricciones expiradas.

### Vida

- [x] Implementar modificación de vida del jugador.
- [x] Implementar modificación de vida de CPU.
- [x] Implementar reset de vida.
- [x] Comprobar victoria después de modificar vida.
- [x] Comprobar derrota después de modificar vida.
- [x] Comprobar empate.

### Tests

- [x] Testear incremento de turnos.
- [x] Testear rondas.
- [x] Testear daño.
- [x] Testear curación.
- [x] Testear victoria.
- [x] Testear derrota.
- [x] Testear empate.
- [x] Testear que una partida terminada no puede continuar.

### Resultado

- [x] Es posible ejecutar una partida completa desde código sin ningún componente React.

---

# Fase 5 — Motor de eventos

**Objetivo:** crear el sistema extensible de eventos.

### Infraestructura

- [x] Crear `eventTypes.ts`.
- [x] Crear `eventRegistry.ts`.
- [x] Crear `eventSelector.ts`.
- [x] Crear `eventEngine.ts`.
- [x] Crear generador aleatorio centralizado.
- [x] Implementar selección ponderada.
- [x] Implementar frecuencia `everyTurn`.
- [x] Implementar frecuencia `everyNTurns`.
- [x] Implementar frecuencia `chance`.
- [x] Implementar límite de eventos consecutivos.

### Primeros eventos

Implementar inicialmente:

- [x] No pasa nada.
- [x] Recibes X de daño.
- [x] Pierdes X vidas.
- [x] CPU gana X vidas.
- [x] Descarta X cartas.
- [x] Destruye X cartas.
- [x] No puedes atacar.
- [x] Destruye una criatura o artefacto.
- [x] Sacrifica una criatura.
- [x] Bloqueo: no puedes bloquear este turno.

### Clasificación

- [x] Marcar eventos automáticos.
- [x] Marcar eventos manuales.
- [x] Definir peso de cada evento.
- [ ] Definir dificultad recomendada.
- [ ] Definir frecuencia recomendada.

### Tests

- [x] Solo seleccionar eventos habilitados.
- [x] No seleccionar eventos con peso `0`.
- [x] Comprobar selección ponderada.
- [x] Comprobar frecuencia.
- [x] Comprobar límite consecutivo.
- [x] Comprobar eventos automáticos.
- [x] Comprobar eventos manuales.

### Resultado

- [x] Añadir un evento nuevo consiste principalmente en registrar una nueva definición.

---

# Fase 6 — Store / estado de aplicación

**Objetivo:** conectar el motor con la aplicación.

### Estado

- [x] Crear `AppState`.
- [x] Crear reducer del juego.
- [x] Definir acciones del juego.
- [ ] Definir selectores.
- [x] Mantener actualizaciones inmutables.

### Acciones mínimas

- [x] `START_GAME`.
- [x] `NEXT_TURN`.
- [x] `PLAYER_LIFE_CHANGE`.
- [x] `CPU_LIFE_CHANGE`.
- [x] `RESOLVE_EVENT`.
- [x] `RESET_GAME`.
- [ ] `FINISH_GAME`.

### Resultado

- [x] La lógica de React no contiene reglas complejas.
- [x] Todas las acciones pasan por un flujo de estado predecible.

---

# Fase 7 — UI mínima jugable

**Objetivo:** tener el primer MVP visual.

### Home

- [x] Crear pantalla inicial.
- [x] Añadir botón `Nueva partida`.

### Setup

- [x] Crear selector de dificultad.
- [x] Mostrar descripción de cada dificultad.
- [x] Mostrar configuración.
- [ ] Crear formulario personalizado.
- [x] Validar formulario.
- [x] Añadir botón `Comenzar`.

### Partida

- [x] Crear contador de vida del jugador.
- [x] Crear contador de vida de CPU.
- [x] Crear contador de turno.
- [x] Crear contador de ronda.
- [x] Crear botón `Siguiente turno`.
- [x] Mostrar evento activo.
- [x] Crear botón `Resolver` para eventos manuales.
- [x] Mostrar historial.

### Resultado

- [x] Crear pantalla de victoria.
- [x] Crear pantalla de derrota.
- [x] Crear pantalla de empate.
- [x] Mostrar resumen.
- [x] Añadir `Jugar de nuevo`.
- [x] Añadir `Cambiar configuración`.

### Resultado

- [x] Ya se puede jugar una partida completa desde el navegador.

---

# Fase 8 — UX y diseño responsive

**Objetivo:** hacer que la aplicación sea cómoda para usar durante una partida real.

### Contadores

- [x] Crear botones `-5`, `-1`, `+1`, `+5`.
- [x] Permitir modificación manual.
- [x] Añadir feedback visual.
- [x] Evitar controles demasiado pequeños.
- [x] Mantener los controles principales al alcance del pulgar.

### Responsive

- [x] Diseñar primero para móvil.
- [x] Adaptar a tablet.
- [x] Adaptar a desktop.
- [x] Comprobar orientación vertical.
- [x] Comprobar pantallas pequeñas.

### Diseño

- [x] Definir variables CSS.
- [x] Crear sistema básico de espaciado.
- [x] Crear tipografía.
- [x] Definir estados de botones.
- [x] Definir estados de vida baja.
- [x] Definir estado de evento.
- [x] Definir estado de partida terminada.

### Resultado

- [x] La aplicación resulta cómoda para utilizar mientras se juega físicamente a MTG.

---

# Fase 9 — Accesibilidad

**Objetivo:** garantizar que las funciones principales sean accesibles.

- [x] Usar elementos HTML semánticos.
- [x] Garantizar navegación mediante teclado.
- [x] Añadir focus visible.
- [x] Añadir labels accesibles.
- [x] Añadir `aria-live` para cambios importantes.
- [x] Anunciar cambios de vida.
- [x] Anunciar aparición de eventos.
- [x] Anunciar victoria/derrota/empate.
- [x] Comprobar contraste.
- [x] Evitar comunicar información únicamente mediante color.
- [x] Respetar `prefers-reduced-motion`.
- [ ] Probar con lector de pantalla.

### Resultado

- [x] Las funciones principales son utilizables sin ratón y con tecnologías de asistencia.

---

# Fase 10 — Persistencia local

**Objetivo:** conservar la configuración y estadísticas.

### Configuración

- [x] Implementar `createSettingsStore(storage)`.
- [x] Guardar última dificultad.
- [x] Guardar configuración personalizada.
- [x] Guardar eventos habilitados.
- [x] Guardar preferencias visuales.

### Estadísticas

- [x] Guardar partidas jugadas.
- [x] Guardar victorias.
- [x] Guardar derrotas.
- [x] Guardar empates.
- [x] Guardar turnos totales.
- [x] Guardar eventos totales.

### Robustez

- [x] Añadir versión a los datos persistidos.
- [x] Validar datos al leer.
- [x] Gestionar JSON corrupto.
- [x] Gestionar cambios de versión.
- [x] No romper la aplicación si `localStorage` no está disponible.

### Resultado

- [x] La configuración sobrevive al cerrar y abrir la aplicación.

---

# Fase 11 — PWA y offline

**Objetivo:** convertir la herramienta en una aplicación instalable y utilizable offline.

- [x] Crear `manifest.webmanifest`.
- [x] Añadir iconos.
- [x] Configurar nombre de aplicación.
- [x] Configurar descripción.
- [x] Añadir Service Worker.
- [x] Cachear assets estáticos.
- [x] Comprobar carga offline.
- [ ] Comprobar instalación en móvil.
- [ ] Comprobar actualización de assets.

### Resultado

- [x] La aplicación puede instalarse como PWA.
- [x] Una vez cargada, puede funcionar sin conexión.

---

# Fase 12 — Testing completo

**Objetivo:** evitar regresiones antes del despliegue.

### Unit

- [x] Cobertura de `GameState`.
- [x] Cobertura de turnos.
- [x] Cobertura de rondas.
- [x] Cobertura de vidas.
- [x] Cobertura de victoria/derrota/empate.
- [x] Cobertura del selector ponderado.
- [x] Cobertura de frecuencia.
- [x] Cobertura de eventos.
- [x] Cobertura de validación.
- [x] Cobertura de persistencia.

### E2E

- [x] Abrir aplicación.
- [x] Crear partida Fácil.
- [x] Crear partida Medio.
- [x] Crear partida Difícil.
- [x] Crear partida Personalizada.
- [x] Avanzar turnos.
- [x] Resolver evento automático.
- [x] Resolver evento manual.
- [x] Ganar una partida.
- [x] Perder una partida.
- [x] Empatar una partida.
- [x] Reiniciar partida.
- [x] Comprobar persistencia.

> **Notas E2E:** todos los eventos usan el mismo flujo de "Resolver" (el
> `resolutionMode` no se expone en la UI), así que "automático"/"manual" se
> cubren con un único flujo de resolución de evento. El empate no es alcanzable
> vía UI (una acción solo afecta a un bando), por lo que se cubre únicamente en
> tests unitarios del reducer.

### Resultado

- [x] Los flujos críticos están cubiertos automáticamente.

---

# Fase 13 — Calidad y CI/CD

**Objetivo:** automatizar la comprobación del proyecto.

- [x] Crear GitHub Actions.
- [x] Ejecutar `npm ci`.
- [x] Ejecutar lint.
- [x] Ejecutar typecheck.
- [x] Ejecutar tests unitarios.
- [x] Ejecutar build.
- [x] Ejecutar E2E.
- [x] Hacer que un fallo bloquee el merge.
- [ ] Configurar previews para cambios.

> **Notas sobre CI/CD:** el workflow (`deploy.yml`) también se ejecuta en
> `pull_request` a `main` (además de en `push`), de modo que un fallo en
> format/lint/typecheck/test/build/E2E bloquea el merge. El job de **deploy**
> solo se ejecuta en pushes a `main`. Los _previews_ por PR no están disponibles:
> GitHub Pages es un hosting estático sin entornos de previsualización por PR
> (el ítem queda pendiente y solo sería aplicable si se migra a otro hosting,
> p. ej. Vercel o Netlify).

Pipeline objetivo:

```text
Pull Request
    ↓
Install
    ↓
Lint
    ↓
Typecheck
    ↓
Unit Tests
    ↓
Build
    ↓
E2E
    ↓
Merge
```

---

# Fase 14 — Deploy

**Objetivo:** publicar la primera versión.

Vite genera por defecto un build estático en `dist`, que puede desplegarse en servicios de hosting estático. citeturn0search0turn0search1

### Opción recomendada

- [x] Crear proyecto en GitHub.
- [x] Configurar GitHub Pages.
- [x] Configurar `base` de Vite si el proyecto se sirve bajo `/<REPO>/`.
- [x] Crear workflow de GitHub Actions.
- [x] Ejecutar build.
- [x] Publicar `dist`.
- [x] Comprobar URL pública.
- [x] Probar navegación.
- [x] Probar PWA en producción.
- [x] Probar funcionamiento offline.

> **Verificación Fase 14 (site de producción `https://hoserpa.github.io/mtg-solo/`):**
> 10/10 comprobaciones PASS — URL responde 200, la app arranca y muestra el
> inicio, el manifest está enlazado/servido con `start_url`/`scope` correctos y
> 5 iconos (incluido 512), el service worker está registrado/activado y
> controlando la página, y la app se carga sin red (offline) desde el precache.

Vite documenta específicamente el uso de GitHub Actions para compilar y publicar el directorio `dist` en GitHub Pages. citeturn0search2

### Alternativas

- [ ] Cloudflare Pages. _(no seleccionado; GitHub Pages es suficiente para el MVP)_
- [ ] Netlify. _(no seleccionado; solo aplicable si se quieren previews por PR)_
- [ ] Vercel. _(no seleccionado; solo aplicable si se quieren previews por PR)_

---

# Fase 15 — MVP Release

**Objetivo:** considerar terminada la primera versión útil.

### Checklist MVP

- [ ] Home.
- [ ] Fácil.
- [ ] Medio.
- [ ] Difícil.
- [ ] Personalizado.
- [ ] Vida jugador.
- [ ] Vida CPU.
- [ ] Turnos.
- [ ] Rondas.
- [ ] Eventos.
- [ ] Eventos ponderados.
- [ ] Eventos automáticos.
- [ ] Eventos manuales.
- [ ] Historial.
- [ ] Victoria.
- [ ] Derrota.
- [ ] Empate.
- [ ] `localStorage`.
- [ ] Responsive.
- [ ] Accesibilidad básica.
- [ ] Tests.
- [ ] PWA.
- [ ] CI.
- [ ] Deploy.

### Criterio de salida

- [ ] Un usuario puede abrir la web.
- [ ] Elegir dificultad.
- [ ] Empezar una partida.
- [ ] Jugar una partida completa.
- [ ] Recibir eventos.
- [ ] Resolver eventos.
- [ ] Ganar/perder/empatar.
- [ ] Reiniciar.
- [ ] Volver a abrir la app conservando configuración.
- [ ] Utilizarla desde móvil.

---

# Fase 16 — Balance y playtesting

**Objetivo:** comprobar que realmente sirve para practicar MTG.

- [ ] Jugar al menos 10 partidas en Fácil.
- [ ] Jugar al menos 10 partidas en Medio.
- [ ] Jugar al menos 10 partidas en Difícil.
- [ ] Registrar qué eventos se sienten demasiado frecuentes.
- [ ] Registrar qué eventos son demasiado castigadores.
- [ ] Registrar qué eventos no aportan valor.
- [ ] Ajustar pesos.
- [ ] Ajustar daño.
- [ ] Ajustar frecuencia.
- [ ] Ajustar número de cartas afectadas.
- [ ] Comprobar que Difícil realmente sea más exigente que Medio.
- [ ] Comprobar que Fácil permita practicar sin demasiada interferencia.

### Resultado

- [ ] Las dificultades tienen una progresión perceptible.
- [ ] Los eventos añaden presión sin convertir la partida en puro azar.

---

# Fase 17 — v1.1: mejorar la experiencia

**Objetivo:** ampliar el MVP sin complicar todavía el modelo de MTG.

- [ ] Añadir más eventos.
- [ ] Añadir temporizador opcional.
- [ ] Añadir estadísticas visuales.
- [ ] Añadir historial completo de partidas.
- [ ] Añadir presets de entrenamiento.
- [ ] Añadir opción de activar/desactivar categorías de eventos.
- [ ] Añadir control de intensidad.
- [ ] Añadir semillas para repetir una secuencia de eventos.
- [ ] Añadir botón `Deshacer` si el modelo de estado lo permite.
- [ ] Mejorar animaciones respetando `prefers-reduced-motion`.

---

# Fase 18 — v1.2: escenarios de entrenamiento

**Objetivo:** pasar de partidas aleatorias a entrenamiento dirigido.

### Escenarios

- [ ] Crear escenarios predefinidos.
- [ ] Crear objetivo por turnos.
- [ ] Crear objetivo por vida.
- [ ] Crear objetivo por número de eventos.
- [ ] Crear eventos obligatorios.
- [ ] Crear condiciones de éxito.
- [ ] Crear condiciones de fallo.

Ejemplos:

- [ ] Sobrevive 10 turnos.
- [ ] Gana antes del turno 8.
- [ ] Sobrevive con al menos 5 vidas.
- [ ] Gana después de recibir 5 eventos.
- [ ] Juega 3 turnos sin atacar.
- [ ] Mantén la CPU por debajo de 5 vidas.

---

# Fase 19 — v2: importación de mazos

**Objetivo:** hacer que los eventos puedan interactuar con el mazo real del usuario.

### Importación

- [ ] Añadir pantalla `Mis mazos`.
- [ ] Crear modelo `Deck`.
- [ ] Permitir pegar una lista de cartas.
- [ ] Parsear cantidades.
- [ ] Validar nombres.
- [ ] Guardar mazos en `localStorage`.
- [ ] Permitir editar/eliminar mazos.

### Simulación

- [ ] Biblioteca.
- [ ] Mano.
- [ ] Cementerio.
- [ ] Exilio.
- [ ] Campo de batalla simplificado.

### Nuevos eventos

- [ ] Roba X cartas.
- [ ] Descarta X cartas.
- [ ] Muele X cartas.
- [ ] Exilia una carta.
- [ ] Sacrifica una criatura.
- [ ] Devuelve una carta del cementerio.
- [ ] Reduce recursos disponibles.

---

# Fase 20 — v3: entrenamiento avanzado

**Objetivo:** convertir la herramienta en un entorno de práctica más completo.

- [ ] Crear escenarios tipo puzzle.
- [ ] Crear objetivos tácticos.
- [ ] Permitir repetir escenarios.
- [ ] Guardar resultados por escenario.
- [ ] Añadir dificultad adaptativa.
- [ ] Crear secuencias de eventos reproducibles.
- [ ] Crear estadísticas avanzadas.
- [ ] Añadir comparación entre sesiones.
- [ ] Permitir compartir configuraciones.
- [ ] Permitir importar/exportar configuraciones mediante JSON.
- [ ] Permitir compartir escenarios mediante URL.

---

# Orden recomendado de implementación

Para evitar sobreconstruir el proyecto, seguir este orden:

1. [x] Setup del proyecto.
2. [x] Tipos de dominio.
3. [x] Configuración y dificultades.
4. [x] Motor de partida.
5. [x] Motor de eventos.
6. [x] Tests del motor.
7. [x] Store/reducer.
8. [x] UI de setup.
9. [x] UI de partida.
10. [x] Pantalla de resultado.
11. [x] Responsive.
12. [x] Accesibilidad.
13. [ ] Persistencia.
14. [ ] PWA.
15. [ ] Tests E2E.
16. [ ] CI/CD.
17. [ ] Deploy.
18. [ ] Playtesting y balance.
19. [ ] v1.1.
20. [ ] v1.2.
21. [ ] v2.

---

# Definition of Done

Una tarea se considera terminada cuando:

- [ ] Está implementada.
- [ ] Está integrada con el resto de la aplicación.
- [ ] Tiene tests cuando contiene lógica de negocio.
- [ ] TypeScript no produce errores.
- [ ] ESLint no produce errores.
- [ ] La interfaz funciona en móvil.
- [ ] No rompe funcionalidades existentes.
- [ ] La funcionalidad está comprobada manualmente cuando afecta a UX.
- [ ] El código mantiene la separación entre UI y dominio.

Una fase se considera terminada cuando:

- [ ] Todas sus tareas están completadas.
- [ ] Los tests pasan.
- [ ] El build pasa.
- [ ] La aplicación sigue siendo ejecutable.
- [ ] El resultado de la fase puede utilizarse como base de la siguiente.

---

# Prioridades

## P0 — Imprescindible para MVP

- [x] Setup.
- [x] Modelo de dominio.
- [x] Dificultades.
- [x] Motor de partida.
- [x] Motor de eventos.
- [x] Contadores.
- [x] Turnos.
- [x] Rondas.
- [x] Resultado.
- [ ] Persistencia básica.
- [x] Tests críticos.

## P1 — Necesario para una buena primera versión

- [x] Responsive.
- [x] Accesibilidad.
- [x] Historial.
- [ ] PWA.
- [ ] E2E.
- [ ] CI/CD.
- [ ] Deploy.
- [ ] Balance de eventos.

## P2 — Mejoras posteriores

- [ ] Estadísticas avanzadas.
- [ ] Temporizador.
- [ ] Escenarios.
- [ ] Semillas.
- [ ] Compartir configuraciones.

## P3 — Evolución del producto

- [ ] Importación de mazos.
- [ ] Biblioteca simulada.
- [ ] Campo de batalla.
- [ ] Cementerio.
- [ ] Escenarios avanzados.
- [ ] Entrenamiento adaptativo.

---

# Primer milestone

## `v0.1 — Core Playable`

El primer objetivo práctico debería ser extremadamente pequeño:

- [x] Crear proyecto.
- [x] Mostrar jugador y CPU con 20 vidas.
- [x] Añadir `+1/-1`.
- [x] Añadir `Siguiente turno`.
- [x] Mostrar turno.
- [x] Mostrar ronda cada 3 turnos.
- [x] Añadir `No pasa nada`.
- [x] Añadir `Recibes 1–3 daños`.
- [x] Detectar victoria/derrota.
- [x] Reiniciar partida.
- [x] Añadir tests del motor.

**No añadir PWA, importación de mazos, estadísticas avanzadas ni decenas de eventos hasta que este milestone sea sólido.**

---

# Segundo milestone

## `v0.2 — Event System`

- [x] Registry de eventos.
- [x] Selección ponderada.
- [x] Frecuencia configurable.
- [x] Eventos manuales.
- [x] 6–10 eventos.
- [x] Historial.
- [x] Dificultad Fácil/Medio/Difícil.

---

# Tercer milestone

## `v0.3 — Custom Mode`

- [ ] Formulario personalizado.
- [ ] Activar/desactivar turnos.
- [ ] Activar/desactivar rondas.
- [ ] Configurar tamaño de ronda.
- [ ] Activar/desactivar eventos.
- [ ] Configurar frecuencia.
- [ ] Elegir eventos.
- [ ] Configurar vida inicial.

---

# Cuarto milestone

## `v1.0 — Release`

- [ ] UX final.
- [ ] Responsive.
- [ ] Accesibilidad.
- [ ] Persistencia.
- [ ] PWA.
- [ ] Tests E2E.
- [ ] CI/CD.
- [ ] Deploy.
- [ ] Playtesting.
- [ ] Balance final.

---

# Regla de oro del proyecto

> **Primero hacer que sea divertido y fiable con una partida mínima. Después añadir profundidad.**

El proyecto debe poder seguir funcionando perfectamente aunque nunca se llegue a implementar la simulación completa de un mazo de MTG.
