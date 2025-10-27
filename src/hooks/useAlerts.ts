// useAlerts.ts - Versión corregida para tus tipos
import { useState, useEffect, useCallback } from 'react';
import { Alert, AlertType, SeverityLevel } from '../types';

export const useAlerts = () => {
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    const [filters, setFilters] = useState<{
        type?: AlertType;
        severity?: SeverityLevel;
        showActive?: boolean;
        search?: string;
        sortBy?: 'date' | 'severity';
    }>({});

    // ✅ Función para generar alertas dinámicas QUE COINCIDA CON TUS TIPOS
    const generateDynamicAlerts = useCallback((): Alert[] => {
        const now = new Date();
        const currentHour = now.getHours();
        const currentMonth = now.getMonth();

        // Alertas base que cambian según condiciones - CORREGIDAS para coincidir con tipos
        const baseAlerts: Alert[] = [
            {
                id: '1',
                type: 'helada',
                severity: currentHour >= 18 || currentHour <= 6 ? 'alto' : 'medio',
                title: currentHour >= 18 ? 'Helada intensa pronosticada para esta noche' : 'Riesgo de helada moderada',
                description: currentHour >= 18
                    ? 'Se espera una helada severa esta noche con temperaturas bajo cero. Proteja sus cultivos.'
                    : 'Posibilidad de helada durante la madrugada. Monitoree condiciones.',
                recommendations: ['Cubra cultivos sensibles', 'Riegue temprano en la mañana', 'Use coberturas térmicas'],
                isActive: currentHour >= 18 || currentHour <= 8,
                createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
                validUntil: new Date(now.getTime() + 12 * 60 * 60 * 1000),
                affectedAreas: ['Huancavelica', 'Acobamba', 'Angaraes'],
                weatherData: {
                    temperature: currentHour >= 18 ? -2 : 2
                    // ✅ CORRECTO: solo temperature, windSpeed, rainfall según tus tipos
                }
            },
            {
                id: '2',
                type: 'lluvia_intensa',
                severity: currentMonth >= 10 || currentMonth <= 3 ? 'medio' : 'bajo',
                title: currentMonth >= 10 || currentMonth <= 3 ? 'Lluvias intensas en la región' : 'Posibilidad de lluvias aisladas',
                description: currentMonth >= 10 || currentMonth <= 3
                    ? 'Lluvias intensas durante la tarde y noche. Riesgo de inundaciones.'
                    : 'Lluvias ligeras posibles en horas de la tarde.',
                recommendations: ['Revisar sistemas de drenaje', 'Almacenar agua de lluvia', 'Proteger cultivos sensibles'],
                isActive: true,
                createdAt: new Date(now.getTime() - 4 * 60 * 60 * 1000),
                validUntil: new Date(now.getTime() + 24 * 60 * 60 * 1000),
                affectedAreas: ['Acobamba', 'Tayacaja'],
                weatherData: {
                    rainfall: currentMonth >= 10 || currentMonth <= 3 ? 25 : 8,
                    windSpeed: 15
                }
            },
            {
                id: '3',
                type: 'sequia',
                severity: currentMonth >= 5 && currentMonth <= 9 ? 'alto' : 'bajo',
                title: currentMonth >= 5 && currentMonth <= 9 ? 'Alerta por sequía prolongada' : 'Condiciones secas normales',
                description: currentMonth >= 5 && currentMonth <= 9
                    ? 'Período de sequía prolongado. Implemente medidas de conservación de agua.'
                    : 'Condiciones secas dentro de lo normal para la temporada.',
                recommendations: ['Optimice riego', 'Use mulch para conservar humedad', 'Plante cultivos resistentes'],
                isActive: currentMonth >= 5 && currentMonth <= 9,
                createdAt: new Date(now.getTime() - 24 * 60 * 60 * 1000),
                validUntil: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
                affectedAreas: ['Huancavelica', 'Castrovirreyna'],
                weatherData: {
                    temperature: 28
                    // ✅ CORRECTO: solo propiedades permitidas
                }
            }
        ];

        // ✅ Agregar alerta aleatoria - CORREGIDA para tipos
        const randomAlerts = [
            {
                id: '4',
                type: 'viento_fuerte' as AlertType, // ✅ CORREGIDO: 'viento_fuerte' no 'vientos_fuertes'
                severity: 'medio' as SeverityLevel,
                title: 'Vientos fuertes en zonas altas',
                description: 'Vientos con ráfagas de hasta 40 km/h en zonas elevadas.',
                recommendations: ['Asegure estructuras temporales', 'Proteja cultivos bajos'],
                isActive: Math.random() > 0.3,
                createdAt: new Date(now.getTime() - 1 * 60 * 60 * 1000),
                validUntil: new Date(now.getTime() + 6 * 60 * 60 * 1000),
                affectedAreas: ['Todas las zonas sobre 3500 msnm'],
                weatherData: {
                    windSpeed: 35,
                    temperature: 15
                }
            },
            {
                id: '5',
                type: 'granizo' as AlertType,
                severity: 'alto' as SeverityLevel,
                title: 'Tormenta de granizo pronosticada',
                description: 'Posibilidad de granizo en las próximas horas. Proteja cultivos y vehículos.',
                recommendations: ['Cubra cultivos sensibles', 'Proteja vehículos', 'Permanezca en interiores'],
                isActive: Math.random() > 0.5,
                createdAt: new Date(now.getTime() - 30 * 60 * 1000), // 30 minutos atrás
                validUntil: new Date(now.getTime() + 3 * 60 * 60 * 1000), // 3 horas adelante
                affectedAreas: ['Huancavelica Centro', 'Ascensión'],
                weatherData: {
                    temperature: 8,
                    rainfall: 12
                }
            }
        ];

        // ✅ Solo incluir alerta aleatoria 50% del tiempo
        if (Math.random() > 0.5) {
            const randomIndex = Math.floor(Math.random() * randomAlerts.length);
            return [...baseAlerts, randomAlerts[randomIndex]];
        }

        return baseAlerts;
    }, []);

    // ✅ Función de carga MEJORADA con datos dinámicos
    const loadAlerts = useCallback(async () => {
        setIsLoading(true);
        try {
            // Simular delay de red más realista
            await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 400));

            const dynamicAlerts = generateDynamicAlerts();

            console.log('📊 Alertas cargadas:', {
                total: dynamicAlerts.length,
                activas: dynamicAlerts.filter(a => a.isActive).length,
                hora: new Date().toLocaleTimeString()
            });

            setAlerts(dynamicAlerts);
            setLastUpdated(new Date());
        } catch (error) {
            console.error('Error loading alerts:', error);
            // En caso de error, mantener las alertas anteriores
            console.log('⚠️ Manteniendo alertas anteriores debido a error');
        } finally {
            setIsLoading(false);
        }
    }, [generateDynamicAlerts]);

    // ✅ Refresh mejorado
    const refreshAlerts = useCallback(async () => {
        console.log('🔄 Refrescando alertas...', new Date().toLocaleTimeString());
        await loadAlerts();
    }, [loadAlerts]);

    // ✅ AUTO-REFRESH INTERNO cada 5 minutos
    useEffect(() => {
        const interval = setInterval(() => {
            if (!isLoading) {
                console.log('⏰ Auto-refresh interno de alertas...');
                refreshAlerts();
            }
        }, 5 * 60 * 1000); // 5 minutos

        return () => clearInterval(interval);
    }, [isLoading, refreshAlerts]);

    // ✅ Carga inicial
    useEffect(() => {
        loadAlerts();
    }, [loadAlerts]);

    // ✅ Filtrado mejorado
    const filteredAlerts = alerts.filter(alert => {
        if (filters.type && alert.type !== filters.type) return false;
        if (filters.severity && alert.severity !== filters.severity) return false;
        if (filters.showActive !== undefined && alert.isActive !== filters.showActive) return false;
        if (filters.search && !alert.title.toLowerCase().includes(filters.search.toLowerCase())) return false;
        return true;
    }).sort((a, b) => {
        if (filters.sortBy === 'severity') {
            const severityOrder = { alto: 3, medio: 2, bajo: 1 };
            return severityOrder[b.severity] - severityOrder[a.severity];
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    const activeAlerts = alerts.filter(alert => alert.isActive);

    const getAlertById = (id: string) => alerts.find(alert => alert.id === id);

    const shareAlert = (alert: Alert) => {
        const message = `🚨 *${alert.title}*\n\n${alert.description}\n\n*Recomendaciones:*\n${alert.recommendations.map(r => `• ${r}`).join('\n')}\n\n_Plataforma de Alertas Climáticas Huancavelica_`;
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    // ✅ Estadísticas en tiempo real
    const stats = {
        total: alerts.length,
        active: activeAlerts.length,
        highSeverity: alerts.filter(a => a.severity === 'alto').length,
        byType: alerts.reduce((acc, alert) => {
            acc[alert.type] = (acc[alert.type] || 0) + 1;
            return acc;
        }, {} as Record<string, number>)
    };

    return {
        alerts: filteredAlerts,
        activeAlerts,
        isLoading,
        lastUpdated,
        filters,
        setFilters,
        getAlertById,
        shareAlert,
        refreshAlerts,
        stats
    };
};