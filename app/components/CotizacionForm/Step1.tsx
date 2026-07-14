import { useFormContext, Controller, useWatch } from "react-hook-form";
import type { CotizacionFormData } from "./CotizacionForm";
import { regionesYComunas, regiones } from "../../utils/locations";
import { format as formatRut, clean as cleanRut } from "rut.js";

const Step1 = () => {
  const {
    control,
    formState: { errors },
    setValue,
    register,
  } = useFormContext<CotizacionFormData>();
  const regionSeleccionada = useWatch({ control, name: "regionEmpresa" });
  const comunasDisponibles = regionSeleccionada
    ? (regionesYComunas[regionSeleccionada] ?? [])
    : [];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-xl font-bold text-gray-900 border-b pb-2">
        Datos del Cotizante
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            RUT de la Empresa *
          </label>
          <input
            {...register("rutEmpresa")}
            onChange={(e) => {
              const cleanValue = cleanRut(e.target.value);
              const formatted = cleanValue ? formatRut(cleanValue) : "";
              setValue("rutEmpresa", formatted, {
                shouldValidate: true,
                shouldDirty: true,
              });
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors"
            placeholder="Ej: 76.123.456-K"
          />
          {errors.rutEmpresa && (
            <p className="text-red-500 text-xs mt-1">
              {errors.rutEmpresa.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre de la Empresa *
          </label>
          <input
            {...register("giroEmpresa")}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors"
            placeholder="Ej: Constructora"
          />
          {errors.giroEmpresa && (
            <p className="text-red-500 text-xs mt-1">
              {errors.giroEmpresa.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre de Contacto *
          </label>
          <input
            {...register("nombreContacto")}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors"
            placeholder="Ej: Juan"
          />
          {errors.nombreContacto && (
            <p className="text-red-500 text-xs mt-1">
              {errors.nombreContacto.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Apellidos de Contacto *
          </label>
          <input
            {...register("apellidosContacto")}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors"
            placeholder="Ej: Pérez González"
          />
          {errors.apellidosContacto && (
            <p className="text-red-500 text-xs mt-1">
              {errors.apellidosContacto.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Celular de Contacto *
          </label>
          <input
            {...register("celularContacto")}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors"
            placeholder="Ej: +569 1234 5678"
          />
          {errors.celularContacto && (
            <p className="text-red-500 text-xs mt-1">
              {errors.celularContacto.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            {...register("emailContacto")}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors"
            placeholder="Ej: juan.perez@empresa.cl"
          />
          {errors.emailContacto && (
            <p className="text-red-500 text-xs mt-1">
              {errors.emailContacto.message}
            </p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Dirección de la Empresa *
          </label>
          <input
            {...register("direccionEmpresa")}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors"
            placeholder="Ej: Av. Apoquindo 1234, Of 56"
          />
          {errors.direccionEmpresa && (
            <p className="text-red-500 text-xs mt-1">
              {errors.direccionEmpresa.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Región *
          </label>
          <Controller
            name="regionEmpresa"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                onChange={(e) => {
                  field.onChange(e);
                  setValue("comunaEmpresa", "");
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
          {errors.regionEmpresa && (
            <p className="text-red-500 text-xs mt-1">
              {errors.regionEmpresa.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Comuna *
          </label>
          <Controller
            name="comunaEmpresa"
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
          {errors.comunaEmpresa && (
            <p className="text-red-500 text-xs mt-1">
              {errors.comunaEmpresa.message}
            </p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ciudad *
          </label>
          <input
            {...register("ciudadEmpresa")}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors"
            placeholder="Ej: Santiago"
          />
          {errors.ciudadEmpresa && (
            <p className="text-red-500 text-xs mt-1">
              {errors.ciudadEmpresa.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Step1;
