const { useState, useEffect, useRef, useMemo } = React;

// ──────────────────────────────────────────────────────────
// Tweakable defaults — persisted via host protocol
// ──────────────────────────────────────────────────────────
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "amethyst",
  "displayFont": "Cormorant Garamond",
  "showOrbs": true,
  "showGrain": true,
  "glassIntensity": 18
}/*EDITMODE-END*/;

const PALETTES = {
  amethyst: {
    name: "Amethyst & Gold",
    bg0: "#0c0418",
    bg1: "#1a0b2e",
    bg2: "#2b1356",
    purple: "#7c3aed",
    deep: "#5b21b6",
    gold: "#e5c158",
    goldDeep: "#b8923a",
    goldLight: "#f5d676",
  },
  plum: {
    name: "Plum & Champagne",
    bg0: "#100618",
    bg1: "#1f0a2b",
    bg2: "#3d1654",
    purple: "#9333ea",
    deep: "#6b21a8",
    gold: "#dfc189",
    goldDeep: "#a88e5e",
    goldLight: "#ecd6a4",
  },
  obsidian: {
    name: "Obsidian Royal",
    bg0: "#080513",
    bg1: "#160a2a",
    bg2: "#241252",
    purple: "#6d28d9",
    deep: "#4c1d95",
    gold: "#d4af37",
    goldDeep: "#9c7d24",
    goldLight: "#eccc6e",
  },
};

// ──────────────────────────────────────────────────────────
// Background — animated gradient orbs + grain + grid
// ──────────────────────────────────────────────────────────
function Atmosphere({ palette, showOrbs, showGrain }) {
  return (
    <div className="atmosphere" aria-hidden="true">
      <div className="vignette"></div>
      <div className="bg-grid"></div>
      {showOrbs && (
        <>
          <div className="orb orb--a" style={{ background: `radial-gradient(circle at 30% 30%, ${palette.purple}cc, transparent 60%)` }}></div>
          <div className="orb orb--b" style={{ background: `radial-gradient(circle at 70% 40%, ${palette.deep}, transparent 65%)` }}></div>
          <div className="orb orb--c" style={{ background: `radial-gradient(circle at 50% 50%, ${palette.gold}55, transparent 60%)` }}></div>
          <div className="orb orb--d" style={{ background: `radial-gradient(circle at 50% 50%, ${palette.purple}88, transparent 70%)` }}></div>
        </>
      )}
      {showGrain && <div className="grain"></div>}
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// Nav
// ──────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About Us" },
  { id: "portfolio", label: "Portfolio" },
  { id: "how", label: "How It Works" },
  { id: "education", label: "Investor Education" },
  { id: "founder", label: "Founder" },
  { id: "faq", label: "FAQ" },
  { id: "contact", label: "Contact" },
];

function Nav({ page, setPage }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header className={`nav-wrap ${scrolled ? "is-scrolled" : ""}`}>
      <nav className="nav glass glass--strong">
        <a className="nav-brand" onClick={(e) => { e.preventDefault(); setPage("home"); window.scrollTo({ top: 0 }); }} href="#">
          <img src="Logo.png.webp" alt="Kynectic Capital" style={{ height: "40px", width: "auto" }} />
        </a>

        <ul className="nav-links">
          {NAV_ITEMS.map((n) => (
            <li key={n.id}>
              <a
                href="#"
                className={page === n.id ? "active" : ""}
                onClick={(e) => { e.preventDefault(); setPage(n.id); window.scrollTo({ top: 0 }); }}
              >
                {n.label}
                {page === n.id && <span className="nav-underline"></span>}
              </a>
            </li>
          ))}
        </ul>

        <a className="btn btn--gold nav-cta" href="#" onClick={(e) => { e.preventDefault(); setPage("login"); }}>
          <span>Client Login</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
        </a>

        <button className="nav-burger" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
          <span></span><span></span><span></span>
        </button>
      </nav>

      {mobileOpen && (
        <div className="mobile-menu glass glass--strong">
          {NAV_ITEMS.map((n) => (
            <a key={n.id} href="#" className={page === n.id ? "active" : ""}
              onClick={(e) => { e.preventDefault(); setPage(n.id); setMobileOpen(false); window.scrollTo({ top: 0 }); }}>
              {n.label}
            </a>
          ))}
          <a href="#" className="btn btn--gold" onClick={(e) => { e.preventDefault(); setPage("login"); setMobileOpen(false); }}>
            Client Login →
          </a>
        </div>
      )}
    </header>
  );
}

// ──────────────────────────────────────────────────────────
// Shared atoms
// ──────────────────────────────────────────────────────────
function Eyebrow({ children }) {
  return <div className="eyebrow"><span className="eyebrow-dot"></span>{children}</div>;
}

function GoldDivider({ width = 80 }) {
  return <div className="gold-divider" style={{ width }}></div>;
}

function Btn({ variant = "gold", onClick, children, href = "#" }) {
  return (
    <a className={`btn btn--${variant}`} href={href} onClick={(e) => { if (onClick) { e.preventDefault(); onClick(); } }}>
      <span>{children}</span>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
        <path d="M5 12h14M13 5l7 7-7 7"/>
      </svg>
    </a>
  );
}

function NumeralBadge({ n }) {
  return (
    <div className="numeral-badge">
      <svg viewBox="0 0 80 80" width="80" height="80" aria-hidden="true">
        <defs>
          <linearGradient id={`num-${n}-grad`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--gold-light)"/>
            <stop offset="100%" stopColor="var(--gold-deep)"/>
          </linearGradient>
        </defs>
        <circle cx="40" cy="40" r="36" fill="none" stroke="url(#num-${n}-grad)" strokeWidth="1" opacity="0.6"/>
        <circle cx="40" cy="40" r="30" fill="none" stroke={`url(#num-${n}-grad)`} strokeWidth="0.5" opacity="0.4"/>
      </svg>
      <span className="numeral-text">{n}</span>
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// PAGE: Home
// ──────────────────────────────────────────────────────────
function HomePage({ setPage }) {
  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-pill glass glass--soft">
            <span className="pill-dot"></span>
            <span className="pill-label">New</span>
            <span className="pill-sep">·</span>
            <span>Invest with Clarity. Thrive with Momentum.</span>
          </div>

          <h1 className="hero-title">
            Build Wealth Through<br/>
            <span className="serif gold-shimmer">Smart, Passive</span><br/>
            Real Estate Investing
          </h1>

          <p className="hero-sub">
            Kynectic Capital helps busy professionals grow long-term wealth through
            well-underwritten, institutional-quality multifamily investments—without
            the stress of managing properties yourself.
          </p>

          <div className="hero-ctas">
            <Btn variant="gold" onClick={() => setPage("contact")}>Invest Passively</Btn>
            <Btn variant="glass" onClick={() => setPage("how")}>Learn How It Works</Btn>
          </div>

          <div className="hero-stats">
            <div className="stat">
              <div className="stat-num serif">17.35<span className="pct">%</span></div>
              <div className="stat-label">Class B AAR<br/>Most recent close</div>
            </div>
            <div className="stat-sep"></div>
            <div className="stat">
              <div className="stat-num serif">188</div>
              <div className="stat-label">Units acquired<br/>Multifamily — Georgia</div>
            </div>
            <div className="stat-sep"></div>
            <div className="stat">
              <div className="stat-num serif">$45.5K</div>
              <div className="stat-label">Yr-1 tax savings<br/>per $100K invested</div>
            </div>
          </div>
        </div>

        <div className="hero-card-frame">
          <div className="floating-card glass glass--strong fc-1">
            <div className="fc-row">
              <span className="fc-dot"></span>
              <span className="fc-label">Live offering</span>
            </div>
            <div className="fc-title">188-Unit Multifamily</div>
            <div className="fc-meta">Atlanta, GA · Class B Stabilized</div>
            <div className="fc-bar"><div className="fc-bar-fill" style={{width:"82%"}}></div></div>
            <div className="fc-bar-meta"><span>Funded</span><span>82%</span></div>
          </div>
          <div className="floating-card glass glass--strong fc-2">
            <div className="fc-tiny">QUARTERLY DISTRIBUTION</div>
            <div className="fc-big serif">$3,250</div>
            <div className="fc-trend">↗ +6.2% vs proforma</div>
          </div>
          <div className="floating-card glass glass--strong fc-3">
            <div className="fc-tiny">TAX BENEFIT</div>
            <div className="fc-big serif">Year One</div>
            <div className="fc-trend gold">Accelerated depreciation</div>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div className="marquee">
        <div className="marquee-track">
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={i} className="marquee-item">
              Integrity <em>·</em> Transparency <em>·</em> Discipline <em>·</em> Partnership <em>·</em>
            </span>
          ))}
        </div>
      </div>

      {/* The Kynectic Promise */}
      <section className="section">
        <div className="container">
          <Eyebrow>THE KYNECTIC PROMISE</Eyebrow>
          <div className="promise-grid">
            <div className="promise-copy">
              <h2 className="section-title">
                Wealth without<br/><span className="serif gold-shimmer">another job</span>
              </h2>
              <GoldDivider/>
              <p className="lede">
                You want financial growth, stability, and freedom — but not another
                responsibility competing for your time.
              </p>
              <p>
                At Kynectic Capital, we help you invest passively in high-quality
                institutional-grade multifamily communities that generate income,
                build equity, and offer powerful tax advantages.
              </p>
              <p>
                We handle the underwriting, operations, renovations, risk management,
                and performance — while you enjoy true passive income and long-term
                wealth creation. We're building a community of wealthy passive investors.
              </p>
              <div className="hero-ctas">
                <Btn variant="gold" onClick={() => setPage("portfolio")}>View Offerings</Btn>
              </div>
            </div>

            <div className="promise-visual">
              <div className="image-stack">
                <div className="image-card glass glass--strong">
                  <img src="https://framerusercontent.com/images/Qubz5p4FwfNslcsQZtoU81XgM8E.jpeg?width=685&height=559" alt="Modern multifamily community"/>
                </div>
                <div className="image-badge glass glass--strong">
                  <div className="ib-tiny">PROPERTIES UNDER MANAGEMENT</div>
                  <div className="ib-big serif">$48M+</div>
                </div>
                <div className="image-orb-1"></div>
                <div className="image-orb-2"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="section">
        <div className="container">
          <div className="section-head center">
            <Eyebrow>OUR FOUNDATION</Eyebrow>
            <h2 className="section-title">
              The <span className="serif gold-shimmer">Four Pillars</span>
            </h2>
            <p className="section-sub">Core values that shape every decision we make on your behalf.</p>
          </div>

          <div className="values-grid">
            {[
              { name: "Integrity", desc: "We honor our word. Every commitment, every disclosure, every dollar." },
              { name: "Transparency", desc: "Clear reporting. Open books. No surprises — only what's verifiable." },
              { name: "Discipline", desc: "Conservative underwriting. Stress-tested assumptions. Patience over hype." },
              { name: "Partnership", desc: "We invest alongside you. Our incentives are perfectly aligned with yours." },
            ].map((v, i) => (
              <div className="value-card glass glass--strong" key={v.name}>
                <div className="value-roman serif">{["I","II","III","IV"][i]}</div>
                <div className="value-icon">
                  <svg viewBox="0 0 64 64" width="48" height="48" aria-hidden="true">
                    {i === 0 && <path d="M32 8 L52 18 V34 C52 46 42 54 32 58 C22 54 12 46 12 34 V18 Z" fill="none" stroke="url(#gold-grad)" strokeWidth="2"/>}
                    {i === 1 && <><circle cx="32" cy="32" r="22" fill="none" stroke="url(#gold-grad)" strokeWidth="2"/><circle cx="32" cy="32" r="10" fill="none" stroke="url(#gold-grad)" strokeWidth="2"/></>}
                    {i === 2 && <><rect x="14" y="14" width="36" height="36" fill="none" stroke="url(#gold-grad)" strokeWidth="2"/><path d="M14 26 H50 M14 38 H50 M26 14 V50 M38 14 V50" stroke="url(#gold-grad)" strokeWidth="1" opacity="0.5"/></>}
                    {i === 3 && <><circle cx="22" cy="32" r="12" fill="none" stroke="url(#gold-grad)" strokeWidth="2"/><circle cx="42" cy="32" r="12" fill="none" stroke="url(#gold-grad)" strokeWidth="2"/></>}
                  </svg>
                </div>
                <h3 className="value-name">{v.name}</h3>
                <p className="value-desc">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mid CTA Banner */}
      <section className="section">
        <div className="container">
          <div className="banner-glass glass glass--strong">
            <div className="banner-glow"></div>
            <div className="banner-inner">
              <Eyebrow>INVEST WITH CLARITY. THRIVE WITH MOMENTUM.</Eyebrow>
              <h2 className="section-title">
                Passive multifamily designed for<br/>
                <span className="serif gold-shimmer">professionals who want more time</span>
              </h2>
              <p className="section-sub">
                Long-term wealth, stability, and freedom — without creating another job.
              </p>
              <div className="hero-ctas">
                <Btn variant="gold" onClick={() => setPage("portfolio")}>View Current Offerings</Btn>
                <Btn variant="glass" onClick={() => setPage("contact")}>Join Investor Community</Btn>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Multifamily */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <Eyebrow>THE ASSET CLASS</Eyebrow>
            <h2 className="section-title">
              Why <span className="serif gold-shimmer">Multifamily</span> Works
            </h2>
          </div>

          <div className="reasons-grid">
            {[
              { t: "Strong Demand", d: "Housing is a basic need. Multifamily stays in demand across every economic environment and outperforms during volatility.", img: "https://framerusercontent.com/images/nOvPrSK9OtYch1lqns8i2LnK2M.jpg?width=1000&height=667", big: true },
              { t: "Predictable Cash Flow", d: "Professionally managed apartment communities generate consistent rental income distributed directly to investors.", img: "https://framerusercontent.com/images/EcpGVKyavTr6pgjIf5kE978wZwI.jpg?width=1000&height=667" },
              { t: "Built-In Appreciation", d: "Through renovations and operational improvements, we increase property value regardless of market fluctuations.", img: "https://framerusercontent.com/images/76YFe3T9U1C0MzVeQ76CC69TPU.jpg?width=1000&height=800" },
              { t: "Inflation Protection", d: "Rents tend to rise with inflation, helping protect your purchasing power.", img: "https://framerusercontent.com/images/8HPC0nevmJ9lUwJijdvn34yeaHo.jpg?width=626&height=417" },
              { t: "Long-Term Appreciation", d: "Grow wealth through strategically selected real estate built for long-term value.", img: "https://framerusercontent.com/images/BfuZL56lNdoYPeF5milqDsLyE.jpg?width=1000&height=667" },
            ].map((r, i) => (
              <article className={`reason-card glass glass--strong ${r.big ? "reason--big" : ""}`} key={r.t}>
                <div className="reason-img">
                  <img src={r.img} alt={r.t}/>
                  <div className="reason-img-overlay"></div>
                </div>
                <div className="reason-body">
                  <div className="reason-index serif">0{i+1}</div>
                  <h3 className="reason-title">{r.t}</h3>
                  <p className="reason-desc">{r.d}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="center mt-48">
            <Btn variant="gold" onClick={() => setPage("portfolio")}>Learn Why Multifamily Wins</Btn>
          </div>
        </div>
      </section>

      {/* Deal Closed banner */}
      <section className="section">
        <div className="container">
          <div className="deal-banner glass glass--strong">
            <div className="deal-orbs"></div>
            <div className="deal-inner">
              <div className="deal-left">
                <span className="deal-badge">DEAL CLOSED</span>
                <h2 className="serif deal-title">
                  188-Unit Multifamily<br/>Opportunity — Georgia
                </h2>
                <p className="deal-sub">Join our list of upcoming opportunities.</p>
              </div>
              <div className="deal-right">
                <div className="deal-stat">
                  <span className="deal-check">✓</span>
                  <div>
                    <div className="deal-stat-big serif">17.35%</div>
                    <div className="deal-stat-label">AAR · Class B</div>
                  </div>
                </div>
                <div className="deal-stat">
                  <span className="deal-check">✓</span>
                  <div>
                    <div className="deal-stat-big serif">10.0%</div>
                    <div className="deal-stat-label">AAR · Class A</div>
                  </div>
                </div>
                <div className="deal-stat">
                  <span className="deal-check">✓</span>
                  <div>
                    <div className="deal-stat-big serif">$45.5K</div>
                    <div className="deal-stat-label">Yr-1 tax savings per $100K</div>
                  </div>
                </div>
                <Btn variant="gold" onClick={() => setPage("contact")}>Join Investor List</Btn>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Investors Choose Us */}
      <section className="section">
        <div className="container">
          <div className="section-head center">
            <Eyebrow>THE KYNECTIC ADVANTAGE</Eyebrow>
            <h2 className="section-title">
              Why Investors<br/>
              <span className="serif gold-shimmer">Choose Kynectic Capital</span>
            </h2>
            <p className="section-sub">
              Disciplined underwriting, aligned incentives, and transparent
              communication — a trusted investment experience.
            </p>
          </div>

          <div className="choose-grid">
            {[
              { t: "Professional & Disciplined", d: "Every deal undergoes conservative underwriting, stress testing, and market analysis." },
              { t: "Aligned Interests", d: "We invest our own capital alongside our investors — your success is our success." },
              { t: "Educational & Transparent", d: "Clear explanations, regular updates, and communication you can actually understand." },
              { t: "Proven Partnerships", d: "We collaborate only with experienced operators who have strong track records." },
            ].map((c, i) => (
              <div className="choose-card glass glass--strong" key={c.t}>
                <div className="choose-num serif">0{i+1}</div>
                <h3 className="choose-title">{c.t}</h3>
                <p className="choose-desc">{c.d}</p>
                <div className="choose-ornament">
                  <svg viewBox="0 0 100 12" width="100" height="12">
                    <path d="M0 6 H40" stroke="url(#gold-grad)" strokeWidth="1"/>
                    <circle cx="50" cy="6" r="3" fill="none" stroke="url(#gold-grad)" strokeWidth="1"/>
                    <path d="M60 6 H100" stroke="url(#gold-grad)" strokeWidth="1"/>
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Book a Call */}
      <section className="section">
        <div className="container">
          <div className="book-call glass glass--strong">
            <div className="bc-content">
              <Eyebrow>SPEAK WITH OUR TEAM</Eyebrow>
              <h2 className="section-title serif">Book a Free Call</h2>
              <p className="section-sub">
                A 20-minute conversation. No pressure. Just clarity on whether
                passive multifamily fits into your wealth plan.
              </p>
              <div className="hero-ctas">
                <Btn variant="gold" onClick={() => setPage("contact")}>Schedule a Call</Btn>
              </div>
            </div>
            <div className="bc-visual">
              <div className="calendar-mock glass">
                <div className="cm-head">
                  <span>NOVEMBER 2025</span>
                  <span className="gold">›</span>
                </div>
                <div className="cm-grid">
                  {["S","M","T","W","T","F","S"].map((d,i)=>(<div key={i} className="cm-day-label">{d}</div>))}
                  {Array.from({length: 30}).map((_, i) => (
                    <div key={i} className={`cm-day ${[5,12,18,25].includes(i) ? "available" : ""} ${i === 18 ? "selected" : ""}`}>
                      {i+1}
                    </div>
                  ))}
                </div>
                <div className="cm-slots">
                  <div className="cm-slot">9:00 AM</div>
                  <div className="cm-slot active">11:30 AM</div>
                  <div className="cm-slot">2:00 PM</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

// ──────────────────────────────────────────────────────────
// PAGE: About
// ──────────────────────────────────────────────────────────
function AboutPage({ setPage }) {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <Eyebrow>WHO WE ARE</Eyebrow>
          <h1 className="page-hero-title">
            About <span className="serif gold-shimmer">Kynectic</span>
          </h1>
          <GoldDivider width={140}/>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="about-grid">
            <div className="about-copy glass glass--soft">
              <h3 className="about-mission serif">
                To give busy professionals access to institutional-grade
                investment opportunities — without the complexity of active
                real estate.
              </h3>
              <GoldDivider/>
              <p>
                Kynectic Capital is a private real estate investment firm that
                partners with experienced operators to acquire strong,
                cash-flowing multifamily communities in growing U.S. markets.
              </p>
              <p>
                We focus on long-term fundamentals, disciplined underwriting,
                and investor-aligned strategies that prioritize capital
                preservation and steady returns.
              </p>
              <p>
                Whether you're a high-income earner, a healthcare professional,
                or someone preparing for long-term financial freedom, Kynectic
                Capital is built to help you grow with clarity, transparency
                and confidence. At Kynectic we lead with integrity, clarity
                and momentum.
              </p>
            </div>
            <div className="about-visual">
              <div className="image-card glass glass--strong">
                <img src="https://framerusercontent.com/images/qSon2USRItw1L0FGcK623ExDWv4.jpg?width=1000&height=667" alt="Property"/>
              </div>
              <div className="image-badge glass glass--strong">
                <div className="ib-tiny">FOUNDED ON</div>
                <div className="ib-big serif">Trust</div>
                <div className="ib-mini">Integrity · Discipline · Partnership</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head center">
            <Eyebrow>OUR APPROACH</Eyebrow>
            <h2 className="section-title">
              Institutional discipline.<br/><span className="serif gold-shimmer">Investor-first experience.</span>
            </h2>
          </div>
          <div className="choose-grid">
            {[
              { t: "Professional & Disciplined Approach", d: "We evaluate each opportunity using conservative assumptions and data-driven analysis. If the numbers don't make sense, we don't move forward." },
              { t: "Aligned Interests", d: "We invest our own capital in every deal. When you win, we win — and when you grow, we grow." },
              { t: "Educational & Transparent", d: "We take the complexity out of real estate investing. From clear communication to accessible updates, you always know what you're invested in and why." },
              { t: "Dual Strategy: Co-GP + Investor Access", d: "We partner with trusted operators and bring thoroughly vetted, high-quality opportunities to our investor community." },
            ].map((c, i) => (
              <div className="choose-card glass glass--strong" key={c.t}>
                <div className="choose-num serif">0{i+1}</div>
                <h3 className="choose-title">{c.t}</h3>
                <p className="choose-desc">{c.d}</p>
                <div className="choose-ornament">
                  <svg viewBox="0 0 100 12" width="100" height="12">
                    <path d="M0 6 H40" stroke="url(#gold-grad)" strokeWidth="1"/>
                    <circle cx="50" cy="6" r="3" fill="none" stroke="url(#gold-grad)" strokeWidth="1"/>
                    <path d="M60 6 H100" stroke="url(#gold-grad)" strokeWidth="1"/>
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="mission-banner glass glass--strong">
            <Eyebrow>OUR MISSION</Eyebrow>
            <h2 className="section-title serif">
              To help everyday professionals build generational wealth,
              <span className="gold-shimmer"> financial independence,</span> and
              time freedom through passive, strategic, and tax-efficient
              multifamily investments.
            </h2>
            <div className="hero-ctas center-flex">
              <Btn variant="gold" onClick={() => setPage("contact")}>Join Investor Community</Btn>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

// ──────────────────────────────────────────────────────────
// PAGE: Portfolio
// ──────────────────────────────────────────────────────────
function PortfolioPage({ setPage }) {
  const properties = [
    {
      name: "188-Unit Multifamily",
      location: "Georgia, USA",
      status: "Closed",
      img: "https://framerusercontent.com/images/nOvPrSK9OtYch1lqns8i2LnK2M.jpg?width=1000&height=667",
      stats: [{ k: "Class B AAR", v: "17.35%" }, { k: "Class A AAR", v: "10.0%" }, { k: "Units", v: "188" }],
    },
    {
      name: "Sunbelt Garden Community",
      location: "Texas, USA",
      status: "Underwriting",
      img: "https://framerusercontent.com/images/EcpGVKyavTr6pgjIf5kE978wZwI.jpg?width=1000&height=667",
      stats: [{ k: "Projected AAR", v: "16.8%" }, { k: "Hold", v: "5 yrs" }, { k: "Units", v: "224" }],
    },
    {
      name: "Class A Urban Infill",
      location: "Carolinas, USA",
      status: "Coming Soon",
      img: "https://framerusercontent.com/images/76YFe3T9U1C0MzVeQ76CC69TPU.jpg?width=1000&height=800",
      stats: [{ k: "Target IRR", v: "18.2%" }, { k: "Hold", v: "5–7 yrs" }, { k: "Units", v: "312" }],
    },
  ];

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <Eyebrow>OUR PORTFOLIO</Eyebrow>
          <h1 className="page-hero-title">
            Curated <span className="serif gold-shimmer">Multifamily</span><br/>Opportunities
          </h1>
          <GoldDivider width={140}/>
          <p className="page-hero-sub">
            Every property in the Kynectic portfolio is stress-tested,
            institutionally underwritten, and operated by partners with proven
            track records.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="portfolio-grid">
            {properties.map((p) => (
              <article className="property-card glass glass--strong" key={p.name}>
                <div className="property-img">
                  <img src={p.img} alt={p.name}/>
                  <div className={`property-status ${p.status.toLowerCase().replace(/\s/g,"-")}`}>
                    <span className="ps-dot"></span>{p.status}
                  </div>
                </div>
                <div className="property-body">
                  <div className="property-loc">{p.location}</div>
                  <h3 className="property-name serif">{p.name}</h3>
                  <div className="property-stats">
                    {p.stats.map((s) => (
                      <div className="property-stat" key={s.k}>
                        <div className="ps-val serif">{s.v}</div>
                        <div className="ps-key">{s.k}</div>
                      </div>
                    ))}
                  </div>
                  <Btn variant="glass" onClick={() => setPage("contact")}>Request the deck</Btn>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="track-record glass glass--strong">
            <Eyebrow>TRACK RECORD AT A GLANCE</Eyebrow>
            <div className="tr-grid">
              <div className="tr-stat">
                <div className="tr-big serif gold-shimmer">$48M+</div>
                <div className="tr-label">Assets transacted</div>
              </div>
              <div className="tr-stat">
                <div className="tr-big serif gold-shimmer">724</div>
                <div className="tr-label">Units across portfolio</div>
              </div>
              <div className="tr-stat">
                <div className="tr-big serif gold-shimmer">17.4%</div>
                <div className="tr-label">Avg projected AAR (Class B)</div>
              </div>
              <div className="tr-stat">
                <div className="tr-big serif gold-shimmer">100%</div>
                <div className="tr-label">Distributions on schedule</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

// ──────────────────────────────────────────────────────────
// PAGE: How It Works
// ──────────────────────────────────────────────────────────
function HowPage({ setPage }) {
  const steps = [
    { n: "01", t: "Join the Investor List", d: "Verify accreditation and get access to upcoming opportunities." },
    { n: "02", t: "Review the Offering", d: "We send you a full investment package outlining the business plan, projected returns, and timeline." },
    { n: "03", t: "Invest with Confidence", d: "Sign the subscription documents and fund your investment securely." },
    { n: "04", t: "Receive Cash Flow & Updates", d: "Investors receive quarterly updates, distributions, and a year-end K-1 for tax benefits." },
    { n: "05", t: "Exit or Refinance", d: "Upon sale or refinance, investors receive their profits plus return of capital." },
  ];
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <Eyebrow>THE INVESTOR JOURNEY</Eyebrow>
          <h1 className="page-hero-title">How It <span className="serif gold-shimmer">Works</span></h1>
          <GoldDivider width={140}/>
          <p className="page-hero-sub">
            Five clear steps from first conversation to capital returned —
            built around your time, not ours.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="steps">
            <div className="steps-rail"></div>
            {steps.map((s, i) => (
              <div className={`step glass glass--strong ${i % 2 ? "right" : "left"}`} key={s.n}>
                <div className="step-num-col">
                  <div className="step-num serif">{s.n}</div>
                  <div className="step-dot"></div>
                </div>
                <div className="step-body">
                  <h3 className="step-title">{s.t}</h3>
                  <p className="step-desc">{s.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="banner-glass glass glass--strong">
            <div className="banner-glow"></div>
            <div className="banner-inner">
              <h2 className="section-title serif">Invest with a Partner Who Puts You First</h2>
              <p className="section-sub">
                Join our investor community and gain access to
                institutional-grade multifamily opportunities.
              </p>
              <div className="hero-ctas">
                <Btn variant="gold" onClick={() => setPage("contact")}>Join Investor List</Btn>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

// ──────────────────────────────────────────────────────────
// PAGE: Education
// ──────────────────────────────────────────────────────────
function EducationPage({ setPage }) {
  const articles = [
    { t: "Multifamily 101", d: "The foundational primer on how apartment investments produce four return drivers simultaneously.", tag: "Primer", read: "8 min read" },
    { t: "Understanding AAR vs. IRR", d: "Why average annual return and internal rate of return tell different stories — and which matters when.", tag: "Returns", read: "6 min read" },
    { t: "Bonus Depreciation Explained", d: "How accelerated depreciation can shelter ordinary income and amplify your year-one tax position.", tag: "Tax", read: "10 min read" },
    { t: "Reading a Private Placement Memorandum", d: "A line-by-line guide to the document that governs your investment — what to look for and what to skip.", tag: "Diligence", read: "12 min read" },
    { t: "The Power of Cost Segregation", d: "Why a $100K investment can deliver $45K in year-one paper losses without affecting cash flow.", tag: "Tax", read: "9 min read" },
    { t: "Operator Diligence Checklist", d: "The exact 24-point checklist Kynectic uses to vet every operating partner before deploying a dollar.", tag: "Diligence", read: "7 min read" },
  ];
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <Eyebrow>INVESTOR EDUCATION</Eyebrow>
          <h1 className="page-hero-title">
            Learn Before<br/>You <span className="serif gold-shimmer">Invest</span>
          </h1>
          <GoldDivider width={140}/>
          <p className="page-hero-sub">
            Free, no-fluff education built for high-income earners who want
            to understand exactly what they're buying.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="ebook glass glass--strong">
            <div className="ebook-cover glass">
              <div className="eb-spine"></div>
              <div className="eb-front">
                <div className="eb-tiny">FREE EBOOK</div>
                <div className="eb-title serif">The Passive<br/>Investor's<br/>Playbook</div>
                <div className="eb-author">— Kynectic Capital</div>
                <div className="eb-emblem">
                  <svg viewBox="0 0 60 60" width="60" height="60"><circle cx="30" cy="30" r="26" fill="none" stroke="url(#gold-grad)" strokeWidth="1.5"/><circle cx="30" cy="30" r="18" fill="none" stroke="url(#gold-grad)" strokeWidth="0.8"/></svg>
                </div>
              </div>
            </div>
            <div className="ebook-copy">
              <Eyebrow>NEW · 64 PAGES</Eyebrow>
              <h2 className="section-title">
                A complete guide to <span className="serif gold-shimmer">passive multifamily investing</span>
              </h2>
              <p className="section-sub">
                Inside: how returns are structured, what bonus depreciation
                actually does to your tax bill, how to read a PPM, and the
                exact questions to ask before wiring funds.
              </p>
              <form className="inline-form" onSubmit={(e) => { e.preventDefault(); setPage("contact"); }}>
                <input type="email" placeholder="your@email.com" required/>
                <button type="submit" className="btn btn--gold"><span>Download Free</span></button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <Eyebrow>THE LIBRARY</Eyebrow>
            <h2 className="section-title">Articles & <span className="serif gold-shimmer">guides</span></h2>
          </div>
          <div className="library-grid">
            {articles.map((a) => (
              <article className="article-card glass glass--strong" key={a.t}>
                <div className="article-tag">{a.tag}</div>
                <h3 className="article-title">{a.t}</h3>
                <p className="article-desc">{a.d}</p>
                <div className="article-foot">
                  <span>{a.read}</span>
                  <span className="gold">Read →</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

// ──────────────────────────────────────────────────────────
// PAGE: Founder
// ──────────────────────────────────────────────────────────
function FounderPage({ setPage }) {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <Eyebrow>FOUNDER</Eyebrow>
          <h1 className="page-hero-title">Meet <span className="serif gold-shimmer">Anita</span></h1>
          <GoldDivider width={140}/>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="founder-grid">
            <div className="founder-portrait">
              <div className="portrait-frame glass glass--strong">
                <div className="portrait-placeholder">
                  <div className="pp-grain"></div>
                  <div className="pp-mono">[ FOUNDER PORTRAIT ]</div>
                </div>
              </div>
              <div className="founder-badge glass glass--strong">
                <div className="fb-tiny">PRINCIPAL & FOUNDER</div>
                <div className="fb-name serif">Anita</div>
                <div className="fb-credentials">Kynectic Capital · Denton, TX</div>
              </div>
            </div>
            <div className="founder-copy">
              <h2 className="section-title serif">
                "Real wealth shouldn't cost you<br/>your <span className="gold-shimmer">time, energy</span>, or peace."
              </h2>
              <GoldDivider/>
              <p>
                Anita founded Kynectic Capital after a decade of watching
                high-achievers earn extraordinary incomes and have nothing to
                show for it — taxed to the hilt, time-starved, and locked out
                of the institutional deals that build true generational wealth.
              </p>
              <p>
                Kynectic exists to close that gap. Every offering is structured
                for the busy professional who values clarity, transparency, and
                aligned incentives over hype.
              </p>
              <p>
                She invests her own capital alongside every Kynectic investor —
                a non-negotiable commitment to the partnership we stand for.
              </p>
              <div className="hero-ctas">
                <Btn variant="gold" onClick={() => setPage("contact")}>Book a Call with Anita</Btn>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

// ──────────────────────────────────────────────────────────
// PAGE: FAQ
// ──────────────────────────────────────────────────────────
function FAQPage() {
  const faqs = [
    { q: "What is passive multifamily investing?", a: "It's the structure where you invest capital alongside a professional sponsor (Kynectic) who acquires, operates, and eventually sells an apartment community. You receive distributions, tax benefits, and a share of proceeds at sale — without managing tenants, toilets, or trash." },
    { q: "Who can invest with Kynectic Capital?", a: "Most offerings are open to accredited investors as defined by SEC Rule 501. We verify accreditation as part of onboarding and can walk you through the process." },
    { q: "What is the minimum investment?", a: "Minimums typically start at $50,000–$100,000 depending on the offering. We'll share the exact figure with each opportunity." },
    { q: "How are returns paid out?", a: "Most deals distribute cash flow quarterly via ACH directly to your account. A larger share of returns is realized at sale or refinance." },
    { q: "What are the tax benefits?", a: "Multifamily real estate offers depreciation — including accelerated and bonus depreciation — that can offset distributions and, in some cases, other passive income. We issue an annual K-1 for each investment." },
    { q: "What is a typical hold period?", a: "Most Kynectic offerings target a 3–7 year hold, with the exact timeline disclosed in each business plan." },
    { q: "How do I get started?", a: "Join our investor list to receive education, market updates, and access to upcoming offerings. When a deal opens, you'll receive the full investment package to review." },
  ];
  const [open, setOpen] = useState(0);
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <Eyebrow>FREQUENTLY ASKED</Eyebrow>
          <h1 className="page-hero-title">Your <span className="serif gold-shimmer">Questions</span><br/>Answered</h1>
          <GoldDivider width={140}/>
        </div>
      </section>

      <section className="section">
        <div className="container container--narrow">
          <div className="faq-list">
            {faqs.map((f, i) => (
              <div className={`faq-item glass glass--strong ${open === i ? "open" : ""}`} key={f.q} onClick={() => setOpen(open === i ? -1 : i)}>
                <div className="faq-q">
                  <span className="faq-num serif">0{i+1}</span>
                  <span className="faq-q-text">{f.q}</span>
                  <span className="faq-toggle">{open === i ? "–" : "+"}</span>
                </div>
                {open === i && <div className="faq-a">{f.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

// ──────────────────────────────────────────────────────────
// PAGE: Contact
// ──────────────────────────────────────────────────────────
function ContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", invest: "", message: "" });
  const onChange = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <Eyebrow>CONTACT US</Eyebrow>
          <h1 className="page-hero-title">Let's <span className="serif gold-shimmer">Connect</span></h1>
          <GoldDivider width={140}/>
          <p className="page-hero-sub">
            Tell us a little about yourself and we'll be in touch within one business day.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-form glass glass--strong">
              {!sent ? (
                <form onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
                  <div className="field">
                    <label>Full Name</label>
                    <input type="text" required value={form.name} onChange={onChange("name")} placeholder="Jane Smith"/>
                  </div>
                  <div className="field-row">
                    <div className="field">
                      <label>Email</label>
                      <input type="email" required value={form.email} onChange={onChange("email")} placeholder="jane@example.com"/>
                    </div>
                    <div className="field">
                      <label>Phone</label>
                      <input type="tel" value={form.phone} onChange={onChange("phone")} placeholder="(555) 123-4567"/>
                    </div>
                  </div>
                  <div className="field">
                    <label>Investment range</label>
                    <select value={form.invest} onChange={onChange("invest")}>
                      <option value="">Select a range</option>
                      <option>$50K – $100K</option>
                      <option>$100K – $250K</option>
                      <option>$250K – $500K</option>
                      <option>$500K+</option>
                    </select>
                  </div>
                  <div className="field">
                    <label>What would you like to discuss?</label>
                    <textarea rows="4" value={form.message} onChange={onChange("message")} placeholder="A bit about your goals…"/>
                  </div>
                  <div className="accred glass glass--soft">
                    <input type="checkbox" id="accred" required/>
                    <label htmlFor="accred">I confirm I am an accredited investor or qualified to participate.</label>
                  </div>
                  <button type="submit" className="btn btn--gold btn--full">
                    <span>Submit & Join Investor List</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
                  </button>
                </form>
              ) : (
                <div className="sent-state">
                  <div className="sent-glyph">
                    <svg viewBox="0 0 64 64" width="80" height="80">
                      <circle cx="32" cy="32" r="30" fill="none" stroke="url(#gold-grad)" strokeWidth="1.5"/>
                      <path d="M20 32 L28 40 L44 24" stroke="url(#gold-grad)" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <h3 className="serif">Thank you, {form.name || "investor"}.</h3>
                  <p>We've received your details. A member of the Kynectic team will reach out shortly.</p>
                </div>
              )}
            </div>
            <aside className="contact-info">
              <div className="info-card glass glass--strong">
                <div className="info-tiny">EMAIL</div>
                <a className="info-big" href="mailto:anita@kynecticcap.com">anita@kynecticcap.com</a>
              </div>
              <div className="info-card glass glass--strong">
                <div className="info-tiny">PHONE</div>
                <a className="info-big" href="tel:+14302437221">+1 (430) 243‑7221</a>
              </div>
              <div className="info-card glass glass--strong">
                <div className="info-tiny">OFFICE</div>
                <div className="info-big">1800 S Loop 288<br/>396 670, Denton, TX 76208</div>
              </div>
              <div className="info-card glass glass--strong">
                <div className="info-tiny">FOLLOW</div>
                <a className="info-big" href="https://www.instagram.com/kynecticcapital/" target="_blank" rel="noreferrer">@kynecticcapital</a>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}

// ──────────────────────────────────────────────────────────
// PAGE: Client Login (placeholder)
// ──────────────────────────────────────────────────────────
function LoginPage() {
  return (
    <section className="page-hero">
      <div className="container">
        <div className="login-card glass glass--strong">
          <Eyebrow>CLIENT LOGIN</Eyebrow>
          <h1 className="page-hero-title">Investor <span className="serif gold-shimmer">Portal</span></h1>
          <GoldDivider width={120}/>
          <p>Access your investments, K-1s, distributions, and quarterly reports.</p>
          <form className="login-form">
            <div className="field"><label>Email</label><input type="email" placeholder="you@email.com"/></div>
            <div className="field"><label>Password</label><input type="password" placeholder="••••••••"/></div>
            <button type="button" className="btn btn--gold btn--full"><span>Sign In</span></button>
          </form>
          <p className="muted small">Powered by Cashflow Portal · 256-bit encrypted</p>
        </div>
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────────────────
// Footer
// ──────────────────────────────────────────────────────────
function Footer({ setPage }) {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-banner glass glass--strong">
          <h2 className="footer-headline serif">
            Start Building Wealth Through<br/>
            <span className="gold-shimmer">Passive Real Estate</span>
          </h2>
          <p>Join our investor list to receive new opportunities, updates, and education designed to help you invest with clarity and confidence.</p>
          <div className="hero-ctas center-flex">
            <Btn variant="gold" onClick={() => setPage("contact")}>Join Investor List</Btn>
          </div>
        </div>

        <div className="footer-grid">
          <div className="footer-brand">
            <div className="nav-brand">
              <img src="Logo.png.webp" alt="Kynectic Capital" style={{ height: "40px", width: "auto" }} />
            </div>
            <p className="footer-tag">Invest with Clarity. Thrive with Momentum.</p>
          </div>
          <div className="footer-col">
            <h4>Company</h4>
            <a href="#" onClick={(e) => { e.preventDefault(); setPage("about"); }}>About Us</a>
            <a href="#" onClick={(e) => { e.preventDefault(); setPage("founder"); }}>Founder</a>
            <a href="#" onClick={(e) => { e.preventDefault(); setPage("how"); }}>How it Works</a>
            <a href="#" onClick={(e) => { e.preventDefault(); setPage("faq"); }}>FAQ</a>
          </div>
          <div className="footer-col">
            <h4>Invest</h4>
            <a href="#" onClick={(e) => { e.preventDefault(); setPage("portfolio"); }}>Portfolio</a>
            <a href="#" onClick={(e) => { e.preventDefault(); setPage("education"); }}>Investor Education</a>
            <a href="#" onClick={(e) => { e.preventDefault(); setPage("contact"); }}>Contact Us</a>
            <a href="#" onClick={(e) => { e.preventDefault(); setPage("login"); }}>Client Login</a>
          </div>
          <div className="footer-col">
            <h4>Contact</h4>
            <a href="mailto:anita@kynecticcap.com">anita@kynecticcap.com</a>
            <a href="tel:+14302437221">+1 (430) 243‑7221</a>
            <a href="https://www.instagram.com/kynecticcapital/" target="_blank" rel="noreferrer">Instagram</a>
            <span className="muted">1800 S Loop 288 396 670<br/>Denton, TX 76208, USA</span>
          </div>
        </div>

        <div className="footer-bottom">
          <span>All Rights Reserved © 2025 Kynectic Capital Investment</span>
          <span className="footer-disclaim">Past performance is not indicative of future results. Investments involve risk. Offerings are limited to accredited investors.</span>
        </div>
      </div>
    </footer>
  );
}

// ──────────────────────────────────────────────────────────
// Tweaks panel
// ──────────────────────────────────────────────────────────
function MyTweaks({ tweaks, setTweak }) {
  return (
    <TweaksPanel>
      <TweakSection title="Palette">
        <TweakSelect label="Color theme" value={tweaks.palette}
          onChange={(v) => setTweak("palette", v)}
          options={[
            { value: "amethyst", label: "Amethyst & Gold" },
            { value: "plum", label: "Plum & Champagne" },
            { value: "obsidian", label: "Obsidian Royal" },
          ]}
        />
      </TweakSection>
      <TweakSection title="Typography">
        <TweakSelect label="Display font" value={tweaks.displayFont}
          onChange={(v) => setTweak("displayFont", v)}
          options={[
            { value: "Cormorant Garamond", label: "Cormorant Garamond" },
            { value: "Playfair Display", label: "Playfair Display" },
            { value: "DM Serif Display", label: "DM Serif Display" },
          ]}
        />
      </TweakSection>
      <TweakSection title="Atmosphere">
        <TweakToggle label="Animated orbs" value={tweaks.showOrbs} onChange={(v) => setTweak("showOrbs", v)}/>
        <TweakToggle label="Film grain" value={tweaks.showGrain} onChange={(v) => setTweak("showGrain", v)}/>
        <TweakSlider label="Glass blur" value={tweaks.glassIntensity} onChange={(v) => setTweak("glassIntensity", v)} min={6} max={32} step={1}/>
      </TweakSection>
    </TweaksPanel>
  );
}

// ──────────────────────────────────────────────────────────
// App
// ──────────────────────────────────────────────────────────
function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [page, setPage] = useState("home");
  const palette = PALETTES[tweaks.palette] || PALETTES.amethyst;

  // apply CSS vars
  useEffect(() => {
    const r = document.documentElement;
    r.style.setProperty("--bg-0", palette.bg0);
    r.style.setProperty("--bg-1", palette.bg1);
    r.style.setProperty("--bg-2", palette.bg2);
    r.style.setProperty("--purple", palette.purple);
    r.style.setProperty("--deep", palette.deep);
    r.style.setProperty("--gold", palette.gold);
    r.style.setProperty("--gold-deep", palette.goldDeep);
    r.style.setProperty("--gold-light", palette.goldLight);
    r.style.setProperty("--glass-blur", `${tweaks.glassIntensity}px`);
    r.style.setProperty("--display-font", `'${tweaks.displayFont}', 'Cormorant Garamond', serif`);
  }, [palette, tweaks.glassIntensity, tweaks.displayFont]);

  // Inject the shared gold gradient once for SVGs
  const svgDefs = (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
      <defs>
        <linearGradient id="gold-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--gold-light)" />
          <stop offset="50%" stopColor="var(--gold)" />
          <stop offset="100%" stopColor="var(--gold-deep)" />
        </linearGradient>
      </defs>
    </svg>
  );

  let body;
  switch (page) {
    case "about": body = <AboutPage setPage={setPage}/>; break;
    case "portfolio": body = <PortfolioPage setPage={setPage}/>; break;
    case "how": body = <HowPage setPage={setPage}/>; break;
    case "education": body = <EducationPage setPage={setPage}/>; break;
    case "founder": body = <FounderPage setPage={setPage}/>; break;
    case "faq": body = <FAQPage/>; break;
    case "contact": body = <ContactPage/>; break;
    case "login": body = <LoginPage/>; break;
    default: body = <HomePage setPage={setPage}/>;
  }

  return (
    <>
      {svgDefs}
      <Atmosphere palette={palette} showOrbs={tweaks.showOrbs} showGrain={tweaks.showGrain}/>
      <Nav page={page} setPage={setPage}/>
      <main>{body}</main>
      <Footer setPage={setPage}/>
      <MyTweaks tweaks={tweaks} setTweak={setTweak}/>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
