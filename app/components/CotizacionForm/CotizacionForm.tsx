"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";
import { CheckCircle2 } from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  cotizacionSchema,
  type CotizacionFormData,
} from "../../schemas/cotizacionSchema";
export type { CotizacionFormData };

const steps = [
  { id: 1, title: "Datos del Cotizante" },
  { id: 2, title: "Datos de la Obra" },
  { id: 3, title: "Datos del Encargado" },
  { id: 4, title: "Ensayos y Normas" },
];

const CotizacionForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

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

  const { handleSubmit, trigger } = methods;

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
      ] as (keyof CotizacionFormData)[];
    } else if (currentStep === 3) {
      fieldsToValidate = [
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

  const onSubmit = async (data: CotizacionFormData) => {
    setIsSubmitting(true);
    try {
      const { ensayos, ...rest } = data;
      const payload = {
        ...rest,
        ensayosStr: JSON.stringify(ensayos),
      };

      const response = await fetch("https://api.sheetbest.com/sheets/b30b964b-52d6-4051-b05f-e55e2fbbce6a", {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setIsSuccess(true);
      } else {
        console.error("Error al enviar el formulario", await response.text());
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

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <CheckCircle2 className="w-20 h-20 text-green-500 mb-6" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          ¡Cotización Solicitada con Éxito!
        </h2>
        <p className="text-gray-600 mb-8 max-w-md">
          Hemos recibido tu solicitud. Nuestro equipo se pondrá en contacto
          contigo a la brevedad con la información requerida.
        </p>
        <a
          href="/"
          className="bg-primary text-gray-900 font-semibold px-6 py-3 rounded-xl hover:bg-primary-hover transition-colors"
        >
          Volver al Inicio
        </a>
      </div>
    );
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
          {currentStep === 3 && <Step3 />}
          {currentStep === 4 && <Step4 />}
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
