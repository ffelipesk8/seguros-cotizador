export type ProductType = "auto" | "moto" | "salud";

export type QuoteRequest = {
  product: ProductType;
  hasPlate: boolean;
  plate?: string;
  city: string;
  document: string;
  name: string;
  phone: string;
  email: string;
  vehicleYear?: number;
  vehicleValue?: number;
};

export type QuoteOffer = {
  insurer: string;
  plan: string;
  monthlyPrice: number;
  deductible: string;
  benefits: string[];
  highlight: string;
  rating: number;
};

export const products: Array<{
  id: ProductType;
  name: string;
  subtitle: string;
  accent: string;
}> = [
  {
    id: "auto" satisfies ProductType,
    name: "Seguro de auto",
    subtitle: "Comparador con placa o sin placa",
    accent: "Para particulares, flotillas pequenas y renovaciones.",
  },
  {
    id: "moto" satisfies ProductType,
    name: "Seguro de moto",
    subtitle: "Cotizacion agil con filtros de cilindraje",
    accent: "Coberturas urbanas, repartidores y uso diario.",
  },
  {
    id: "salud" satisfies ProductType,
    name: "Planes de salud",
    subtitle: "Opciones por presupuesto y red medica",
    accent: "Ideal para upsell posterior desde la landing.",
  },
];

const offerTemplates: Record<ProductType, Array<Omit<QuoteOffer, "monthlyPrice" | "rating">>> = {
  auto: [
    {
      insurer: "Sura",
      plan: "Auto Global Plus",
      deductible: "1 SMMLV",
      highlight: "La mejor combinacion precio-cobertura para ciudad.",
      benefits: ["Grua nacional", "Conductor elegido", "Asistencia juridica"],
    },
    {
      insurer: "Allianz",
      plan: "Auto Preferente",
      deductible: "10% min 1 SMMLV",
      highlight: "Muy fuerte en respaldo y tiempos de respuesta.",
      benefits: ["Taller premium", "Carro de reemplazo", "Perdida total y parcial"],
    },
    {
      insurer: "AXA Colpatria",
      plan: "Proteccion Flexible",
      deductible: "15% min 1 SMMLV",
      highlight: "Ideal cuando quieres bajar cuota mensual sin perder respaldo.",
      benefits: ["Asistencia vial", "Vidrios", "RCE ampliada"],
    },
  ],
  moto: [
    {
      insurer: "SBS",
      plan: "Moto Activa",
      deductible: "10% min 0.8 SMMLV",
      highlight: "Muy competitiva para uso diario y trabajo.",
      benefits: ["Asistencia vial", "Perdida parcial", "RC extracontractual"],
    },
    {
      insurer: "Mapfre",
      plan: "Moto Integral",
      deductible: "15% min 1 SMMLV",
      highlight: "Buena mezcla entre precio y cobertura extendida.",
      benefits: ["Grua", "Choque y hurto", "Asesor de siniestro"],
    },
    {
      insurer: "Previsora",
      plan: "Moto Urbana",
      deductible: "1 SMMLV",
      highlight: "Opcion conservadora para presupuestos medios.",
      benefits: ["Asistencia legal", "Red de talleres", "Cobertura nacional"],
    },
  ],
  salud: [
    {
      insurer: "Colsanitas",
      plan: "Acceso Vital",
      deductible: "Sin deducible",
      highlight: "Muy buscado por red medica y experiencia premium.",
      benefits: ["Medicina general", "Telemedicina", "Chequeos preventivos"],
    },
    {
      insurer: "Sura Salud",
      plan: "Plan Familiar",
      deductible: "Copagos variables",
      highlight: "Fuerte para grupos familiares con varios beneficiarios.",
      benefits: ["Urgencias", "Especialistas", "Laboratorio"],
    },
    {
      insurer: "Coomeva",
      plan: "Salud Flexible",
      deductible: "Copago por servicio",
      highlight: "Buena puerta de entrada para tickets mas bajos.",
      benefits: ["Red nacional", "Orientacion medica", "Citas programadas"],
    },
  ],
};

export function generateOffers(input: QuoteRequest): QuoteOffer[] {
  const base =
    input.product === "auto"
      ? 215_000
      : input.product === "moto"
        ? 92_000
        : 168_000;

  const cityModifier =
    ["bogota", "medellin", "cali"].includes(input.city.toLowerCase()) ? 24_000 : 10_000;
  const ageModifier = input.vehicleYear ? Math.max(0, 2026 - input.vehicleYear) * 2_500 : 8_000;
  const valueModifier = input.vehicleValue ? Math.round(input.vehicleValue / 7_500_000) * 2_000 : 0;

  return offerTemplates[input.product].map((template, index) => ({
    ...template,
    monthlyPrice: base + cityModifier + ageModifier + valueModifier + index * 18_000,
    rating: Number((4.6 - index * 0.12).toFixed(1)),
  }));
}
