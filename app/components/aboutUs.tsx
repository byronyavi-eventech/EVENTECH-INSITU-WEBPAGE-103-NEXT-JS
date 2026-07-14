import { FileCheck, Building2, Users } from "lucide-react";
import Photo3 from "../assets/images/photo-3.webp";

const AboutUs = () => {
  return (
    <section
      id="about-us"
      className="flex flex-col lg:flex-row w-full min-h-screen"
    >
      {/* Left Content */}
      <div className="w-full lg:w-3/5 bg-gray-50 text-black px-4 sm:px-6 lg:pl-[max(2rem,calc(50vw-38rem))] lg:pr-16 py-16 lg:py-24 flex flex-col justify-center">
        <div className="w-full max-w-3xl">
          <h2 className="text-2xl md:text-5xl font-bold mb-6">
            Sobre <span className="text-primary">INSITU</span>
          </h2>
          <p className="mb-6 text-gray-700 leading-relaxed text-base md:text-lg">
            Laboratorio INSITU, somos un grupo de profesionales unidos a partir
            del año 2013, con el fin de proveer servicios de calidad en la
            realización de Ensayos de Material e Inspecciones Técnicas de Obra,
            para las distintas actividades en la Construcción, Industriales y de
            Minería.
          </p>
          <p className="mb-10 text-gray-700 leading-relaxed text-base md:text-lg">
            Con casa matriz en Iquique y sucursales en Arica y Calama, contamos
            con equipo de punta para la obtención de resultados de excelencia.
            Contribuimos activamente a la capacitación y educación de nuestros
            trabajadores, manteniendo nuestro compromiso social.
          </p>

          <div className="flex flex-col sm:flex-row gap-6">
            {/* Card 1 */}
            <div className="bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-6 flex-1 flex flex-col items-center justify-center text-center transition-transform hover:-translate-y-1">
              <FileCheck className="w-8 h-8 mb-2 text-gray-700" />
              <p className="text-gray-800 font-medium mb-1">Certificados</p>
              <p className="text-4xl font-bold text-primary mb-1">+15k</p>
              <p className="text-xs text-gray-500 font-medium">Emitidos</p>
            </div>
            {/* Card 2 */}
            <div className="bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-6 flex-1 flex flex-col items-center justify-center text-center transition-transform hover:-translate-y-1">
              <Building2 className="w-8 h-8 mb-2 text-gray-700" />
              <p className="text-gray-800 font-medium mb-1">Obras</p>
              <p className="text-4xl font-bold text-primary mb-1">+150</p>
              <p className="text-xs text-gray-500 font-medium">Atendidas</p>
            </div>
            {/* Card 3 */}
            <div className="bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-6 flex-1 flex flex-col items-center justify-center text-center transition-transform hover:-translate-y-1">
              <Users className="w-8 h-8 mb-2 text-gray-700" />
              <p className="text-gray-800 font-medium mb-1">Clientes</p>
              <p className="text-4xl font-bold text-primary mb-1">+300</p>
              <p className="text-xs text-gray-500 font-medium">Satisfechos</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Image/Values */}
      <div
        className="w-full lg:w-2/5 bg-cover bg-center min-h-[500px] flex items-center justify-center p-8"
        style={{ backgroundImage: `url(${Photo3.src})` }}
      >
        {/* Values Card */}
        <div className="bg-black/40 backdrop-blur-md border border-primary rounded-xl p-8 md:p-10 w-full max-w-md shadow-2xl">
          <h3 className="text-3xl font-bold text-white mb-6 text-center">
            Misión y Visión
          </h3>
          <div className="space-y-6">
            <div>
              <h4 className="text-xl font-bold text-primary mb-2">
                Nuestra Misión
              </h4>
              <p className="text-white text-sm md:text-base leading-relaxed opacity-90">
                Proporcionar servicios con métodos normalizados por personal
                calificado y ético, comprometidos con la excelencia y la
                satisfacción del cliente.
              </p>
            </div>
            <div className="w-full h-px bg-white/30"></div>
            <div>
              <h4 className="text-xl font-bold text-primary mb-2">
                Nuestra Visión
              </h4>
              <p className="text-white text-sm md:text-base leading-relaxed opacity-90">
                Ser el laboratorio líder en ensayes de materiales, aplicando
                tecnología de punta para responder a los requerimientos de la
                Minería y Construcción.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
