# components — Biblioteca de UI (detallada)

Este documento sirve como guía operativa para crear, documentar y probar componentes UI reutilizables dentro de `src/components/`.

Objetivos
- Mantener consistencia visual y de interacción.
- Facilitar la reutilización y la composición.
- Garantizar accesibilidad y testabilidad.

Estructura recomendada por componente

```
src/components/<ComponentName>/
  ├─ ComponentName.tsx        # Implementación principal (export default)
  ├─ ComponentName.types.ts   # Tipos/Props (opcional)
  ├─ ComponentName.test.tsx   # Tests unitarios / accesibilidad
  ├─ ComponentName.stories.tsx# Storybook (opcional)
  ├─ index.ts                 # Re-export
  └─ README.md                # Documentación del componente (props, examples)
```

Convenciones
- Uso de TypeScript estricto: exportar interfaces/ types de las props.
- `PascalCase` en nombres de componentes y carpetas.
- Documentar props en el `README.md` del componente y en JSDoc sobre la interfaz.
- Preferir componentes controlados/prop-drilled mínimos y delegar lógica a hooks.

Accesibilidad
- Asegurar roles apropiados, labels y gestión del foco.
- Preferir primitives de Radix para diálogos, menús y selects cuando sea posible.

Testing
- Usar Jest + React Testing Library.
- Añadir pruebas unitarias para variantes visuales, comportamiento (onClick, disabled) y accesibilidad (`axe`).

Plantilla de README para un componente (copiar dentro de la carpeta del componente)

-- Nombre: Button
-- Descripción: Botón primario reutilizable con variantes y accesibilidad.

Props principales (ejemplo)

```ts
export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}
```

Ejemplo: `Button.tsx` (simplificado)

```tsx
import React from 'react';
import clsx from 'clsx';
import type { ButtonProps } from './Button.types';

const sizeClasses = {
  sm: 'px-2 py-1 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg'
};

const variantClasses = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700',
  secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
  ghost: 'bg-transparent text-blue-600 hover:bg-blue-50'
};

export default function Button({ children, onClick, variant='primary', size='md', disabled=false }: ButtonProps) {
  return (
    <button
      type="button"
      className={clsx('rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2', sizeClasses[size], variantClasses[variant], disabled && 'opacity-50 cursor-not-allowed')}
      onClick={onClick}
      disabled={disabled}
      aria-disabled={disabled}
    >
      {children}
    </button>
  );
}
```

Ejemplo de test (`Button.test.tsx`)

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';

test('renders and triggers onClick', () => {
  const handle = jest.fn();
  render(<Button onClick={handle}>Click</Button>);
  const btn = screen.getByRole('button', { name: /click/i });
  fireEvent.click(btn);
  expect(handle).toHaveBeenCalledTimes(1);
});
```

Checklist de PR para componentes
- [ ] Documentar props en `README.md` del componente
- [ ] Agregar tests unitarios y de accesibilidad (`axe`)
- [ ] Añadir Storybook story (si aplica)
- [ ] Asegurar que no se usan estilos globales innecesarios

Guía de versiones y compatibilidad
- Evitar cambios breaking en props públicas sin versionado.
