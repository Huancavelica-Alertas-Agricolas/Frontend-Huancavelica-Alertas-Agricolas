# Guía de inicio

Esta guía explica cómo preparar el entorno de desarrollo local para el frontend, instalar dependencias, ejecutar el servidor y comprobar la aplicación.

Requisitos
- Node.js 20.x
- npm 10.x
- Git

Instalación
```powershell
git clone <repo-url>
cd frontend
npm install
```

Scripts principales
- `npm run dev` — iniciar servidor de desarrollo (HMR)
- `npm run build` — build optimizado para producción

Verificación rápida
- Abrir http://localhost:3000 — debería verse la pantalla de login.
- Credenciales demo: Teléfono `+51999999999` / contraseña `demo123` o `admin123`.
- Al login correcto se guarda `climaAlert_user` en localStorage y se redirige a `/dashboard`.

Problemas comunes
- "Cannot find module 'vite'": ejecutar `npm install`.
- Puerto 3000 ocupado: cambiar puerto en `vite.config.ts` o liberar el puerto.

Notas
