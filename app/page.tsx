"use client";

import { startTransition, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  Bike,
  Car,
  Check,
  ChevronDown,
  ExternalLink,
  HeartPulse,
  Phone,
  Quote,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";

import { products, type ProductType, type QuoteOffer, type QuoteRequest } from "@/lib/insurance-data";

type FormState = QuoteRequest;
type QuoteFlow = "fast" | "runt";

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
  { value: "+12.000", label: "Cotizaciones procesadas en el ultimo ano." },
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

const testimonials = [
  {
    quote:
      "Cotice mi seguro de auto un domingo en la noche y el lunes ya tenia tres ofertas comparadas. El asesor me llamo solo cuando le dije que queria, no antes.",
    name: "Camila R.",
    role: "Cliente Auto - Bogota",
    rating: 4.9,
  },
];

const faqItems = [
  {
    q: "El cotizador esta conectado a aseguradoras reales?",
    a: "Hafe es un broker tecnologico vigilado. Operamos con Sura, Allianz, AXA Colpatria, Mapfre, Colsanitas y SBS. Las cifras del cotizador son estimaciones; la cotizacion en firme la confirma la aseguradora.",
  },
  {
    q: "Tengo que pagar algo por usar el comparador?",
    a: "No. Comparar y recibir asesoria humana es gratis. Hafe se compensa con la aseguradora cuando emites la poliza, sin que eso encarezca tu prima.",
  },
  {
    q: "Que pasa con mis datos personales?",
    a: "Tus datos viajan cifrados y solo se comparten con las aseguradoras necesarias para cotizar. Cumplimos la Ley 1581 de proteccion de datos personales y podes pedir borrado en cualquier momento.",
  },
  {
    q: "En cuanto tiempo me emiten la poliza?",
    a: "Una vez aceptas la oferta, la mayoria de aseguradoras emiten la poliza en menos de 72 horas habiles. Te avisamos cada paso por correo y WhatsApp.",
  },
  {
    q: "Puedo hablar con un asesor humano?",
    a: "Si. Cada oferta tiene un boton para conectar con un asesor por WhatsApp o llamada. Sin bots intermedios, sin esperas largas.",
  },
];

const NAV_SECTIONS = [
  { id: "cotizador", label: "Cotizar" },
  { id: "por-que", label: "Por que Hafe" },
  { id: "resultados", label: "Como ves la oferta" },
  { id: "faq", label: "Preguntas" },
];

function productIcon(product: ProductType, size = 18) {
  if (product === "auto") return <Car size={size} />;
  if (product === "moto") return <Bike size={size} />;
  return <HeartPulse size={size} />;
}

function useScrollSpy(ids: string[]): string {
  const [active, setActive] = useState<string>(ids[0] ?? "");

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const observers: IntersectionObserver[] = [];
    const visible = new Map<string, number>();

    ids.forEach((id) => {
      const node = document.getElementById(id);
      if (!node) return;
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            visible.set(id, entry.isIntersecting ? entry.intersectionRatio : 0);
          });
          let bestId = ids[0];
          let best = 0;
          visible.forEach((ratio, key) => {
            if (ratio > best) {
              best = ratio;
              bestId = key;
            }
          });
          if (best > 0) setActive(bestId);
        },
        { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
      );
      obs.observe(node);
      observers.push(obs);
    });

    return () => observers.forEach((obs) => obs.disconnect());
  }, [ids]);

  return active;
}

function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).classList.add("hf-in");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, []);
  return ref;
}

export default function HomePage() {
  const [form, setForm] = useState<FormState>(initialState);
  const [quoteFlow, setQuoteFlow] = useState<QuoteFlow>("fast");
  const [offers, setOffers] = useState<QuoteOffer[]>([]);
  const [requestId, setRequestId] = useState("");
  const [serverMessage, setServerMessage] = useState("");
  const [isPending, setIsPending] = useState(false);

  const activeSection = useScrollSpy(NAV_SECTIONS.map((s) => s.id));
  const benefitsRef = useReveal<HTMLDivElement>();
  const statsRef = useReveal<HTMLDivElement>();
  const testimonialRef = useReveal<HTMLDivElement>();
  const faqRef = useReveal<HTMLDivElement>();
  const ctaRef = useReveal<HTMLDivElement>();

  const selectedProduct = useMemo(
    () => products.find((item) => item.id === form.product) ?? products[0],
    [form.product],
  );

  const formProgress = useMemo(() => {
    const checks = [
      Boolean(form.product),
      form.product === "salud" ? Boolean(form.document) : Boolean(form.hasPlate ? form.plate : form.vehicleYear),
      Boolean(form.city),
      Boolean(form.name),
      Boolean(form.phone),
      Boolean(form.email),
    ];
    const filled = checks.filter(Boolean).length;
    return Math.round((filled / checks.length) * 100);
  }, [form]);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsPending(true);
    setOffers([]);

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

      requestAnimationFrame(() => {
        const el = document.getElementById("resultados");
        el?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    } finally {
      setIsPending(false);
    }
  }

  return (
    <main className="hf-site">
      <a className="hf-skip-link" href="#cotizador">
        Saltar al cotizador
      </a>

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

          <nav className="hf-nav" aria-label="Secciones principales">
            {NAV_SECTIONS.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={activeSection === item.id ? "active" : undefined}
              >
                {item.label}
              </a>
            ))}
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
        <div className="hf-hero-bg" aria-hidden>
          <div className="hf-hero-grid-pattern" />
          <div className="hf-hero-blob hf-hero-blob-a" />
          <div className="hf-hero-blob hf-hero-blob-b" />
        </div>

        <div className="hf-shell hf-hero-grid">
          <div className="hf-hero-copy">
            <span className="hf-eyebrow">
              <Sparkles size={14} /> Broker tecnologico de seguros
            </span>
            <h1>
              <span>Asegurar tu auto, moto o salud</span>{" "}
              <span className="hf-hero-em">no tiene que ser un papeleo.</span>
            </h1>
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
              <div className="hf-hero-meta-row">
                <ShieldCheck size={16} />
                <span>
                  Aliados con aseguradoras vigiladas por la Superintendencia Financiera de
                  Colombia.
                </span>
              </div>
              <div className="hf-hero-meta-row">
                <Star size={16} />
                <span>4.8 / 5 promedio en reviews de Google.</span>
              </div>
            </div>
          </div>

          <aside className="hf-quote-preview" aria-label="Vista previa de oferta">
            <div className="hf-quote-preview-head">
              <span className="hf-pill-soft">Vista previa de oferta</span>
              <span className="hf-pill-soft hf-pill-accent">
                <Sparkles size={12} /> Mejor cobertura
              </span>
            </div>

            <div className="hf-quote-preview-body">
              <div className="hf-quote-insurer">
                <span className="hf-insurer-logo hf-insurer-su">SU</span>
                <div>
                  <strong>Sura - Auto Global Plus</strong>
                  <small>Bogota - Vehiculo 2022 - Todo riesgo</small>
                </div>
              </div>

              <div className="hf-quote-price">
                <small>Cuota mensual estimada</small>
                <strong>$259.000</strong>
                <span>Pago anual: $3.108.000 - financiable hasta 12 cuotas</span>
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

              <div className="hf-quote-preview-foot">
                <span className="hf-quote-pulse" aria-hidden />
                Cotizacion en linea con la aseguradora
              </div>
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

      <section className="hf-stats" ref={statsRef}>
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
            <span className="hf-eyebrow dark">Por que Hafe</span>
            <h2>Comparar seguros sin que se sienta como llenar formularios eternos.</h2>
            <p>
              No te vendemos un seguro. Te ayudamos a elegir el que mejor te queda entre
              varias aseguradoras reales, con un asesor humano de respaldo.
            </p>
          </div>

          <div className="hf-benefits" ref={benefitsRef}>
            {benefits.map((benefit, i) => (
              <article
                key={benefit.title}
                className="hf-benefit-card"
                style={{ "--hf-delay": `${i * 80}ms` } as React.CSSProperties}
              >
                <span className="hf-benefit-num">0{i + 1}</span>
                <h3>{benefit.title}</h3>
                <p>{benefit.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="hf-testimonial" ref={testimonialRef}>
        <div className="hf-shell">
          {testimonials.map((t) => (
            <figure key={t.name} className="hf-testimonial-card">
              <Quote className="hf-testimonial-glyph" size={28} aria-hidden />
              <blockquote>{t.quote}</blockquote>
              <figcaption>
                <div>
                  <strong>{t.name}</strong>
                  <small>{t.role}</small>
                </div>
                <div className="hf-testimonial-rating" aria-label={`${t.rating} de 5`}>
                  <Star size={14} fill="currentColor" />
                  <span>{t.rating} / 5</span>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section id="cotizador" className="hf-section hf-section-soft">
        <div className="hf-shell hf-quote-layout">
          <div className="hf-quote-intro">
            <span className="hf-eyebrow dark">Cotizador</span>
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

              <div className="hf-quote-progress" aria-hidden>
                <div className="hf-quote-progress-track">
                  <div className="hf-quote-progress-fill" style={{ width: `${formProgress}%` }} />
                </div>
                <small>{formProgress}% completado</small>
              </div>
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
                <legend>2. Flujo de consulta</legend>

                <div className="hf-flow-switch" role="tablist" aria-label="Flujo de cotizacion">
                  <button
                    type="button"
                    className={`hf-flow-option${quoteFlow === "fast" ? " active" : ""}`}
                    onClick={() => setQuoteFlow("fast")}
                    role="tab"
                    aria-selected={quoteFlow === "fast"}
                  >
                    <strong>Cotizacion rapida</strong>
                    <small>Avanza con placa o datos base y valida despues con asesor.</small>
                  </button>
                  <button
                    type="button"
                    className={`hf-flow-option${quoteFlow === "runt" ? " active" : ""}`}
                    onClick={() => setQuoteFlow("runt")}
                    role="tab"
                    aria-selected={quoteFlow === "runt"}
                  >
                    <strong>Validacion con RUNT</strong>
                    <small>Usa la consulta ciudadana oficial antes de seguir al cierre.</small>
                  </button>
                </div>

                {quoteFlow === "runt" ? (
                  <div className="hf-runt-callout">
                    <div>
                      <strong>Consulta asistida</strong>
                      <p>
                        La consulta ciudadana del RUNT suele pedir placa, documento del propietario
                        y captcha. Por eso la manejamos como validacion asistida, no como integracion automatica.
                      </p>
                    </div>
                    <a
                      className="hf-btn hf-btn-ghost"
                      href="https://portalpublico.runt.gov.co/#/consulta-vehiculo/consulta/consulta-ciudadana"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Abrir portal RUNT
                      <ExternalLink size={16} />
                    </a>
                  </div>
                ) : (
                  <p className="hf-flow-note">
                    Puedes cotizar primero y dejar la validacion documental para el cierre asistido.
                  </p>
                )}
              </fieldset>
            )}

            {(form.product === "auto" || form.product === "moto") && (
              <fieldset className="hf-fieldset">
                <legend>{quoteFlow === "runt" ? "3. Datos del vehiculo" : "2. Datos del vehiculo"}</legend>

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

                  {quoteFlow === "runt" ? (
                    <label className="hf-field">
                      <span>Documento del propietario</span>
                      <input
                        value={form.document}
                        onChange={(e) => updateField("document", e.target.value)}
                        placeholder="Documento para validar en RUNT"
                      />
                    </label>
                  ) : null}
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
              <legend>{quoteFlow === "runt" && (form.product === "auto" || form.product === "moto") ? "4. Datos de contacto" : "3. Datos de contacto"}</legend>
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
                {!isPending && <ArrowRight size={18} />}
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
              <span className="hf-eyebrow dark">Resultados</span>
              <h2>Tus ofertas comparadas.</h2>
              <p>Tres aseguradoras lado a lado, con coberturas reales y cuota mensual.</p>
            </div>
            {requestId ? <span className="hf-pill-soft">Solicitud {requestId}</span> : null}
          </div>

          {isPending ? (
            <div className="hf-results-grid">
              {[0, 1, 2].map((i) => (
                <div key={i} className="hf-result-card hf-skeleton" aria-hidden>
                  <div className="hf-skel hf-skel-row" style={{ width: "60%" }} />
                  <div className="hf-skel hf-skel-row hf-skel-lg" style={{ width: "70%" }} />
                  <div className="hf-skel hf-skel-row" style={{ width: "92%" }} />
                  <div className="hf-skel hf-skel-row" style={{ width: "84%" }} />
                  <div className="hf-skel hf-skel-row" style={{ width: "76%" }} />
                  <div className="hf-skel hf-skel-row" style={{ width: "60%" }} />
                </div>
              ))}
            </div>
          ) : offers.length > 0 ? (
            <div className="hf-results-grid">
              {offers.map((offer, index) => (
                <article
                  key={`${requestId}-${offer.insurer}`}
                  className={`hf-result-card${index === 0 ? " featured" : ""}`}
                >
                  {index === 0 && <span className="hf-result-flag">Mejor cobertura</span>}

                  <header className="hf-result-head">
                    <span className={`hf-insurer-logo hf-insurer-${index}`}>
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
              <span className="hf-empty-glyph" aria-hidden>
                <Sparkles size={20} />
              </span>
              <h3>Tus tres ofertas apareceran aqui cuando completes el cotizador.</h3>
              <p>
                Veras la cuota mensual, las coberturas principales y el deducible de cada
                aseguradora, lado a lado, sin ruido.
              </p>
              <a className="hf-btn hf-btn-primary" href="#cotizador">
                Empezar cotizador
                <ArrowRight size={16} />
              </a>
            </div>
          )}

          {serverMessage ? <p className="hf-note">{serverMessage}</p> : null}
        </div>
      </section>

      <section id="faq" className="hf-section hf-section-soft" ref={faqRef}>
        <div className="hf-shell hf-faq-layout">
          <div className="hf-faq-intro">
            <span className="hf-eyebrow dark">Preguntas frecuentes</span>
            <h2>Lo que normalmente nos preguntan antes de cotizar.</h2>
            <p>
              Si te queda una duda fuera de esta lista, escribinos por WhatsApp y un asesor te
              responde el mismo dia.
            </p>
          </div>

          <div className="hf-faq-list">
            {faqItems.map((item, i) => (
              <details key={item.q} className="hf-faq-item" open={i === 0}>
                <summary>
                  <span>{item.q}</span>
                  <ChevronDown size={18} className="hf-faq-chev" aria-hidden />
                </summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="hf-cta" ref={ctaRef}>
        <div className="hf-shell hf-cta-card">
          <div>
            <span className="hf-eyebrow light">
              <Sparkles size={14} /> Listo en 2 minutos
            </span>
            <h2>Compara tu seguro hoy. Cierra cuando estes seguro.</h2>
            <p>
              Tres ofertas reales, un asesor humano si lo pides, y una decision con respaldo de
              aseguradoras vigiladas.
            </p>
          </div>
          <div className="hf-cta-actions">
            <a className="hf-btn hf-btn-light hf-btn-lg" href="#cotizador">
              Empezar cotizador
              <ArrowRight size={18} />
            </a>
            <a className="hf-btn hf-btn-ghost-light" href="https://wa.me/573000000000">
              Hablar con asesor
            </a>
          </div>
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
            <div className="hf-footer-badges">
              <span>Vigilado Superfinanciera</span>
              <span>SSL 256-bit</span>
              <span>Habeas Data</span>
            </div>
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
