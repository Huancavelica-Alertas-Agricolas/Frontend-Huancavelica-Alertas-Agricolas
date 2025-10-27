# Autenticación

Resumen
- Describe el flujo de login, manejo de tokens, almacenamiento y comportamiento offline (demo).

Flujo de login
1. POST /auth/login con teléfono + contraseña.
2. Backend devuelve `{ accessToken, refreshToken, user }`.
3. Guardar sesión mínima en `localStorage` (clave: `climaAlert_user`) o IndexedDB.

Tokens
- Access token: corta duración (ej. 15 min).
- Refresh token: mayor duración; renovar vía POST /auth/refresh.

Offline (modo demo)
- La app permite credenciales demo (`demo123`, `admin123`) para demostraciones sin backend.

Seguridad
- Preferir HttpOnly cookies para refresh tokens cuando sea posible.
- Validar expiración y forzar refresh o logout.

Endpoints de ejemplo
- POST /auth/login
- POST /auth/refresh
- POST /auth/logout
- GET /users/me
