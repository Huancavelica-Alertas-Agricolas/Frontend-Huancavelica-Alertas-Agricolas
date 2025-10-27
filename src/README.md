```markdown
# src — Guía técnica y de producto (detallada)

Este documento describe con detalle la estructura, convenciones, patrones y procesos para trabajar con el código fuente del frontend. Está orientado tanto a desarrolladores como a managers/clients que necesitan entender cómo está organizado y cómo evolucionar la aplicación.

Índice rápido
- Visión general
- Arquitectura y responsabilidades
- Estructura de carpetas (desglosada)
- Convenciones de código y estilos
- Flujo de desarrollo (añadir componente, página, hook)
- Testing y calidad
- Build, CI/CD y despliegue
- Operaciones y performance
- Preguntas frecuentes (FAQ)
- Contactos y recursos

Visión general
------------
El código en `src/` contiene la aplicación React (SPA) que el usuario final ejecuta en el navegador. Su responsabilidad principal es: presentar datos, manejar la interacción del usuario, orquestar hooks/contextos y consumir la API backend.

Arquitectura y responsabilidades
--------------------------------
- UI layer: componentes y páginas que renderizan la interfaz.
- State & logic: hooks y contexts que encapsulan la lógica de negocio en el cliente (autenticación, polling de alertas, sincronización offline).
- Integración: `services/` o utilidades (`utils/apiClient`) para llamadas HTTP a la API.
- Assets: imágenes, iconos y recursos que se procesan con Vite.

Estructura de carpetas (detallada)
---------------------------------

- `components/` — Biblioteca de componentes reutilizables y atómicos.
	- Objetivo: mantener UI consistente y reutilizable.
	- Subcarpetas por componente: cada una con `Component.tsx`, `index.ts`, `Component.test.tsx`, `Component.stories.tsx` (si se usa Storybook) y `README.md` con props principales.
	- Ejemplo: `components/Button/Button.tsx` exporta `Button` con variantes `variant="primary|secondary"`.

- `pages/` — Vistas ligadas al router (Login, Dashboard, Alerts, Crops, Reports, Profile).
	- Cada página debe ser un contenedor que componga componentes y consuma hooks.
	- Mantener lógica asíncrona en hooks, no en componentes presentacionales.

- `hooks/` — Hooks personalizados (p. ej. `useAlerts`, `useAuth`, `useWeather`).
	- Responsabilidad: encapsular efectos, llamadas a API, polling, retries y transformación de datos.
	- Reglas: nombres `useXxx`, aceptar params y devolver objeto con datos/estado/acciones.

- `contexts/` — Providers React (AuthProvider, LanguageProvider, ThemeProvider).
	- Proveer APIs de consumo vía `useAuth()`, `useLanguage()`.
	- Mantener los providers delgados; delegar la lógica hacia hooks/servicios.

- `utils/` — Auxiliares puros: formateadores, validadores, wrappers HTTP.
	- Funciones puras, con tests unitarios.

- `assets/` — Logos, iconos, fuentes y archivos estáticos que conviene versionar.
	- Estructura: `assets/icons/`, `assets/images/`, `assets/fonts/`.

- `services/` (si existe) — Integración con backend (API clients), manejo de tokens y adaptadores de datos.

Convenciones de código y estilo
-------------------------------

- TypeScript: activar `strict` y preferir tipos explícitos en las APIs públicas de componentes.
- Nombres: `PascalCase` para componentes (`MyButton`), `camelCase` para funciones y variables, `useXxx` para hooks.
- Exports: usar `index.ts` para re-exportar módulos y mantener imports desde rutas poco profundas (`import { Button } from 'components'`).
- CSS: Tailwind CSS para utilidades; tokens y variables en `tailwind.config.js`. Evitar estilos inline complejos.
- Accesibilidad: cada componente interactivo debe exponer roles/aria-attributes y focus management (usar Radix primitives cuando sea posible).

Flujo de desarrollo (añadir un componente)
-----------------------------------------

1. Crear carpeta `src/components/<Name>/`.
2. Añadir `Name.tsx` con PropTypes/TS interface y `index.ts` que exporte el componente.
3. Añadir `Name.test.tsx` con pruebas unitarias (Jest + React Testing Library).
4. (Opcional) Añadir `Name.stories.tsx` para Storybook.
5. Documentar props clave en `README.md` dentro del componente.
6. Actualizar el componente en la página de ejemplo o dashboard para validar integración.

Ejemplo rápido de `index.ts`:

```ts
export { default as Button } from './Button';
export type { ButtonProps } from './Button';
```

Testing y calidad
-----------------

- Tests unitarios: Jest + React Testing Library. Cobertura mínima sugerida para lógica crítica: 70%.
- Tests de integración: pruebas que validan la interacción entre hooks/pages y servicios (pueden usar msw para mockear la API).
- Linting/formatting: ESLint + Prettier. Asegurarse de ejecutar `npm run lint` antes de PR.
- Accessibility tests: usar `axe` en componentes críticos (formularios, modals).

Build, CI/CD y despliegue
-------------------------

- Scripts comunes (definir en `package.json` raíz o de frontend):
	- `npm run dev` — iniciar Vite en modo desarrollo.
	- `npm run build` — generar `dist/`.
	- `npm run preview` — servir build localmente.
	- `npm run test` — ejecutar tests.
	- `npm run lint` — ejecutar ESLint.

- CI sugerido (GitHub Actions / GitLab CI):
	1. instalar dependencias
	2. ejecutar lint y tests
	3. ejecutar build
	4. publicar artefactos o desplegar a Vercel/Netlify

Operaciones y performance
-------------------------

- Code-splitting: mantener chunks separados para vendor (react, ui, charts, forms, utils).
- Caché y TTL: almacenar datos meteorológicos con TTL para evitar llamadas excesivas.
- Monitoring: integrar Sentry para errores JS y métricas de frontend (Lighthouse / Web Vitals).

Preguntas frecuentes (FAQ)
-------------------------

- ¿Dónde añado una nueva ruta? — Registrar la ruta en el router principal (`src/main.tsx` o `src/App.tsx`) y crear la página en `src/pages/`.
- ¿Cómo manejo las variables de entorno? — Usar `VITE_` prefijo para exponerlas al cliente (`.env`, `.env.local`). No incluir secretos sensibles.
- ¿Qué hacer si el build es lento? — Revisar dependencias pesadas, desactivar `reportCompressedSize` en `vite.config.ts` y usar caching en CI.

Contacto y recursos
-------------------

- Documentación principal: `docs/` (en la raíz del repo).
- Owner del frontend: equipo de frontend / correo: `equipo@organizacion.org` (reemplazar).
- Canal de comunicación: Slack/Telegram interno.

Checklist antes de abrir un PR
-----------------------------

- [ ] Código compilable y tests pasan localmente
- [ ] Lint limpio (`npm run lint`)
- [ ] Documentación del componente/página actualizada
- [ ] Añadido test unitario para la nueva lógica

```
