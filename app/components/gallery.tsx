"use client";

import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import { useState, useCallback, useEffect } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

import photo1 from "../assets/images/photo-1.webp";
import photo2 from "../assets/images/photo-2.webp";
import photo3 from "../assets/images/photo-3.webp";

const baseImages = [photo1.src, photo2.src, photo3.src];
const images = [
  ...baseImages,
  ...baseImages,
  ...baseImages,
  ...baseImages,
  ...baseImages,
];

const Gallery = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, dragFree: true },
    [AutoScroll({ playOnInit: true, stopOnInteraction: false, speed: 1 })],
  );

  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const onMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const onMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const togglePlay = useCallback(() => {
    if (!emblaApi) return;
    const autoScroll = emblaApi.plugins().autoScroll;
    if (!autoScroll) return;

    if (autoScroll.isPlaying()) {
      autoScroll.stop();
      setIsPlaying(false);
    } else {
      autoScroll.play();
      setIsPlaying(true);
    }
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const autoScroll = emblaApi.plugins().autoScroll;
    if (!autoScroll) return;

    const syncPlayState = () => setIsPlaying(autoScroll.isPlaying());

    emblaApi
      .on("autoScroll:play", syncPlayState)
      .on("autoScroll:stop", syncPlayState)
      .on("reInit", syncPlayState);

    return () => {
      emblaApi
        .off("autoScroll:play", syncPlayState)
        .off("autoScroll:stop", syncPlayState)
        .off("reInit", syncPlayState);
    };
  }, [emblaApi]);

  return (
    <section id="gallery" className="py-16 bg-white overflow-hidden scroll-mt-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-12 text-center">
        <h2 className="text-2xl md:text-4xl font-bold text-center text-gray-900 mb-4">
          Nuestra <span className="text-primary">Galería</span> de Fotos
        </h2>
        <p className="text-lg text-center text-gray-600 max-w-2xl mx-auto">
          Explora algunos de los mejores momentos y detalles de nuestros
          eventos.
        </p>
      </div>

      <div className="relative max-w-[100vw]">
        <div
          className="embla overflow-hidden cursor-grab active:cursor-grabbing"
          ref={emblaRef}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          <div className="embla__container flex touch-pan-y -ml-4 md:-ml-8">
            {images.map((src, index) => (
              <div
                className="embla__slide flex-[0_0_80%] sm:flex-[0_0_45%] lg:flex-[0_0_30%] min-w-0 pl-4 md:pl-8"
                key={index}
              >
                <div
                  className="relative aspect-4/3 overflow-hidden rounded-3xl shadow-lg ring-1 ring-gray-200 group transition-transform duration-500 ease-out"
                  style={{
                    transform: isHovered ? "scale(0.98)" : "scale(1)",
                  }}
                >
                  <div className="absolute inset-0 bg-gray-900/10 group-hover:bg-transparent transition-colors duration-300 z-10" />
                  <img
                    src={src}
                    alt={`Galería de fotos ${index + 1}`}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* controls */}
        <div className="flex items-center justify-center gap-4 mt-10">
          <button
            onClick={scrollPrev}
            className="p-3 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900 transition-colors"
            aria-label="Anterior"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            onClick={togglePlay}
            className="flex items-center justify-center w-14 h-14 rounded-full bg-primary text-gray-900 shadow-md hover:bg-primary-hover hover:scale-105 transition-all"
            aria-label={isPlaying ? "Pausar" : "Reproducir"}
          >
            {isPlaying ? (
              <Pause size={24} fill="currentColor" />
            ) : (
              <Play size={24} fill="currentColor" className="ml-1" />
            )}
          </button>

          <button
            onClick={scrollNext}
            className="p-3 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900 transition-colors"
            aria-label="Siguiente"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Gallery;
