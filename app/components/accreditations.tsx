import { Award, ShieldCheck, CheckCircle } from "lucide-react";

const Accreditations = () => {
  return (
    <section
      id="accreditations"
      className="bg-white py-12 border-y border-gray-200 scroll-mt-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-4xl font-bold text-gray-900">
            Nuestras <span className="text-primary">Acreditaciones</span>
          </h2>
          <p className="text-gray-600 mt-2">
            Respaldados por las principales instituciones para garantizar la
            máxima calidad.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-items-center">
          <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-2xl w-full max-w-sm border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <Award className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">INN</h3>
            <p className="text-center text-gray-600 text-sm">
              Acreditados ante el Instituto Nacional de Normalización bajo la
              norma NCh-ISO/IEC 17025:2017.
            </p>
          </div>

          <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-2xl w-full max-w-sm border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <CheckCircle className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Especialidades
            </h3>
            <p className="text-center text-gray-600 text-sm">
              Acreditación LE 1245 (Mecánica de Suelos) y LE 1246 (Hormigón y
              Mortero).
            </p>
          </div>

          <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-2xl w-full max-w-sm border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <ShieldCheck className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">MINVU</h3>
            <p className="text-center text-gray-600 text-sm">
              Inscritos oficialmente por resolución exenta del Ministerio de
              Vivienda y Urbanismo.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Accreditations;
