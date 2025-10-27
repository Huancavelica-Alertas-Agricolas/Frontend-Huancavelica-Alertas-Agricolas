import { useState, useEffect, useMemo } from 'react';
import { Lightbulb, AlertTriangle, CheckCircle, Clock, Sprout, Droplets, Thermometer, Wind } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { useRecommendations } from '../../hooks/useRecommendations';
import { useCrops } from '../../hooks/useCrops';
import { useAlerts } from '../../hooks/useAlerts';
import { useLanguage } from '../../context/LanguageContext';

const RecommendationSystem = () => {
    const { language } = useLanguage();
    const { crops } = useCrops();
    const { activeAlerts } = useAlerts();
    const { recommendations, markAsRead, dismissRecommendation } = useRecommendations();
    const [activeTab, setActiveTab] = useState('all');

    // ✅ USAR useMemo PARA CALCULOS COSTOSOS - Evita re-renders innecesarios
    const { unreadCount, priorityCount } = useMemo(() => {
        const unread = recommendations.filter(rec => !rec.isRead).length;
        const priority = recommendations.filter(rec => rec.priority === 'alto').length;
        return { unreadCount: unread, priorityCount: priority };
    }, [recommendations]);

    // ✅ FILTRADO CON useMemo - Solo se recalcula cuando cambian las dependencias
    const filteredRecommendations = useMemo(() => {
        return recommendations.filter(rec => {
            if (activeTab === 'all') return true;
            if (activeTab === 'unread') return !rec.isRead;
            if (activeTab === 'priority') return rec.priority === 'alto';
            return rec.type === activeTab;
        });
    }, [recommendations, activeTab]);

    // ✅ FUNCIONES MEMOIZADAS - Evitan recreación en cada render
    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'alto':
                return 'bg-red-100 text-red-800';
            case 'medio':
                return 'bg-yellow-100 text-yellow-800';
            case 'bajo':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'alerta':
                return <AlertTriangle className="h-5 w-5" />;
            case 'clima':
                return <Thermometer className="h-5 w-5" />;
            case 'cultivo':
                return <Sprout className="h-5 w-5" />;
            case 'riego':
                return <Droplets className="h-5 w-5" />;
            default:
                return <Lightbulb className="h-5 w-5" />;
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'alerta':
                return 'text-red-600';
            case 'clima':
                return 'text-blue-600';
            case 'cultivo':
                return 'text-green-600';
            case 'riego':
                return 'text-cyan-600';
            default:
                return 'text-orange-600';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-medium">💡 {language === 'qu' ? 'Kamachikuykuna personal' : language === 'en' ? 'Personalized Recommendations' : 'Recomendaciones Personalizadas'}</h1>
                <p className="text-gray-600 mt-2">
                    {language === 'qu' ? 'Kamachikuykuna sallqa kawsaykuna, clima' : language === 'en' ? 'Smart advice based on your crops and current weather conditions' : 'Consejos inteligentes basados en tus cultivos y las condiciones climáticas actuales'}
                </p>
            </div>

            {/* Estadísticas rápidas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4 text-center">
                        <div className="text-2xl font-medium text-blue-600">{recommendations.length}</div>
                        <p className="text-sm text-gray-600">Total</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4 text-center">
                        <div className="text-2xl font-medium text-orange-600">{unreadCount}</div>
                        <p className="text-sm text-gray-600">Sin leer</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4 text-center">
                        <div className="text-2xl font-medium text-red-600">{priorityCount}</div>
                        <p className="text-sm text-gray-600">Prioritarias</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4 text-center">
                        <div className="text-2xl font-medium text-green-600">{crops.length}</div>
                        <p className="text-sm text-gray-600">Cultivos</p>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs de filtros */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-6">
                    <TabsTrigger value="all">Todas</TabsTrigger>
                    <TabsTrigger value="unread">
                        Sin leer {unreadCount > 0 && <Badge className="ml-1 text-xs">{unreadCount}</Badge>}
                    </TabsTrigger>
                    <TabsTrigger value="priority">
                        Prioritarias {priorityCount > 0 && <Badge className="ml-1 text-xs bg-red-500">{priorityCount}</Badge>}
                    </TabsTrigger>
                    <TabsTrigger value="alerta">Alertas</TabsTrigger>
                    <TabsTrigger value="cultivo">Cultivos</TabsTrigger>
                    <TabsTrigger value="clima">Clima</TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="mt-6">
                    {filteredRecommendations.length === 0 ? (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-12">
                                <Lightbulb className="h-16 w-16 text-gray-400 mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    No hay recomendaciones en esta categoría
                                </h3>
                                <p className="text-gray-600 text-center">
                                    {activeTab === 'unread' && 'Todas las recomendaciones han sido leídas'}
                                    {activeTab === 'priority' && 'No hay recomendaciones prioritarias en este momento'}
                                    {activeTab === 'all' && 'Agrega cultivos para recibir recomendaciones personalizadas'}
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {filteredRecommendations.map((recommendation) => (
                                <Card
                                    key={recommendation.id}
                                    className={`transition-all duration-200 hover:shadow-md ${
                                        !recommendation.isRead ? 'border-blue-200 bg-blue-50/30' : ''
                                    }`}
                                >
                                    <CardHeader className="pb-4">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center space-x-3">
                                                <div className={`p-2 rounded-lg bg-gray-100 ${getTypeColor(recommendation.type)}`}>
                                                    {getTypeIcon(recommendation.type)}
                                                </div>
                                                <div>
                                                    <CardTitle className="text-lg">{recommendation.title}</CardTitle>
                                                    <div className="flex items-center space-x-2 mt-2">
                                                        <Badge className={getPriorityColor(recommendation.priority)}>
                                                            {recommendation.priority.toUpperCase()}
                                                        </Badge>
                                                        <Badge variant="outline">
                                                            {recommendation.type.charAt(0).toUpperCase() + recommendation.type.slice(1)}
                                                        </Badge>
                                                        {!recommendation.isRead && (
                                                            <Badge className="bg-blue-100 text-blue-800">
                                                                Nuevo
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {!recommendation.isRead && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => markAsRead(recommendation.id)}
                                                    className="text-blue-600 hover:text-blue-700"
                                                >
                                                    <CheckCircle className="h-4 w-4 mr-1" />
                                                    Marcar leído
                                                </Button>
                                            )}
                                        </div>
                                    </CardHeader>

                                    <CardContent className="space-y-4">
                                        <p className="text-gray-700">{recommendation.description}</p>

                                        {recommendation.actions.length > 0 && (
                                            <div>
                                                <h4 className="font-medium mb-2">Acciones recomendadas:</h4>
                                                <ul className="space-y-1">
                                                    {recommendation.actions.map((action, index) => (
                                                        <li key={index} className="flex items-start">
                                                            <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                                            <span className="text-sm text-gray-700">{action}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {recommendation.relatedCrop && (
                                            <div className="flex items-center text-sm text-gray-600">
                                                <Sprout className="h-4 w-4 mr-2" />
                                                Relacionado con: {recommendation.relatedCrop}
                                            </div>
                                        )}

                                        <div className="space-y-3 pt-2 border-t">
                                            <div className="flex items-center text-sm text-gray-500">
                                                <Clock className="h-4 w-4 mr-1" />
                                                {recommendation.createdAt.toLocaleDateString()} a las {recommendation.createdAt.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                                            </div>

                                            <div className="flex space-x-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => dismissRecommendation(recommendation.id)}
                                                    className="text-gray-500 hover:text-gray-700"
                                                >
                                                    Descartar
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default RecommendationSystem;