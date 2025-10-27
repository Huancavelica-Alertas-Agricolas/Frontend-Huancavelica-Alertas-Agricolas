# PWA — Características y comportamiento offline

Resumen
- La app actúa como Progressive Web App para ofrecer soporte offline parcial y notificaciones.

Service Worker
- Cache static assets (Cache-first) y API calls (Network-first con fallback a cache).

Manifest
- `manifest.json`: nombre, iconos, `display: standalone`, `theme_color`.

Sincronización
- Usar IndexedDB para guardar acciones cuando no hay red y sincronizar luego.
- Background sync si está disponible.

Buenas prácticas
- Limitar tamaño de runtime cache (LRU).
- Notificar al usuario cuando hay nueva versión disponible.
