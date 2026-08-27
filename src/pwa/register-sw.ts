import { registerSW } from "virtual:pwa-register";

const updateSW = registerSW({
  immediate: true,
  onNeedRefresh() {
    if (window.confirm("Nueva versión disponible. ¿Actualizar ahora?")) {
      updateSW(true);
    }
  },
  onOfflineReady() {
    console.info("MTG Practice está lista para funcionar sin conexión.");
  },
});
