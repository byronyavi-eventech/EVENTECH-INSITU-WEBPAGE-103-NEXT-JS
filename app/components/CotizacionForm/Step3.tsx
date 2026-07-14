import { useFormContext } from "react-hook-form";
import type { CotizacionFormData } from "./CotizacionForm";

const Step3 = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<CotizacionFormData>();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-xl font-bold text-gray-900 border-b pb-2">
        Datos del Encargado de la Obra
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre del Encargado *
          </label>
          <input
            {...register("nombreEncargado")}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors"
            placeholder="Ej: Carlos Silva"
          />
          {errors.nombreEncargado && (
            <p className="text-red-500 text-xs mt-1">
              {errors.nombreEncargado.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Correo del Encargado *
          </label>
          <input
            type="email"
            {...register("correoEncargado")}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors"
            placeholder="Ej: carlos.silva@empresa.cl"
          />
          {errors.correoEncargado && (
            <p className="text-red-500 text-xs mt-1">
              {errors.correoEncargado.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Teléfono del Encargado *
          </label>
          <input
            {...register("telefonoEncargado")}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors"
            placeholder="Ej: +569 8765 4321"
          />
          {errors.telefonoEncargado && (
            <p className="text-red-500 text-xs mt-1">
              {errors.telefonoEncargado.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Step3;
