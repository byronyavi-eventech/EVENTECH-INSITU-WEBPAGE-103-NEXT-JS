import logo from "../assets/logos/logo-insitu.png";
import { Mail, Phone, MapPin } from "lucide-react";
import { navLinks } from "../utils/navigation";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-dark text-gray-300 py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-8">
          <div className="flex flex-col space-y-4">
            <div className="bg-white p-2 rounded-xl inline-block w-max mb-2">
              <img src={logo.src} alt="Insitu Logo" className="h-10 w-auto" />
            </div>
            <p className="text-sm leading-relaxed opacity-90">
              Laboratorio INSITU es un grupo de profesionales especializados en
              proveer servicios de calidad en Ensayos de Materiales e
              Inspecciones Técnicas de Obra.
            </p>
          </div>

          <div className="flex flex-col space-y-4">
            <h4 className="text-white font-bold text-lg mb-2">
              Enlaces Rápidos
            </h4>
            <ul className="space-y-3 text-sm">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col space-y-4">
            <h4 className="text-white font-bold text-lg mb-2">Contacto</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 text-primary mr-3 mt-0.5 shrink-0" />
                <div className="flex flex-col">
                  <span className="mb-2">
                    <strong>Alto Hospicio:</strong>
                    <br />
                    Unión Europea 2831, Altos del Sur III
                  </span>
                  <span>
                    <strong>Calama (Casa Matriz):</strong>
                    <br />
                    Av. Nueva 2678
                  </span>
                </div>
              </li>
              <li className="flex items-start">
                <Phone className="w-5 h-5 text-primary mr-3 mt-0.5 shrink-0" />
                <div className="flex flex-col space-y-1">
                  <span>(57) 2500774</span>
                  <span>+56 9 53640040</span>
                  <span>+56 9 53640026</span>
                </div>
              </li>
              <li className="flex items-start">
                <Mail className="w-5 h-5 text-primary mr-3 mt-0.5 shrink-0" />
                <div className="flex flex-col space-y-1">
                  <a
                    href="mailto:contacto@laboratorioinsitu.cl"
                    className="hover:text-white transition-colors"
                  >
                    contacto@laboratorioinsitu.cl
                  </a>
                  <a
                    href="mailto:administracion@laboratorioinsitu.cl"
                    className="hover:text-white transition-colors"
                  >
                    administracion@laboratorioinsitu.cl
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Laboratorio INSITU. Todos los
          derechos reservados.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
