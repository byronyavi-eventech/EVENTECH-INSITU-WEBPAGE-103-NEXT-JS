import type { Metadata } from "next";
import CotizacionForm from "../components/CotizacionForm/CotizacionForm";

export const metadata: Metadata = {
  title: "Solicitud de Cotización | Laboratorio INSITU",
  description:
    "Solicita tu cotización detallada para ensayos de mecánica de suelos, hormigones, asfalto y control de calidad en obra con Laboratorio INSITU.",
  alternates: {
    canonical: "/cotizacion",
  },
};

export default function CotizacionPage() {
  return (
    <div className="bg-gray-50 min-h-screen pt-8 pb-16 px-4 sm:px-6 lg:px-8 text-gray-900">
      <div className="max-w-4xl mx-auto mt-4 md:mt-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">
            Solicitud de <span className="text-primary">Cotización</span>
          </h1>
          <p className="text-gray-600">
            Completa el formulario para solicitar una cotización detallada de
            nuestros servicios.
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 ring-1 ring-gray-100">
          <CotizacionForm />
        </div>
      </div>
    </div>
  );
}
