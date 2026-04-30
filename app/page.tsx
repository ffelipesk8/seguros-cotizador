"use client";

import { startTransition, useMemo, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Bike,
  Car,
  Check,
  ChevronRight,
  Clock3,
  HeartPulse,
  MessageCircleMore,
  PhoneCall,
  Shield,
  Sparkles,
  Star,
  TimerReset,
} from "lucide-react";

import { products, type ProductType, type QuoteOffer, type QuoteRequest } from "@/lib/insurance-data";

const trustMetrics = [
  { value: "13+", label: "alianzas listas para integrar" },
  { value: "48h", label: "para conectar un carrier nuevo" },
  { value: "3", label: "ofertas comparadas en la primera vista" },
];

const productNarrative = [
  {
    eyebrow: "Auto",
    title: "Comparador elegante para polizas de alto volumen",
    description:
      "Captura por placa o por datos manuales, con salida inmediata a asesor comercial y seguimiento posterior.",
  },
  {
    eyebrow: "Moto",
    title: "Un flujo mas agil para usuarios de decision rapida",
    description:
      "Disenado para reducir abandono en mobile y llevar a cierre con menos pasos, menos friccion y mejor confianza.",
  },
  {
    eyebrow: "Salud",
    title: "Upsell natural dentro de la misma experiencia",
    description:
      "La plataforma queda lista para ampliar catalogo sin romper la narrativa visual ni el motor comercial.",
  },
];

const principles = [
  "Narrativa premium y mucho mas clara en el primer scroll",
  "Jerarquia tipografica fuerte para credibilidad inmediata",
  "Formularios con menos ruido y mas orientacion comercial",
  "Resultados con lectura rapida para comparacion real",
];

const process = [
  {
    number: "01",
    title: "Entrada inteligente",
    body: "El usuario elige producto, entiende valor y entra al cotizador sin perderse entre demasiadas opciones.",
  },
  {
    number: "02",
    title: "Captura asistida",
    body: "Los campos se presentan en el orden correcto: contexto, datos clave y contacto para seguimiento.",
  },
  {
    number: "03",
    title: "Comparacion premium",
    body: "Las ofertas salen en un formato sobrio y profesional para precio, respaldo y beneficios clave.",
  },
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
  vehicleYear: 2022,
  vehicleValue: 62_000_000,
};

function productIcon(product: ProductType) {
  if (product === "auto") return <Car size={18} />;
  if (product === "moto") return <Bike size={18} />;
  return <HeartPulse size={18} />;
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
    <main className="site-shell">
      <section className="hero-section">
        <div className="hero-noise" />
        <div className="shell">
          <header className="topbar">
            <a className="brand-mark" href="#">
              <span className="brand-badge">CS</span>
              <span>
                <strong>Canguro Select</strong>
                <small>Seguro digital de perfil premium</small>
              </span>
            </a>

            <nav className="topnav">
              <a href="#productos">Productos</a>
              <a href="#proceso">Proceso</a>
              <a href="#cotizador">Cotizar</a>
            </nav>

            <a className="btn btn-light" href="#cotizador">
              Empezar
            </a>
          </header>

          <div className="hero-layout">
            <div className="hero-copy">
              <span className="eyebrow">
                <Sparkles size={14} />
                rediseñado con criterio de conversion y calidad visual premium
              </span>
              <h1>
                Una experiencia de seguros que se siente
                <span> seria, exclusiva y lista para vender.</span>
              </h1>
              <p>
                Replanteamos la interfaz para que se vea como un producto financiero de alto
                nivel: mejor lectura, mejor ritmo visual, mejor confianza y un cotizador que
                parece hecho por una agencia top.
              </p>

              <div className="hero-actions">
                <a className="btn btn-primary" href="#cotizador">
                  Cotizar ahora
                  <ArrowRight size={18} />
                </a>
                <a className="btn btn-ghost" href="#proceso">
                  Ver experiencia
                </a>
              </div>

              <div className="hero-points">
                {principles.map((principle) => (
                  <div key={principle} className="hero-point">
                    <Check size={16} />
                    <span>{principle}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="hero-stage">
              <div className="hero-card hero-card-primary">
                <div className="hero-card-top">
                  <span className="mini-label">Snapshot comercial</span>
                  <span className="mini-chip">Preview premium</span>
                </div>
                <div className="hero-stat-grid">
                  {trustMetrics.map((metric) => (
                    <article key={metric.label} className="hero-stat">
                      <strong>{metric.value}</strong>
                      <span>{metric.label}</span>
                    </article>
                  ))}
                </div>
                <div className="hero-offer-preview">
                  <div>
                    <p>Oferta recomendada</p>
                    <h3>Sura Auto Global Plus</h3>
                  </div>
                  <strong>$259.000</strong>
                </div>
              </div>

              <div className="hero-card hero-card-secondary">
                <div className="badge-row">
                  <span className="soft-badge">
                    <TimerReset size={14} />
                    respuesta rapida
                  </span>
                  <span className="soft-badge">
                    <Shield size={14} />
                    respaldo multiaseguradora
                  </span>
                </div>

                <div className="product-preview-list">
                  {products.map((product) => (
                    <div key={product.id} className="product-preview-item">
                      <span className="product-preview-icon">{productIcon(product.id)}</span>
                      <div>
                        <strong>{product.name}</strong>
                        <p>{product.subtitle}</p>
                      </div>
                      <ChevronRight size={16} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="productos" className="section">
        <div className="shell">
          <div className="section-heading">
            <span className="section-kicker">Portafolio</span>
            <h2>Una propuesta visual sobria para vender productos complejos con mas confianza.</h2>
            <p>
              El enfoque ya no es solo “tener un cotizador”, sino presentar una marca que
              inspire respaldo desde la primera impresion.
            </p>
          </div>

          <div className="editorial-grid">
            {productNarrative.map((item) => (
              <article key={item.eyebrow} className="editorial-card">
                <span className="card-kicker">{item.eyebrow}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="proceso" className="section section-contrast">
        <div className="shell">
          <div className="section-heading contrast">
            <span className="section-kicker">Proceso UX</span>
            <h2>Menos ruido. Mejor orientacion. Mucho mejor sensacion de producto.</h2>
            <p>
              El rediseño organiza la experiencia como lo haria una marca financiera cuidada:
              claridad arriba, decision al centro y comparacion al final.
            </p>
          </div>

          <div className="process-grid">
            {process.map((step) => (
              <article key={step.number} className="process-card">
                <span>{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="cotizador" className="section">
        <div className="shell quote-shell">
          <div className="quote-intro">
            <span className="section-kicker">Cotizador</span>
            <h2>Una interfaz de captura que se ve limpia, premium y lista para conversion.</h2>
            <p>
              Mantuvimos la funcionalidad principal y rediseñamos por completo la presentacion.
              El siguiente paso natural sera conectar carriers reales y CRM.
            </p>
          </div>

          <div className="quote-layout">
            <div className="quote-panel">
              <form onSubmit={handleSubmit} className="quote-form">
                <div className="product-switch">
                  {products.map((product) => {
                    const active = form.product === product.id;

                    return (
                      <button
                        key={product.id}
                        type="button"
                        className={`product-switch-item${active ? " active" : ""}`}
                        onClick={() => updateField("product", product.id)}
                      >
                        <span>{productIcon(product.id)}</span>
                        <div>
                          <strong>{product.name}</strong>
                          <small>{product.subtitle}</small>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="quote-summary">
                  <span className="card-kicker">Producto seleccionado</span>
                  <h3>{selectedProduct.name}</h3>
                  <p>{selectedProduct.accent}</p>
                </div>

                {(form.product === "auto" || form.product === "moto") && (
                  <div className="segmented">
                    <button
                      type="button"
                      className={`segment${form.hasPlate ? " active" : ""}`}
                      onClick={() => updateField("hasPlate", true)}
                    >
                      Con placa
                    </button>
                    <button
                      type="button"
                      className={`segment${!form.hasPlate ? " active" : ""}`}
                      onClick={() => updateField("hasPlate", false)}
                    >
                      Sin placa
                    </button>
                    <span className="segment-note">
                      <Clock3 size={14} />
                      primera lectura inmediata
                    </span>
                  </div>
                )}

                <div className="form-grid">
                  <label className="field-block">
                    <span>Identificador del vehiculo</span>
                    {form.hasPlate && (form.product === "auto" || form.product === "moto") ? (
                      <input
                        className="field"
                        value={form.plate}
                        onChange={(event) => updateField("plate", event.target.value.toUpperCase())}
                        placeholder="Ej. ABC123"
                      />
                    ) : (
                      <input
                        className="field"
                        type="number"
                        value={form.vehicleYear ?? ""}
                        onChange={(event) => updateField("vehicleYear", Number(event.target.value))}
                        placeholder="Ej. 2023"
                      />
                    )}
                  </label>

                  <label className="field-block">
                    <span>Ciudad</span>
                    <input
                      className="field"
                      value={form.city}
                      onChange={(event) => updateField("city", event.target.value)}
                      placeholder="Bogota"
                    />
                  </label>

                  <label className="field-block">
                    <span>
                      {form.product === "auto" || form.product === "moto"
                        ? "Valor aproximado"
                        : "Documento"}
                    </span>
                    {form.product === "auto" || form.product === "moto" ? (
                      <input
                        className="field"
                        type="number"
                        value={form.vehicleValue ?? ""}
                        onChange={(event) => updateField("vehicleValue", Number(event.target.value))}
                        placeholder="62000000"
                      />
                    ) : (
                      <input
                        className="field"
                        value={form.document}
                        onChange={(event) => updateField("document", event.target.value)}
                        placeholder="Documento"
                      />
                    )}
                  </label>

                  <label className="field-block">
                    <span>Nombre completo</span>
                    <input
                      className="field"
                      value={form.name}
                      onChange={(event) => updateField("name", event.target.value)}
                      placeholder="Nombre del prospecto"
                      required
                    />
                  </label>

                  <label className="field-block">
                    <span>Celular</span>
                    <input
                      className="field"
                      value={form.phone}
                      onChange={(event) => updateField("phone", event.target.value)}
                      placeholder="300 000 0000"
                      required
                    />
                  </label>

                  <label className="field-block">
                    <span>Correo</span>
                    <input
                      className="field"
                      type="email"
                      value={form.email}
                      onChange={(event) => updateField("email", event.target.value)}
                      placeholder="correo@empresa.com"
                      required
                    />
                  </label>
                </div>

                <div className="quote-actions">
                  <button type="submit" className="btn btn-primary btn-large" disabled={isPending}>
                    {isPending ? "Consultando ofertas..." : "Generar comparacion premium"}
                    <ArrowRight size={18} />
                  </button>
                  <p>
                    Esta version devuelve ofertas demo. La estructura ya esta lista para enlazar
                    carriers reales sin rehacer la interfaz.
                  </p>
                </div>
              </form>
            </div>

            <aside className="insight-panel">
              <div className="insight-box dark">
                <span className="card-kicker light">Direccion visual</span>
                <h3>Mas criterio editorial, menos look generico de plantilla.</h3>
                <p>
                  El contraste, la tipografia y el espaciado ahora trabajan como una misma
                  marca y no como bloques sueltos.
                </p>
              </div>
              <div className="insight-box">
                <span className="soft-badge">
                  <PhoneCall size={14} />
                  cierre asistido
                </span>
                <span className="soft-badge">
                  <MessageCircleMore size={14} />
                  whatsapp listo
                </span>
                <span className="soft-badge">
                  <BadgeCheck size={14} />
                  comparacion inmediata
                </span>
              </div>
            </aside>
          </div>

          <div className="results-zone">
            <div className="results-header">
              <div>
                <span className="section-kicker">Resultados</span>
                <h2>Ofertas con lectura limpia para vender mejor.</h2>
              </div>
              {requestId ? <span className="request-pill">Solicitud {requestId}</span> : null}
            </div>

            <div className="results-list">
              {offers.length > 0 ? (
                offers.map((offer) => (
                  <article key={`${requestId}-${offer.insurer}`} className="result-card fade-up">
                    <div className="result-main">
                      <div className="result-brand">
                        <span className="soft-badge">
                          <BadgeCheck size={14} />
                          {offer.insurer}
                        </span>
                        <h3>{offer.plan}</h3>
                        <p>{offer.highlight}</p>
                      </div>

                      <div className="result-price">
                        <span>desde</span>
                        <strong>${offer.monthlyPrice.toLocaleString("es-CO")}</strong>
                        <small>por mes</small>
                      </div>
                    </div>

                    <div className="benefit-grid">
                      {offer.benefits.map((benefit) => (
                        <div key={benefit} className="benefit-card">
                          <Shield size={16} />
                          <span>{benefit}</span>
                        </div>
                      ))}
                      <div className="benefit-card accent">
                        <Star size={16} />
                        <span>Rating {offer.rating}</span>
                      </div>
                    </div>

                    <div className="result-footer">
                      <span>Deducible: {offer.deductible}</span>
                      <div className="result-actions">
                        <a className="btn btn-ghost-dark" href="https://wa.me/573000000000">
                          Hablar por WhatsApp
                        </a>
                        <button className="btn btn-dark" type="button">
                          Continuar cierre
                        </button>
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                <div className="empty-results">
                  <h3>Aqui apareceran las mejores opciones comparadas.</h3>
                  <p>
                    Completa el cotizador para ver una salida mucho mas elegante, clara y
                    profesional que la version anterior.
                  </p>
                </div>
              )}
            </div>

            {serverMessage ? <p className="server-note">{serverMessage}</p> : null}
          </div>
        </div>
      </section>
    </main>
  );
}
