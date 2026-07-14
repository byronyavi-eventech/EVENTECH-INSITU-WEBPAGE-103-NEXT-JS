import {
  useFormContext,
  useFieldArray,
  Controller,
  useWatch,
} from "react-hook-form";
import type { CotizacionFormData } from "./CotizacionForm";
import { Plus, Trash2 } from "lucide-react";
import { ensayosData } from "../../data/ensayos";

const Step4 = () => {
  const {
    control,
    formState: { errors },
    setValue,
    register,
  } = useFormContext<CotizacionFormData>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "ensayos",
  });

  const ensayosValues =
    useWatch({
      control,
      name: "ensayos",
    }) || [];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center border-b pb-2">
        <h2 className="text-xl font-bold text-gray-900">Ensayos y Normas</h2>
        <button
          type="button"
          onClick={() =>
            append({
              area: "",
              subarea: "",
              ensayo: "",
              cantidad: 1,
              visitas: 1,
            })
          }
          className="flex items-center gap-1 text-sm font-medium text-primary-hover hover:text-primary transition-colors bg-primary/10 px-3 py-1.5 rounded-lg"
        >
          <Plus size={16} />
          Agregar Ensayo
        </button>
      </div>

      {fields.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-300">
          <p className="text-gray-500 mb-2">
            No has agregado ningún ensayo aún.
          </p>
          <button
            type="button"
            onClick={() =>
              append({
                area: "",
                subarea: "",
                ensayo: "",
                cantidad: 1,
                visitas: 1,
              })
            }
            className="text-primary-hover font-medium underline"
          >
            Agregar mi primer ensayo
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {fields.map((field, index) => {
            const currentAreaName = ensayosValues[index]?.area;
            const currentSubAreaName = ensayosValues[index]?.subarea;

            const selectedArea = ensayosData.find(
              (a) => a.nombre === currentAreaName,
            );
            const selectedSubArea = selectedArea?.subareas.find(
              (sa) => sa.nombre === currentSubAreaName,
            );

            return (
              <div
                key={field.id}
                className="p-5 bg-gray-50 rounded-xl border border-gray-200 relative group"
              >
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors p-1"
                  title="Eliminar ensayo"
                >
                  <Trash2 size={18} />
                </button>

                <h4 className="font-semibold text-gray-800 mb-4 pr-8">
                  Ensayo #{index + 1}
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  {/* Area */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Área *
                    </label>
                    <Controller
                      name={`ensayos.${index}.area`}
                      control={control}
                      render={({ field }) => (
                        <select
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            setValue(`ensayos.${index}.subarea`, "");
                            setValue(`ensayos.${index}.ensayo`, "");
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-white transition-colors text-sm"
                        >
                          <option value="">Seleccionar Área...</option>
                          {ensayosData.map((area) => (
                            <option key={area.nombre} value={area.nombre}>
                              {area.nombre}
                            </option>
                          ))}
                        </select>
                      )}
                    />
                    {errors.ensayos?.[index]?.area && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.ensayos[index]?.area?.message}
                      </p>
                    )}
                  </div>

                  {/* SubArea */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sub Área *
                    </label>
                    <Controller
                      name={`ensayos.${index}.subarea`}
                      control={control}
                      render={({ field }) => (
                        <select
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            setValue(`ensayos.${index}.ensayo`, "");
                          }}
                          disabled={!currentAreaName}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-white transition-colors text-sm disabled:bg-gray-100 disabled:text-gray-400"
                        >
                          <option value="">Seleccionar Sub Área...</option>
                          {selectedArea?.subareas.map((subarea) => (
                            <option key={subarea.nombre} value={subarea.nombre}>
                              {subarea.nombre}
                            </option>
                          ))}
                        </select>
                      )}
                    />
                    {errors.ensayos?.[index]?.subarea && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.ensayos[index]?.subarea?.message}
                      </p>
                    )}
                  </div>

                  {/* Ensayo */}
                  <div className="md:col-span-2 lg:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo de Ensayo *
                    </label>
                    <Controller
                      name={`ensayos.${index}.ensayo`}
                      control={control}
                      render={({ field }) => (
                        <select
                          {...field}
                          disabled={!currentSubAreaName}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-white transition-colors text-sm disabled:bg-gray-100 disabled:text-gray-400"
                        >
                          <option value="">Seleccionar Ensayo...</option>
                          {selectedSubArea?.ensayos.map((ensayo) => (
                            <option key={ensayo.nombre} value={ensayo.nombre}>
                              {ensayo.nombre}{" "}
                              {ensayo.norma !== "N/A"
                                ? `(${ensayo.norma})`
                                : ""}
                            </option>
                          ))}
                        </select>
                      )}
                    />
                    {errors.ensayos?.[index]?.ensayo && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.ensayos[index]?.ensayo?.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-200 pt-4 mt-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cantidad de Ensayos *
                    </label>
                    <input
                      type="number"
                      {...register(`ensayos.${index}.cantidad` as const)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors text-sm"
                    />
                    {errors.ensayos?.[index]?.cantidad && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.ensayos[index]?.cantidad?.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cantidad de Visitas *
                    </label>
                    <input
                      type="number"
                      {...register(`ensayos.${index}.visitas` as const)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors text-sm"
                    />
                    {errors.ensayos?.[index]?.visitas && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.ensayos[index]?.visitas?.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Step4;
