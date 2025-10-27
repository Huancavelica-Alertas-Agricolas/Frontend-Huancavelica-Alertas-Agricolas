import { useState, useEffect } from 'react';
import { User, AuthFormData, ConsentData } from '../types';

const STORAGE_KEY = 'climaAlert_user';

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const savedUser = localStorage.getItem(STORAGE_KEY);
        if (savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            } catch (error) {
                console.error('Error parsing saved user:', error);
                localStorage.removeItem(STORAGE_KEY);
            }
        }
        setIsLoading(false);
    }, []);

    const login = async (formData: AuthFormData): Promise<{ success: boolean; error?: string }> => {
        setIsLoading(true);

        try {
            // Usuario predefinido para demo
            const predefinedUser = {
                telefono: '+51 999999999',
                contraseña: 'admin123',
                nombre: 'Usuario Demo',
                provincia: 'Huancavelica Centro',
                medio_alerta: ['sms']
            };

            let authenticatedUser = null;

            // 1. Verificar con demoUser del localStorage
            const demoUserRaw = localStorage.getItem('demoUser');
            if (demoUserRaw) {
                try {
                    const demoUser = JSON.parse(demoUserRaw);
                    const normalizedPhone = formData.phone.replace(/\s/g, '');
                    const normalizedDemoPhone = demoUser.telefono.replace(/\s/g, '');

                    if (normalizedPhone === normalizedDemoPhone && formData.password.trim() === demoUser.contraseña) {
                        authenticatedUser = demoUser;
                    }
                } catch (error) {
                    console.error('Error parsing demoUser:', error);
                }
            }

            // 2. Si no se autenticó con demoUser, probar con usuario predefinido
            if (!authenticatedUser) {
                const normalizedPhone = formData.phone.replace(/\s/g, '');
                const normalizedPredefinedPhone = predefinedUser.telefono.replace(/\s/g, '');

                if (normalizedPhone === normalizedPredefinedPhone && formData.password.trim() === predefinedUser.contraseña) {
                    authenticatedUser = predefinedUser;
                }
            }

            // 3. Si se autenticó con alguno de los métodos
            if (authenticatedUser) {
                const newUser: User = {
                    id: 'user_' + Date.now(),
                    phone: formData.phone,
                    name: authenticatedUser.nombre || `Usuario ${formData.phone}`,
                    location: authenticatedUser.provincia || 'Huancavelica Centro',
                    isAuthenticated: true,
                    profile: authenticatedUser,
                    notifications: {
                        sms: authenticatedUser.medio_alerta?.includes('sms') || true,
                        telegram: authenticatedUser.medio_alerta?.includes('Telegram') || false,
                        email: authenticatedUser.medio_alerta?.includes('email') || false
                    }
                };

                // ✅ PRIMERO actualizar el estado y localStorage
                setUser(newUser);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));

                // ✅ ESPERAR un ciclo de render para asegurar la actualización
                await new Promise(resolve => setTimeout(resolve, 0));

                // ✅ LUEGO desactivar loading y retornar éxito
                setIsLoading(false);
                return { success: true };
            }

            // 4. Si no se pudo autenticar
            setIsLoading(false);
            return { success: false, error: 'Teléfono o contraseña incorrectos' };

        } catch (error) {
            console.error('Error in login:', error);
            setIsLoading(false);
            return { success: false, error: 'Error inesperado. Intenta nuevamente.' };
        }
    };

    const logout = () => {
        setIsLoading(true);
        setUser(null);
        localStorage.removeItem(STORAGE_KEY);
        setIsLoading(false);
    };

    const updateConsents = (consents: ConsentData) => {
        if (!user) return;

        const updatedUser = {
            ...user,
            notifications: consents
        };

        setUser(updatedUser);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
    };

    return {
        user,
        isLoading,
        isAuthenticated: !!user?.isAuthenticated,
        login,
        logout,
        updateConsents
    };
};