import { NextResponse } from "next/server";

import { generateOffers, type QuoteRequest } from "@/lib/insurance-data";

export async function POST(request: Request) {
  const body = (await request.json()) as QuoteRequest;
  const offers = generateOffers(body);

  return NextResponse.json({
    requestId: `cot-${Date.now()}`,
    offers,
    message:
      "Estas ofertas son demo. Reemplaza este endpoint por tus credenciales reales de aseguradoras o por tu broker middleware.",
  });
}
