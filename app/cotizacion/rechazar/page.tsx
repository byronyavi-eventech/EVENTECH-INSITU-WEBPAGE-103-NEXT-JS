"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import {
  CheckCircleIcon,
  AlertCircleIcon,
  LoaderCircleIcon,
  XCircleIcon,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

type Phase = "input" | "submitting" | "success" | "error";

function RechazarContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const yaRechazado = searchParams.get("ya_rechazado") === "1";

  const [comentario, setComentario] = useState("");
  const [phase, setPhase] = useState<Phase>(yaRechazado ? "success" : "input");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!token && !yaRechazado) {
      setErrorMsg("Enlace inválido. El token de acceso no está presente.");
      setPhase("error");
    }
  }, [token, yaRechazado]);

  const handleConfirmar = async () => {
    setPhase("submitting");
    setErrorMsg(null);

    try {
      const res = await fetch(`${API_URL}/api/quotations/rechazar-cliente`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          comentarioRechazo: comentario.trim() || undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message ?? `Error ${res.status}`);
      setPhase("success");
    } catch (err) {
      setErrorMsg((err as Error).message);
      setPhase("input");
    }
  };

  // ── Success ──────────────────────────────────────────────────────────────
  if (phase === "success") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 p-6">
        <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full text-center border border-slate-100">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center">
              <CheckCircleIcon className="w-10 h-10 text-slate-500" />
            </div>
          </div>
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-widest bg-slate-100 text-slate-600 mb-4">
            RESPUESTA REGISTRADA
          </span>
          <h1 className="text-2xl font-extrabold text-gray-900 mb-3">
            Gracias por avisarnos
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed mb-8">
            Hemos registrado tu respuesta. Si en algún momento cambias de
            opinión o necesitas información adicional, no dudes en contactarnos.
          </p>
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
          © {new Date().getFullYear()} Laboratorio Insitu · Todos los derechos reservados
        </p>
      </div>
    );
  }

  // ── Error (invalid token) ────────────────────────────────────────────────
  if (phase === "error" && errorMsg) {
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
          <p className="text-gray-500 text-sm leading-relaxed">{errorMsg}</p>
        </div>
      </div>
    );
  }

  // ── Form ─────────────────────────────────────────────────────────────────
  const isSubmitting = phase === "submitting";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex flex-col items-center justify-center p-4 py-12">
      {/* Header */}
      <div className="text-center mb-8">
        <p className="text-2xl font-black text-[#c8102e] tracking-wider mb-1">INSITU</p>
        <p className="text-xs text-gray-400 tracking-wide">Laboratorio de Ensayos y Calidad</p>
      </div>

      <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 w-full max-w-lg">
        {/* Title */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center shrink-0">
              <XCircleIcon className="w-5 h-5 text-rose-500" />
            </div>
            <h1 className="text-xl font-extrabold text-gray-900">Rechazar Cotización</h1>
          </div>
          <p className="text-sm text-gray-500 leading-relaxed">
            Lamentamos que no podamos trabajar juntos en esta oportunidad.
            Si lo deseas, puedes dejarnos un comentario para mejorar nuestro servicio.
          </p>
        </div>

        {/* Error banner */}
        {errorMsg && (
          <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
            <AlertCircleIcon className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
            <p className="text-sm text-red-700">{errorMsg}</p>
          </div>
        )}

        {/* Comment textarea */}
        <div className="mb-6">
          <label
            htmlFor="comentario"
            className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2"
          >
            Comentario{" "}
            <span className="normal-case font-normal text-gray-400">(opcional)</span>
          </label>
          <textarea
            id="comentario"
            rows={4}
            maxLength={500}
            disabled={isSubmitting}
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            placeholder="¿Hay algo que quieras contarnos? Tu opinión nos ayuda a mejorar."
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 resize-none outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          />
          <p className="text-right text-xs text-gray-300 mt-1">{comentario.length}/500</p>
        </div>

        {/* CTA */}
        <button
          id="btn-confirmar-rechazo"
          onClick={handleConfirmar}
          disabled={isSubmitting}
          className={`
            w-full flex items-center justify-center gap-2.5 rounded-xl py-3.5 px-6
            text-sm font-bold tracking-wide transition-all duration-200
            ${!isSubmitting
              ? "bg-rose-600 text-white hover:bg-rose-700 shadow-lg shadow-rose-200 hover:shadow-rose-300 active:scale-[0.98]"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"}
          `}
        >
          {isSubmitting ? (
            <><LoaderCircleIcon className="w-4 h-4 animate-spin" /> Enviando…</>
          ) : (
            <><XCircleIcon className="w-4 h-4" /> Confirmar Rechazo</>
          )}
        </button>

        <p className="text-center text-xs text-gray-400 mt-4 leading-relaxed">
          Tu respuesta será registrada y revisada por nuestro equipo comercial.
        </p>
      </div>

      <p className="mt-8 text-xs text-gray-400">
        © {new Date().getFullYear()} Laboratorio Insitu · Todos los derechos reservados
      </p>
    </div>
  );
}

export default function RechazarPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <LoaderCircleIcon className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      }
    >
      <RechazarContent />
    </Suspense>
  );
}
