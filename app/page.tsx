"use client";

import { startTransition, useMemo, useState } from "react";
import {
  ArrowRight,
  Bike,
  Car,
  Check,
  HeartPulse,
  Phone,
  ShieldCheck,
} from "lucide-react";

import { products, type ProductType, type QuoteOffer, type QuoteRequest } from "@/lib/insurance-data";

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
  vehicleYear: 2022,
  vehicleValue: 62_000_000,
};

const trustPartners = [
  "Sura",
  "Allianz",
  "AXA Colpatria",
  "Mapfre",
  "Colsanitas",
  "SBS",
];

const stats = [
  { value: "24/7", label: "Asistencia en via y emergencias medicas." },
  { value: "< 72 h", label: "Emision promedio de tu poliza." },
  { value: "6", label: "Aseguradoras aliadas vigiladas por Superfinanciera." },
];

const benefits = [
  {
    title: "Comparas en minutos",
    description:
      "Llenas un solo formulario y recibes tres ofertas reales de aseguradoras aliadas, lado a lado, sin llamadas en frio.",
  },
  {
    title: "Asesor humano cuando lo necesites",
    description:
      "Si la decision es grande, te conectamos por WhatsApp o llamada con un asesor que te explica las diferencias finas.",
  },
  {
    title: "Aseguradoras vigiladas",
    description:
      "Trabajamos solo con companias autorizadas por la Superintendencia Financiera de Colombia. Polizas con respaldo real.",
  },
];

const previewCoverage = [
  { label: "Todo riesgo + asistencia 24/7", value: "Incluido" },
  { label: "Carro de reemplazo (5 dias)", value: "Incluido" },
  { label: "Perdida total y parcial", value: "Incluido" },
  { label: "Deducible", value: "1 SMMLV" },
];

function productIcon(product: ProductType, size = 18) {
  if (product === "auto") return <Car size={size} />;
  if (product === "moto") return <Bike size={size} />;
  return <HeartPulse size={size} />;
}

export default function HomePage() {
  const [form, setForm] = useState<FormState>(initialState);
  const [offers, setOffers] = useState<QuoteOffer[]>([]);
  const [requestId, setRequestId] = useState("");
  const [serverMessage, setServerMessage] = useState("");
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
    <main className="hf-site">
      <header className="hf-topbar">
        <div className="hf-shell hf-topbar-inner">
          <a className="hf-brand" href="#">
            <span className="hf-brand-mark" aria-hidden>
              <ShieldCheck size={18} strokeWidth={2.2} />
            </span>
            <span className="hf-brand-text">
              <strong>Seguros Hafe</strong>
              <small>Comparador con asesor</small>
            </span>
          </a>

          <nav className="hf-nav">
            <a href="#cotizador">Cotizar</a>
            <a href="#por-que">Por que Hafe</a>
            <a href="#resultados">Como ves la oferta</a>
          </nav>

          <div className="hf-topbar-actions">
            <a className="hf-btn hf-btn-ghost" href="tel:+5713000000000">
              <Phone size={16} /> 300 000 0000
            </a>
            <a className="hf-btn hf-btn-primary" href="#cotizador">
              Cotizar ahora
            </a>
          </div>
        </div>
      </header>

      <section className="hf-hero">
        <div className="hf-shell hf-hero-grid">
          <div className="hf-hero-copy">
            <span className="hf-eyebrow">
              <span className="hf-eyebrow-dot" /> Broker tecnologico de seguros
            </span>
            <h1>Asegurar tu auto, moto o salud no tiene que ser un papeleo.</h1>
            <p>
              Compara tres ofertas reales de aseguradoras vigiladas por Superfinanciera,
              sin llamadas en frio y con un asesor humano cuando lo pidas.
            </p>

            <div className="hf-hero-actions">
              <a className="hf-btn hf-btn-primary hf-btn-lg" href="#cotizador">
                Cotizar mi seguro
                <ArrowRight size={18} />
              </a>
              <a className="hf-btn hf-btn-link" href="#por-que">
                Como trabajamos
              </a>
            </div>

            <div className="hf-hero-meta">
              <ShieldCheck size={16} />
              <span>
                Aliados con aseguradoras vigiladas por la Superintendencia Financiera de Colombia.
              </span>
            </div>
          </div>

          <aside className="hf-quote-preview" aria-label="Vista previa de oferta">
            <div className="hf-quote-preview-head">
              <span className="hf-pill-soft">Vista de oferta</span>
              <span className="hf-pill-soft hf-pill-accent">Mejor cobertura</span>
            </div>

            <div className="hf-quote-preview-body">
              <div className="hf-quote-insurer">
                <span className="hf-insurer-logo">SU</span>
                <div>
                  <strong>Sura - Auto Global Plus</strong>
                  <small>Bogota - Vehiculo 2022 - Todo riesgo</small>
                </div>
              </div>

              <div className="hf-quote-price">
                <small>Cuota mensual estimada</small>
                <strong>$259.000</strong>
                <span>Pago anual: $3.108.000</span>
              </div>

              <ul className="hf-quote-coverage">
                {previewCoverage.map((row) => (
                  <li key={row.label}>
                    <Check size={14} />
                    <span>{row.label}</span>
                    <em>{row.value}</em>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>

        <div className="hf-trust-strip">
          <div className="hf-shell hf-trust-strip-inner">
            <span>Aseguradoras aliadas</span>
            <ul>
              {trustPartners.map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="hf-stats">
        <div className="hf-shell hf-stats-grid">
          {stats.map((stat) => (
            <div key={stat.label} className="hf-stat">
              <strong>{stat.value}</strong>
              <p>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="por-que" className="hf-section">
        <div className="hf-shell">
          <div className="hf-section-head">
            <h2>Por que cotizar con Seguros Hafe</h2>
            <p>
              No te vendemos un seguro. Te ayudamos a elegir el que mejor te queda entre
              varias aseguradoras reales, con un asesor humano de respaldo.
            </p>
          </div>

          <div className="hf-benefits">
            {benefits.map((benefit) => (
              <article key={benefit.title} className="hf-benefit-card">
                <h3>{benefit.title}</h3>
                <p>{benefit.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="cotizador" className="hf-section hf-section-soft">
        <div className="hf-shell hf-quote-layout">
          <div className="hf-quote-intro">
            <span className="hf-eyebrow dark">
              <span className="hf-eyebrow-dot" /> Cotizador
            </span>
            <h2>Cuentanos que quieres asegurar.</h2>
            <p>Toma 2 minutos. Despues ves tres ofertas reales y eliges con quien sigues.</p>

            <ol className="hf-quote-steps">
              <li>
                <strong>1.</strong>
                <span>Eliges producto y cuentas lo basico de lo que quieres asegurar.</span>
              </li>
              <li>
                <strong>2.</strong>
                <span>Recibes tres ofertas reales lado a lado con cuota, cobertura y deducible.</span>
              </li>
              <li>
                <strong>3.</strong>
                <span>Te conectamos con un asesor humano si quieres revisarla a fondo.</span>
              </li>
            </ol>

            <div className="hf-quote-current">
              <small>Producto seleccionado</small>
              <strong>{selectedProduct.name}</strong>
              <span>{selectedProduct.subtitle}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="hf-form" aria-label="Formulario de cotizacion">
            <fieldset className="hf-fieldset">
              <legend>1. Producto a asegurar</legend>
              <div className="hf-product-tabs">
                {products.map((product) => {
                  const active = form.product === product.id;
                  return (
                    <button
                      key={product.id}
                      type="button"
                      className={`hf-product-tab${active ? " active" : ""}`}
                      onClick={() => updateField("product", product.id)}
                      aria-pressed={active}
                    >
                      <span className="hf-product-icon">{productIcon(product.id, 20)}</span>
                      <strong>{product.name}</strong>
                      <small>{product.subtitle}</small>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            {(form.product === "auto" || form.product === "moto") && (
              <fieldset className="hf-fieldset">
                <legend>2. Datos del vehiculo</legend>

                <div className="hf-segmented" role="tablist" aria-label="Tipo de identificacion">
                  <button
                    type="button"
                    className={`hf-segment${form.hasPlate ? " active" : ""}`}
                    onClick={() => updateField("hasPlate", true)}
                    role="tab"
                    aria-selected={form.hasPlate}
                  >
                    Con placa
                  </button>
                  <button
                    type="button"
                    className={`hf-segment${!form.hasPlate ? " active" : ""}`}
                    onClick={() => updateField("hasPlate", false)}
                    role="tab"
                    aria-selected={!form.hasPlate}
                  >
                    Sin placa
                  </button>
                </div>

                <div className="hf-form-grid">
                  {form.hasPlate ? (
                    <label className="hf-field">
                      <span>Placa</span>
                      <input
                        value={form.plate}
                        onChange={(e) => updateField("plate", e.target.value.toUpperCase())}
                        placeholder="ABC123"
                      />
                    </label>
                  ) : (
                    <label className="hf-field">
                      <span>Ano del vehiculo</span>
                      <input
                        type="number"
                        value={form.vehicleYear ?? ""}
                        onChange={(e) => updateField("vehicleYear", Number(e.target.value))}
                        placeholder="2023"
                      />
                    </label>
                  )}

                  <label className="hf-field">
                    <span>Valor asegurado aproximado</span>
                    <input
                      type="number"
                      value={form.vehicleValue ?? ""}
                      onChange={(e) => updateField("vehicleValue", Number(e.target.value))}
                      placeholder="62000000"
                    />
                  </label>

                  <label className="hf-field">
                    <span>Ciudad de circulacion</span>
                    <input
                      value={form.city}
                      onChange={(e) => updateField("city", e.target.value)}
                      placeholder="Bogota"
                    />
                  </label>
                </div>
              </fieldset>
            )}

            {form.product === "salud" && (
              <fieldset className="hf-fieldset">
                <legend>2. Datos del titular</legend>
                <div className="hf-form-grid">
                  <label className="hf-field">
                    <span>Documento de identidad</span>
                    <input
                      value={form.document}
                      onChange={(e) => updateField("document", e.target.value)}
                      placeholder="C.C. 1.000.000.000"
                    />
                  </label>
                  <label className="hf-field">
                    <span>Ciudad</span>
                    <input
                      value={form.city}
                      onChange={(e) => updateField("city", e.target.value)}
                      placeholder="Bogota"
                    />
                  </label>
                </div>
              </fieldset>
            )}

            <fieldset className="hf-fieldset">
              <legend>3. Datos de contacto</legend>
              <div className="hf-form-grid">
                <label className="hf-field">
                  <span>Nombre completo</span>
                  <input
                    value={form.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    placeholder="Camila Restrepo"
                    required
                  />
                </label>
                <label className="hf-field">
                  <span>Celular</span>
                  <input
                    value={form.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    placeholder="300 000 0000"
                    required
                  />
                </label>
                <label className="hf-field hf-field-full">
                  <span>Correo electronico</span>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    placeholder="camila@correo.com"
                    required
                  />
                </label>
              </div>
            </fieldset>

            <div className="hf-form-foot">
              <button type="submit" className="hf-btn hf-btn-primary hf-btn-lg" disabled={isPending}>
                {isPending ? "Buscando ofertas..." : "Ver mis tres ofertas"}
                <ArrowRight size={18} />
              </button>
              <small>
                Al enviar aceptas el tratamiento de datos segun nuestra politica de privacidad.
              </small>
            </div>
          </form>
        </div>
      </section>

      <section id="resultados" className="hf-section">
        <div className="hf-shell">
          <div className="hf-section-head row">
            <div>
              <h2>Tus ofertas comparadas</h2>
              <p>Tres aseguradoras lado a lado, con coberturas reales y cuota mensual.</p>
            </div>
            {requestId ? <span className="hf-pill-soft">Solicitud {requestId}</span> : null}
          </div>

          {offers.length > 0 ? (
            <div className="hf-results-grid">
              {offers.map((offer, index) => (
                <article
                  key={`${requestId}-${offer.insurer}`}
                  className={`hf-result-card${index === 0 ? " featured" : ""}`}
                >
                  {index === 0 && <span className="hf-result-flag">Mejor cobertura</span>}

                  <header className="hf-result-head">
                    <span className="hf-insurer-logo">
                      {offer.insurer.slice(0, 2).toUpperCase()}
                    </span>
                    <div>
                      <strong>{offer.insurer}</strong>
                      <small>{offer.plan}</small>
                    </div>
                  </header>

                  <div className="hf-result-price">
                    <small>Cuota mensual</small>
                    <strong>${offer.monthlyPrice.toLocaleString("es-CO")}</strong>
                    <span>Anual desde ${(offer.monthlyPrice * 12).toLocaleString("es-CO")}</span>
                  </div>

                  <ul className="hf-result-coverage">
                    {offer.benefits.map((benefit) => (
                      <li key={benefit}>
                        <Check size={14} /> {benefit}
                      </li>
                    ))}
                    <li className="muted">
                      Deducible: <em>{offer.deductible}</em>
                    </li>
                  </ul>

                  <p className="hf-result-highlight">{offer.highlight}</p>

                  <div className="hf-result-actions">
                    <a className="hf-btn hf-btn-ghost" href="https://wa.me/573000000000">
                      Asesor
                    </a>
                    <button type="button" className="hf-btn hf-btn-primary">
                      Continuar
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="hf-empty">
              <h3>Tus tres ofertas apareceran aqui cuando completes el cotizador.</h3>
              <p>
                Veras la cuota mensual, las coberturas principales y el deducible de cada
                aseguradora, lado a lado, sin ruido.
              </p>
            </div>
          )}

          {serverMessage ? <p className="hf-note">{serverMessage}</p> : null}
        </div>
      </section>

      <footer className="hf-footer">
        <div className="hf-shell hf-footer-grid">
          <div>
            <a className="hf-brand small" href="#">
              <span className="hf-brand-mark" aria-hidden>
                <ShieldCheck size={16} strokeWidth={2.2} />
              </span>
              <span className="hf-brand-text">
                <strong>Seguros Hafe</strong>
              </span>
            </a>
            <p>
              Hafe es un broker tecnologico de seguros vigilado por la Superintendencia
              Financiera de Colombia. Trabajamos con aseguradoras autorizadas para emitir
              polizas con respaldo real.
            </p>
          </div>
          <div>
            <strong>Contacto</strong>
            <ul>
              <li>300 000 0000</li>
              <li>hola@segurohafe.com</li>
              <li>Bogota, Colombia</li>
            </ul>
          </div>
          <div>
            <strong>Legal</strong>
            <ul>
              <li>Politica de tratamiento de datos</li>
              <li>Terminos y condiciones</li>
              <li>NIT 900.000.000-0</li>
            </ul>
          </div>
        </div>
        <div className="hf-shell hf-footer-meta">
          <span>(c) 2026 Seguros Hafe S.A.S.</span>
          <span>
            Las cifras del cotizador son estimaciones; la cobertura final depende de cada aseguradora.
          </span>
        </div>
      </footer>
    </main>
  );
}
