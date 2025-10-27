# Despliegue

Opciones
- Vercel (recomendado para frontend estático), Netlify o Docker + Nginx.

Variables de entorno
- `VITE_API_URL`, `VITE_SENTRY_DSN`, `VITE_PUBLIC_URL`.

Pipeline CI (sugerido)
1. Instalar dependencias
2. Ejecutar tests y linters
3. `npm run build`
4. Deploy automático a Vercel/Netlify

Ejemplo `vercel.json`
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev"
}
```

Buenas prácticas
- Separar env vars por entorno (dev/staging/prod).
- Habilitar monitorización (Sentry).
