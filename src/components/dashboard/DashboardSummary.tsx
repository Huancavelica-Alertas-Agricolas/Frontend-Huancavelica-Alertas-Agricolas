import { Sprout, AlertTriangle, Lightbulb } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { useCrops } from '../../hooks/useCrops';
import { useLanguage } from '../../context/LanguageContext';
import { useRecommendations } from '../../hooks/useRecommendations';
import { useAlerts } from '../../hooks/useAlerts';

// ✅ CORREGIDO: Tipo explícito para las secciones
type DashboardSection = 'alerts' | 'crops' | 'recommendations' | 'reports';

interface DashboardSummaryProps {
    onNavigate: (section: 'alerts' | 'crops' | 'recommendations' | 'reports') => void;
}

export const DashboardSummary = ({ onNavigate }: DashboardSummaryProps) => {
    const { language } = useLanguage();
    const { crops, getCropStats } = useCrops();
    const { getUnreadCount, getPriorityRecommendations } = useRecommendations();
    const { activeAlerts } = useAlerts();

    // Check authentication from localStorage
    const isAuthenticated = (() => {
        try {
            const user = localStorage.getItem('climaAlert_user');
            return user && JSON.parse(user).isAuthenticated;
        } catch {
            return false;
        }
    })();

    const cropStats = getCropStats();
    const unreadRecommendations = getUnreadCount();
    const priorityRecommendations = getPriorityRecommendations();

    // ✅ CORREGIDO: Usar el tipo DashboardSection
    const summaryCards: {
        id: DashboardSection;
        title: string;
        value: number;
        total: number;
        icon: any;
        color: string;
        bgColor: string;
        description: string;
        action: () => void;
    }[] = [
        {
            id: 'crops',
            title: language === 'qu' ? 'Sallqa kawsaykuna' : language === 'en' ? 'Active Crops' : 'Cultivos Activos',
            value: cropStats.active,
            total: cropStats.total,
            icon: Sprout,
            color: 'text-green-600',
            bgColor: 'bg-green-50',
            description: language === 'qu' ? `${cropStats.totalArea.toFixed(1)} ha totalpi` : language === 'en' ? `${cropStats.totalArea.toFixed(1)} ha total` : `${cropStats.totalArea.toFixed(1)} ha en total`,
            action: () => {
                console.log('🟢 Click en Cultivos');
                if (isAuthenticated) {
                    onNavigate('crops'); // ✅ Ahora el tipo coincide
                }
            }
        },
        {
            id: 'alerts',
            title: language === 'qu' ? 'Kallpachaykuna' : language === 'en' ? 'Active Alerts' : 'Alertas Activas',
            value: activeAlerts.length,
            total: activeAlerts.length,
            icon: AlertTriangle,
            color: 'text-red-600',
            bgColor: 'bg-red-50',
            description: activeAlerts.length > 0 ?
                (language === 'qu' ? 'Yanapaykuna reqsiyku' : language === 'en' ? 'Require attention' : 'Requieren atención') :
                (language === 'qu' ? 'Tukuy allinmi' : language === 'en' ? 'All under control' : 'Todo bajo control'),
            action: () => {
                console.log('🔴 Click en Alertas');
                if (isAuthenticated) {
                    onNavigate('alerts'); // ✅ Ahora el tipo coincide
                }
            }
        },
        {
            id: 'recommendations',
            title: language === 'qu' ? 'Kamachikuykuna' : language === 'en' ? 'Recommendations' : 'Recomendaciones',
            value: unreadRecommendations,
            total: unreadRecommendations,
            icon: Lightbulb,
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-50',
            description: priorityRecommendations.length > 0 ?
                (language === 'qu' ? `${priorityRecommendations.length} wakin kamachikuykuna` : language === 'en' ? `${priorityRecommendations.length} priority` : `${priorityRecommendations.length} prioritarias`) :
                (language === 'qu' ? 'Mana ima chaykuna' : language === 'en' ? 'No pending' : 'Sin pendientes'),
            action: () => {
                console.log('🟡 Click en Recomendaciones');
                if (isAuthenticated) {
                    onNavigate('recommendations'); // ✅ Ahora el tipo coincide
                }
            }
        }
    ];

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-medium">
                📊 {language === 'qu' ? 'Kawsaypa qillqay' : language === 'en' ? 'Status Summary' : 'Resumen del Estado'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {summaryCards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <Card
                            key={card.id}
                            className={`${card.bgColor} border-0 hover:shadow-md transition-shadow cursor-pointer min-h-[120px] touch-friendly`}
                            onClick={card.action}
                        >
                            <CardContent className="p-4 h-full flex flex-col justify-center">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className={`p-2 rounded-lg bg-white ${card.color}`}>
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">{card.title}</p>
                                            <div className="flex items-center space-x-2">
                                                <span className="text-2xl font-bold text-gray-900">{card.value}</span>
                                                {card.value > 0 && card.id === 'recommendations' && (
                                                    <Badge className="bg-orange-100 text-orange-800 text-xs">
                                                        {language === 'qu' ? 'Musuq' : language === 'en' ? 'New' : 'Nuevas'}
                                                    </Badge>
                                                )}
                                                {card.value > 0 && card.id === 'alerts' && (
                                                    <Badge className="bg-red-100 text-red-800 text-xs">
                                                        {language === 'qu' ? 'Kallpachasqa' : language === 'en' ? 'Active' : 'Activas'}
                                                    </Badge>
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-600 mt-1">{card.description}</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Alertas importantes */}
            {priorityRecommendations.length > 0 && (
                <Card className="border-orange-200 bg-orange-50">
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-2 mb-2">
                            <Lightbulb className="h-5 w-5 text-orange-600" />
                            <h3 className="font-medium text-orange-900">
                                {language === 'qu' ? 'Ñawpaq kamachikuykuna' : language === 'en' ? 'Priority Recommendations' : 'Recomendaciones Prioritarias'}
                            </h3>
                            <Badge className="bg-orange-100 text-orange-800">
                                {priorityRecommendations.length}
                            </Badge>
                        </div>
                        <p className="text-sm text-orange-800 mb-3">
                            {language === 'qu' ? 'Ñawpaq kamachikuykunata qhawankichik' : language === 'en' ? 'You have important recommendations that require your immediate attention.' : 'Tienes recomendaciones importantes que requieren tu atención inmediata.'}
                        </p>
                        <div className="space-y-2">
                            {priorityRecommendations.slice(0, 2).map((rec) => (
                                <div
                                    key={rec.id}
                                    className="text-sm text-orange-900 bg-white p-2 rounded border-l-4 border-orange-400 cursor-pointer hover:bg-orange-50"
                                    onClick={() => isAuthenticated && onNavigate('recommendations')}
                                >
                                    <p className="font-medium">{rec.title}</p>
                                    {rec.relatedCrop && (
                                        <p className="text-orange-700">
                                            {language === 'qu' ? 'Sallqa kawsay:' : language === 'en' ? 'Crop:' : 'Cultivo:'} {rec.relatedCrop}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                        {priorityRecommendations.length > 2 && (
                            <p className="text-sm text-orange-700 mt-2">
                                {language === 'qu' ? 'Chaymanta' : language === 'en' ? 'And' : 'Y'} {priorityRecommendations.length - 2} {language === 'qu' ? 'astawan' : language === 'en' ? 'more' : 'más'}...
                            </p>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Resumen de cultivos si hay */}
            {crops.length > 0 && (
                <Card
                    className="cursor-pointer hover:shadow-md transition-shadow touch-friendly"
                    onClick={() => isAuthenticated && onNavigate('crops')}
                >
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-medium text-gray-900">
                                {language === 'qu' ? 'Sallqa kawsaykuna' : language === 'en' ? 'Your Crops' : 'Tus Cultivos'}
                            </h3>
                            <Badge variant="outline">{crops.length} total</Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                            {Object.entries(cropStats.byType).map(([type, count]) => {
                                const typeLabels: Record<string, string> = {
                                    papa: '🥔 Papa',
                                    maiz: '🌽 Maíz',
                                    quinua: '🌾 Quinua',
                                    cebada: '🌾 Cebada',
                                    habas: '🫘 Habas',
                                    otro: '🌱 Otro'
                                };

                                return (
                                    <div key={type} className="flex justify-between">
                                        <span className="text-gray-600">{typeLabels[type] || type}</span>
                                        <span className="font-medium">{count}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};