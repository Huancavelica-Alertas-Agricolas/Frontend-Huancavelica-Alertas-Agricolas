```markdown
# pages — Rutas y vistas

Propósito
- Contiene las páginas que renderiza el router: Login, Dashboard, Alerts, Crops, Reports, Profile.

Convenciones
- Cada página exporta un componente por defecto.
- Mantener las páginas ligeras; delegar lógica a hooks y servicios.

Ejemplo
- `src/pages/Dashboard` debe usar hooks (`useAlerts`, `useWeather`) y componentes presentacionales.

```
