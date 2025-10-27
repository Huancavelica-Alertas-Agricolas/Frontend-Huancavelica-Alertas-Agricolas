# Guía de inicio — Frontend Huancavelica Alertas Agrícolas

Este documento explica cómo configurar un entorno de desarrollo local para la aplicación Frontend Huancavelica Alertas Agrícolas. Cubre prerequisitos, instalación, ejecución del servidor de desarrollo y pasos básicos de verificación. Para información arquitectónica más detallada consulte "System Architecture" y para configuraciones avanzadas revise "Development Environment".

## Archivos fuente relevantes

Los archivos de configuración y scripts principales que se mencionan en esta guía son:

- `package.json`
- `vite.config.ts`
- `vercel.json`
- `.idx/dev.nix`

## Requisitos

Antes de empezar, asegúrese de tener instaladas las siguientes herramientas en su máquina:

| Requisito | Versión mínima | Propósito |
|---|---:|---|
| Node.js | 20.x | Runtime JavaScript para herramientas de construcción y servidor de desarrollo |
| npm | 10.x (incluido con Node.js) | Gestor de paquetes para instalar dependencias |
| Git | Cualquier versión reciente | Control de versiones para clonar el repositorio |

El proyecto usa Node.js 20 tal como se especifica en ` .idx/dev.nix`. Esto asegura compatibilidad con la cadena de herramientas (Vite, TypeScript, React, etc.).

Opcional: para pruebas de despliegue, se recomienda una cuenta en Vercel (no es obligatoria para desarrollo local).

## Flujo de instalación (resumen)

1. Clonar el repositorio

```powershell
git clone https://github.com/Huancavelica-Alertas-Agricolas/Frontend-Huancavelica-Alertas-Agricolas.git
cd Frontend-Huancavelica-Alertas-Agricolas
```

2. Instalar dependencias

Ejecute el comando de instalación definido en `vercel.json`:

```powershell
npm install
```

Esto instalará las dependencias listadas en `package.json`, entre las que se incluyen (resumen):

- Dependencias de producción:
  - React: `react@18.3.1`, `react-dom@18.3.1`, `react-router-dom@7.9.2`
  - UI: varias librerías de Radix UI (`@radix-ui/react-*`)
  - Tailwind CSS: `tailwindcss@4.1.13` y utilidades relacionadas
  - Visualización: `recharts@2.15.2`
  - Formularios: `react-hook-form`, `react-day-picker`
  - HTTP: `axios@1.12.2`
  - Iconos: `lucide-react`
  - Theming y notificaciones: `next-themes`, `sonner`, etc.

- Dependencias de desarrollo (build-time):
  - Vite, plugin SWC para React, PostCSS/autoprefixer, terser, tipos de TypeScript, etc.

3. Verificar la instalación

Confirme que la carpeta `node_modules/` existe y contiene los paquetes esperados. El conteo total de dependencias (incluyendo transitivas) suele ser alto (60+).

## Ejecutar la aplicación

En `package.json` están definidos los scripts principales:

| Comando | Propósito |
|---|---|
| `npm run dev` | Inicia el servidor de desarrollo (HMR) |
| `npm run build` | Genera el bundle optimizado para producción |

### Modo desarrollo

Inicie el servidor de desarrollo:

```powershell
npm run dev
```

Comportamiento esperado del servidor (según `vite.config.ts`):

- Puerto por defecto: `3000`
- Abre automáticamente el navegador en `http://localhost:3000`
- Habilita Hot Module Replacement (HMR) para ver cambios sin recargar
- Usa SWC para una transpilación rápida de TypeScript/JSX

Salida típica:

```
VITE v6.3.5  ready in XXX ms

➜  Local:   http://localhost:3000/
➜  Network: use --host to expose
➜  press h + enter to show help
```

La primera carga puede tardar 2–3 segundos mientras Vite compila a demanda; luego la navegación será casi instantánea.

### Build de producción

Para crear una versión optimizada:

```powershell
npm run build
```

El proceso de build (resumen):

- Compila TypeScript/TSX a JS con SWC
- Usa Rollup (interno en Vite) para empacar módulos
- Divide el código en varios *vendor chunks* (ej.: `react-vendor`, `ui-vendor`, `charts-vendor`, `forms-vendor`, `utils-vendor`) para mejorar la carga en redes lentas
- Minifica con Terser y aplica hash en los nombres de los archivos para invalidación de caché
- Salida en `dist/`

Salida ejemplo:

```
vite v6.3.5 building for production...
✓ XXX modules transformed.
dist/index.html                   X.XX kB
dist/assets/react-vendor-[hash].js     XXX kB
dist/assets/ui-vendor-[hash].js        XXX kB
...
✓ built in XXs
```

La estrategia de code-splitting está pensada para minimizar lo que el usuario descarga en redes lentas.

## Configuración de despliegue en Vercel

El repositorio incluye `vercel.json`. Ejemplo de configuración:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "rewrites": [ /* reglas de reescritura para SPA */ ]
}
```

Reglas de reescritura típicas:

- `/assets/*` → servir archivos estáticos directamente
- `/*` → servir `index.html` (permite routing del lado cliente con React Router)

## Pasos de verificación

Después de iniciar el servidor de desarrollo, compruebe lo siguiente:

1. Pantalla de login

   - Abrir `http://localhost:3000` debe mostrar el componente de login con campos de teléfono y contraseña.
   - Indicador de estado de red (icono WiFi verde/rojo).
   - Selector de idioma (español / quechua / inglés).

2. Autenticación offline (demo)

   - Credenciales de ejemplo:

     - Teléfono: `+51999999999`
     - Contraseña: `demo123` o `admin123`

   - Al iniciar sesión correctamente la app:
     - Crea un objeto de sesión en `localStorage` con la clave `climaAlert_user`
     - Redirige a `/dashboard`
     - Muestra widget meteorológico, tarjetas de alerta y acciones rápidas

3. Hot Module Replacement (HMR)

   - Cambie un texto simple en `src/components/LoginForm.tsx` y verifique que el navegador se actualiza sin recargar toda la página y preserva el estado.

4. Navegación

   - Pruebe las pestañas de navegación inferiores: Dashboard, Alerts, Crops, Reports, Profile (→ `/configuration`) y confirme que las rutas cargan sin errores.

## Opciones del entorno de desarrollo

- Terminal estándar: Las instrucciones funcionan en `bash`, `zsh`, PowerShell o CMD.
- Google IDX: si usa `IDX` el archivo `.idx/dev.nix` configura Node.js 20 y un servidor de previsualización que arranca automáticamente con `--host 0.0.0.0`.

## Solución de problemas comunes

| Problema | Causa | Solución |
|---|---|---|
| "Cannot find module 'vite'" | Dependencias no instaladas | Ejecutar `npm install` |
| Puerto 3000 ocupado | Otro proceso usa el puerto | Matar el proceso o cambiar el puerto en `vite.config.ts` |
| Errores de resolución de módulos | Alias mal configurado | Verificar que `vite.config.ts` coincide con los paquetes instalados |
| Build lento | Recursos del sistema insuficientes | Desactivar `reportCompressedSize` en `vite.config.ts` o aumentar la memoria de Node |

## Estructura de la salida de build

Tras `npm run build`, la carpeta `dist/` típicamente contiene:

```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js
│   ├── react-vendor-[hash].js
│   ├── ui-vendor-[hash].js
│   ├── charts-vendor-[hash].js
│   ├── forms-vendor-[hash].js
│   ├── utils-vendor-[hash].js
│   └── index-[hash].css
└── [archivos públicos]
```

Los hashes en los nombres de archivos garantizan la invalidación de caché cuando hay cambios.

## Próximos pasos recomendados

- Leer `System Architecture` para comprender el diseño de alto nivel.
- Revisar el sistema de autenticación para entender el flujo de login y manejo de sesiones.
- Explorar el `Dashboard` y los hooks personalizados para ver cómo fluye la información.
- Revisar componentes UI (Radix + Tailwind) y patrones de estilo.
- Investigar capacidades PWA si se requiere funcionamiento offline y optimización móvil.

## Archivos de configuración clave

| Archivo | Propósito |
|---|---|
| `package.json` | Dependencias y scripts |
| `vite.config.ts` | Configuración del sistema de build |
| `vercel.json` | Configuración de despliegue en Vercel |
| `.idx/dev.nix` | Configuración de entorno IDX |
| `tsconfig.json` | Opciones del compilador TypeScript |
| `tailwind.config.js` | Configuración de Tailwind CSS |
| `postcss.config.js` | Pipeline de PostCSS |

---

Si quiere, puedo también (opcional):

- Añadir comandos concretos para cambiar el puerto en `vite.config.ts` si el puerto 3000 está ocupado.
- Crear un pequeño script README local con pasos rápidos para nuevos desarrolladores.

Fin de la guía de inicio traducida.
