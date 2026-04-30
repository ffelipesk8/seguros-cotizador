"use client";

import { startTransition, useMemo, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Bike,
  Car,
  CheckCircle2,
  Clock3,
  HeartPulse,
  PhoneCall,
  ShieldCheck,
  Sparkles,
  Stars,
} from "lucide-react";

import { products, type ProductType, type QuoteOffer, type QuoteRequest } from "@/lib/insurance-data";

const metrics = [
  { value: "13+", label: "aseguradoras listas para conectar" },
  { value: "< 60s", label: "para entregar una primera comparacion" },
  { value: "2 rutas", label: "cotizar por placa o sin placa" },
];

const steps = [
  {
    title: "Captura comercial clara",
    text: "El usuario aterriza, entiende valor en segundos y entra al flujo correcto sin ruido.",
  },
  {
    title: "Formulario que no fricciona",
    text: "Pide solo los datos necesarios para devolver opciones reales y escalar a cierre comercial.",
  },
  {
    title: "Comparacion accionable",
    text: "Devuelve planes, beneficios y CTA para continuar por WhatsApp o compra asistida.",
  },
];

const featureCards = [
  "Cotizacion por placa o sin placa",
  "Soporte para auto, moto y salud",
  "Ranking de ofertas por precio y cobertura",
  "CTA inmediato a asesor comercial",
];

type FormState = QuoteRequest;

const initialState: FormState = {
  product: "auto",
  hasPlate: true,
  plate: "",
  city: "Bogota",
  document: "",
  name: "",
  phone: "",
  email: "",
  vehicleYear: 2021,
  vehicleValue: 58_000_000,
};

function productIcon(product: ProductType) {
  if (product === "auto") return <Car size={18} />;
  if (product === "moto") return <Bike size={18} />;
  return <HeartPulse size={18} />;
}

export default function HomePage() {
  const [form, setForm] = useState<FormState>(initialState);
  const [offers, setOffers] = useState<QuoteOffer[]>([]);
  const [requestId, setRequestId] = useState<string>("");
  const [serverMessage, setServerMessage] = useState<string>("");
  const [isPending, setIsPending] = useState(false);

  const selectedProduct = useMemo(
    () => products.find((item) => item.id === form.product) ?? products[0],
    [form.product],
  );

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsPending(true);

    try {
      const response = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const payload = (await response.json()) as {
        requestId: string;
        offers: QuoteOffer[];
        message: string;
      };

      startTransition(() => {
        setOffers(payload.offers);
        setRequestId(payload.requestId);
        setServerMessage(payload.message);
      });
    } finally {
      setIsPending(false);
    }
  }

  return (
    <main>
      <section className="section" style={{ paddingTop: 24 }}>
        <div className="shell">
          <div
            className="glass"
            style={{
              padding: "14px 18px",
              borderRadius: 999,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 14,
                  background: "linear-gradient(135deg, var(--accent), var(--brand))",
                  color: "white",
                  display: "grid",
                  placeItems: "center",
                  fontWeight: 800,
                }}
              >
                CS
              </div>
              <div>
                <strong style={{ display: "block" }}>Canguro Select</strong>
                <span className="muted" style={{ fontSize: 14 }}>
                  Plataforma de cotizacion online para seguros
                </span>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <a className="btn btn-secondary" href="#productos">
                Productos
              </a>
              <a className="btn btn-primary" href="#cotizador">
                Cotizar ahora
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 22 }}>
        <div className="shell hero-grid">
          <div className="hero-panel glass">
            <span className="pill">
              <Sparkles size={14} />
              inspirado en la claridad comercial del mercado
            </span>
            <h1 style={{ fontSize: "clamp(3rem, 7vw, 5.9rem)", marginTop: 22, maxWidth: "11ch" }}>
              Cotiza seguros en linea con una experiencia que si convierte.
            </h1>
            <p className="muted" style={{ marginTop: 20, maxWidth: 620, fontSize: 18 }}>
              Construimos una base propia para vender auto, moto y salud sin copiar otro
              sitio literal: misma ambicion comercial, identidad nueva y backend listo para
              conectar tus usuarios de aseguradoras.
            </p>
            <div style={{ display: "flex", gap: 12, marginTop: 26, flexWrap: "wrap" }}>
              <a className="btn btn-primary" href="#cotizador">
                Probar cotizador
                <ArrowRight size={18} />
              </a>
              <a className="btn btn-secondary" href="#arquitectura">
                Ver arquitectura
              </a>
            </div>
            <div className="metric-strip">
              {metrics.map((metric) => (
                <div key={metric.label} className="metric-card glass">
                  <div style={{ fontSize: 34, fontWeight: 800 }}>{metric.value}</div>
                  <div className="muted" style={{ fontSize: 14 }}>
                    {metric.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            className="hero-panel"
            style={{
              background: "linear-gradient(180deg, rgba(20,35,29,0.96), rgba(15,78,59,0.92))",
              color: "white",
              borderRadius: "var(--radius-lg)",
              boxShadow: "var(--shadow-lift)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
              <span className="badge badge-accent">
                <Stars size={14} />
                Flujo principal
              </span>
              <span style={{ color: "rgba(255,255,255,0.74)", fontSize: 14 }}>
                lead, comparacion, cierre asistido
              </span>
            </div>
            <div className="stack" style={{ marginTop: 22 }}>
              {featureCards.map((item) => (
                <div
                  key={item}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: 18,
                    borderRadius: 20,
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <CheckCircle2 size={18} color="#f6c06f" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 22, padding: 18, borderRadius: 22, background: "rgba(255,255,255,0.06)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <PhoneCall size={18} color="#f6c06f" />
                <strong>Camino comercial recomendado</strong>
              </div>
              <p style={{ marginTop: 10, color: "rgba(255,255,255,0.76)" }}>
                Cotiza online, muestra 3 ofertas comparables y lleva el cierre por WhatsApp,
                llamada o pasarela cuando tengas los convenios completos.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="productos" className="section">
        <div className="shell">
          <span className="pill">Productos base</span>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 18,
              alignItems: "end",
              marginTop: 18,
              flexWrap: "wrap",
            }}
          >
            <h2 style={{ fontSize: "clamp(2.2rem, 4vw, 4rem)", maxWidth: 620 }}>
              Mismo objetivo de negocio, propuesta propia y escalable.
            </h2>
            <p className="muted" style={{ maxWidth: 420 }}>
              Esta primera entrega deja la experiencia lista para captar, cotizar y abrir
              el camino a integraciones reales con tus credenciales.
            </p>
          </div>

          <div className="grid-3" style={{ marginTop: 28 }}>
            {products.map((product) => (
              <article key={product.id} className="product-card">
                <div className="badge badge-brand">
                  {productIcon(product.id)}
                  {product.name}
                </div>
                <h3 style={{ marginTop: 16, fontSize: 30 }}>{product.subtitle}</h3>
                <p className="muted" style={{ marginTop: 10 }}>
                  {product.accent}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="cotizador" className="section">
        <div className="shell quote-grid">
          <div className="stack">
            <span className="pill">Cotizador demo funcional</span>
            <h2 style={{ fontSize: "clamp(2.1rem, 4vw, 4rem)" }}>
              Formulario comercial y ofertas comparadas.
            </h2>
            <p className="muted" style={{ fontSize: 17 }}>
              Ya puedes probar la experiencia principal. El endpoint local devuelve ofertas
              demo y luego lo cambiamos por la integracion real con tus aseguradoras.
            </p>

            <div className="stack">
              {steps.map((step, index) => (
                <div key={step.title} className="step-card">
                  <div className="badge badge-accent">0{index + 1}</div>
                  <h3 style={{ marginTop: 14, fontSize: 24 }}>{step.title}</h3>
                  <p className="muted" style={{ marginTop: 8 }}>
                    {step.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass hero-panel">
            <form onSubmit={handleSubmit} className="stack">
              <div className="grid-3">
                {products.map((product) => {
                  const active = form.product === product.id;
                  return (
                    <button
                      key={product.id}
                      type="button"
                      className="btn"
                      onClick={() => updateField("product", product.id)}
                      style={{
                        padding: 18,
                        background: active ? "var(--brand-strong)" : "white",
                        color: active ? "white" : "var(--ink)",
                        border: active ? "none" : "1px solid var(--line)",
                      }}
                    >
                      {productIcon(product.id)}
                      {product.name}
                    </button>
                  );
                })}
              </div>

              <div
                style={{
                  padding: 18,
                  borderRadius: 22,
                  background: "rgba(255,255,255,0.72)",
                  border: "1px solid var(--line)",
                }}
              >
                <strong>{selectedProduct.name}</strong>
                <p className="muted" style={{ marginTop: 6 }}>
                  {selectedProduct.subtitle}
                </p>
              </div>

              {(form.product === "auto" || form.product === "moto") && (
                <div className="grid-3">
                  <button
                    type="button"
                    className="btn"
                    onClick={() => updateField("hasPlate", true)}
                    style={{
                      background: form.hasPlate ? "var(--accent)" : "white",
                      color: form.hasPlate ? "white" : "var(--ink)",
                      border: form.hasPlate ? "none" : "1px solid var(--line)",
                    }}
                  >
                    Con placa
                  </button>
                  <button
                    type="button"
                    className="btn"
                    onClick={() => updateField("hasPlate", false)}
                    style={{
                      background: !form.hasPlate ? "var(--accent)" : "white",
                      color: !form.hasPlate ? "white" : "var(--ink)",
                      border: !form.hasPlate ? "none" : "1px solid var(--line)",
                    }}
                  >
                    Sin placa
                  </button>
                  <div className="badge badge-brand" style={{ justifyContent: "center" }}>
                    <Clock3 size={14} />
                    entrega inmediata
                  </div>
                </div>
              )}

              <div className="grid-3">
                {form.hasPlate && (form.product === "auto" || form.product === "moto") ? (
                  <input
                    className="field"
                    value={form.plate}
                    onChange={(event) => updateField("plate", event.target.value.toUpperCase())}
                    placeholder="Placa"
                  />
                ) : (
                  <input
                    className="field"
                    type="number"
                    value={form.vehicleYear ?? ""}
                    onChange={(event) => updateField("vehicleYear", Number(event.target.value))}
                    placeholder="Modelo"
                  />
                )}

                <input
                  className="field"
                  value={form.city}
                  onChange={(event) => updateField("city", event.target.value)}
                  placeholder="Ciudad"
                />

                {(form.product === "auto" || form.product === "moto") ? (
                  <input
                    className="field"
                    type="number"
                    value={form.vehicleValue ?? ""}
                    onChange={(event) => updateField("vehicleValue", Number(event.target.value))}
                    placeholder="Valor aproximado"
                  />
                ) : (
                  <input
                    className="field"
                    value={form.document}
                    onChange={(event) => updateField("document", event.target.value)}
                    placeholder="Documento"
                  />
                )}
              </div>

              <div className="grid-3">
                <input
                  className="field"
                  value={form.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  placeholder="Nombre completo"
                  required
                />
                <input
                  className="field"
                  value={form.phone}
                  onChange={(event) => updateField("phone", event.target.value)}
                  placeholder="Celular"
                  required
                />
                <input
                  className="field"
                  type="email"
                  value={form.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  placeholder="Correo"
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary" disabled={isPending}>
                {isPending ? "Consultando ofertas..." : "Ver mejores opciones ahora"}
                <ArrowRight size={18} />
              </button>
            </form>
          </div>
        </div>

        <div className="shell" style={{ marginTop: 28 }}>
          <div className="stack">
            {offers.length > 0 ? (
              offers.map((offer) => (
                <article key={`${requestId}-${offer.insurer}`} className="offer-card fade-up">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 18,
                      alignItems: "start",
                      flexWrap: "wrap",
                    }}
                  >
                    <div>
                      <div className="badge badge-brand">
                        <BadgeCheck size={14} />
                        {offer.insurer}
                      </div>
                      <h3 style={{ fontSize: 30, marginTop: 12 }}>{offer.plan}</h3>
                      <p className="muted" style={{ marginTop: 8, maxWidth: 720 }}>
                        {offer.highlight}
                      </p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 14 }} className="muted">
                        desde
                      </div>
                      <strong style={{ fontSize: 38 }}>
                        ${offer.monthlyPrice.toLocaleString("es-CO")}
                      </strong>
                      <div className="muted">/ mes</div>
                    </div>
                  </div>

                  <div className="soft-divider" style={{ margin: "18px 0" }} />

                  <div className="grid-4">
                    {offer.benefits.map((benefit) => (
                      <div key={benefit} className="feature-card" style={{ padding: 16 }}>
                        <ShieldCheck size={16} color="var(--brand)" />
                        <div style={{ marginTop: 10, fontWeight: 700 }}>{benefit}</div>
                      </div>
                    ))}
                    <div className="feature-card" style={{ padding: 16 }}>
                      <Stars size={16} color="var(--accent)" />
                      <div style={{ marginTop: 10, fontWeight: 700 }}>Rating {offer.rating}</div>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 14,
                      alignItems: "center",
                      marginTop: 18,
                      flexWrap: "wrap",
                    }}
                  >
                    <span className="muted">Deducible: {offer.deductible}</span>
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                      <a className="btn btn-secondary" href="https://wa.me/573000000000">
                        Hablar con asesor
                      </a>
                      <button className="btn btn-primary" type="button">
                        Continuar compra
                      </button>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="offer-card">
                <h3 style={{ fontSize: 28 }}>Aun no hay ofertas generadas.</h3>
                <p className="muted" style={{ marginTop: 10 }}>
                  Completa el formulario para ver una comparacion demo del flujo principal.
                </p>
              </div>
            )}
          </div>

          {serverMessage ? (
            <p className="muted" style={{ marginTop: 16 }}>
              {serverMessage}
            </p>
          ) : null}
        </div>
      </section>

      <section id="arquitectura" className="section">
        <div className="shell">
          <span className="pill">Arquitectura sugerida</span>
          <div className="grid-3" style={{ marginTop: 22 }}>
            <article className="feature-card">
              <h3 style={{ fontSize: 28 }}>Frontend comercial</h3>
              <p className="muted" style={{ marginTop: 10 }}>
                Landing, cotizador, resultados y CTA de cierre. Ya quedo planteado en este
                proyecto con App Router y endpoint local.
              </p>
            </article>
            <article className="feature-card">
              <h3 style={{ fontSize: 28 }}>Broker middleware</h3>
              <p className="muted" style={{ marginTop: 10 }}>
                Capa privada donde conectas cada aseguradora, normalizas respuestas y
                manejas credenciales sin exponerlas al frontend.
              </p>
            </article>
            <article className="feature-card">
              <h3 style={{ fontSize: 28 }}>CRM o bandeja comercial</h3>
              <p className="muted" style={{ marginTop: 10 }}>
                Leads, estados de cierre, documentos y renovaciones. Es el siguiente bloque
                natural despues del cotizador.
              </p>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}
