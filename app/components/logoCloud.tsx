import icafalLogo from "../assets/logos/icafal-logo.svg";
import bitumixLogo from "../assets/logos/logo-bitumix.png";
import dvcLogo from "../assets/logos/logo-dvc.png";
import exconLogo from "../assets/logos/logo-excon.png";
import simelecLogo from "../assets/logos/logo-simelec.png";

const logos = [
  { src: icafalLogo.src, alt: "Icafal" },
  { src: bitumixLogo.src, alt: "Bitumix" },
  { src: dvcLogo.src, alt: "DVC" },
  { src: exconLogo.src, alt: "Excon" },
  { src: simelecLogo.src, alt: "Simelec" },
];

const LogoCloud = () => {
  return (
    <div className="w-full bg-white py-16 overflow-hidden flex flex-col items-center">
      <h2 className="text-2xl md:text-4xl font-bold text-center text-gray-900 mb-12">
        Empresas que han <span className="text-primary">confiado</span> en
        nosotros
      </h2>
      <div className="relative flex max-w-[100vw] overflow-hidden group">
        {logos.map((_, groupIndex) => (
          <div
            key={groupIndex}
            className="flex shrink-0 animate-marquee group-hover:[animation-play-state:paused]"
          >
            {logos.map((logo, index) => (
              <div
                key={index}
                className="flex items-center justify-center mx-8 w-48 h-24"
              >
                <img
                  src={logo.src}
                  alt={logo.alt}
                  className="max-w-full max-h-full object-contain filter opacity-70 hover:opacity-100 transition-all duration-300"
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LogoCloud;
