"use client";

import { startTransition, useMemo, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Bike,
  Car,
  Check,
  Clock3,
  HeartPulse,
  MessageCircleMore,
  Shield,
  Star,
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

const proofItems = [
  "Comparacion inmediata de planes",
  "Atencion asistida para cierre comercial",
  "Arquitectura lista para carriers reales",
];

const servicePillars = [
  {
    title: "Seleccion premium",
    description: "No mostramos ruido. Solo opciones claras, comparables y listas para decision.",
  },
  {
    title: "Acompanamiento experto",
    description: "La experiencia esta pensada para cerrar con asesor, no para abandonar al usuario.",
  },
  {
    title: "Operacion escalable",
    description: "La capa visual ya queda lista para integrarse a aseguradoras y CRM.",
  },
];

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
    <main className="premium-site">
      <section className="premium-hero">
        <div className="premium-shell">
          <header className="premium-topbar">
            <a className="premium-brand" href="#">
              <span className="premium-brand-mark">CS</span>
              <span>
                <strong>Canguro Select</strong>
                <small>Seguros con criterio premium</small>
              </span>
            </a>

            <nav className="premium-nav">
              <a href="#cotizador">Cotizar</a>
              <a href="#servicio">Servicio</a>
              <a href="#resultados">Resultados</a>
            </nav>

            <a className="btn btn-outline-light" href="#cotizador">
              Empezar
            </a>
          </header>

          <div className="premium-hero-grid">
            <div className="premium-copy">
              <span className="premium-kicker">Experiencia de aseguradora premium</span>
              <h1>Seguros online con una presentacion mas sobria, elegante y confiable.</h1>
              <p>
                Redujimos el ruido visual y dejamos solo lo importante: confianza, claridad,
                comparacion y conversion. Ahora el sitio se siente mas cercano a una marca de
                seguros premium y menos a una landing generica.
              </p>

              <div className="premium-hero-actions">
                <a className="btn btn-gold" href="#cotizador">
                  Cotizar ahora
                  <ArrowRight size={18} />
                </a>
                <a className="btn btn-ghost-light" href="#resultados">
                  Ver formato de ofertas
                </a>
              </div>

              <div className="premium-proof-list">
                {proofItems.map((item) => (
                  <div key={item} className="premium-proof-item">
                    <Check size={16} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="premium-hero-card">
              <div className="premium-card-header">
                <span className="premium-label">Vista previa</span>
                <span className="premium-dot">Disponible</span>
              </div>

              <div className="premium-price-card">
                <p>Oferta destacada</p>
                <h2>Sura Auto Global Plus</h2>
                <strong>$259.000 / mes</strong>
              </div>

              <div className="premium-mini-list">
                {products.map((product) => (
                  <div key={product.id} className="premium-mini-item">
                    <span>{productIcon(product.id)}</span>
                    <div>
                      <strong>{product.name}</strong>
                      <small>{product.subtitle}</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="servicio" className="premium-section premium-section-light">
        <div className="premium-shell">
          <div className="premium-section-head">
            <span className="premium-kicker dark">Servicio</span>
            <h2>Una interfaz con mejor criterio para un producto que necesita inspirar respaldo.</h2>
          </div>

          <div className="premium-pillars">
            {servicePillars.map((pillar) => (
              <article key={pillar.title} className="premium-pillar">
                <h3>{pillar.title}</h3>
                <p>{pillar.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="cotizador" className="premium-section">
        <div className="premium-shell">
          <div className="premium-quote-head">
            <div>
              <span className="premium-kicker dark">Cotizador</span>
              <h2>Formulario limpio, dirigido y con mas sensacion de servicio exclusivo.</h2>
            </div>
            <p>
              Cada bloque aparece con un proposito claro. Menos elementos irrelevantes y mejor
              orden para que la atencion caiga donde debe caer.
            </p>
          </div>

          <div className="premium-quote-layout">
            <div className="premium-form-panel">
              <form onSubmit={handleSubmit} className="premium-form">
                <div className="premium-product-tabs">
                  {products.map((product) => {
                    const active = form.product === product.id;

                    return (
                      <button
                        key={product.id}
                        type="button"
                        className={`premium-tab${active ? " active" : ""}`}
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

                <div className="premium-selected-card">
                  <span className="premium-micro-label">Producto seleccionado</span>
                  <h3>{selectedProduct.name}</h3>
                  <p>{selectedProduct.accent}</p>
                </div>

                {(form.product === "auto" || form.product === "moto") && (
                  <div className="premium-segmented">
                    <button
                      type="button"
                      className={`premium-segment${form.hasPlate ? " active" : ""}`}
                      onClick={() => updateField("hasPlate", true)}
                    >
                      Con placa
                    </button>
                    <button
                      type="button"
                      className={`premium-segment${!form.hasPlate ? " active" : ""}`}
                      onClick={() => updateField("hasPlate", false)}
                    >
                      Sin placa
                    </button>
                    <span className="premium-inline-note">
                      <Clock3 size={14} />
                      respuesta inicial inmediata
                    </span>
                  </div>
                )}

                <div className="premium-form-grid">
                  <label className="premium-field-block">
                    <span>Identificador</span>
                    {form.hasPlate && (form.product === "auto" || form.product === "moto") ? (
                      <input
                        className="premium-field"
                        value={form.plate}
                        onChange={(event) => updateField("plate", event.target.value.toUpperCase())}
                        placeholder="ABC123"
                      />
                    ) : (
                      <input
                        className="premium-field"
                        type="number"
                        value={form.vehicleYear ?? ""}
                        onChange={(event) => updateField("vehicleYear", Number(event.target.value))}
                        placeholder="2023"
                      />
                    )}
                  </label>

                  <label className="premium-field-block">
                    <span>Ciudad</span>
                    <input
                      className="premium-field"
                      value={form.city}
                      onChange={(event) => updateField("city", event.target.value)}
                      placeholder="Bogota"
                    />
                  </label>

                  <label className="premium-field-block">
                    <span>
                      {form.product === "auto" || form.product === "moto"
                        ? "Valor aproximado"
                        : "Documento"}
                    </span>
                    {form.product === "auto" || form.product === "moto" ? (
                      <input
                        className="premium-field"
                        type="number"
                        value={form.vehicleValue ?? ""}
                        onChange={(event) => updateField("vehicleValue", Number(event.target.value))}
                        placeholder="62000000"
                      />
                    ) : (
                      <input
                        className="premium-field"
                        value={form.document}
                        onChange={(event) => updateField("document", event.target.value)}
                        placeholder="Documento"
                      />
                    )}
                  </label>

                  <label className="premium-field-block">
                    <span>Nombre completo</span>
                    <input
                      className="premium-field"
                      value={form.name}
                      onChange={(event) => updateField("name", event.target.value)}
                      placeholder="Nombre del cliente"
                      required
                    />
                  </label>

                  <label className="premium-field-block">
                    <span>Celular</span>
                    <input
                      className="premium-field"
                      value={form.phone}
                      onChange={(event) => updateField("phone", event.target.value)}
                      placeholder="300 000 0000"
                      required
                    />
                  </label>

                  <label className="premium-field-block">
                    <span>Correo</span>
                    <input
                      className="premium-field"
                      type="email"
                      value={form.email}
                      onChange={(event) => updateField("email", event.target.value)}
                      placeholder="cliente@correo.com"
                      required
                    />
                  </label>
                </div>

                <div className="premium-submit-row">
                  <button type="submit" className="btn btn-gold btn-wide" disabled={isPending}>
                    {isPending ? "Consultando ofertas..." : "Solicitar comparacion"}
                    <ArrowRight size={18} />
                  </button>
                  <p>
                    Version demo lista para reemplazar el endpoint por tus conexiones reales.
                  </p>
                </div>
              </form>
            </div>

            <aside className="premium-aside">
              <div className="premium-aside-card dark">
                <span className="premium-micro-label light">Posicionamiento</span>
                <h3>Menos landing. Mas sensacion de firma aseguradora.</h3>
                <p>
                  El foco ahora esta en credibilidad, orden, tono sobrio y lectura clara del
                  valor comercial.
                </p>
              </div>
              <div className="premium-aside-card">
                <div className="premium-aside-points">
                  <span>
                    <BadgeCheck size={14} />
                    comparacion curada
                  </span>
                  <span>
                    <Shield size={14} />
                    acompanamiento experto
                  </span>
                  <span>
                    <MessageCircleMore size={14} />
                    seguimiento comercial
                  </span>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section id="resultados" className="premium-section premium-section-light">
        <div className="premium-shell">
          <div className="premium-results-head">
            <div>
              <span className="premium-kicker dark">Resultados</span>
              <h2>Comparacion clara, sobria y lista para cerrar.</h2>
            </div>
            {requestId ? <span className="premium-request-id">Solicitud {requestId}</span> : null}
          </div>

          <div className="premium-results-list">
            {offers.length > 0 ? (
              offers.map((offer) => (
                <article key={`${requestId}-${offer.insurer}`} className="premium-result-card">
                  <div className="premium-result-top">
                    <div>
                      <span className="premium-offer-badge">
                        <BadgeCheck size={14} />
                        {offer.insurer}
                      </span>
                      <h3>{offer.plan}</h3>
                      <p>{offer.highlight}</p>
                    </div>
                    <div className="premium-result-price">
                      <span>desde</span>
                      <strong>${offer.monthlyPrice.toLocaleString("es-CO")}</strong>
                      <small>por mes</small>
                    </div>
                  </div>

                  <div className="premium-benefits">
                    {offer.benefits.map((benefit) => (
                      <div key={benefit} className="premium-benefit">
                        <Shield size={16} />
                        <span>{benefit}</span>
                      </div>
                    ))}
                    <div className="premium-benefit accent">
                      <Star size={16} />
                      <span>Rating {offer.rating}</span>
                    </div>
                  </div>

                  <div className="premium-result-bottom">
                    <span>Deducible: {offer.deductible}</span>
                    <div className="premium-result-actions">
                      <a className="btn btn-soft-dark" href="https://wa.me/573000000000">
                        WhatsApp
                      </a>
                      <button className="btn btn-dark" type="button">
                        Continuar
                      </button>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="premium-empty-state">
                <h3>Las ofertas apareceran aqui con un formato mas ejecutivo y facil de comparar.</h3>
                <p>
                  Completa el formulario para ver la salida premium del cotizador.
                </p>
              </div>
            )}
          </div>

          {serverMessage ? <p className="premium-server-note">{serverMessage}</p> : null}
        </div>
      </section>
    </main>
  );
}
