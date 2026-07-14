import Link from "next/link";

const Hero = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row justify-between items-center mt-12 lg:mt-36 gap-12 lg:gap-8 pb-16">
        <div className="max-w-2xl text-center lg:text-left">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
            Aseguramos tu Proyecto con{" "}
            <span className="text-secondary">resultados </span>profesionales
          </h1>
          <p className="text-base md:text-lg mt-4 md:mt-6 text-gray-100 max-w-lg">
            Especialistas en recolección y análisis de muestras. Entregamos
            resultados profesionales para asegurar la calidad de tu obra con el
            mayor conocimiento.
          </p>
          <a
            href="/brochure_insitu.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-secondary text-white px-6 py-3 rounded-lg font-bold mt-8 hover:bg-yellow-400 transition-colors cursor-pointer"
          >
            Ver Brochure
          </a>
        </div>
        <div className="bg-white rounded-xl w-full max-w-sm lg:w-72 p-8 text-black flex flex-col justify-center items-center shadow-2xl">
          <h3 className="text-xl font-semibold text-center mb-6">
            Cotiza con nosotros aquí
          </h3>
          <Link
            href="/cotizacion"
            className="bg-secondary text-center text-white px-8 py-3 rounded-lg font-bold hover:bg-yellow-400 transition-colors cursor-pointer w-full shadow-2xl"
          >
            Cotizar
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
