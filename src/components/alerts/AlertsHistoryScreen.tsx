import { useState, useEffect } from 'react';
import { AlertCard } from '../dashboard/AlertCard';
import { useLanguage } from '../../context/LanguageContext';
import { AlertFilter } from './AlertFilter';
import { Button } from '../ui/button';
import { Alert, AlertDescription } from '../ui/alert';
import { RefreshCw, Wifi, Filter, Download, Clock, AlertTriangle } from 'lucide-react';
import { useAlerts } from '../../hooks/useAlerts';
import { Alert as AlertType } from '../../types';

type AlertFilters = {
    type?: import('../../types').AlertType;
    severity?: import('../../types').SeverityLevel;
    showActive?: boolean;
    search?: string;
    sortBy?: 'date' | 'severity';
};

interface AlertsHistoryScreenProps {
    onAlertClick: (alert: AlertType) => void;
}

function AlertsHistoryScreen({ onAlertClick }: AlertsHistoryScreenProps) {
    const { language } = useLanguage();
    const { alerts, isLoading, filters, setFilters, refreshAlerts, lastUpdated } = useAlerts();
    const typedFilters = filters as AlertFilters;
    const [showFilters, setShowFilters] = useState(false);
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [localAlerts, setLocalAlerts] = useState<AlertType[]>([]);

    // Monitorear estado de conexión
    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    // Sincronizar alertas locales
    useEffect(() => {
        if (alerts.length > 0) {
            setLocalAlerts(alerts);
            // Guardar en localStorage para modo offline
            localStorage.setItem('cached_alerts', JSON.stringify(alerts));
            localStorage.setItem('cached_alerts_timestamp', new Date().toISOString());
        }
    }, [alerts]);

    // Cargar alertas cacheadas al inicio
    useEffect(() => {
        const cachedAlerts = localStorage.getItem('cached_alerts');
        const cachedTimestamp = localStorage.getItem('cached_alerts_timestamp');

        if (cachedAlerts && !isLoading && alerts.length === 0) {
            try {
                const parsedAlerts = JSON.parse(cachedAlerts);
                setLocalAlerts(parsedAlerts);
                console.log('📦 Alertas cacheadas cargadas:', parsedAlerts.length);
            } catch (error) {
                console.error('Error cargando alertas cacheadas:', error);
            }
        }
    }, [isLoading, alerts.length]);

    // Función de refresh mejorada
    const handleRefresh = async () => {
        if (!isOnline) return;

        setIsRefreshing(true);
        try {
            await refreshAlerts();
            // Simular un pequeño delay para mejor UX
            await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
            console.error('Error refrescando alertas:', error);
        } finally {
            setIsRefreshing(false);
        }
    };

    // Aplicar filtros a las alertas
    const filteredAlerts = (isOnline ? alerts : localAlerts).filter(alert => {
        // Filtro por búsqueda
        if (typedFilters.search) {
            const searchTerm = typedFilters.search.toLowerCase();
            const matches =
                alert.title.toLowerCase().includes(searchTerm) ||
                alert.description.toLowerCase().includes(searchTerm) ||
                (alert.affectedAreas && alert.affectedAreas.some(area =>
                    area.toLowerCase().includes(searchTerm)
                ));
            if (!matches) return false;
        }
        // Filtro por tipo
        if (typedFilters.type && alert.type !== typedFilters.type) return false;
        // Filtro por severidad
        if (typedFilters.severity && alert.severity !== typedFilters.severity) return false;
        // Filtro por estado activo
        if (typedFilters.showActive !== undefined && alert.isActive !== typedFilters.showActive) return false;
        return true;
    });

    // Ordenar alertas
    const sortedAlerts = [...filteredAlerts].sort((a, b) => {
        if (typedFilters.sortBy === 'severity') {
            const severityOrder = { alto: 3, medio: 2, bajo: 1 };
            return severityOrder[b.severity] - severityOrder[a.severity];
        }
        // Por defecto ordenar por fecha (más recientes primero)
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    // Estadísticas para mostrar
    const stats = {
        total: isOnline ? alerts.length : localAlerts.length,
        active: sortedAlerts.filter(alert => alert.isActive).length,
        highSeverity: sortedAlerts.filter(alert => alert.severity === 'alto').length,
        showing: sortedAlerts.length
    };

    // Función para exportar alertas
    const handleExportAlerts = () => {
        const exportData = sortedAlerts.map(alert => ({
            Título: alert.title,
            Descripción: alert.description,
            Tipo: alert.type,
            Severidad: alert.severity,
            Estado: alert.isActive ? 'Activa' : 'Inactiva',
            'Fecha creación': new Date(alert.createdAt).toLocaleDateString(),
            'Válida hasta': new Date(alert.validUntil).toLocaleDateString(),
            'Zonas afectadas': alert.affectedAreas?.join(', ') || ''
        }));

        const csvContent = [
            Object.keys(exportData[0]).join(','),
            ...exportData.map(row => Object.values(row).map(value =>
                `"${String(value).replace(/"/g, '""')}"`
            ).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `alertas_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6">
            {/* Header con estadísticas */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            📋 {language === 'qu' ? 'Kallpachaykuna willakuy' : language === 'en' ? 'Alerts History' : 'Historial de Alertas'}
                        </h1>
                        <p className="text-gray-600">
                            {language === 'qu' ? 'Kallpachaykuna tukuy llaqta' : language === 'en' ? 'Complete climate alert history for your region' : 'Monitoreo completo de alertas climáticas'}
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setShowFilters(!showFilters)}
                            className="min-h-[44px] touch-friendly"
                        >
                            <Filter className="h-4 w-4 mr-2" />
                            {showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
                        </Button>

                        <Button
                            onClick={handleRefresh}
                            disabled={isRefreshing || !isOnline}
                            className="min-h-[44px] touch-friendly bg-blue-600 hover:bg-blue-700"
                        >
                            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                            {isRefreshing ? 'Actualizando...' : 'Actualizar'}
                        </Button>
                    </div>
                </div>

                {/* Estadísticas rápidas */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <div className="bg-white rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                        <div className="text-sm text-gray-600">Total</div>
                    </div>
                    <div className="bg-white rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-green-600">{stats.active}</div>
                        <div className="text-sm text-gray-600">Activas</div>
                    </div>
                    <div className="bg-white rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-red-600">{stats.highSeverity}</div>
                        <div className="text-sm text-gray-600">Alta Severidad</div>
                    </div>
                    <div className="bg-white rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-purple-600">{stats.showing}</div>
                        <div className="text-sm text-gray-600">Mostrando</div>
                    </div>
                </div>
            </div>

            {/* Información de estado */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-sm">
                <div className="flex items-center gap-4">
                    {isOnline ? (
                        <div className="flex items-center gap-1 text-green-600">
                            <Wifi className="h-4 w-4" />
                            <span>✅ Conectado - Datos en tiempo real</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-1 text-orange-600">
                            <AlertTriangle className="h-4 w-4" />
                            <span>📴 Modo offline - Datos cacheados</span>
                        </div>
                    )}

                    {lastUpdated && (
                        <div className="flex items-center gap-1 text-gray-600">
                            <Clock className="h-4 w-4" />
                            <span>Actualizado: {lastUpdated.toLocaleTimeString()}</span>
                        </div>
                    )}
                </div>

                {sortedAlerts.length > 0 && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleExportAlerts}
                        className="min-h-[40px] touch-friendly"
                    >
                        <Download className="h-4 w-4 mr-2" />
                        Exportar CSV
                    </Button>
                )}
            </div>

            {/* Componente de filtros */}
            <AlertFilter
                filters={filters}
                onFiltersChange={setFilters}
                isVisible={showFilters}
                onToggle={() => setShowFilters(!showFilters)}
            />

            {/* Estado de carga */}
            {isLoading && (
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="animate-pulse bg-gray-200 rounded-xl h-32"></div>
                    ))}
                </div>
            )}

            {/* Lista de alertas */}
            {!isLoading && sortedAlerts.length > 0 ? (
                <div className="space-y-4">
                    {sortedAlerts.map((alert) => (
                        <AlertCard
                            key={alert.id}
                            alert={alert}
                            onClick={() => onAlertClick(alert)}
                        />
                    ))}
                </div>
            ) : !isLoading && sortedAlerts.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl">
                    <div className="w-20 h-20 mx-auto mb-4 bg-white rounded-full flex items-center justify-center shadow-sm">
                        <span className="text-3xl">🔍</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                        No se encontraron alertas
                    </h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                        {typedFilters.search || typedFilters.type || typedFilters.severity || typedFilters.showActive
                            ? 'No hay alertas que coincidan con los filtros aplicados. Intenta con otros criterios.'
                            : 'No hay alertas disponibles en este momento. Las alertas se cargarán automáticamente cuando estén disponibles.'
                        }
                    </p>
                    {(typedFilters.search || typedFilters.type || typedFilters.severity || typedFilters.showActive) && (
                        <Button
                            variant="outline"
                            onClick={() => setFilters({})}
                            className="min-h-[48px] touch-friendly"
                        >
                            🧹 Limpiar todos los filtros
                        </Button>
                    )}
                </div>
            ) : null}

            {/* Información adicional */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 border">
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-blue-600" />
                            Información importante
                        </h3>
                        <ul className="text-sm text-gray-600 space-y-2">
                            <li className="flex items-start gap-2">
                                <span className="text-green-600 mt-0.5">•</span>
                                <span>Las alertas se actualizan automáticamente cada 15 minutos</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-600 mt-0.5">•</span>
                                <span>En modo offline puedes acceder a las alertas cacheadas</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-purple-600 mt-0.5">•</span>
                                <span>Toca cualquier alerta para ver detalles completos</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-orange-600 mt-0.5">•</span>
                                <span>Usa los filtros para encontrar alertas específicas</span>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <Download className="h-5 w-5 text-green-600" />
                            Acciones disponibles
                        </h3>
                        <ul className="text-sm text-gray-600 space-y-2">
                            <li className="flex items-start gap-2">
                                <span className="text-green-600 mt-0.5">•</span>
                                <span>Exporta las alertas a CSV para análisis externo</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-600 mt-0.5">•</span>
                                <span>Comparte alertas importantes por WhatsApp</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-purple-600 mt-0.5">•</span>
                                <span>Filtra por severidad para ver las más críticas</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AlertsHistoryScreen;