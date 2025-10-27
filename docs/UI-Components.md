# UI Components

Stack
- Radix UI, Tailwind CSS, class-variance-authority (cva), lucide-react.

Estructura
- `src/components/` — componentes reutilizables (Button, Input, Modal, Card).
- `src/components/ui/` — primitives shared.

Guía rápida para crear un componente
1. Crear `src/components/<Name>/` con `index.tsx` y `index.test.tsx`.
2. Documentar props con JSDoc/TypeScript.
3. Añadir ejemplo de uso en `src/pages` o Storybook.

Accesibilidad
- Usar roles, `aria-` y gestión de foco; Radix ayuda a esto.
