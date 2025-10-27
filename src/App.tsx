import React, { useState, useEffect, Suspense, lazy } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Routes, Route, Navigate } from 'react-router-dom';

// Componentes
import { RegistrationForm } from './components/form/RegistrationForm';
import { WelcomeScreen } from './components/welcome/WelcomeScreen';
import LoginForm from './components/auth/LoginForm';
import { Header } from './components/shared/Header';
import { BottomNav } from './components/shared/BottomNav';
import { WeatherWidget } from './components/dashboard/WeatherWidget';
import { AlertCard } from './components/dashboard/AlertCard';
import { QuickActions } from './components/dashboard/QuickActions';
import { DashboardSummary } from './components/dashboard/DashboardSummary';
import { AlertDetail } from './components/alerts/AlertDetail';
import { Button } from './components/ui/button';
import { useAuth } from './hooks/useAuth';
import { useAlerts } from './hooks/useAlerts';
import { useWeather } from './hooks/useWeather';
import { Alert } from './types';

// Lazy loading para componentes pesados
const AlertsHistoryScreen = lazy(() => import('./components/alerts/AlertsHistoryScreen'));
const ReportGenerator = lazy(() => import('./components/reports/ReportGenerator'));
const CropManagement = lazy(() => import('./components/crops/CropManagement'));
const RecommendationSystem = lazy(() => import('./components/recommendations/RecommendationSystem'));
const ConfigurationScreen = lazy(() => import('./components/configuration/ConfigurationScreen'));
const UserProfile = lazy(() => import('./components/profile/UserProfile'));
const ActorsInfo = lazy(() => import('./components/about/ActorsInfo'));
const UserManual = lazy(() => import('./components/about/UserManual'));

// Loading component
const PageLoader = () => (
    <div className="flex justify-center items-center py-12">
        <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mr-3"></div>
        <span className="text-gray-600">Cargando...</span>
    </div>
);

// DashboardLoader simple
function DashboardLoader({ children }: { children: React.ReactNode }) {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 500);
        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}

function App() {
    const { isAuthenticated, isLoading } = useAuth();
    const { activeAlerts, shareAlert, isLoading: isAlertsLoading, refreshAlerts } = useAlerts();
    const { refreshWeather } = useWeather();
    const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
    const navigate = useNavigate();
    const location = useLocation();

    // ✅ NAVEGACIÓN SUPER SIMPLE - SIN COMPLEJIDAD
    const handleNavigate = (section: 'alerts' | 'crops' | 'recommendations' | 'reports') => {
        console.log(`🚀 Navegando a: /${section}`);
        navigate(`/${section}`);
    };

    // ✅ REFRESCO SIMPLE
    const handleRefresh = async () => {
        try {
            await refreshWeather();
            await refreshAlerts();
        } catch (error) {
            console.error('Error al actualizar:', error);
        }
    };

    // ✅ REDIRECCIÓN BÁSICA - SIN BUCLE
    useEffect(() => {
        if (!isLoading) {
            const currentPath = location.pathname;

            if (isAuthenticated) {
                if (currentPath === '/login' || currentPath === '/register' || currentPath === '/') {
                    navigate('/dashboard', { replace: true });
                }
            } else {
                const publicRoutes = ['/login', '/register', '/about/actors', '/about/manual'];
                if (!publicRoutes.includes(currentPath)) {
                    navigate('/login', { replace: true });
                }
            }
        }
    }, [isAuthenticated, isLoading, navigate, location]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Verificando autenticación...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <Header />
            <main className="max-w-4xl mx-auto p-4 md:p-6 min-h-screen bg-gray-50 pb-20 md:pb-4">
                <Suspense fallback={<PageLoader />}>
                    <Routes>
                        {/* Rutas públicas */}
                        <Route path="/" element={
                            !isAuthenticated ? <Navigate to="/login" replace /> : <WelcomeScreen onEnter={() => navigate('/dashboard')} />
                        } />
                        <Route path="/login" element={
                            isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginForm onSuccess={() => navigate('/dashboard')} />
                        } />
                        <Route path="/register" element={
                            isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegistrationForm />
                        } />

                        {/* ✅ DASHBOARD PRINCIPAL */}
                        <Route path="/dashboard" element={
                            !isAuthenticated ? <Navigate to="/login" replace /> : (
                                <DashboardLoader>
                                    <div className="space-y-6">
                                        <WeatherWidget />
                                        <DashboardSummary onNavigate={handleNavigate} />
                                        {isAlertsLoading ? (
                                            <div className="flex justify-center items-center py-8">
                                                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                                                <span className="text-gray-600">Cargando alertas...</span>
                                            </div>
                                        ) : activeAlerts.length > 0 && (
                                            <div>
                                                <h2 className="text-xl font-medium mb-6">🚨 Alertas Activas</h2>
                                                <div className="grid gap-4">
                                                    {activeAlerts.slice(0, 3).map((alert) => (
                                                        <AlertCard
                                                            key={alert.id}
                                                            alert={alert}
                                                            onClick={() => setSelectedAlert(alert)}
                                                        />
                                                    ))}
                                                </div>
                                                {activeAlerts.length > 3 && (
                                                    <div className="mt-4 text-center">
                                                        <Button
                                                            variant="outline"
                                                            onClick={() => handleNavigate('alerts')}
                                                            className="min-h-[44px]"
                                                        >
                                                            Ver todas las alertas ({activeAlerts.length})
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        <QuickActions onNavigate={handleNavigate} onRefresh={handleRefresh} />
                                    </div>
                                </DashboardLoader>
                            )
                        } />

                        {/* ✅ RUTAS PRINCIPALES - ESTAS DEBEN FUNCIONAR */}
                        <Route path="/alerts" element={
                            !isAuthenticated ? <Navigate to="/login" replace /> : <AlertsHistoryScreen onAlertClick={setSelectedAlert} />
                        } />
                        <Route path="/reports" element={
                            !isAuthenticated ? <Navigate to="/login" replace /> : <ReportGenerator />
                        } />
                        <Route path="/crops" element={
                            !isAuthenticated ? <Navigate to="/login" replace /> : <CropManagement />
                        } />
                        <Route path="/recommendations" element={
                            !isAuthenticated ? <Navigate to="/login" replace /> : <RecommendationSystem />
                        } />

                        {/* Otras rutas */}
                        <Route path="/configuration" element={
                            !isAuthenticated ? <Navigate to="/login" replace /> : <ConfigurationScreen />
                        } />
                        <Route path="/profile" element={
                            !isAuthenticated ? <Navigate to="/login" replace /> : <UserProfile />
                        } />
                        <Route path="/about/actors" element={
                            !isAuthenticated ? <Navigate to="/login" replace /> : <ActorsInfo />
                        } />
                        <Route path="/about/manual" element={
                            !isAuthenticated ? <Navigate to="/login" replace /> : <UserManual />
                        } />

                        <Route path="*" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                </Suspense>

                {selectedAlert && (
                    <AlertDetail
                        alert={selectedAlert}
                        onClose={() => setSelectedAlert(null)}
                        onShare={shareAlert}
                    />
                )}
            </main>

            <BottomNav
                currentSection={window.location.pathname.replace('/', '') === 'configuration' ? 'profile' : window.location.pathname.replace('/', '') as any}
                onSectionChange={(section) => navigate(`/${section === 'profile' ? 'configuration' : section}`)}
            />
        </>
    );
}

export default App;