import { useState } from 'react';
import { Calendar, Download, FileImage } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';
import { TemperatureChart } from './TemperatureChart';
import { CropType, Report } from '../../types';
import { CROP_TYPES, DATE_RANGES } from '../../utils/constants';

const ReportGenerator = () => {
  const [selectedCrop, setSelectedCrop] = useState<CropType>('papa');
  const [selectedPeriod, setSelectedPeriod] = useState<number>(7);
  const [currentReport, setCurrentReport] = useState<Report | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateReport = async () => {
  setIsGenerating(true);
  // Simular tiempo de generación
  await new Promise(resolve => setTimeout(resolve, 1000));
  // TODO: Reemplazar con llamada real a backend
  // const report = await fetchReport(selectedCrop, selectedPeriod);
  setCurrentReport(null); // No hay datos de reporte por ahora
  setIsGenerating(false);
  };

  const exportReport = (format: 'image' | 'pdf') => {
    // Simulación de exportación
    const filename = `reporte_${selectedCrop}_${selectedPeriod}dias.${format}`;
    
    if (format === 'image') {
      // En una implementación real, se capturaría el chart como imagen
      alert(`Exportando como imagen: ${filename}`);
    } else {
      // En una implementación real, se generaría un PDF
      alert(`Exportando como PDF: ${filename}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Configuración del reporte */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">📊 Generar Reporte de Temperaturas</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Selector de cultivo */}
            <div className="space-y-2">
              <Label className="text-base">🌾 Tipo de Cultivo</Label>
              <Select value={selectedCrop} onValueChange={(value: string) => setSelectedCrop(value as CropType)}>
                <SelectTrigger className="min-h-[44px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(CROP_TYPES).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Selector de período */}
            <div className="space-y-2">
              <Label className="text-base">📅 Período de Análisis</Label>
              <Select value={selectedPeriod.toString()} onValueChange={(value: string) => setSelectedPeriod(Number(value))}>
                <SelectTrigger className="min-h-[44px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Últimos 7 días</SelectItem>
                  <SelectItem value="15">Últimos 15 días</SelectItem>
                  <SelectItem value="30">Últimos 30 días</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex space-x-3">
            <Button
              onClick={generateReport}
              disabled={isGenerating}
              className="min-h-[48px] text-base touch-friendly bg-blue-600 hover:bg-blue-700"
            >
              <Calendar className="h-5 w-5 mr-2" />
              {isGenerating ? '⏳ Generando...' : '📊 Generar Reporte'}
            </Button>

            {currentReport && (
              <>
                <Button
                  variant="outline"
                  onClick={() => exportReport('image')}
                  className="min-h-[48px] text-base touch-friendly"
                >
                  <FileImage className="h-5 w-5 mr-2" />
                  🖼️ Exportar Imagen
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => exportReport('pdf')}
                  className="min-h-[48px] text-base touch-friendly"
                >
                  <Download className="h-5 w-5 mr-2" />
                  📄 Exportar PDF
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Gráfico de temperaturas */}
      {currentReport && <TemperatureChart report={currentReport} />}

      {/* Información sobre los reportes */}
      {!currentReport && (
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-gray-500 space-y-4">
              <div className="text-6xl">📊</div>
              <h3 className="font-medium text-gray-700 text-lg">Genera tu primer reporte</h3>
              <p className="text-base">
                Selecciona un tipo de cultivo y período para ver el análisis de temperaturas y alertas.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ReportGenerator;