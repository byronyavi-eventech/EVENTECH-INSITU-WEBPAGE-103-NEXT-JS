import Hero from "./components/hero";
import Accreditations from "./components/accreditations";
import LogoCloud from "./components/logoCloud";
import Services from "./components/services";
import Photo1 from "./assets/images/photo-1.webp";
import Photo2 from "./assets/images/photo-2.webp";
import AboutUs from "./components/aboutUs";
import Gallery from "./components/gallery";

export default function Home() {
  return (
    <>
      <div
        id="hero"
        className="relative bg-cover bg-center bg-no-repeat w-full min-h-screen flex flex-col mt-[-88px] sm:mt-[-104px] md:mt-[-112px]"
        style={{ backgroundImage: `url(${Photo1.src})` }}
      >
        <div className="absolute inset-0 bg-red-800/60 mix-blend-multiply"></div>
        <div className="relative z-10 pt-[88px] sm:pt-[104px] md:pt-[112px]">
          <Hero />
        </div>
      </div>
      <LogoCloud />
      <div
        className="relative bg-cover bg-center bg-no-repeat w-full min-h-screen flex flex-col"
        style={{ backgroundImage: `url(${Photo2.src})` }}
      >
        <div className="absolute inset-0 bg-linear-to-r from-blue-600/60 from-25% to-yellow-500/60 mix-blend-multiply"></div>
        <div className="relative z-0">
          <Services />
        </div>
      </div>
      <Accreditations />
      <AboutUs />
      <Gallery />
    </>
  );
}
