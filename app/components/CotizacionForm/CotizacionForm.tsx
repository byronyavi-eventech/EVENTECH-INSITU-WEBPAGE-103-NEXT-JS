"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step4 from "./Step4";
import {
  CheckCircle2,
  Building2,
  HardHat,
  FlaskConical,
  User,
  Mail,
  Phone,
  MapPin,
  Clock,
  RotateCcw,
  Home,
} from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  cotizacionSchema,
  type CotizacionFormData,
} from "../../schemas/cotizacionSchema";
export type { CotizacionFormData };

const steps = [
  { id: 1, title: "Datos del Cotizante" },
  { id: 2, title: "Datos de la Obra" },
  { id: 3, title: "Ensayos y Normas" },
];

// Pantalla de éxito con sumario
const SuccessScreen = ({
  data,
  onReset,
}: {
  data: CotizacionFormData;
  onReset: () => void;
}) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
      {/* Header */}
      <div className="flex flex-col items-center text-center py-6">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
          <CheckCircle2 className="w-9 h-9 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">
          ¡Cotización Solicitada con Éxito!
        </h2>
        <p className="text-gray-500 text-sm mt-1 max-w-sm">
          Nuestro equipo revisará tu solicitud y se pondrá en contacto a la
          brevedad.
        </p>
      </div>

      {/*  Datos del Cotizante */}
      <div className="rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-b border-gray-200">
          <Building2 size={15} className="text-gray-500" />
          <h3 className="text-sm font-semibold text-gray-700">
            Datos del Cotizante
          </h3>
        </div>
        <div className="px-4 py-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <SummaryRow
            icon={<Building2 size={13} />}
            label="Empresa"
            value={`${data.giroEmpresa} · ${data.rutEmpresa}`}
          />
          <SummaryRow
            icon={<User size={13} />}
            label="Contacto"
            value={`${data.nombreContacto} ${data.apellidosContacto}`}
          />
          <SummaryRow
            icon={<Phone size={13} />}
            label="Celular"
            value={data.celularContacto}
          />
          <SummaryRow
            icon={<Mail size={13} />}
            label="Email"
            value={data.emailContacto}
          />
          <SummaryRow
            icon={<MapPin size={13} />}
            label="Dirección"
            value={`${data.direccionEmpresa}, ${data.comunaEmpresa}, ${data.regionEmpresa}`}
            fullWidth
          />
        </div>
      </div>

      {/* ── Datos de la Obra ── */}
      <div className="rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-b border-gray-200">
          <HardHat size={15} className="text-gray-500" />
          <h3 className="text-sm font-semibold text-gray-700">
            Datos de la Obra
          </h3>
        </div>
        <div className="px-4 py-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <SummaryRow
            icon={<HardHat size={13} />}
            label="Obra"
            value={data.nombreObra}
            fullWidth
          />
          <SummaryRow
            icon={<Building2 size={13} />}
            label="Mandante"
            value={data.nombreMandante}
          />
          <SummaryRow
            icon={<Building2 size={13} />}
            label="Contratista"
            value={data.nombreContratista}
          />
          <SummaryRow
            icon={<MapPin size={13} />}
            label="Ubicación"
            value={`${data.ubicacionObra}, ${data.comunaObra}, ${data.regionObra}`}
            fullWidth
          />
          <SummaryRow
            icon={<Clock size={13} />}
            label="Duración"
            value={`${data.duracionObra} meses`}
          />
          <div className="sm:col-span-2 border-t border-gray-100 pt-3 mt-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <SummaryRow
              icon={<User size={13} />}
              label="Encargado"
              value={data.nombreEncargado}
            />
            <SummaryRow
              icon={<Mail size={13} />}
              label="Correo Encargado"
              value={data.correoEncargado}
            />
            <SummaryRow
              icon={<Phone size={13} />}
              label="Teléfono Encargado"
              value={data.telefonoEncargado}
            />
          </div>
        </div>
      </div>

      {/* ── Ensayos ── */}
      <div className="rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <FlaskConical size={15} className="text-gray-500" />
            <h3 className="text-sm font-semibold text-gray-700">
              Ensayos Solicitados
            </h3>
          </div>
          <span className="text-xs font-medium text-gray-500 bg-white border border-gray-200 px-2 py-0.5 rounded-full">
            {data.ensayos.length} ensayo{data.ensayos.length !== 1 ? "s" : ""}
          </span>
        </div>
        <ul className="divide-y divide-gray-100">
          {data.ensayos.map((e, i) => (
            <li
              key={i}
              className="px-4 py-3 flex items-start justify-between gap-4"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800">{e.ensayo}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {e.area.split(" - ")[1] ?? e.area} · {e.subarea}
                </p>
              </div>
              <div className="flex gap-3 shrink-0 text-right">
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    {e.cantidad}
                  </p>
                  <p className="text-xs text-gray-400">ensayo{e.cantidad !== 1 ? "s" : ""}</p>
                </div>
                <div className="w-px bg-gray-200" />
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    {e.visitas}
                  </p>
                  <p className="text-xs text-gray-400">
                    visita{e.visitas !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* ── Botones ── */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <a
          href="/"
          className="flex-1 flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors text-sm"
        >
          <Home size={16} />
          Volver al Inicio
        </a>
        <button
          type="button"
          onClick={onReset}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-semibold bg-primary text-gray-900 hover:bg-primary-hover transition-colors shadow-sm text-sm"
        >
          <RotateCcw size={16} />
          Nueva Cotización
        </button>
      </div>
    </div>
  );
};

// ─── Fila de sumario ────────────────────────────────────────────────────────
const SummaryRow = ({
  icon,
  label,
  value,
  fullWidth,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  fullWidth?: boolean;
}) => (
  <div className={fullWidth ? "sm:col-span-2" : ""}>
    <p className="text-xs text-gray-400 flex items-center gap-1 mb-0.5">
      {icon}
      {label}
    </p>
    <p className="text-sm font-medium text-gray-800 break-words">{value}</p>
  </div>
);

// ─── Formulario principal ────────────────────────────────────────────────────
const CotizacionForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState<CotizacionFormData | null>(
    null,
  );

  const methods = useForm({
    resolver: zodResolver(cotizacionSchema),
    defaultValues: {
      regionEmpresa: "",
      regionObra: "",
      comunaEmpresa: "",
      comunaObra: "",
      ensayos: [],
    },
  });

  const { handleSubmit, trigger, reset } = methods;

  const nextStep = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    let fieldsToValidate: (keyof CotizacionFormData)[] = [];
    if (currentStep === 1) {
      fieldsToValidate = [
        "giroEmpresa",
        "rutEmpresa",
        "nombreContacto",
        "apellidosContacto",
        "celularContacto",
        "emailContacto",
        "direccionEmpresa",
        "ciudadEmpresa",
        "regionEmpresa",
        "comunaEmpresa",
      ] as (keyof CotizacionFormData)[];
    } else if (currentStep === 2) {
      fieldsToValidate = [
        "nombreObra",
        "nombreMandante",
        "ubicacionObra",
        "nombreContratista",
        "ciudadObra",
        "regionObra",
        "comunaObra",
        "duracionObra",
        "nombreEncargado",
        "correoEncargado",
        "telefonoEncargado",
      ] as (keyof CotizacionFormData)[];
    }

    const isStepValid = await trigger(fieldsToValidate);
    if (isStepValid) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleReset = () => {
    reset();
    setSubmittedData(null);
    setCurrentStep(1);
  };

  const onSubmit = async (data: CotizacionFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || ""}/api/quotations/web`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        },
      );

      if (response.ok) {
        setSubmittedData(data);
      } else {
        const errorBody = await response.json().catch(() => ({}));
        console.error("Error al enviar el formulario", errorBody);
        alert(
          "Hubo un problema al enviar la cotización. Por favor intenta de nuevo.",
        );
      }
    } catch (error) {
      console.error(error);
      alert("Hubo un problema de red. Por favor intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submittedData) {
    return <SuccessScreen data={submittedData} onReset={handleReset} />;
  }

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        onKeyDown={(e) => {
          if (e.key === "Enter") e.preventDefault();
        }}
        className="flex flex-col min-h-[400px] sm:px-5"
      >
        <div className="mb-8">
          <div className="flex justify-between items-center relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 rounded-full z-0"></div>
            <div
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary rounded-full z-0 transition-all duration-300 ease-in-out"
              style={{
                width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
              }}
            ></div>

            {steps.map((step) => (
              <div
                key={step.id}
                className="relative z-10 flex flex-col items-center group"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 ${
                    currentStep >= step.id
                      ? "bg-primary text-gray-900 shadow-md"
                      : "bg-white text-gray-400 border-2 border-gray-200"
                  }`}
                >
                  {step.id}
                </div>
                <span className="absolute -bottom-6 text-xs font-medium text-gray-500 hidden sm:block whitespace-nowrap">
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 mt-4 sm:mt-8">
          {currentStep === 1 && <Step1 />}
          {currentStep === 2 && <Step2 />}
          {currentStep === 3 && <Step4 />}
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 1 || isSubmitting}
            className={`px-6 py-2.5 rounded-xl font-medium transition-colors ${
              currentStep === 1
                ? "opacity-0 cursor-default"
                : "text-gray-600 bg-gray-100 hover:bg-gray-200"
            }`}
          >
            Anterior
          </button>

          {currentStep < steps.length ? (
            <button
              type="button"
              onClick={nextStep}
              className="px-6 py-2.5 rounded-xl font-semibold bg-primary text-gray-900 hover:bg-primary-hover transition-colors shadow-sm"
            >
              Siguiente
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl font-semibold bg-gray-900 text-white hover:bg-gray-800 transition-colors shadow-sm disabled:opacity-70 flex items-center gap-2"
            >
              {isSubmitting ? "Enviando..." : "Solicitar Cotización"}
            </button>
          )}
        </div>
      </form>
    </FormProvider>
  );
};

export default CotizacionForm;
