"use client";

import { useSearchParams } from "next/navigation";
import { useState, useRef, useCallback, useEffect, Suspense } from "react";
import {
  CloudUploadIcon,
  XIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  LoaderCircleIcon,
  FileTextIcon,
  ImageIcon,
  ArrowRightIcon,
} from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────────────────────

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

interface FileItem {
  file: File;
  id: string;
  uploadUrl?: string;
  s3Key?: string;
  status: "pending" | "uploading" | "uploaded" | "error";
  progress: number;
  error?: string;
}

type PagePhase = "input" | "uploading" | "confirming" | "success" | "error";

// ─── Helpers ───────────────────────────────────────────────────────────────────

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const ALLOWED_TYPES: Record<string, string> = {
  "application/pdf": "PDF",
  "image/jpeg": "JPG",
  "image/jpg": "JPG",
  "image/png": "PNG",
};

function FileIcon2({ contentType }: { contentType: string }) {
  if (contentType === "application/pdf") {
    return <FileTextIcon className="w-5 h-5 text-red-500" />;
  }
  return <ImageIcon className="w-5 h-5 text-blue-500" />;
}

// ─── Main component ────────────────────────────────────────────────────────────

function PagoUploadContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const yaEnviado = searchParams.get("ya_enviado") === "1";

  const [files, setFiles] = useState<FileItem[]>([]);
  const [phase, setPhase] = useState<PagePhase>(
    yaEnviado ? "success" : "input",
  );
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Validate token present
  useEffect(() => {
    if (!token) {
      setGlobalError("Enlace inválido. El token de acceso no está presente.");
      setPhase("error");
    }
  }, [token]);

  // ── File selection ────────────────────────────────────────────────────────

  const addFiles = useCallback((newFiles: File[]) => {
    const valid = newFiles.filter((f) => {
      if (!ALLOWED_TYPES[f.type]) return false;
      if (f.size > 10 * 1024 * 1024) return false;
      return true;
    });

    setFiles((prev) => {
      const combined = [...prev];
      for (const f of valid) {
        if (combined.length >= 5) break;
        // Avoid duplicates by name+size
        if (
          !combined.find(
            (e) => e.file.name === f.name && e.file.size === f.size,
          )
        ) {
          combined.push({
            file: f,
            id: `${f.name}-${f.size}-${Date.now()}`,
            status: "pending",
            progress: 0,
          });
        }
      }
      return combined;
    });
  }, []);

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const onFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addFiles(Array.from(e.target.files));
    e.target.value = "";
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) addFiles(Array.from(e.dataTransfer.files));
  };

  // ── Upload flow ───────────────────────────────────────────────────────────

  const handleConfirmar = async () => {
    if (files.length === 0) return;
    setGlobalError(null);
    setPhase("uploading");

    // 1. Obtener presigned PUT URLs del backend
    let targets: Array<{
      s3Key: string;
      nombreArchivo: string;
      contentType: string;
      sizeBytes: number;
      uploadUrl: string;
    }>;

    try {
      const res = await fetch(`${API_URL}/api/quotations/upload-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          files: files.map((f) => ({
            nombreArchivo: f.file.name,
            contentType: f.file.type,
            sizeBytes: f.file.size,
          })),
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message ?? `Error ${res.status}`);
      targets = json.data.targets;
    } catch (err) {
      setGlobalError((err as Error).message);
      setPhase("error");
      return;
    }

    // 2. Subir cada archivo directamente a S3 con la presigned URL
    const updatedFiles = [...files];
    for (let i = 0; i < updatedFiles.length; i++) {
      const item = updatedFiles[i];
      const target = targets[i];
      if (!target) continue;

      updatedFiles[i] = {
        ...item,
        uploadUrl: target.uploadUrl,
        s3Key: target.s3Key,
        status: "uploading",
      };
      setFiles([...updatedFiles]);

      try {
        const uploadRes = await fetch(target.uploadUrl, {
          method: "PUT",
          body: item.file,
          headers: { "Content-Type": item.file.type },
        });

        if (!uploadRes.ok) throw new Error(`Error al subir ${item.file.name}`);

        updatedFiles[i] = {
          ...updatedFiles[i],
          status: "uploaded",
          progress: 100,
        };
      } catch (err) {
        updatedFiles[i] = {
          ...updatedFiles[i],
          status: "error",
          error: (err as Error).message,
        };
      }
      setFiles([...updatedFiles]);
    }

    const allUploaded = updatedFiles.every((f) => f.status === "uploaded");
    if (!allUploaded) {
      setGlobalError(
        "Algunos archivos no pudieron subirse. Por favor intenta de nuevo.",
      );
      setPhase("input");
      return;
    }

    // 3. Confirmar pago en el backend
    setPhase("confirming");
    try {
      const confirmRes = await fetch(
        `${API_URL}/api/quotations/confirmar-pago`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token,
            comprobantes: updatedFiles.map((f, i) => ({
              s3Key: targets[i].s3Key,
              nombreArchivo: f.file.name,
              contentType: f.file.type,
              sizeBytes: f.file.size,
            })),
          }),
        },
      );
      const json = await confirmRes.json();
      if (!confirmRes.ok)
        throw new Error(json.message ?? `Error ${confirmRes.status}`);
      setPhase("success");
    } catch (err) {
      setGlobalError((err as Error).message);
      setPhase("error");
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────

  if (phase === "success") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50 p-6">
        <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full text-center border border-emerald-100">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center">
              <CheckCircleIcon className="w-10 h-10 text-emerald-500" />
            </div>
          </div>
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-widest bg-emerald-100 text-emerald-800 mb-4">
            EN REVISIÓN
          </span>
          <h1 className="text-2xl font-extrabold text-gray-900 mb-3">
            ¡Comprobantes Recibidos!
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed mb-8">
            Hemos recibido tus comprobantes de pago. El equipo de{" "}
            <strong className="text-gray-700">Laboratorio Insitu</strong>{" "}
            revisará la transferencia y se pondrá en contacto contigo a la
            brevedad para confirmar el inicio de los servicios.
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
          © {new Date().getFullYear()} Laboratorio Insitu · Todos los derechos
          reservados
        </p>
      </div>
    );
  }

  if (phase === "error" && globalError && !files.length) {
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

  const isUploading = phase === "uploading" || phase === "confirming";
  const canConfirm =
    files.length > 0 && !isUploading && phase !== ("success" as PagePhase);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex flex-col items-center justify-center p-4 py-12">
      {/* Header */}
      <div className="text-center mb-8">
        <p className="text-2xl font-black text-[#c8102e] tracking-wider mb-1">
          INSITU
        </p>
        <p className="text-xs text-gray-400 tracking-wide">
          Laboratorio de Ensayos y Calidad
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 w-full max-w-lg">
        {/* Title */}
        <div className="mb-6">
          <h1 className="text-xl font-extrabold text-gray-900 mb-1">
            Adjunta tus Comprobantes de Pago
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed">
            Para confirmar tu cotización, adjunta el/los comprobantes de
            depósito o transferencia bancaria. Formatos aceptados: PDF, JPG,
            PNG. Máx. 10 MB por archivo.
          </p>
        </div>

        {/* Error banner */}
        {globalError && (
          <div className="mb-4 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
            <AlertCircleIcon className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
            <p className="text-sm text-red-700">{globalError}</p>
          </div>
        )}

        {/* Drop zone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={`
            relative flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed
            cursor-pointer transition-all duration-200 py-10 px-6 mb-5
            ${
              isDragging
                ? "border-[#c8102e] bg-red-50 scale-[1.01]"
                : "border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100"
            }
            ${isUploading ? "pointer-events-none opacity-60" : ""}
            ${files.length >= 5 ? "opacity-50 cursor-not-allowed" : ""}
          `}
        >
          <div className="w-12 h-12 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center">
            <CloudUploadIcon
              className={`w-6 h-6 ${isDragging ? "text-[#c8102e]" : "text-gray-400"}`}
            />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-gray-700">
              {files.length >= 5
                ? "Límite de 5 archivos alcanzado"
                : "Arrastra archivos aquí"}
            </p>
            {files.length < 5 && (
              <p className="text-xs text-gray-400 mt-0.5">
                o{" "}
                <span className="text-[#c8102e] font-medium underline">
                  selecciona desde tu equipo
                </span>
              </p>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
            className="hidden"
            onChange={onFileInput}
            disabled={isUploading || files.length >= 5}
          />
        </div>

        {/* File list */}
        {files.length > 0 && (
          <ul className="space-y-2 mb-6">
            {files.map((item) => (
              <li
                key={item.id}
                className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3"
              >
                <FileIcon2 contentType={item.file.type} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {item.file.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {ALLOWED_TYPES[item.file.type]} ·{" "}
                    {formatBytes(item.file.size)}
                  </p>
                  {item.status === "uploading" && (
                    <div className="mt-1 h-1 w-full rounded-full bg-gray-200 overflow-hidden">
                      <div className="h-full bg-[#c8102e] animate-pulse w-full" />
                    </div>
                  )}
                  {item.error && (
                    <p className="text-xs text-red-500 mt-0.5">{item.error}</p>
                  )}
                </div>
                <div className="shrink-0">
                  {item.status === "uploading" && (
                    <LoaderCircleIcon className="w-4 h-4 text-gray-400 animate-spin" />
                  )}
                  {item.status === "uploaded" && (
                    <CheckCircleIcon className="w-4 h-4 text-emerald-500" />
                  )}
                  {item.status === "error" && (
                    <AlertCircleIcon className="w-4 h-4 text-red-500" />
                  )}
                  {item.status === "pending" && !isUploading && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(item.id);
                      }}
                      className="w-6 h-6 rounded-full bg-gray-200 hover:bg-red-100 flex items-center justify-center transition-colors"
                      aria-label="Eliminar archivo"
                    >
                      <XIcon className="w-3.5 h-3.5 text-gray-500 hover:text-red-500" />
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Counter */}
        <p className="text-xs text-gray-400 text-right mb-4">
          {files.length} / 5 archivos seleccionados
        </p>

        {/* CTA */}
        <button
          onClick={handleConfirmar}
          disabled={!canConfirm}
          className={`
            w-full flex items-center justify-center gap-2.5 rounded-xl py-3.5 px-6
            text-sm font-bold tracking-wide transition-all duration-200
            ${
              canConfirm
                ? "bg-[#c8102e] text-white hover:bg-[#a50d26] shadow-lg shadow-red-200 hover:shadow-red-300 active:scale-[0.98]"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }
          `}
        >
          {phase === "uploading" && (
            <>
              <LoaderCircleIcon className="w-4 h-4 animate-spin" /> Subiendo
              archivos…
            </>
          )}
          {phase === "confirming" && (
            <>
              <LoaderCircleIcon className="w-4 h-4 animate-spin" /> Confirmando
              pago…
            </>
          )}
          {(phase === "input" || phase === "error") && (
            <>
              Confirmar Pago <ArrowRightIcon className="w-4 h-4" />
            </>
          )}
        </button>

        <p className="text-center text-xs text-gray-400 mt-4 leading-relaxed">
          Al confirmar, tus comprobantes serán enviados de forma segura al
          equipo de{" "}
          <strong className="text-gray-500">Laboratorio Insitu</strong> para su
          verificación.
        </p>
      </div>

      <p className="mt-8 text-xs text-gray-400">
        © {new Date().getFullYear()} Laboratorio Insitu · Todos los derechos
        reservados
      </p>
    </div>
  );
}

export default function PagoUploadPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <LoaderCircleIcon className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      }
    >
      <PagoUploadContent />
    </Suspense>
  );
}
