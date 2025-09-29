import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Phone, Lock, Wifi, WifiOff } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { Checkbox } from '../ui/checkbox';
import { AuthFormData } from '../../types';
import { PHONE_PATTERN } from '../../utils/constants';

interface LoginFormProps {
  onSuccess?: () => void;
}


const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [resetPhone, setResetPhone] = useState('+51');
  const [resetMessage, setResetMessage] = useState('');
  const [resetError, setResetError] = useState('');
  const [formData, setFormData] = useState<AuthFormData>({
    phone: '+51',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<AuthFormData>>({});
  const [generalError, setGeneralError] = useState<string>('');
  const [rememberDevice, setRememberDevice] = useState(false);
  const [allowNotifications, setAllowNotifications] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Configurar usuario demo automáticamente (solo una vez)
  useEffect(() => {
    const demoUser = localStorage.getItem('demoUser');
    if (!demoUser) {
      localStorage.setItem('demoUser', JSON.stringify({
        telefono: '+51987654321',
        contraseña: 'password123'
      }));
    }
  }, []); // Array vacío para ejecutar solo una vez

  const validateForm = (): boolean => {
    const newErrors: Partial<AuthFormData> = {};
    if (!PHONE_PATTERN.test(formData.phone)) {
      newErrors.phone = 'Formato: +51 seguido de 9 dígitos';
    }
    if (formData.password.length < 6) {
      newErrors.password = 'Mínimo 6 caracteres';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePhoneChange = (value: string) => {
    if (!value.startsWith('+51')) {
      value = '+51';
    }
    if (value.length <= 12) {
      setFormData(prev => ({ ...prev, phone: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError('');
    setSuccessMessage('');
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const demoUserRaw = localStorage.getItem('demoUser');
      if (demoUserRaw) {
        const demoUser = JSON.parse(demoUserRaw);
        if (
          demoUser.telefono === formData.phone &&
          demoUser.contraseña === formData.password
        ) {
          const newUser = {
            id: 'user_' + Date.now(),
            phone: formData.phone,
            name: `Usuario ${formData.phone}`,
            location: 'Huancavelica Centro',
            isAuthenticated: true,
            notifications: {
              sms: true,
              telegram: false,
              email: false
            }
          };
          localStorage.setItem('climaAlert_user', JSON.stringify(newUser));
          setSuccessMessage('✅ ¡Acceso exitoso! Entrando al dashboard...');
          
          // Asegurar que la navegación ocurra después de un breve delay
          setTimeout(() => {
            setIsLoading(false);
            if (onSuccess) {
              onSuccess();
            } else {
              // Fallback: redirigir directamente
              window.location.href = '/dashboard';
            }
          }, 1000);
          return;
        }
      }
      setGeneralError('Error de autenticación (demo)');
    } catch (error) {
      setGeneralError('Error inesperado. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError('');
    setResetMessage('');
    if (!PHONE_PATTERN.test(resetPhone)) {
      setResetError('Formato: +51 seguido de 9 dígitos');
      return;
    }
    setTimeout(() => {
      setResetMessage('Se ha enviado un enlace de restablecimiento a tu número. (demo)');
    }, 1000);
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 py-4 px-2 sm:py-8 sm:px-4 flex flex-col items-center justify-center">
      <div className={`w-full max-w-md mx-auto p-4 border-b-2 rounded-t-xl ${isOnline ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}> 
        <div className="flex items-center justify-center gap-3">
          {isOnline ? (
            <Wifi className="h-6 w-6 text-green-600" />
          ) : (
            <WifiOff className="h-6 w-6 text-red-600" />
          )}
          <span className={`font-medium ${isOnline ? 'text-green-600' : 'text-red-600'}`}>📶 {isOnline ? 'ONLINE' : 'OFFLINE - Usar datos locales'}</span>
        </div>
      </div>
      <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center">
        <Card className="w-full">
          <CardHeader className="text-center">
            <div className="mx-auto w-20 h-20 bg-green-600 rounded-2xl flex items-center justify-center mb-6">
              <span className="text-4xl" role="img" aria-label="clima">🌦️</span>
            </div>
            <CardTitle className="text-2xl">🌾 Bienvenido</CardTitle>
            <CardDescription className="text-base">Ingresa a la plataforma de alertas climáticas para agricultores de Huancavelica</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {generalError && (
                <Alert variant="destructive">
                  <AlertDescription>{generalError}</AlertDescription>
                </Alert>
              )}
                {successMessage && (
                  <Alert variant="default">
                    <AlertDescription>{successMessage}</AlertDescription>
                  </Alert>
                )}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-base">📱 Número de Teléfono</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    placeholder="+51987654321"
                    className="pl-12 min-h-[52px] text-base touch-friendly"
                    aria-describedby={errors.phone ? "phone-error" : undefined}
                  />
                </div>
                {errors.phone && (
                  <p id="phone-error" className="text-sm text-red-600" role="alert">
                    {errors.phone}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-base">🔒 Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="••••••"
                    className="pl-12 pr-12 min-h-[52px] text-base touch-friendly"
                    aria-describedby={errors.password ? "password-error" : undefined}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 min-h-[44px] min-w-[44px] p-2"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </Button>
                </div>
                {errors.password && (
                  <p id="password-error" className="text-sm text-red-600" role="alert">
                    {errors.password}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full min-h-[52px] text-base touch-friendly bg-green-600 hover:bg-green-700"
                disabled={isLoading}
              >
                {isLoading ? '🔄 Ingresando...' : isOnline ? '🚀 Ingresar' : '📱 Ingresar (Modo Offline)'}
              </Button>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-2 mt-2">
                <Button
                  type="button"
                  variant="link"
                  className="min-h-[44px] text-sm text-blue-600"
                  disabled={!isOnline}
                  onClick={() => setShowReset(true)}
                >
                  ¿Olvidaste tu contraseña? {!isOnline && '(Requiere conexión)'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="min-h-[44px] text-sm text-green-700 border-green-600 hover:bg-green-50"
                  onClick={() => window.location.href = '/register'}
                >
                  Registrarse
                </Button>
              </div>
              {showReset && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                  <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xs relative">
                    <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700" onClick={() => { setShowReset(false); setResetMessage(''); setResetError(''); }}>&times;</button>
                    <h2 className="text-lg font-semibold mb-2">Recuperar contraseña</h2>
                    <form onSubmit={handleReset} className="space-y-3">
                      <Label htmlFor="reset-phone">Número de teléfono</Label>
                      <Input
                        id="reset-phone"
                        type="tel"
                        value={resetPhone}
                        onChange={e => setResetPhone(e.target.value)}
                        placeholder="+51987654321"
                        className="min-h-[44px]"
                      />
                      {resetError && <p className="text-sm text-red-600">{resetError}</p>}
                      <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 min-h-[44px]">Enviar enlace</Button>
                    </form>
                    {resetMessage && <p className="text-green-700 text-sm mt-3">{resetMessage}</p>}
                  </div>
                </div>
              )}
            </form>
            <div className="mt-6 space-y-3">
              {!isOnline && (
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <p className="text-sm text-orange-800">
                    📴 <strong>Modo Offline:</strong> Usando datos almacenados localmente
                  </p>
                </div>
              )}
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800 mb-2">
                  <strong>Demo:</strong> Usa cualquier número +51 con 9 dígitos y contraseña de 6+ caracteres
                </p>
                <p className="text-xs text-blue-600">
                  Ejemplo: +51987654321 / password123
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginForm;