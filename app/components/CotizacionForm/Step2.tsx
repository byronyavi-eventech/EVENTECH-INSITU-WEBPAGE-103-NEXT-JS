import { useFormContext, Controller, useWatch } from "react-hook-form";
import type { CotizacionFormData } from "./CotizacionForm";
import { regionesYComunas, regiones } from "../../utils/locations";

const Step2 = () => {
  const {
    control,
    formState: { errors },
    setValue,
    register,
    trigger,
  } = useFormContext<CotizacionFormData>();
  const regionSeleccionada = useWatch({ control, name: "regionObra" });
  const comunasDisponibles = regionSeleccionada
    ? (regionesYComunas[regionSeleccionada] ?? [])
    : [];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-xl font-bold text-gray-900 border-b pb-2">
        Datos de la Obra
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre de la Obra *
          </label>
          <input
            {...register("nombreObra")}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors"
            placeholder="Ej: Edificio Los Leones"
          />
          {errors.nombreObra && (
            <p className="text-red-500 text-xs mt-1">
              {errors.nombreObra.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre del Mandante / Propietario *
          </label>
          <input
            {...register("nombreMandante")}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors"
            placeholder="Ej: Inmobiliaria A"
          />
          {errors.nombreMandante && (
            <p className="text-red-500 text-xs mt-1">
              {errors.nombreMandante.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre del Contratista *
          </label>
          <input
            {...register("nombreContratista")}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors"
            placeholder="Ej: Constructora B"
          />
          {errors.nombreContratista && (
            <p className="text-red-500 text-xs mt-1">
              {errors.nombreContratista.message}
            </p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ubicación de la Obra *
          </label>
          <input
            {...register("ubicacionObra")}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors"
            placeholder="Ej: Av. Los Leones 2000"
          />
          {errors.ubicacionObra && (
            <p className="text-red-500 text-xs mt-1">
              {errors.ubicacionObra.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Región *
          </label>
          <Controller
            name="regionObra"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                onChange={(e) => {
                  field.onChange(e);
                  setValue("comunaObra", "");
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-white transition-colors"
              >
                <option value="">Seleccione una región</option>
                {regiones.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            )}
          />
          {errors.regionObra && (
            <p className="text-red-500 text-xs mt-1">
              {errors.regionObra.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Comuna *
          </label>
          <Controller
            name="comunaObra"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-white transition-colors disabled:opacity-50 disabled:bg-gray-100"
                disabled={!regionSeleccionada}
              >
                <option value="">Seleccione una comuna</option>
                {comunasDisponibles.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            )}
          />
          {errors.comunaObra && (
            <p className="text-red-500 text-xs mt-1">
              {errors.comunaObra.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ciudad *
          </label>
          <input
            {...register("ciudadObra")}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors"
            placeholder="Ej: Santiago"
          />
          {errors.ciudadObra && (
            <p className="text-red-500 text-xs mt-1">
              {errors.ciudadObra.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Duración de la Obra (meses) *
          </label>
          <input
            type="number"
            {...register("duracionObra")}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors"
            placeholder="Ej: 12"
          />
          {errors.duracionObra && (
            <p className="text-red-500 text-xs mt-1">
              {errors.duracionObra.message}
            </p>
          )}
        </div>
      </div>

      <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mt-2">
        Datos del Encargado de la Obra
      </h3>

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
            {...register("correoEncargado", {
              onBlur: () => trigger("correoEncargado"),
            })}
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
            {...register("telefonoEncargado", {
              onBlur: () => trigger("telefonoEncargado"),
            })}
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

export default Step2;
