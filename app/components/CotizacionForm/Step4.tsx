import { useState, useMemo, useRef, useEffect } from "react";
import { useFormContext, useFieldArray, useWatch } from "react-hook-form";
import type { CotizacionFormData } from "./CotizacionForm";
import {
  Search,
  Plus,
  Trash2,
  ChevronDown,
  ChevronRight,
  FlaskConical,
  X,
} from "lucide-react";
import { ensayosData } from "../../data/ensayos";

// alias de los ensayos
const sinonimos: Record<string, string[]> = {
  cemento: [
    "hormigon",
    "compresion",
    "probetas",
    "docilidad",
    "abrams",
    "curado",
    "cono",
  ],
  tierra: [
    "suelos",
    "cbr",
    "granulometrico",
    "humedad",
    "pavimentacion",
    "proctor",
    "limite",
  ],
  asfalto: [
    "asfaltico",
    "bitumen",
    "mezclas asfalticas",
    "marshall",
    "muestreo",
    "espesor",
    "ignicion",
  ],
  pintura: ["adherencia", "espesor de pintura", "toquimetro"],
  fisura: ["traccion", "flexion", "hendimiento"],
  perno: ["pernos", "anclaje"],
  ultrasonido: ["radiografia", "end", "no destructivos"],
  arena: ["arenas", "densidad neta", "absorcion de agua"],
  grava: ["gravas", "cubicidad"],
  compactacion: ["proctor", "cbr"],
  resistencia: ["compresion", "traccion", "flexion", "hendimiento"],
  suelo: [
    "suelos",
    "cbr",
    "proctor",
    "granulometrico",
    "limite liquido",
    "limite plastico",
  ],
  pavimento: ["pavimentacion", "asfalto", "densidad"],
  hormigon: ["compresion", "docilidad", "probetas", "curado", "abrams"],
  laboratorio: ["ensayo", "norma"],
  calicata: ["calicatas", "ingenieria"],
  sondaje: ["sondaje", "ingenieria"],
  vibra: ["vibraciones"],
};

// Aplanar todos los ensayos para búsqueda
interface EnsayoFlat {
  area: string;
  subarea: string;
  ensayo: string;
  norma: string;
  areaIndex: number;
}

const allEnsayos: EnsayoFlat[] = ensayosData.flatMap((area, areaIndex) =>
  area.subareas.flatMap((subarea) =>
    subarea.ensayos.map((ensayo) => ({
      area: area.nombre,
      subarea: subarea.nombre,
      ensayo: ensayo.nombre,
      norma: ensayo.norma,
      areaIndex,
    })),
  ),
);

function buscarEnsayos(query: string): EnsayoFlat[] {
  const q = query.toLowerCase().trim();
  if (q.length < 2) return [];

  // Expandir con sinónimos
  const terminos = new Set<string>([q]);
  for (const [clave, valores] of Object.entries(sinonimos)) {
    const coincideClave = q.includes(clave) || clave.includes(q);
    const coincideValor = valores.some((v) => q.includes(v) || v.includes(q));
    if (coincideClave || coincideValor) {
      terminos.add(clave);
      valores.forEach((v) => terminos.add(v));
    }
  }

  return allEnsayos.filter((item) => {
    const texto =
      `${item.area} ${item.subarea} ${item.ensayo} ${item.norma}`.toLowerCase();
    return Array.from(terminos).some((t) => texto.includes(t));
  });
}

// Colores por área
const AREA_COLORS = [
  { bg: "bg-blue-100", text: "text-blue-700", dot: "bg-blue-500" },
  { bg: "bg-amber-100", text: "text-amber-700", dot: "bg-amber-500" },
  { bg: "bg-purple-100", text: "text-purple-700", dot: "bg-purple-500" },
  { bg: "bg-orange-100", text: "text-orange-700", dot: "bg-orange-500" },
  { bg: "bg-green-100", text: "text-green-700", dot: "bg-green-500" },
  { bg: "bg-rose-100", text: "text-rose-700", dot: "bg-rose-500" },
  { bg: "bg-cyan-100", text: "text-cyan-700", dot: "bg-cyan-500" },
];

const areaColorMap = new Map<string, (typeof AREA_COLORS)[number]>();
ensayosData.forEach((area, i) => {
  areaColorMap.set(area.nombre, AREA_COLORS[i % AREA_COLORS.length]);
});

// Componente principal
const Step4 = () => {
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [openAreas, setOpenAreas] = useState<Record<string, boolean>>({});
  const [openSubareas, setOpenSubareas] = useState<Record<string, boolean>>({});
  const searchRef = useRef<HTMLDivElement>(null);

  const {
    control,
    formState: { errors },
    register,
  } = useFormContext<CotizacionFormData>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "ensayos",
  });

  const ensayosValues = useWatch({ control, name: "ensayos" }) || [];

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const searchResults = useMemo(() => buscarEnsayos(query), [query]);

  const handleAdd = (item: EnsayoFlat) => {
    append({
      area: item.area,
      subarea: item.subarea,
      ensayo: item.ensayo,
      cantidad: 1,
    });
    setQuery("");
    setShowDropdown(false);
  };

  const handleAddFromCatalog = (
    area: string,
    subarea: string,
    ensayo: string,
  ) => {
    append({ area, subarea, ensayo, cantidad: 1 });
  };

  const toggleArea = (name: string) =>
    setOpenAreas((p) => ({ ...p, [name]: !p[name] }));

  const toggleSubarea = (key: string) =>
    setOpenSubareas((p) => ({ ...p, [key]: !p[key] }));

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* ── Header ── */}
      <div className="flex justify-between items-center border-b pb-2">
        <h2 className="text-xl font-bold text-gray-900">Ensayos y Normas</h2>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
          {fields.length} seleccionado{fields.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* ── Cantidad de Visitas a Terreno (global, toda la cotización) ── */}
      <div className="flex flex-wrap items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
        <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
          Cantidad de Visitas a Terreno *
        </label>
        <select
          {...register("visitasTotales", { valueAsNumber: true })}
          className="w-20 px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-white transition-colors text-sm"
        >
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
        <p className="text-xs text-gray-400">
          En cuántas visitas a terreno se realizarán todos los ensayos de esta
          cotización.
        </p>
        {errors.visitasTotales && (
          <p className="text-red-500 text-xs w-full">
            {errors.visitasTotales.message}
          </p>
        )}
      </div>

      {/* ── Buscador ── */}
      <div ref={searchRef} className="relative">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            placeholder='Buscar ensayo... ej: "cemento", "asfalto", "CBR"'
            className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm shadow-sm"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setShowDropdown(false);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Dropdown de resultados */}
        {showDropdown && query.length >= 2 && (
          <div className="absolute z-20 top-full mt-1 w-full bg-white rounded-xl shadow-xl border border-gray-200 max-h-72 overflow-y-auto">
            {searchResults.length === 0 ? (
              <div className="px-4 py-6 text-center text-sm text-gray-500">
                <FlaskConical
                  size={24}
                  className="mx-auto mb-2 text-gray-300"
                />
                <p>
                  Sin resultados para <strong>"{query}"</strong>
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Prueba con otro término o explora el catálogo abajo
                </p>
              </div>
            ) : (
              <ul className="py-1">
                {searchResults.map((item, i) => {
                  const color = areaColorMap.get(item.area) ?? AREA_COLORS[0];
                  return (
                    <li key={i}>
                      <button
                        type="button"
                        onClick={() => handleAdd(item)}
                        className="w-full flex items-center justify-between gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left group"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate">
                            {item.ensayo}
                          </p>
                          <p className="text-xs text-gray-400 truncate">
                            {item.norma}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span
                            className={`text-xs font-medium px-2 py-0.5 rounded-full ${color.bg} ${color.text} hidden sm:inline-block`}
                          >
                            {item.area.split(" - ")[1] ?? item.area}
                          </span>
                          <span className="text-xs text-primary-hover font-semibold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
                            <Plus size={13} /> Agregar
                          </span>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* Lista de ensayos seleccionados */}
      {fields.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <FlaskConical size={15} className="text-primary-hover" />
            Ensayos seleccionados
          </h3>
          {fields.map((field, index) => {
            const color =
              areaColorMap.get(ensayosValues[index]?.area ?? "") ??
              AREA_COLORS[0];
            return (
              <div
                key={field.id}
                className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${color.bg} ${color.text}`}
                      >
                        {(ensayosValues[index]?.area ?? "").split(" - ")[1] ??
                          ensayosValues[index]?.area}
                      </span>
                      <span className="text-xs text-gray-400">›</span>
                      <span className="text-xs text-gray-500">
                        {ensayosValues[index]?.subarea}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-gray-800">
                      {ensayosValues[index]?.ensayo}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-gray-300 hover:text-red-500 transition-colors p-1 shrink-0"
                    title="Eliminar ensayo"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-3 border-t border-gray-100 pt-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Cantidad de Ensayos *
                    </label>
                    <input
                      type="number"
                      min={1}
                      {...register(`ensayos.${index}.cantidad` as const, {
                        valueAsNumber: true,
                      })}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors text-sm"
                    />
                    {errors.ensayos?.[index]?.cantidad && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.ensayos[index]?.cantidad?.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/*   Catálogo por área (acordeones) */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          — O explorar por área —
        </p>
        <div className="space-y-2">
          {ensayosData.map((area) => {
            const color = areaColorMap.get(area.nombre) ?? AREA_COLORS[0];
            const isAreaOpen = !!openAreas[area.nombre];
            const totalEnsayos = area.subareas.reduce(
              (acc, sa) => acc + sa.ensayos.length,
              0,
            );

            return (
              <div
                key={area.nombre}
                className="border border-gray-200 rounded-xl overflow-hidden"
              >
                {/* Cabecera del área */}
                <button
                  type="button"
                  onClick={() => toggleArea(area.nombre)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full ${color.dot}`} />
                    <span className="text-sm font-semibold text-gray-700">
                      {area.nombre}
                    </span>
                    <span className="text-xs text-gray-400">
                      ({totalEnsayos} ensayos)
                    </span>
                  </div>
                  {isAreaOpen ? (
                    <ChevronDown size={16} className="text-gray-400 shrink-0" />
                  ) : (
                    <ChevronRight
                      size={16}
                      className="text-gray-400 shrink-0"
                    />
                  )}
                </button>

                {/* Subareas */}
                {isAreaOpen && (
                  <div className="divide-y divide-gray-100">
                    {area.subareas.map((subarea) => {
                      const subareaKey = `${area.nombre}::${subarea.nombre}`;
                      const isSubOpen = !!openSubareas[subareaKey];

                      return (
                        <div key={subarea.nombre}>
                          <button
                            type="button"
                            onClick={() => toggleSubarea(subareaKey)}
                            className="w-full flex items-center justify-between px-5 py-2.5 bg-white hover:bg-gray-50 transition-colors text-left"
                          >
                            <span className="text-xs font-medium text-gray-600">
                              {subarea.nombre}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-400">
                                {subarea.ensayos.length}
                              </span>
                              {isSubOpen ? (
                                <ChevronDown
                                  size={14}
                                  className="text-gray-400"
                                />
                              ) : (
                                <ChevronRight
                                  size={14}
                                  className="text-gray-400"
                                />
                              )}
                            </div>
                          </button>

                          {/* Lista de ensayos */}
                          {isSubOpen && (
                            <ul className="bg-gray-50 px-5 py-2 space-y-1">
                              {subarea.ensayos.map((ensayo) => (
                                <li
                                  key={ensayo.nombre}
                                  className="flex items-center justify-between gap-3 py-1.5 group"
                                >
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-gray-700">
                                      {ensayo.nombre}
                                    </p>
                                    {ensayo.norma !== "N/A" && (
                                      <p className="text-xs text-gray-400 truncate">
                                        {ensayo.norma}
                                      </p>
                                    )}
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleAddFromCatalog(
                                        area.nombre,
                                        subarea.nombre,
                                        ensayo.nombre,
                                      )
                                    }
                                    className="flex items-center gap-1 text-xs font-medium text-primary-hover bg-primary/10 hover:bg-primary/20 px-2.5 py-1 rounded-lg transition-colors shrink-0 opacity-0 group-hover:opacity-100"
                                  >
                                    <Plus size={12} /> Agregar
                                  </button>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Validación global: al menos 1 ensayo */}
      {errors.ensayos && !Array.isArray(errors.ensayos) && (
        <p className="text-red-500 text-sm">
          {(errors.ensayos as { message?: string }).message}
        </p>
      )}
    </div>
  );
};

export default Step4;
