import { useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  MapPin,
  Calendar,
  Sprout,
  Share2,
} from "lucide-react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Badge } from "../ui/badge";
import { useCrops } from "../../hooks/useCrops";
import { CropType } from "../../types";
import { useLanguage } from '../../context/LanguageContext';

const CropManagement = () => {
  const { language } = useLanguage();
  const { crops, addCrop, updateCrop, deleteCrop } = useCrops();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingCrop, setEditingCrop] = useState<string | null>(
    null,
  );

  const [formData, setFormData] = useState({
    name: "",
    type: "" as CropType,
    area: "",
    location: "",
    plantingDate: "",
    harvestDate: "",
  });

  const cropTypeLabels: Record<CropType, string> = {
    papa: "🥔 Papa",
    maiz: "🌽 Maíz",
    quinua: "🌾 Quinua",
    cebada: "🌾 Cebada",
    habas: "🫘 Habas",
    otro: "🌱 Otro",
  };

  const cropTypeColors: Record<CropType, string> = {
    papa: "bg-yellow-100 text-yellow-800",
    maiz: "bg-orange-100 text-orange-800",
    quinua: "bg-green-100 text-green-800",
    cebada: "bg-amber-100 text-amber-800",
    habas: "bg-emerald-100 text-emerald-800",
    otro: "bg-gray-100 text-gray-800",
  };

  const resetForm = () => {
    setFormData({
      name: "",
      type: "" as CropType,
      area: "",
      location: "",
      plantingDate: "",
      harvestDate: "",
    });
    setEditingCrop(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.type ||
      !formData.area ||
      !formData.location
    )
      return;

    const cropData = {
      ...formData,
      area: Number(formData.area),
      plantingDate: formData.plantingDate
        ? new Date(formData.plantingDate)
        : undefined,
      harvestDate: formData.harvestDate
        ? new Date(formData.harvestDate)
        : undefined,
    };

    if (editingCrop) {
      updateCrop(editingCrop, cropData);
    } else {
      addCrop(cropData);
    }

    resetForm();
    setShowAddDialog(false);
  };

  const handleEdit = (cropId: string) => {
    const crop = crops.find((c) => c.id === cropId);
    if (crop) {
      setFormData({
        name: crop.name,
        type: crop.type,
        area: crop.area.toString(),
        location: crop.location,
        plantingDate: crop.plantingDate
          ? crop.plantingDate.toISOString().split("T")[0]
          : "",
        harvestDate: crop.harvestDate
          ? crop.harvestDate.toISOString().split("T")[0]
          : "",
      });
      setEditingCrop(cropId);
      setShowAddDialog(true);
    }
  };

  const handleDelete = (cropId: string) => {
    if (
      confirm(
        "¿Estás seguro de que quieres eliminar este cultivo?",
      )
    ) {
      deleteCrop(cropId);
    }
  };

  const getCropStatus = (crop: any) => {
    if (!crop.plantingDate)
      return {
        status: "Sin plantar",
        color: "bg-gray-100 text-gray-800",
      };

    const now = new Date();
    const plantingDate = new Date(crop.plantingDate);
    const harvestDate = crop.harvestDate
      ? new Date(crop.harvestDate)
      : null;

    if (now < plantingDate) {
      return {
        status: "Por plantar",
        color: "bg-blue-100 text-blue-800",
      };
    } else if (harvestDate && now > harvestDate) {
      return {
        status: "Cosechado",
        color: "bg-green-100 text-green-800",
      };
    } else {
      return {
        status: "En crecimiento",
        color: "bg-yellow-100 text-yellow-800",
      };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header con acción principal */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-medium">
            🌾 {language === 'qu' ? 'Sallqa kawsaykuna kamachiy' : language === 'en' ? 'Crop Management' : 'Gestión de Cultivos'}
          </h1>
          <p className="text-gray-600 mt-2">
            {language === 'qu' ? 'Sallqa kawsaykuna kamachiy, kawsaykuna qillqay' : language === 'en' ? 'Manage your crops and monitor their status' : 'Administra tus cultivos y monitorea su estado'}
          </p>
        </div>

        <div className="flex space-x-2">
          {crops.length > 0 && (
            <div>No crops to share</div>
          )}

          <Dialog
            open={showAddDialog}
            onOpenChange={setShowAddDialog}
          >
            <DialogTrigger asChild>
              <Button
                className="touch-friendly bg-green-600 hover:bg-green-700"
                onClick={() => {
                  resetForm();
                  setShowAddDialog(true);
                }}
              >
                <Plus className="h-5 w-5 mr-2" />
                Agregar Cultivo
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>
                  {editingCrop
                    ? "Editar Cultivo"
                    : "Agregar Nuevo Cultivo"}
                </DialogTitle>
                <DialogDescription>
                  Completa la información del cultivo para un
                  mejor seguimiento
                </DialogDescription>
              </DialogHeader>

              <form
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">
                      Nombre del Cultivo
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          name: e.target.value,
                        })
                      }
                      placeholder="Ej: Papa blanca lote 1"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="type">
                      Tipo de Cultivo
                    </Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value: CropType) =>
                        setFormData({
                          ...formData,
                          type: value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(cropTypeLabels).map(
                          ([key, label]) => (
                            <SelectItem key={key} value={key}>
                              {label}
                            </SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="area">
                      Área (hectáreas)
                    </Label>
                    <Input
                      id="area"
                      type="number"
                      step="0.1"
                      value={formData.area}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          area: e.target.value,
                        })
                      }
                      placeholder="Ej: 2.5"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="location">Ubicación</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          location: e.target.value,
                        })
                      }
                      placeholder="Ej: Sector Alto Verde"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="plantingDate">
                      Fecha de Siembra
                    </Label>
                    <Input
                      id="plantingDate"
                      type="date"
                      value={formData.plantingDate}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          plantingDate: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="harvestDate">
                      Fecha de Cosecha (estimada)
                    </Label>
                    <Input
                      id="harvestDate"
                      type="date"
                      value={formData.harvestDate}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          harvestDate: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      resetForm();
                      setShowAddDialog(false);
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {editingCrop ? "Actualizar" : "Agregar"}{" "}
                    Cultivo
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Lista de cultivos */}
      {crops.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Sprout className="h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No tienes cultivos registrados
            </h3>
            <p className="text-gray-600 text-center mb-6">
              Comienza agregando tu primer cultivo para recibir
              alertas y recomendaciones personalizadas
            </p>
            <Button
              onClick={() => setShowAddDialog(true)}
              className="touch-friendly bg-green-600 hover:bg-green-700"
            >
              <Plus className="h-5 w-5 mr-2" />
              Agregar Primer Cultivo
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {crops.map((crop) => {
            const status = getCropStatus(crop);
            return (
              <Card
                key={crop.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      {crop.name}
                    </CardTitle>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(crop.id)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(crop.id)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Badge
                      className={cropTypeColors[crop.type]}
                    >
                      {cropTypeLabels[crop.type]}
                    </Badge>
                    <Badge className={status.color}>
                      {status.status}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    {crop.location} • {crop.area} ha
                  </div>

                  {crop.plantingDate && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      Siembra:{" "}
                      {crop.plantingDate.toLocaleDateString()}
                    </div>
                  )}

                  {crop.harvestDate && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      Cosecha:{" "}
                      {crop.harvestDate.toLocaleDateString()}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CropManagement;