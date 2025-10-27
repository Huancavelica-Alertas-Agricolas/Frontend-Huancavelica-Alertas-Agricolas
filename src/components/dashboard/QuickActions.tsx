import { AlertTriangle, Sprout, Lightbulb, BarChart3, RefreshCw } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { useLanguage } from '../../context/LanguageContext';

interface QuickActionsProps {
    onNavigate: (section: 'alerts' | 'crops' | 'recommendations' | 'reports') => void;
    onRefresh?: () => void;
}

export const QuickActions = ({ onNavigate, onRefresh }: QuickActionsProps) => {
    const { language } = useLanguage();

    // ✅ SOLO ACCIONES DE NAVEGACIÓN
    const navigationActions = [
        {
            id: 'alerts' as const,
            icon: AlertTriangle,
            emoji: '🚨',
            title: language === 'qu' ? 'Kallpachaykuna' : language === 'en' ? 'Alerts' : 'Alertas',
            description: language === 'qu' ? 'Tukuy kallpachaykuna rikuy' : language === 'en' ? 'View all alerts' : 'Ver todas las alertas',
            color: 'text-red-600',
            bgColor: 'bg-red-50',
            hoverColor: 'hover:bg-red-100',
            action: () => onNavigate('alerts')
        },
        {
            id: 'crops' as const,
            icon: Sprout,
            emoji: '🌾',
            title: language === 'qu' ? 'Sallqa kawsaykuna' : language === 'en' ? 'Crops' : 'Cultivos',
            description: language === 'qu' ? 'Sallqa kawsaykuna kamachiy' : language === 'en' ? 'Manage crops' : 'Gestionar cultivos',
            color: 'text-green-600',
            bgColor: 'bg-green-50',
            hoverColor: 'hover:bg-green-100',
            action: () => onNavigate('crops')
        },
        {
            id: 'recommendations' as const,
            icon: Lightbulb,
            emoji: '💡',
            title: language === 'qu' ? 'Kamachikuykuna' : language === 'en' ? 'Recommendations' : 'Recomendaciones',
            description: language === 'qu' ? 'Kamachikuykuna personal' : language === 'en' ? 'Personalized advice' : 'Consejos personalizados',
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-50',
            hoverColor: 'hover:bg-yellow-100',
            action: () => onNavigate('recommendations')
        },
        {
            id: 'reports' as const, // ✅ Cambiado de 'refresh' a 'reports'
            icon: BarChart3,
            emoji: '📊',
            title: language === 'qu' ? 'Willakuykuna' : language === 'en' ? 'Reports' : 'Reportes',
            description: language === 'qu' ? 'Willakuykuna musuqmanta' : language === 'en' ? 'Latest reports' : 'Reportes actualizados',
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
            hoverColor: 'hover:bg-blue-100',
            action: () => onNavigate('reports')
        }
    ];

    return (
        <Card>
            <CardContent className="p-6">
                <h2 className="text-lg font-medium mb-4">
                    {language === 'qu' ? 'Ruraqkunapa ruraqkuna' : language === 'en' ? 'Quick Actions' : 'Acciones Rápidas'}
                </h2>

                {/* ✅ SOLO BOTONES DE NAVEGACIÓN */}
                <div className="grid grid-cols-2 gap-4">
                    {navigationActions.map((action) => (
                        <Button
                            key={action.id}
                            variant="ghost"
                            className={`h-auto p-6 flex flex-col items-center space-y-3 min-h-[100px] ${action.bgColor} ${action.hoverColor} border border-gray-200 rounded-xl touch-friendly`}
                            onClick={action.action}
                        >
                            <div className="text-3xl" role="img" aria-hidden="true">
                                {action.emoji}
                            </div>
                            <div className="text-center">
                                <p className="font-medium text-gray-900 text-base">{action.title}</p>
                                <p className="text-sm text-gray-600">{action.description}</p>
                            </div>
                        </Button>
                    ))}
                </div>

                {/* ✅ BOTÓN DE REFRESH SEPARADO */}
                {onRefresh && (
                    <div className="mt-4 flex justify-center">
                        <Button
                            variant="outline"
                            onClick={onRefresh}
                            className="min-h-[48px] touch-friendly"
                        >
                            <RefreshCw className="h-5 w-5 mr-2" />
                            {language === 'qu' ? 'Musuqmanta' : language === 'en' ? 'Refresh' : 'Actualizar'}
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};