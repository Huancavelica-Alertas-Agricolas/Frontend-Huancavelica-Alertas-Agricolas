const UserManual = () => (
  <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6 mt-6">
    <h2 className="text-2xl font-bold mb-4">📖 Manual de Usuario</h2>
    <ol className="list-decimal pl-6 text-sm mb-4">
      <li className="mb-2"><b>Registro e Inicio de Sesión:</b> Ingresa tu número de teléfono y datos básicos para crear una cuenta o iniciar sesión. Si eres agricultor, técnico o investigador, puedes usar el sistema según tu perfil.</li>
      <li className="mb-2"><b>Dashboard:</b> Al ingresar, verás el panel principal con el clima actual, alertas activas y accesos rápidos a reportes y recomendaciones.</li>
      <li className="mb-2"><b>Alertas:</b> Consulta el historial de alertas climáticas, revisa detalles y recibe notificaciones importantes para tus cultivos.</li>
      <li className="mb-2"><b>Reportes:</b> Genera y descarga reportes de temperatura, lluvias y eventos climáticos relevantes para tu zona y cultivos.</li>
      <li className="mb-2"><b>Recomendaciones:</b> Accede a sugerencias y buenas prácticas agrícolas personalizadas según las condiciones climáticas.</li>
      <li className="mb-2"><b>Gestión de Cultivos:</b> Administra información sobre tus cultivos, fechas de siembra y cosecha.</li>
      <li className="mb-2"><b>Perfil de Usuario:</b> Consulta y edita tus datos personales, ubicación y preferencias de notificación.</li>
      <li className="mb-2"><b>Cerrar Sesión:</b> Usa el botón de salir en la parte superior para cerrar tu sesión de forma segura.</li>
      <li className="mb-2"><b>Soporte:</b> Si tienes dudas o problemas, contacta al administrador del sistema o revisa la sección de ayuda.</li>
    </ol>
    <p className="text-xs text-gray-500 mt-4">Este sistema está dirigido principalmente a agricultores de Huancavelica, pero también es útil para técnicos, investigadores y administradores.</p>
  </div>
);

export default UserManual;