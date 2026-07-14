import type { Metadata } from "next";
import { ensayosData } from "../data/ensayos";
import { ArrowRight, BookOpen, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Catálogo de Ensayos | Laboratorio INSITU",
  description:
    "Listado completo de nuestros servicios de ensayos de laboratorio de mecánica de suelos, hormigones, asfaltos y más, realizados bajo las normativas vigentes (INN, MINVU).",
  alternates: {
    canonical: "/ensayos",
  },
};

export default function EnsayosPage() {
  return (
    <div className="pt-[88px] sm:pt-[104px] md:pt-[112px] min-h-screen bg-gray-50 text-gray-900 pb-20">
      {/* Header section */}
      <section className="bg-dark text-white py-16 md:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-r from-blue-900/50 to-primary/30 z-0"></div>
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Catálogo de <span className="text-primary">Ensayos</span>
          </h1>
          <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-300 font-medium">
            Listado completo de nuestros servicios de ensayos de laboratorio de
            mecánica de suelos, hormigones, asfaltos y más, realizados bajo las
            normativas vigentes.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="space-y-16">
          {ensayosData.map((area, areaIdx) => (
            <div key={areaIdx} className="scroll-mt-32" id={`area-${areaIdx}`}>
              <div className="flex items-center gap-3 mb-8 border-b-2 border-primary/20 pb-4">
                <BookOpen className="w-8 h-8 text-primary" />
                <h2 className="text-2xl md:text-3xl font-bold text-dark">
                  {area.nombre}
                </h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {area.subareas.map((subarea, subIdx) => (
                  <div
                    key={subIdx}
                    className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 md:p-8 hover:shadow-xl transition-shadow duration-300"
                  >
                    <h3 className="text-xl font-semibold text-blue-900 mb-6 flex items-start gap-2">
                      <ArrowRight className="w-5 h-5 text-primary mt-1 shrink-0" />
                      <span>{subarea.nombre}</span>
                    </h3>

                    <ul className="space-y-4">
                      {subarea.ensayos.map((ensayo, ensIdx) => (
                        <li
                          key={ensIdx}
                          className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg"
                        >
                          <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                          <div>
                            <h4 className="font-semibold text-gray-800 text-base md:text-lg">
                              {ensayo.nombre}
                            </h4>
                            <p className="text-sm text-gray-500 mt-1">
                              <span className="font-medium text-gray-700">
                                Norma:
                              </span>{" "}
                              {ensayo.norma}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
