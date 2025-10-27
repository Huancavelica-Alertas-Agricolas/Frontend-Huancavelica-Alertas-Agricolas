import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Progress } from '../ui/progress';
import { Alert, AlertDescription } from '../ui/alert';
import { 
  Wifi, 
  Download, 
  Bell, 
  Globe, 
  MapPin, 
  Trash2, 
  BookOpen, 
  Phone,
  MessageCircle,
  Mail,
  Clock,
  HardDrive
} from 'lucide-react';

function ConfigurationScreen() {
  const [offlineMode, setOfflineMode] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [telegramNotifications, setTelegramNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [autoLocation, setAutoLocation] = useState(true);
  const [language, setLanguage] = useState('es');
  const [storageUsed] = useState(45);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadOfflineContent = async () => {
    setIsDownloading(true);
    // Simular descarga
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsDownloading(false);
  };

  return (
    <div className="space-y-6">
      {/* Estado de conexión y offline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wifi className="h-6 w-6 text-blue-600" />
            📡 Configuración de Conexión
          </CardTitle>
          <CardDescription>
            Gestiona cómo funciona la aplicación con y sin conexión a internet
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Modo offline automático */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="offline-mode" className="text-base font-medium">
                Modo offline automático
              </Label>
              <p className="text-sm text-gray-600">
                Activa automáticamente el modo offline cuando no hay conexión
              </p>
            </div>
            <Switch
              id="offline-mode"
              checked={offlineMode}
              onCheckedChange={setOfflineMode}
            />
          </div>

          {/* Almacenamiento usado */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">
                <HardDrive className="h-4 w-4 inline mr-2" />
                Espacio usado
              </Label>
              <span className="text-sm text-gray-600">
                {storageUsed}MB / 100MB
              </span>
            </div>
            <Progress value={storageUsed} className="h-2" />
          </div>

          {/* Botón descargar contenido offline */}
          <Button
            onClick={handleDownloadOfflineContent}
            disabled={isDownloading}
            className="w-full min-h-[48px] touch-friendly"
            variant="outline"
          >
            <Download className="h-5 w-5 mr-2" />
            {isDownloading ? '⏳ Descargando...' : '💾 Descargar contenido offline'}
          </Button>

          {offlineMode && (
            <Alert>
              <AlertDescription>
                ✅ El modo offline está activo. La aplicación funcionará sin conexión usando datos almacenados localmente.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Notificaciones */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-6 w-6 text-yellow-600" />
            🔔 Notificaciones
          </CardTitle>
          <CardDescription>
            Configura cómo quieres recibir las alertas agrícolas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* SMS */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="sms" className="text-base font-medium flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Alertas por SMS
              </Label>
              <p className="text-sm text-gray-600">
                Recibe alertas importantes en tu celular por mensaje de texto
              </p>
            </div>
            <Switch
              id="sms"
              checked={smsNotifications}
              onCheckedChange={setSmsNotifications}
            />
          </div>

          {/* Telegram */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="telegram" className="text-base font-medium flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                Alertas por Telegram
              </Label>
              <p className="text-sm text-gray-600">
                Recibe alertas en tu canal de Telegram
              </p>
            </div>
            <Switch
              id="telegram"
              checked={telegramNotifications}
              onCheckedChange={setTelegramNotifications}
            />
          </div>

          {/* Email */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="email" className="text-base font-medium flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Alertas por Email
              </Label>
              <p className="text-sm text-gray-600">
                Recibe resúmenes diarios por correo electrónico
              </p>
            </div>
            <Switch
              id="email"
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
            />
          </div>

          {/* Configurar horarios */}
          <Button variant="outline" className="w-full min-h-[48px] touch-friendly">
            <Clock className="h-5 w-5 mr-2" />
            ⏰ Configurar horarios de notificación
          </Button>
        </CardContent>
      </Card>

      {/* Idioma y región */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-6 w-6 text-green-600" />
            🌐 Idioma y Región
          </CardTitle>
          <CardDescription>
            Configura tu idioma preferido y ubicación
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Selector de idioma */}
          <div className="space-y-2">
            <Label className="text-base font-medium">Idioma de la aplicación</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="min-h-[48px] touch-friendly">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="es">🇵🇪 Español</SelectItem>
                <SelectItem value="qu">🏔️ Quechua</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Región detectada */}
          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm text-green-800">
              📍 <strong>Región detectada:</strong> Huancavelica, Perú
            </p>
          </div>

          {/* Ubicación automática */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="auto-location" className="text-base font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Usar ubicación automática
              </Label>
              <p className="text-sm text-gray-600">
                Permite que la aplicación use tu ubicación para alertas precisas
              </p>
            </div>
            <Switch
              id="auto-location"
              checked={autoLocation}
              onCheckedChange={setAutoLocation}
            />
          </div>
        </CardContent>
      </Card>

      {/* Gestión offline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HardDrive className="h-6 w-6 text-gray-600" />
            🗑️ Gestión Offline
          </CardTitle>
          <CardDescription>
            Administra el contenido almacenado en tu dispositivo
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            variant="outline" 
            className="w-full min-h-[48px] touch-friendly justify-start"
          >
            <Trash2 className="h-5 w-5 mr-2" />
            🧹 Liberar espacio offline
          </Button>

          <Button 
            variant="outline" 
            className="w-full min-h-[48px] touch-friendly justify-start"
          >
            <BookOpen className="h-5 w-5 mr-2" />
            📚 Descargar guías de emergencia
          </Button>

          <Button 
            variant="outline" 
            className="w-full min-h-[48px] touch-friendly justify-start"
          >
            <Phone className="h-5 w-5 mr-2" />
            👥 Configurar contactos locales
          </Button>
        </CardContent>
      </Card>

      {/* Información adicional */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-2 text-sm text-gray-500">
            <p>📱 Aplicación optimizada para Huancavelica</p>
            <p>🌐 Versión 1.0.0 - Última actualización: Hoy</p>
            <p>💾 Funciona 100% offline una vez descargado el contenido</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ConfigurationScreen;