# Arquitectura del Frontend

Resumen
- SPA en React (Vite) que consume una API REST (backend en NestJS). Diseñada para redes lentas y soporte PWA.

Componentes principales
- Cliente: React + Vite + SWC
- Rutas: React Router
- Estado: hooks personalizados y Context API
- UI: Radix UI + Tailwind CSS
- Integraciones: axios, recharts, sonner

Patrones y decisiones
- Code-splitting por vendor chunks para optimizar descargas.
- PWA para soporte offline parcial.
- Internacionalización: español / quechua / inglés.

Diagramas sugeridos
- Navegador ↔ API Gateway ↔ Microservicios (Alertas, Weather, Auth)

Recomendaciones
- Cache con TTL para datos meteorológicos.
- WebSocket o Webhooks para notificaciones en tiempo real.
