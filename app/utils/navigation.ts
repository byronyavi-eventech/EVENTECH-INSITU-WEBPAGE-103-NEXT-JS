interface NavLink {
  name: string;
  href: string;
}

export const navLinks: NavLink[] = [
  { name: "Inicio", href: "/#hero" },
  { name: "Servicios", href: "/#services" },
  { name: "Catálogo de Ensayos", href: "/ensayos" },
  { name: "Acreditaciones", href: "/#accreditations" },
  { name: "Nosotros", href: "/#about-us" },
  { name: "Galería", href: "/#gallery" },
  { name: "Cotizar", href: "/cotizacion" },
];