// Persistencia local (NO backend) de los datos de contacto/empresa que tiene
// sentido reutilizar entre cotizaciones futuras del mismo cliente. Guarda
// solo en localStorage del navegador — nunca se envía a ningún servidor.
//
// Explícitamente afuera: RUT empresa (para persona natural equivale a un ID
// de gobierno — dato sensible), ensayos seleccionados, ubicación/región/
// comuna/ciudad/nombre/contratista/duración de la obra (específicos de cada
// proyecto, no tiene sentido reutilizarlos), y visitasTotales.

import type { CotizacionFormData } from "../schemas/cotizacionSchema";

export const FORM_STORAGE_KEY = "insitu_datos_formulario";

const STORED_FIELDS = [
  // Paso 1 — Datos del Cotizante
  "giroEmpresa",
  "nombreContacto",
  "celularContacto",
  "emailContacto",
  "direccionEmpresa",
  "regionEmpresa",
  "comunaEmpresa",
  "ciudadEmpresa",
  // Paso 2 — Datos de la Obra (solo Mandante + Encargado)
  "nombreMandante",
  "nombreEncargado",
  "correoEncargado",
  "telefonoEncargado",
] as const satisfies readonly (keyof CotizacionFormData)[];

export type StoredContactField = (typeof STORED_FIELDS)[number];
export type StoredFormData = Partial<Record<StoredContactField, string>>;

export function saveFormDataToStorage(data: CotizacionFormData): void {
  try {
    const subset: StoredFormData = {};
    for (const field of STORED_FIELDS) {
      const value = data[field];
      if (typeof value === "string" && value.trim() !== "") {
        subset[field] = value;
      }
    }
    window.localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(subset));
  } catch {
    // localStorage no disponible (modo privado, cuotas, SSR, etc.) — no
    // interrumpe el flujo de envío del formulario.
  }
}

export function loadFormDataFromStorage(): StoredFormData | null {
  try {
    const raw = window.localStorage.getItem(FORM_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (typeof parsed !== "object" || parsed === null) return null;

    const result: StoredFormData = {};
    for (const field of STORED_FIELDS) {
      const value = (parsed as Record<string, unknown>)[field];
      if (typeof value === "string") result[field] = value;
    }
    return result;
  } catch {
    return null;
  }
}
