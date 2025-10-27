# contexts — Providers y Context API (detallado)

Los contexts agrupan providers globales que deben estar en la raíz de la app. Estos providers deben ser lo más delgados posible y delegar la lógica a hooks/servicios.

Responsabilidades
- Proveer estado y acciones globales (auth, idioma, tema).
- Rehidratar estado desde almacenamiento local al iniciar.
- Evitar lógica de negocio compleja dentro del provider.

Patrón recomendado: Provider + hook helper

```tsx
// AuthContext.tsx (esqueleto)
import React, { createContext, useContext, useEffect, useState } from 'react';
import apiClient from 'utils/apiClient';

interface User { id: string; phone: string; name?: string }

interface AuthContextValue {
	user: User | null;
	login: (phone: string, password: string) => Promise<void>;
	logout: () => void;
	isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [user, setUser] = useState<User | null>(() => {
		try { return JSON.parse(localStorage.getItem('climaAlert_user') || 'null'); } catch { return null }
	});

	useEffect(() => {
		// opcional: refrescar token al montar si existe
	}, []);

	const login = async (phone: string, password: string) => {
		const res = await apiClient.post('/auth/login', { phone, password });
		const { user: u, accessToken, refreshToken } = res.data;
		// guardar tokens según estrategia (HttpOnly cookie preferible)
		localStorage.setItem('climaAlert_user', JSON.stringify(u));
		setUser(u);
	};

	const logout = () => {
		localStorage.removeItem('climaAlert_user');
		setUser(null);
	};

	return (
		<AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
			{children}
		</AuthContext.Provider>
	);
};

export function useAuth() {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error('useAuth must be used within AuthProvider');
	return ctx;
}
```

Buenas prácticas
- Rehidratar estado de forma segura y minimizar exposición de tokens en `localStorage` cuando sea posible.
- Mantener las APIs del provider estables para evitar breaking changes.

Inicialización y orden de providers
- `AuthProvider` debería envolver `App` para proteger rutas.
- `LanguageProvider` y `ThemeProvider` pueden colocarse a continuación.

Ejemplo de uso en una página

```tsx
import { useAuth } from 'context/AuthContext';

export default function Profile() {
	const { user, logout } = useAuth();
	return <div>Hola {user?.name} <button onClick={logout}>Salir</button></div>;
}
```

