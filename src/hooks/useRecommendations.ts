import { useState, useEffect, useCallback, useRef } from 'react';
import { useCrops } from './useCrops';
import { useAlerts } from './useAlerts';
import { useWeather } from './useWeather';

export interface Recommendation {
    id: string;
    title: string;
    description: string;
    type: 'alerta' | 'clima' | 'cultivo' | 'riego' | 'general';
    priority: 'alto' | 'medio' | 'bajo';
    actions: string[];
    relatedCrop?: string;
    relatedAlert?: string;
    isRead: boolean;
    createdAt: Date;
    validUntil?: Date;
}

export const useRecommendations = () => {
    const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
    const { crops } = useCrops();
    const { activeAlerts } = useAlerts();
    const { weatherData } = useWeather();

    // ✅ REF para evitar bucles - trackear estado anterior
    const prevCropsRef = useRef(crops);
    const prevAlertsRef = useRef(activeAlerts);
    const prevWeatherRef = useRef(weatherData);
    const lastGeneratedRef = useRef<number>(0);

    // ✅ Generar recomendaciones con useCallback
    const generateRecommendations = useCallback(() => {
        const now = Date.now();

        // ✅ Evitar generación muy frecuente (mínimo 30 segundos entre generaciones)
        if (now - lastGeneratedRef.current < 30000) {
            console.log('⏰ Evitando generación frecuente de recomendaciones');
            return [];
        }

        lastGeneratedRef.current = now;
        console.log('🔄 Generando nuevas recomendaciones...');

        const newRecommendations: Recommendation[] = [];

        // ✅ Recomendaciones basadas en alertas activas
        activeAlerts.forEach(alert => {
            crops.forEach(crop => {
                let actions: string[] = [];
                let priority: 'alto' | 'medio' | 'bajo' = alert.severity;

                switch (alert.type) {
                    case 'helada':
                        actions = [
                            'Aplicar riego por aspersión durante la madrugada',
                            'Cubrir cultivos jóvenes con mantas térmicas',
                            'Revisar sistemas de calefacción si están disponibles',
                            'Monitorear temperaturas durante la noche'
                        ];
                        break;
                    case 'lluvia_intensa':
                        actions = [
                            'Verificar y limpiar sistemas de drenaje',
                            'Evitar aplicaciones de fertilizantes o pesticidas',
                            'Proteger plantas jóvenes con coberturas',
                            'Revisar estructuras de soporte de cultivos'
                        ];
                        break;
                    case 'sequia':
                        actions = [
                            'Implementar riego eficiente (goteo o microaspersión)',
                            'Aplicar mulch para conservar humedad',
                            'Revisar y optimizar programación de riego',
                            'Considerar cultivos resistentes a sequía'
                        ];
                        break;
                    case 'granizo':
                        actions = [
                            'Instalar mallas antigranizo si es posible',
                            'Refugiar cultivos en invernaderos móviles',
                            'Preparar seguros agrícolas',
                            'Monitorear pronósticos cada 2 horas'
                        ];
                        break;
                    case 'viento_fuerte':
                        actions = [
                            'Reforzar tutores y estructuras de soporte',
                            'Podar ramas que puedan quebrar',
                            'Proteger cultivos con barreras cortaviento',
                            'Asegurar elementos sueltos en el campo'
                        ];
                        break;
                }

                newRecommendations.push({
                    id: `alert-${alert.id}-${crop.id}-${now}`,
                    title: `🚨 Protección para ${crop.name} - ${alert.title}`,
                    description: `Tu cultivo de ${crop.name} en ${crop.location} está en riesgo por ${alert.description}. Toma medidas preventivas inmediatas.`,
                    type: 'alerta',
                    priority,
                    actions,
                    relatedCrop: crop.name,
                    relatedAlert: alert.id,
                    isRead: false,
                    createdAt: new Date(),
                    validUntil: alert.validUntil
                });
            });
        });

        // ✅ Recomendaciones generales basadas en clima
        if (weatherData) {
            if (weatherData.humidity > 80) {
                newRecommendations.push({
                    id: `humidity-${now}`,
                    title: '💧 Alta Humedad Detectada',
                    description: `La humedad actual es del ${weatherData.humidity}%. Esto puede favorecer el desarrollo de enfermedades fúngicas en tus cultivos.`,
                    type: 'clima',
                    priority: 'medio',
                    actions: [
                        'Mejorar ventilación en cultivos bajo cubierta',
                        'Aplicar fungicidas preventivos si es necesario',
                        'Evitar riego en las próximas horas',
                        'Monitorear signos de enfermedades fúngicas'
                    ],
                    isRead: false,
                    createdAt: new Date()
                });
            }

            if (weatherData.windSpeed > 25) {
                newRecommendations.push({
                    id: `wind-${now}`,
                    title: '💨 Vientos Fuertes',
                    description: `Se detectan vientos de ${weatherData.windSpeed} km/h. Esto puede afectar tus cultivos y estructuras.`,
                    type: 'clima',
                    priority: 'medio',
                    actions: [
                        'Revisar y reforzar estructuras de soporte',
                        'Postponer aplicaciones de pesticidas',
                        'Asegurar herramientas y equipos',
                        'Monitorear daños en cultivos altos'
                    ],
                    isRead: false,
                    createdAt: new Date()
                });
            }
        }

        // ✅ Recomendaciones específicas por cultivo
        crops.forEach(crop => {
            const currentDate = new Date();

            if (crop.plantingDate) {
                const daysFromPlanting = Math.floor((currentDate.getTime() - crop.plantingDate.getTime()) / (1000 * 60 * 60 * 24));

                if (daysFromPlanting >= 0 && daysFromPlanting <= 30) {
                    newRecommendations.push({
                        id: `early-stage-${crop.id}-${now}`,
                        title: `🌱 Cuidados Iniciales - ${crop.name}`,
                        description: `Tu cultivo de ${crop.name} está en etapa inicial (${daysFromPlanting} días desde siembra). Es crucial mantener condiciones óptimas.`,
                        type: 'cultivo',
                        priority: 'medio',
                        actions: [
                            'Mantener humedad constante del suelo',
                            'Proteger de vientos fuertes',
                            'Aplicar fertilizante de arranque si no se hizo',
                            'Monitorear plagas iniciales'
                        ],
                        relatedCrop: crop.name,
                        isRead: false,
                        createdAt: new Date()
                    });
                }

                if (crop.type === 'papa' && daysFromPlanting >= 45 && daysFromPlanting <= 60) {
                    newRecommendations.push({
                        id: `potato-hilling-${crop.id}-${now}`,
                        title: `🥔 Tiempo de Aporque - ${crop.name}`,
                        description: `Tu cultivo de papa está listo para el aporque. Esta práctica es esencial para un buen desarrollo.`,
                        type: 'cultivo',
                        priority: 'alto',
                        actions: [
                            'Realizar aporque cuando las plantas tengan 15-20 cm',
                            'Aplicar fertilizante antes del aporque',
                            'Revisar presencia de gusano blanco',
                            'Mantener suelo húmedo pero no encharcado'
                        ],
                        relatedCrop: crop.name,
                        isRead: false,
                        createdAt: new Date()
                    });
                }
            }
        });

        // ✅ Recomendaciones generales de temporada
        const month = new Date().getMonth();
        if (month >= 3 && month <= 5) {
            newRecommendations.push({
                id: `season-planting-${now}`,
                title: '🌾 Temporada de Siembra',
                description: 'Estamos en época óptima de siembra para muchos cultivos. Asegúrate de estar preparado.',
                type: 'general',
                priority: 'bajo',
                actions: [
                    'Verificar calidad de semillas',
                    'Preparar terrenos para siembra',
                    'Revisar sistemas de riego',
                    'Planificar calendario de cultivos'
                ],
                isRead: false,
                createdAt: new Date()
            });
        }

        console.log(`✅ Generadas ${newRecommendations.length} nuevas recomendaciones`);
        return newRecommendations;
    }, [crops, activeAlerts, weatherData]);

    // ✅ Cargar y generar recomendaciones - CORREGIDO
    useEffect(() => {
        const loadRecommendations = () => {
            try {
                const saved = localStorage.getItem('recommendations');
                let existingRecommendations: Recommendation[] = [];

                if (saved) {
                    existingRecommendations = JSON.parse(saved).map((rec: any) => ({
                        ...rec,
                        createdAt: new Date(rec.createdAt),
                        validUntil: rec.validUntil ? new Date(rec.validUntil) : undefined
                    }));
                }

                // Filtrar recomendaciones expiradas
                const validRecommendations = existingRecommendations.filter(rec =>
                    !rec.validUntil || rec.validUntil > new Date()
                );

                // ✅ Solo generar nuevas si hay cambios significativos
                const cropsChanged = JSON.stringify(crops) !== JSON.stringify(prevCropsRef.current);
                const alertsChanged = JSON.stringify(activeAlerts) !== JSON.stringify(prevAlertsRef.current);
                const weatherChanged = JSON.stringify(weatherData) !== JSON.stringify(prevWeatherRef.current);

                if (cropsChanged || alertsChanged || weatherChanged) {
                    console.log('🔄 Cambios detectados, generando recomendaciones...');
                    const newRecommendations = generateRecommendations();

                    // Evitar duplicados
                    const filteredNew = newRecommendations.filter(newRec =>
                        !validRecommendations.some(existing =>
                            existing.title === newRec.title &&
                            existing.relatedCrop === newRec.relatedCrop
                        )
                    );

                    const allRecommendations = [...validRecommendations, ...filteredNew]
                        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

                    setRecommendations(allRecommendations);
                    localStorage.setItem('recommendations', JSON.stringify(allRecommendations));

                    // ✅ Actualizar referencias
                    prevCropsRef.current = crops;
                    prevAlertsRef.current = activeAlerts;
                    prevWeatherRef.current = weatherData;
                } else {
                    // ✅ Sin cambios, mantener recomendaciones existentes
                    setRecommendations(validRecommendations);
                }
            } catch (error) {
                console.error('Error loading recommendations:', error);
                setRecommendations([]);
            }
        };

        // Solo ejecutar si tenemos datos
        if (crops.length > 0 || activeAlerts.length > 0) {
            loadRecommendations();
        }
    }, [crops, activeAlerts, weatherData, generateRecommendations]);

    const markAsRead = (recommendationId: string) => {
        const updated = recommendations.map(rec =>
            rec.id === recommendationId ? { ...rec, isRead: true } : rec
        );
        setRecommendations(updated);
        localStorage.setItem('recommendations', JSON.stringify(updated));
    };

    const dismissRecommendation = (recommendationId: string) => {
        const updated = recommendations.filter(rec => rec.id !== recommendationId);
        setRecommendations(updated);
        localStorage.setItem('recommendations', JSON.stringify(updated));
    };

    const markAllAsRead = () => {
        const updated = recommendations.map(rec => ({ ...rec, isRead: true }));
        setRecommendations(updated);
        localStorage.setItem('recommendations', JSON.stringify(updated));
    };

    const getUnreadCount = () => {
        return recommendations.filter(rec => !rec.isRead).length;
    };

    const getPriorityRecommendations = () => {
        return recommendations.filter(rec => rec.priority === 'alto' && !rec.isRead);
    };

    return {
        recommendations,
        markAsRead,
        dismissRecommendation,
        markAllAsRead,
        getUnreadCount,
        getPriorityRecommendations
    };
};