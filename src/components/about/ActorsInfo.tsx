const ActorsInfo = () => (
  <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6 mt-6">
    <h2 className="text-2xl font-bold mb-4">👥 Actores del Sistema</h2>
    <table className="w-full text-sm mb-4 border">
      <thead>
        <tr className="bg-gray-100">
          <th className="p-2 border">Actor</th>
          <th className="p-2 border">Descripción</th>
          <th className="p-2 border">Tipo</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="p-2 border">Agricultor</td>
          <td className="p-2 border">Productor agrícola de Huancavelica, usuario principal que monitorea y recibe alertas.</td>
          <td className="p-2 border">Usuario Primario</td>
        </tr>
        <tr>
          <td className="p-2 border">Técnico Agrícola</td>
          <td className="p-2 border">Supervisa cultivos, analiza datos y configura alertas especializadas.</td>
          <td className="p-2 border">Usuario Avanzado</td>
        </tr>
        <tr>
          <td className="p-2 border">Investigador</td>
          <td className="p-2 border">Especialista en análisis científico de datos climáticos.</td>
          <td className="p-2 border">Usuario Especializado</td>
        </tr>
        <tr>
          <td className="p-2 border">Administrador</td>
          <td className="p-2 border">Responsable de la configuración y mantenimiento de la plataforma.</td>
          <td className="p-2 border">Administrador</td>
        </tr>
        <tr>
          <td className="p-2 border">WeatherAPI.com</td>
          <td className="p-2 border">Servicio externo de datos meteorológicos en tiempo real.</td>
          <td className="p-2 border">Sistema Externo</td>
        </tr>
        <tr>
          <td className="p-2 border">Sistema de Notificaciones SMS</td>
          <td className="p-2 border">Servicio externo para envío de alertas por SMS.</td>
          <td className="p-2 border">Sistema Externo</td>
        </tr>
      </tbody>
    </table>
    <h3 className="text-lg font-semibold mt-6 mb-2">Tipología de Actores</h3>
    <ul className="list-disc pl-6 text-sm">
      <li><b>Usuario Primario:</b> Agricultor. Usa el sistema para su trabajo diario, requiere simplicidad y alertas inmediatas.</li>
      <li><b>Usuario Avanzado:</b> Técnico agrícola. Realiza análisis y configuraciones avanzadas.</li>
      <li><b>Usuario Especializado:</b> Investigador. Utiliza el sistema para estudios y análisis científicos.</li>
      <li><b>Administrador:</b> Gestiona usuarios, configuración y mantenimiento.</li>
      <li><b>Sistema/Sistema Externo:</b> Componentes automáticos y servicios de terceros.</li>
    </ul>
  </div>
);

export default ActorsInfo;