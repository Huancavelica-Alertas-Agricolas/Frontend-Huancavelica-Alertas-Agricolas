// Tipos para la plataforma de alertas climáticas

export type SeverityLevel = 'alto' | 'medio' | 'bajo';

export type AlertType = 'lluvia_intensa' | 'helada' | 'sequia' | 'granizo' | 'viento_fuerte';

export type CropType = 'papa' | 'maiz' | 'quinua' | 'cebada' | 'habas' | 'otro';

export interface User {
    id: string;
    phone: string;
    name: string;
    location: string;
    isAuthenticated: boolean;
    profile?: any; // ✅ AGREGAR ESTA LÍNEA
    notifications: {
        sms: boolean;
        telegram: boolean;
        email: boolean;
    };
}

export interface WeatherData {
    temperature: number;
    humidity: number;
    windSpeed: number;
    rainfall: number;
    lastUpdated: Date;
    location: string;
}

export interface Alert {
    id: string;
    type: AlertType;
    severity: SeverityLevel;
    title: string;
    description: string;
    recommendations: string[];
    isActive: boolean;
    createdAt: Date;
    validUntil: Date;
    affectedAreas: string[];
    weatherData: {
        temperature?: number;
        windSpeed?: number;
        rainfall?: number;
    };
}

export interface Report {
    id: string;
    cropType: CropType;
    dateRange: {
        start: Date;
        end: Date;
    };
    temperatureData: {
        date: Date;
        temperature: number;
        hasAlert: boolean;
    }[];
    alertsCount: {
        alto: number;
        medio: number;
        bajo: number;
    };
}

export interface AuthFormData {
    phone: string;
    password: string;
}

export interface ConsentData {
    sms: boolean;
    telegram: boolean;
    email: boolean;
}