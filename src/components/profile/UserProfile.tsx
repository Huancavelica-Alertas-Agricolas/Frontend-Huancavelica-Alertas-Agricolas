import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/button';
import { useState } from 'react';

const UserProfile = () => {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    location: user?.location || ''
  });
  const [saved, setSaved] = useState(false);

  if (!user) return <div className="p-4">No hay usuario autenticado.</div>;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setSaved(false);
  };

  const handleSave = () => {
    // Actualizar usuario en localStorage y contexto
    const updatedUser = { ...user, ...form };
    localStorage.setItem('climaAlert_user', JSON.stringify(updatedUser));
    window.location.reload(); // Forzar recarga para refrescar contexto (simple)
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow p-6 mt-6">
      <h2 className="text-xl font-bold mb-4">👤 Perfil del Usuario</h2>
      {isEditing ? (
        <>
          <div className="mb-2">
            <strong>Nombre:</strong>
            <input
              className="border rounded px-2 py-1 ml-2"
              name="name"
              value={form.name}
              onChange={handleChange}
            />
          </div>
          <div className="mb-2">
            <strong>Teléfono:</strong>
            <input
              className="border rounded px-2 py-1 ml-2"
              name="phone"
              value={form.phone}
              onChange={handleChange}
            />
          </div>
          <div className="mb-2">
            <strong>Ubicación:</strong>
            <input
              className="border rounded px-2 py-1 ml-2"
              name="location"
              value={form.location}
              onChange={handleChange}
            />
          </div>
          <div className="flex gap-2 mt-4">
            <Button onClick={handleSave} variant="default">Guardar</Button>
            <Button onClick={() => setIsEditing(false)} variant="outline">Cancelar</Button>
          </div>
        </>
      ) : (
        <>
          <div className="mb-2"><strong>Nombre:</strong> {user.name}</div>
          <div className="mb-2"><strong>Teléfono:</strong> {user.phone}</div>
          <div className="mb-2"><strong>Ubicación:</strong> {user.location}</div>
          <div className="mb-2"><strong>Notificaciones:</strong> {user.notifications.sms ? 'SMS ' : ''}{user.notifications.telegram ? 'Telegram ' : ''}{user.notifications.email ? 'Email' : ''}</div>
          <div className="flex gap-2 mt-4">
            <Button onClick={() => setIsEditing(true)} variant="secondary">Editar</Button>
            <Button onClick={logout} variant="destructive">Cerrar sesión</Button>
          </div>
        </>
      )}
    </div>
  );
};

export default UserProfile;