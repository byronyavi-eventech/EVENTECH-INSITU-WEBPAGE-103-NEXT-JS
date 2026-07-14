"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import logo from "../assets/logos/logo-insitu.png";
import { navLinks } from "../utils/navigation";
import Link from "next/link";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
          isScrolled
            ? "py-2 sm:py-3 bg-white/85 backdrop-blur-md shadow-md"
            : "py-4 sm:py-8 bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav
            className={`flex flex-col md:flex-row md:justify-between md:items-center transition-all duration-500 ease-out ${
              isScrolled
                ? "bg-transparent p-2 md:px-4"
                : "bg-white p-4 rounded-xl shadow-sm"
            }`}
          >
            <div className="flex justify-between items-center w-full md:w-auto">
              <Link href="/" className="flex items-center">
                <img
                  src={logo.src}
                  alt="Insitu Logo"
                  className={`w-auto transition-all duration-500 ease-out ${
                    isScrolled ? "h-7 md:h-8" : "h-8 md:h-10"
                  }`}
                />
              </Link>
              <button
                className="md:hidden text-black cursor-pointer relative w-6 h-6 flex items-center justify-center"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle menu"
              >
                <Menu
                  className={`absolute transition-all duration-500 ease-out ${
                    isOpen
                      ? "rotate-90 opacity-0 scale-50"
                      : "rotate-0 opacity-100 scale-100"
                  } w-6 h-6`}
                />
                <X
                  className={`absolute transition-all duration-500 ease-out ${
                    isOpen
                      ? "rotate-0 opacity-100 scale-100"
                      : "-rotate-90 opacity-0 scale-50"
                  } w-6 h-6`}
                />
              </button>
            </div>

            <div
              className={`w-full md:w-auto overflow-hidden transition-all duration-500 ease-in-out ${
                isOpen
                  ? "max-h-96 opacity-100"
                  : "max-h-0 opacity-0 md:max-h-96 md:opacity-100"
              }`}
            >
              <ul className="flex flex-col md:flex-row gap-4 md:gap-x-8 pt-4 pb-2 md:py-0 text-black font-medium">
                {navLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="hover:text-accent transition-colors block"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>
      </div>
      {/* top spacer */}
      <div
        className="h-[88px] sm:h-[104px] md:h-[112px] w-full invisible"
        aria-hidden="true"
      ></div>
    </>
  );
};

export default NavBar;
