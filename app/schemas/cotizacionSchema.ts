import { z } from "zod";
import { validate as validateRut } from "rut.js";

const phoneRegex = /^(\+?56)?\s?9\s?[0-9]{4}\s?[0-9]{4}$/;

const capitalizeWords = (str: string) => {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const cotizacionSchema = z.object({
  rutEmpresa: z
    .string()
    .trim()
    .min(1, "Este campo es requerido")
    .refine((val) => validateRut(val), {
      message: "RUT inválido",
    }),
  giroEmpresa: z
    .string()
    .trim()
    .min(2, "Mínimo 2 caracteres")
    .max(255, "Máximo 255 caracteres"),
  nombreContacto: z
    .string()
    .trim()
    .min(2, "Mínimo 2 caracteres")
    .max(255, "Máximo 255 caracteres")
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "Solo se permiten letras")
    .transform(capitalizeWords),
  celularContacto: z
    .string()
    .trim()
    .regex(phoneRegex, "Formato inválido (Ej: +569 1234 5678)"),
  emailContacto: z
    .string()
    .trim()
    .min(1, "Este campo es requerido")
    .pipe(z.email("Email inválido"))
    .transform((str) => str.toLowerCase()),
  direccionEmpresa: z
    .string()
    .trim()
    .min(5, "Mínimo 5 caracteres")
    .max(255, "Máximo 255 caracteres"),
  regionEmpresa: z.string().min(1, "Seleccione una región"),
  comunaEmpresa: z.string().min(1, "Seleccione una comuna"),
  ciudadEmpresa: z
    .string()
    .trim()
    .min(2, "Mínimo 2 caracteres")
    .transform(capitalizeWords),

  nombreObra: z
    .string()
    .trim()
    .min(2, "Mínimo 2 caracteres")
    .max(255, "Máximo 255 caracteres")
    .transform(capitalizeWords),
  nombreMandante: z
    .string()
    .trim()
    .min(2, "Mínimo 2 caracteres")
    .max(255, "Máximo 255 caracteres")
    .transform(capitalizeWords),
  nombreContratista: z
    .string()
    .trim()
    .min(2, "Mínimo 2 caracteres")
    .max(255, "Máximo 255 caracteres")
    .transform(capitalizeWords),
  ubicacionObra: z
    .string()
    .trim()
    .min(5, "Mínimo 5 caracteres")
    .max(255, "Máximo 255 caracteres"),
  regionObra: z.string().min(1, "Seleccione una región"),
  comunaObra: z.string().min(1, "Seleccione una comuna"),
  ciudadObra: z
    .string()
    .trim()
    .min(2, "Mínimo 2 caracteres")
    .transform(capitalizeWords),
  duracionObra: z.coerce.number().min(1, "Debe ser al menos 1 mes"),

  nombreEncargado: z
    .string()
    .trim()
    .min(2, "Mínimo 2 caracteres")
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "Solo se permiten letras")
    .transform(capitalizeWords),
  correoEncargado: z
    .string()
    .trim()
    .min(1, "Este campo es requerido")
    .pipe(z.email("Email inválido"))
    .transform((str) => str.toLowerCase()),
  telefonoEncargado: z
    .string()
    .trim()
    .regex(phoneRegex, "Formato inválido (Ej: +569 1234 5678)"),

  ensayos: z.array(
    z.object({
      area: z.string().min(1, "Seleccione área"),
      subarea: z.string().min(1, "Seleccione sub área"),
      ensayo: z.string().min(1, "Seleccione ensayo"),
      cantidad: z.coerce.number().min(1, "Mínimo 1"),
    }),
  ),

  // Cantidad de visitas a terreno para TODA la cotización (1-5). Reemplaza el
  // viejo campo "visitas" por ensayo individual — ver Regla Transversal del
  // flujo de Programación de Ensayos.
  visitasTotales: z.coerce.number().int().min(1, "Mínimo 1").max(5, "Máximo 5"),
});

export type CotizacionFormData = z.infer<typeof cotizacionSchema>;
