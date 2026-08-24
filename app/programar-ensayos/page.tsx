"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, useMemo, Suspense } from "react";
import logo from "../assets/logos/logo-insitu.png";
import {
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  AlertTriangleIcon,
  LoaderCircleIcon,
  MapPinIcon,
  ArrowRightIcon,
  Building2Icon,
  UserIcon,
  HardHatIcon,
  TruckIcon,
  PencilIcon,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface DetalleEnsayo {
  id: number;
  nombreTipoEnsayo: string;
  nombreArea: string;
  nombreSubarea: string;
  cantidadEnsayos: number;
}

interface ProgramacionData {
  id: number;
  codigoCotizacion: string | null;
  estado: string;
  visitasTotales: number;
  obra: {
    nombreObra: string;
    nombreContratista: string;
    ubicacionObra: string;
    tiempoTrasladoHoras: number | null;
  };
  cliente: {
    giroEmpresa: string;
    nombreContacto: string;
    email: string;
  };
  detalles: DetalleEnsayo[];
}

interface OrdenTrabajoGenerada {
  codigoOt: string;
  numeroVisita: number;
  fechaHoraProgramada: string;
  ensayos: Array<{ id: number; nombreTipoEnsayo: string }>;
}

type PagePhase = "loading" | "error" | "form" | "confirming" | "success";

// ─── Validación de traslado + coherencia cronológica (cliente — UX; el
// servidor es la fuente de verdad y repite esta misma validación en Fase 4) ──

function validarFechas(
  fechas: Record<number, string>,
  visitasTotales: number,
  tiempoTrasladoHoras: number | null,
): Record<number, string | null> {
  const errores: Record<number, string | null> = {};
  let anterior: Date | null = null;

  for (let n = 1; n <= visitasTotales; n++) {
    const raw = fechas[n];
    if (!raw) {
      errores[n] = null;
      continue;
    }
    const fecha = new Date(raw);

    if (tiempoTrasladoHoras != null) {
      const horasHastaVisita =
        (fecha.getTime() - Date.now()) / (1000 * 60 * 60);
      if (horasHastaVisita < tiempoTrasladoHoras) {
        errores[n] =
          `Esta obra requiere al menos ${tiempoTrasladoHoras}h de anticipación. ` +
          `Elige una fecha/hora más adelante.`;
        anterior = fecha;
        continue;
      }
    }

    if (anterior && fecha.getTime() <= anterior.getTime()) {
      errores[n] =
        "Debe ser posterior a la fecha/hora de la visita anterior.";
      anterior = fecha;
      continue;
    }

    errores[n] = null;
    anterior = fecha;
  }

  return errores;
}

function formatFechaHora(raw: string): { fecha: string; hora: string } {
  const d = new Date(raw);
  return {
    fecha: d.toLocaleDateString("es-CL", { day: "2-digit", month: "2-digit", year: "numeric" }),
    hora: d.toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" }),
  };
}

// ─── Contenido principal ────────────────────────────────────────────────────

function ProgramarEnsayosContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [phase, setPhase] = useState<PagePhase>("loading");
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [data, setData] = useState<ProgramacionData | null>(null);
  const [otsGeneradas, setOtsGeneradas] = useState<OrdenTrabajoGenerada[]>([]);

  // detalleId -> número de visita (1..visitasTotales). undefined = sin asignar.
  const [asignaciones, setAsignaciones] = useState<Record<number, number | undefined>>({});
  // número de visita -> valor de <input type="datetime-local">
  const [fechas, setFechas] = useState<Record<number, string>>({});
  // número de visita -> si el editor de fecha/hora está abierto
  const [editandoFecha, setEditandoFecha] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (!token) {
      setGlobalError("Enlace inválido. El token de acceso no está presente.");
      setPhase("error");
      return;
    }

    (async () => {
      try {
        const res = await fetch(
          `${API_URL}/api/quotations/programacion/${encodeURIComponent(token)}`,
        );
        const json = await res.json();
        if (!res.ok) throw new Error(json.message ?? `Error ${res.status}`);

        const d: ProgramacionData = json.data;
        setData(d);
        // Con 1 sola visita no hay nada que elegir — se autoasigna todo.
        // Con 2+ visitas el cliente debe asignar cada ensayo explícitamente.
        setAsignaciones(
          Object.fromEntries(
            d.detalles.map((det) => [det.id, d.visitasTotales === 1 ? 1 : undefined]),
          ),
        );
        setPhase("form");
      } catch (err) {
        setGlobalError((err as Error).message);
        setPhase("error");
      }
    })();
  }, [token]);

  const errores = useMemo(() => {
    if (!data) return {};
    return validarFechas(fechas, data.visitasTotales, data.obra.tiempoTrasladoHoras);
  }, [fechas, data]);

  const visitasNumeros = useMemo(
    () => (data ? Array.from({ length: data.visitasTotales }, (_, i) => i + 1) : []),
    [data],
  );

  const todosAsignados =
    !!data && data.detalles.every((det) => asignaciones[det.id] != null);
  const todasLasFechasCompletas = visitasNumeros.every((n) => !!fechas[n]);
  const hayErrores = Object.values(errores).some((e) => !!e);
  const puedeConfirmar =
    !!data && todosAsignados && todasLasFechasCompletas && !hayErrores && phase === "form";

  const handleConfirmar = async () => {
    if (!data || !puedeConfirmar) return;
    setGlobalError(null);
    setPhase("confirming");

    const visitas = visitasNumeros.map((n) => ({
      numeroVisita: n,
      fechaHoraProgramada: new Date(fechas[n]).toISOString(),
      detalleIds: data.detalles
        .filter((det) => asignaciones[det.id] === n)
        .map((det) => det.id),
    }));

    try {
      const res = await fetch(
        `${API_URL}/api/quotations/${data.id}/confirmar-programacion`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, visitas }),
        },
      );
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.message ?? `Error ${res.status}`);
      setOtsGeneradas(json.data?.ordenesTrabajo ?? []);
      setPhase("success");
    } catch (err) {
      setGlobalError((err as Error).message);
      setPhase("form");
    }
  };

  // ── Estados de página completa ──────────────────────────────────────────

  if (phase === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoaderCircleIcon className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (phase === "error" && !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 p-6">
        <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full text-center border border-amber-100">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center">
              <AlertCircleIcon className="w-10 h-10 text-amber-500" />
            </div>
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 mb-3">
            Enlace No Disponible
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed">{globalError}</p>
        </div>
      </div>
    );
  }

  if (phase === "success") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50 p-6">
        <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-lg w-full text-center border border-emerald-100">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center">
              <CheckCircleIcon className="w-10 h-10 text-emerald-500" />
            </div>
          </div>
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-widest bg-emerald-100 text-emerald-800 mb-4">
            PROGRAMADO
          </span>
          <h1 className="text-2xl font-extrabold text-gray-900 mb-3">
            ¡Visitas Programadas!
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed mb-8">
            Hemos agendado tus visitas a terreno. El equipo de{" "}
            <strong className="text-gray-700">Laboratorio Insitu</strong> se
            presentará en las fechas y horas confirmadas.
          </p>

          {otsGeneradas.length > 0 && (
            <div className="text-left rounded-xl border border-gray-200 overflow-hidden mb-8">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                <p className="text-sm font-semibold text-gray-700">
                  {otsGeneradas.length} Orden{otsGeneradas.length !== 1 ? "es" : ""}{" "}
                  de Trabajo generada{otsGeneradas.length !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="divide-y divide-gray-100">
                {otsGeneradas.map((ot) => (
                  <div key={ot.codigoOt} className="px-4 py-3">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-bold text-[#c8102e]">
                        {ot.codigoOt}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(ot.fechaHoraProgramada).toLocaleString(
                          "es-CL",
                          { dateStyle: "medium", timeStyle: "short" },
                        )}
                      </p>
                    </div>
                    <ul className="text-xs text-gray-500 space-y-0.5">
                      {ot.ensayos.map((e) => (
                        <li key={e.id}>· {e.nombreTipoEnsayo}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="border-t border-gray-100 pt-6">
            <p className="text-xs text-gray-400 font-medium mb-3">
              ¿Tienes preguntas? Contáctanos:
            </p>
            <a
              href="mailto:contacto@laboratorioinsitu.cl"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-all"
            >
              contacto@laboratorioinsitu.cl
            </a>
          </div>
        </div>
        <p className="mt-8 text-xs text-gray-400">
          © {new Date().getFullYear()} Laboratorio Insitu · Todos los derechos
          reservados
        </p>
      </div>
    );
  }

  if (!data) return null;

  const docCode = data.codigoCotizacion ?? `#${data.id}`;

  // ── Formulario de programación ──────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4 py-10">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-3xl overflow-hidden">
        {/* Header */}
        <div className="border-b-2 border-[#c8102e] px-8 py-6 flex items-start justify-between flex-wrap gap-3">
          <div>
            <img src={logo.src} alt="Insitu" className="h-9 w-auto" />
            <p className="text-xs text-gray-400 mt-1">
              Laboratorio de Ensayos y Calidad
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-gray-900">
              PROGRAMACIÓN DE ENSAYOS
            </p>
            <p className="text-xs font-bold text-[#c8102e] mt-0.5">
              N° {docCode}
            </p>
            <span className="inline-block mt-2 px-2.5 py-1 rounded-full text-[11px] font-bold border border-amber-300 bg-amber-50 text-amber-700">
              PENDIENTE DE PROGRAMACIÓN
            </span>
          </div>
        </div>

        <div className="px-8 py-6 space-y-6">
          {/* Title */}
          <div>
            <h1 className="text-xl font-extrabold text-gray-900 mb-1">
              Programar Ensayos
            </h1>
            <p className="text-sm text-gray-500 leading-relaxed">
              Seleccione la fecha y hora en que requiere realizar los ensayos
              asociados a cada visita.
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Cotización: <span className="font-semibold text-gray-600">{docCode}</span>
            </p>
          </div>

          {globalError && (
            <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
              <AlertCircleIcon className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
              <p className="text-sm text-red-700">{globalError}</p>
            </div>
          )}

          {/* Datos del Cliente y Obra */}
          <div>
            <h2 className="text-xs font-bold text-[#c8102e] uppercase tracking-wider border-l-2 border-[#c8102e] pl-2 mb-3">
              Datos del Cliente y Obra
            </h2>
            <div className="rounded-xl border border-gray-200 divide-y divide-gray-100 overflow-hidden">
              <DatoRow icon={<Building2Icon size={14} />} label="Empresa / Razón Social" value={data.cliente.giroEmpresa} />
              <DatoRow icon={<UserIcon size={14} />} label="Contacto" value={data.cliente.nombreContacto} />
              <DatoRow icon={<HardHatIcon size={14} />} label="Contratista" value={data.obra.nombreContratista} />
              <DatoRow icon={<Building2Icon size={14} />} label="Obra" value={data.obra.nombreObra} />
              <DatoRow icon={<MapPinIcon size={14} />} label="Ubicación" value={data.obra.ubicacionObra} />
            </div>
          </div>

          {/* Datos Generales de la Programación */}
          <div>
            <h2 className="text-xs font-bold text-[#c8102e] uppercase tracking-wider border-l-2 border-[#c8102e] pl-2 mb-3">
              Datos Generales de la Programación
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                <p className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  <TruckIcon size={13} /> Número de Visitas a Obra
                </p>
                <p className="text-lg font-bold text-gray-900">{data.visitasTotales}</p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                <p className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  <ClockIcon size={13} /> Tiempo de Traslado a la Obra
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {data.obra.tiempoTrasladoHoras != null
                    ? `${data.obra.tiempoTrasladoHoras} horas`
                    : "No configurado"}
                </p>
              </div>
            </div>
          </div>

          {/* Ensayos a Programar */}
          <div>
            <div className="flex items-center justify-between flex-wrap gap-1 mb-3">
              <h2 className="text-xs font-bold text-[#c8102e] uppercase tracking-wider border-l-2 border-[#c8102e] pl-2">
                Ensayos a Programar
              </h2>
              {data.visitasTotales > 1 && (
                <p className="text-xs text-gray-400">
                  Asigne cada ensayo a una visita (1 a {data.visitasTotales})
                </p>
              )}
            </div>
            <div className="rounded-xl border border-gray-200 overflow-hidden overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left font-semibold text-gray-500 text-xs uppercase tracking-wide px-4 py-2.5">Ensayo</th>
                    <th className="text-left font-semibold text-gray-500 text-xs uppercase tracking-wide px-4 py-2.5">Área</th>
                    <th className="text-right font-semibold text-gray-500 text-xs uppercase tracking-wide px-4 py-2.5">Cantidad</th>
                    <th className="text-right font-semibold text-gray-500 text-xs uppercase tracking-wide px-4 py-2.5">Visita</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.detalles.map((det) => (
                    <tr key={det.id}>
                      <td className="px-4 py-3 font-medium text-gray-800">{det.nombreTipoEnsayo}</td>
                      <td className="px-4 py-3 text-xs text-gray-400 uppercase">
                        {det.nombreArea}
                        <br />
                        <span className="text-gray-400">&rsaquo; {det.nombreSubarea}</span>
                      </td>
                      <td className="px-4 py-3 text-right text-gray-600">{det.cantidadEnsayos}</td>
                      <td className="px-4 py-3 text-right">
                        {data.visitasTotales === 1 ? (
                          <span className="text-xs font-semibold text-gray-500">Visita 1</span>
                        ) : (
                          <select
                            value={asignaciones[det.id] ?? ""}
                            onChange={(e) =>
                              setAsignaciones((prev) => ({
                                ...prev,
                                [det.id]: e.target.value ? Number(e.target.value) : undefined,
                              }))
                            }
                            className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium outline-none bg-white ${
                              asignaciones[det.id] == null
                                ? "border-amber-300 text-amber-700 focus:ring-2 focus:ring-amber-300"
                                : "border-gray-300 text-gray-700 focus:ring-2 focus:ring-[#c8102e]"
                            }`}
                          >
                            <option value="">Sin asignar</option>
                            {visitasNumeros.map((n) => (
                              <option key={n} value={n}>
                                Visita {n}
                              </option>
                            ))}
                          </select>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Programación por Visita */}
          <div>
            <h2 className="text-xs font-bold text-[#c8102e] uppercase tracking-wider border-l-2 border-[#c8102e] pl-2 mb-3">
              Programación por Visita
            </h2>
            <div className="space-y-3">
              {visitasNumeros.map((n) => {
                const ensayosDeEstaVisita = data.detalles.filter(
                  (det) => asignaciones[det.id] === n,
                );
                const tieneFecha = !!fechas[n];
                return (
                  <div key={n} className="rounded-xl border border-gray-200 overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-gray-800 text-white text-xs font-bold flex items-center justify-center">
                          {n}
                        </span>
                        <span className="text-sm font-bold text-gray-800 uppercase tracking-wide">
                          Visita {n}
                        </span>
                      </div>
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                          tieneFecha
                            ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                            : "border-amber-300 bg-amber-50 text-amber-700"
                        }`}
                      >
                        {tieneFecha ? "Fecha y hora definida" : "Pendiente de fecha y hora"}
                      </span>
                    </div>

                    <div className="px-4 py-3 space-y-3">
                      <div>
                        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
                          Ensayos de esta visita
                        </p>
                        {ensayosDeEstaVisita.length === 0 ? (
                          <div className="flex items-start gap-2 rounded-lg border border-dashed border-amber-300 bg-amber-50 px-3 py-2">
                            <AlertTriangleIcon size={14} className="text-amber-500 mt-0.5 shrink-0" />
                            <p className="text-xs text-amber-700">
                              Aún no hay ensayos asignados a esta visita. Asígnalos
                              desde la tabla &quot;Ensayos a programar&quot;.
                            </p>
                          </div>
                        ) : (
                          <ul className="text-xs text-gray-600 space-y-1">
                            {ensayosDeEstaVisita.map((det) => (
                              <li key={det.id}>· {det.nombreTipoEnsayo}</li>
                            ))}
                          </ul>
                        )}
                      </div>

                      {errores[n] && (
                        <p className="text-red-500 text-xs">{errores[n]}</p>
                      )}

                      {editandoFecha[n] ? (
                        // Editor abierto — recién ahora se ve el datetime-local.
                        <div className="flex flex-wrap items-center gap-3 pt-1 border-t border-gray-100">
                          <input
                            type="datetime-local"
                            value={fechas[n] ?? ""}
                            onChange={(e) =>
                              setFechas((prev) => ({ ...prev, [n]: e.target.value }))
                            }
                            className="px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c8102e] focus:border-[#c8102e] outline-none text-sm"
                          />
                          {tieneFecha && (
                            <button
                              type="button"
                              onClick={() =>
                                setEditandoFecha((prev) => ({ ...prev, [n]: false }))
                              }
                              className="text-xs font-semibold text-gray-500 hover:text-gray-700"
                            >
                              Listo
                            </button>
                          )}
                        </div>
                      ) : tieneFecha ? (
                        // Fecha ya definida — colapsada, con opción de editar.
                        <div className="flex items-center justify-between flex-wrap gap-2 pt-1 border-t border-gray-100">
                          <div className="flex items-center gap-4 text-xs text-gray-600">
                            <span className="flex items-center gap-1">
                              <CalendarIcon size={13} className="text-gray-400" />
                              {formatFechaHora(fechas[n]).fecha}
                            </span>
                            <span className="flex items-center gap-1">
                              <ClockIcon size={13} className="text-gray-400" />
                              {formatFechaHora(fechas[n]).hora}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              setEditandoFecha((prev) => ({ ...prev, [n]: true }))
                            }
                            className="flex items-center gap-1 text-xs font-semibold text-[#c8102e] hover:text-[#a50d26]"
                          >
                            <PencilIcon size={12} /> Editar fecha y hora
                          </button>
                        </div>
                      ) : (
                        // Sin definir todavía — colapsada, botón explícito para abrir el editor.
                        <div className="flex items-center justify-between flex-wrap gap-2 pt-1 border-t border-gray-100">
                          <div className="flex items-center gap-4 text-xs text-gray-400">
                            <span className="flex items-center gap-1">
                              <CalendarIcon size={13} /> Fecha sin definir
                            </span>
                            <span className="flex items-center gap-1">
                              <ClockIcon size={13} /> Hora sin definir
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              setEditandoFecha((prev) => ({ ...prev, [n]: true }))
                            }
                            className="flex items-center gap-1 text-xs font-semibold text-[#c8102e] hover:text-[#a50d26]"
                          >
                            <PencilIcon size={12} /> Definir fecha y hora
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer / CTA */}
        <div className="bg-gray-50 border-t border-gray-100 px-8 py-6">
          <p className="text-center text-sm font-semibold text-gray-600 mb-4">
            Por favor, confirme la programación de sus ensayos:
          </p>
          <button
            onClick={handleConfirmar}
            disabled={!puedeConfirmar}
            className={`
              w-full flex items-center justify-center gap-2.5 rounded-xl py-3.5 px-6
              text-sm font-bold tracking-wide transition-all duration-200
              ${
                puedeConfirmar
                  ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-200 hover:shadow-emerald-300 active:scale-[0.98]"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }
            `}
          >
            {phase === "confirming" ? (
              <>
                <LoaderCircleIcon className="w-4 h-4 animate-spin" /> Confirmando…
              </>
            ) : (
              <>
                PROGRAMAR ENSAYOS <ArrowRightIcon className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>

      <p className="mt-8 text-xs text-gray-400">
        © {new Date().getFullYear()} Laboratorio Insitu · Todos los derechos
        reservados
      </p>
    </div>
  );
}

function DatoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-2.5 text-sm">
      <span className="flex items-center gap-1.5 text-gray-500">
        {icon}
        {label}
      </span>
      <span className="font-medium text-gray-800 text-right">{value}</span>
    </div>
  );
}

export default function ProgramarEnsayosPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <LoaderCircleIcon className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      }
    >
      <ProgramarEnsayosContent />
    </Suspense>
  );
}
