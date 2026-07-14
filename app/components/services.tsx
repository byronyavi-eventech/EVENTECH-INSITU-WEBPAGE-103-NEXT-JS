import {
  Mountain,
  Building2,
  Route,
  ClipboardCheck,
  Briefcase,
  Truck,
} from "lucide-react";
import Link from "next/link";

const Services = () => {
  return (
    <section
      id="services"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-24"
    >
      <div className="">
        <h2 className="text-2xl md:text-5xl font-bold text-center mb-4">
          Nuestros <span className="text-primary">Servicios</span>
        </h2>
        <div className="flex flex-col items-center justify-center mb-12">
          <p className="max-w-2xl text-center font-semibold text-lg">
            Proveemos servicios de calidad en la realización de Ensayos de
            Material e Inspecciones Técnicas de Obra, para las distintas
            actividades en la Construcción, Minería e Industria.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          <div className="bg-gray-700/60 backdrop-blur-md p-8 sm:p-10 rounded-lg border border-primary w-full max-w-sm text-white flex flex-col justify-center items-center shadow-2xl transition-transform hover:scale-105">
            <div className="w-20 h-20 bg-blue-600/60 rounded-xl flex items-center justify-center mb-6">
              <Mountain className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-semibold mb-3 text-center">
              Mecánica de Suelos
            </h3>
            <p className="text-center text-sm md:text-base opacity-90">
              Granulometría, Proctor, C.B.R., densidades in situ y más.
            </p>
          </div>

          <div className="bg-gray-700/60 backdrop-blur-md p-8 sm:p-10 rounded-lg border border-primary w-full max-w-sm text-white flex flex-col justify-center items-center shadow-2xl transition-transform hover:scale-105">
            <div className="w-20 h-20 bg-blue-600/60 rounded-xl flex items-center justify-center mb-6">
              <Building2 className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-semibold mb-3 text-center">
              Hormigones
            </h3>
            <p className="text-center text-sm md:text-base opacity-90">
              Control de temperatura, muestreo, compresión y docilidad.
            </p>
          </div>

          <div className="bg-gray-700/60 backdrop-blur-sm p-8 sm:p-10 rounded-lg border border-primary w-full max-w-sm text-white flex flex-col justify-center items-center shadow-2xl transition-transform hover:scale-105">
            <div className="w-20 h-20 bg-blue-600/60 rounded-xl flex items-center justify-center mb-6">
              <Route className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-semibold mb-3 text-center">Asfalto</h3>
            <p className="text-center text-sm md:text-base opacity-90">
              Espesor de testigos, densidades, diseño Marshall y contenido de
              asfalto.
            </p>
          </div>

          <div className="bg-gray-700/60 backdrop-blur-md p-8 sm:p-10 rounded-lg border border-primary w-full max-w-sm text-white flex flex-col justify-center items-center shadow-2xl transition-transform hover:scale-105">
            <div className="w-20 h-20 bg-blue-600/60 rounded-xl flex items-center justify-center mb-6">
              <ClipboardCheck className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-semibold mb-3 text-center">
              Inspecciones (END)
            </h3>
            <p className="text-center text-sm md:text-base opacity-90">
              Evaluación de pinturas, soldaduras y pernos de estructuras.
            </p>
          </div>

          <div className="bg-gray-700/60 backdrop-blur-md p-8 sm:p-10 rounded-lg border border-primary w-full max-w-sm text-white flex flex-col justify-center items-center shadow-2xl transition-transform hover:scale-105">
            <div className="w-20 h-20 bg-blue-600/60 rounded-xl flex items-center justify-center mb-6">
              <Briefcase className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-semibold mb-3 text-center">
              Asesorías
            </h3>
            <p className="text-center text-sm md:text-base opacity-90">
              Dosificaciones, estudios de empréstitos y calibraciones de
              plantas.
            </p>
          </div>

          <div className="bg-gray-700/60 backdrop-blur-md p-8 sm:p-10 rounded-lg border border-primary w-full max-w-sm text-white flex flex-col justify-center items-center shadow-2xl transition-transform hover:scale-105">
            <div className="w-20 h-20 bg-blue-600/60 rounded-xl flex items-center justify-center mb-6">
              <Truck className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-semibold mb-3 text-center">
              Arriendo de Equipos
            </h3>
            <p className="text-center text-sm md:text-base opacity-90">
              Equipos de laboratorio especializados para obras viales y civiles.
            </p>
          </div>
        </div>
        
        <div className="mt-16 text-center">
          <Link 
            href="/ensayos" 
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-primary rounded-full hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-primary/50 hover:-translate-y-1"
          >
            Ver Catálogo Completo de Ensayos
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Services;
