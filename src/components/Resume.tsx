const CONTACTS = [
  { label: "gavin.jaynes@gmail.com", href: "mailto:gavin.jaynes@gmail.com" },
  { label: "gavinjaynes.xyz", href: "https://gavinjaynes.xyz" },
  { label: "GitHub", href: "https://github.com/GavinJaynes" },
  { label: "LinkedIn", href: "https://linkedin.com/in/gavin-jaynes-45a0192b" },
]

const SUMMARY =
  "14+ years of production frontend engineering. DeFi native: shipped DeFi protocols with $1M+ revenue, an open-source registry of onchain UI components, commercial AI products, and autonomous trading systems. TypeScript-first."

const experience = [
  {
    company: "ClawOps",
    role: "Founder",
    period: "2024 – Present",
    location: "Remote",
    intro:
      "Commercial SaaS AI assistant platform. React 19 + Convex monorepo with automated Hetzner VPS provisioning over SSH, Stripe subscriptions, and per-customer OpenRouter API keys with spending caps — checkout to a live personal AI assistant on a dedicated VPS in ~5 minutes, accessible via Telegram and backed by 600+ models.",
    bullets: [
      "Companions platform: installable AI personality layers with domain knowledge, persistent memory, their own data stores, third-party API integrations, and dedicated dashboard UIs — first companion live in alpha",
      "Smart Switching: real-time credit monitoring with automatic model fallback across providers",
      "Built on the open-source OpenClaw foundation",
    ],
    tech: ["React 19", "TypeScript", "Convex", "Vite", "Tailwind CSS", "shadcn/ui", "Stripe", "OpenRouter"],
  },
  {
    company: "Brewlabs",
    role: "Co-founder & Lead Engineer",
    period: "2022 – 2024",
    location: "Remote",
    intro:
      "Co-founded and led engineering on a full DeFi product suite — swap, bridge, staking, yield farming, and NFT platform — across Base, Ethereum, BSC, and Arbitrum. $1M+ protocol revenue, community in the thousands. Spun out INDX, an on-chain index protocol: deposit USDC, receive basket exposure to up to 20 tokens via real swaps. No proxies, no synthetics.",
    bullets: [
      "Performance-critical interfaces: real-time on-chain data, wallet state, and transaction feedback demanding sub-second responsiveness",
      "Next.js SSR with mixed rendering strategies balancing performance, SEO, and live chain data",
    ],
    tech: ["Next.js", "TypeScript", "Wagmi", "Viem", "The Graph", "Moralis"],
  },
  {
    company: "Squiz",
    role: "Frontend Engineer → Senior → Quality & Standards Manager, CoE",
    period: "2016 – Aug 2023",
    location: "Brisbane, AU",
    intro:
      "Seven years on enterprise CMS delivery (Squiz Matrix) for government, university, and healthcare clients, progressing into an international leadership role owning the definition and rollout of development standards across Squiz's globally distributed engineering teams.",
    bullets: [
      "WCAG AAA-compliant interfaces at government scale; performance as a baseline — render paths, asset loading, and CLS on high-traffic properties",
      "Built and maintained test pipelines from unit to E2E (Jest, Vitest, Cypress, Puppeteer) integrated into CI/CD",
      "Led frontend modernisation: component-driven architecture, TypeScript, Vue, React; sprint facilitation and junior mentoring",
      "As Quality & Standards Manager: audited and standardised development processes across international teams",
    ],
    tech: [],
  },
]

const earlier = [
  {
    company: "Logic Spot",
    role: "Developer",
    period: "2013 – 2015",
    location: "London, UK",
    detail: "Membership sites and eCommerce platforms for agency clients; client-facing build specifications and small-team coordination.",
  },
  {
    company: "NOUS Group",
    role: "Developer",
    period: "2012 – 2013",
    location: "Brisbane, AU",
    detail: "Small and medium website builds; client meetings and discovery workshops.",
  },
]

const projects = [
  {
    name: "onchain-ui",
    type: "Open Source",
    period: "2026 – Present",
    url: "onchain-ui.dev",
    intro:
      "Open-source shadcn registry of copy-paste web3 components for teams building onchain interfaces: address display and ENS/Base identity, token logos, prices, balances, network badges, and portfolio asset rows — installed straight into any shadcn app via the shadcn CLI.",
    bullets: [
      "Registry-first architecture: components land in the consumer's codebase — inspectable, editable, wired to their own data layer",
      "Registry contract tests; docs site with live demos",
    ],
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "shadcn", "wagmi", "viem", "Fumadocs"],
  },
  {
    name: "HyperLiquid Algo Trading System",
    type: "Personal / ClawOps Companion MVP",
    period: "2024 – Present",
    url: null,
    intro:
      "Autonomous trading system for HyperLiquid perpetual futures. Trade via natural language through Telegram, or let it run: every 4 hours it scores RSI, funding rate, and momentum signals alongside a DBRCI breakout scanner, then decides whether to act.",
    bullets: [
      "Full execution layer: configurable leverage, GTC limit orders, fill polling, TP/SL bracket management",
      "Prototype for the ClawOps Trading Companion",
    ],
    tech: ["Python", "HyperLiquid SDK", "Telegram Bot API"],
  },
]

const skills = [
  { label: "Languages", items: "TypeScript, JavaScript, HTML, CSS" },
  {
    label: "Frontend",
    items: "React, Vue, Next.js, Nuxt, Astro, Vite, Tailwind CSS, shadcn/ui — SSR, i18n",
  },
  {
    label: "Design Systems",
    items: "Reusable component libraries, design tokens, Tailwind theme architecture",
  },
  {
    label: "Web3",
    items: "wagmi, viem, ethers.js, The Graph, Hardhat, smart contract integration",
  },
  { label: "Testing", items: "Jest, Vitest, Cypress, Puppeteer — unit to E2E, integrated into CI/CD" },
  {
    label: "Backend & Infra",
    items: "Node.js, Convex, WebSockets, Hetzner VPS, Nginx, Netlify, CI/CD",
  },
  {
    label: "AI Engineering",
    items: "Claude Code, Cursor, OpenRouter, multi-model routing, Telegram bots",
  },
  { label: "Accessibility", items: "WCAG AAA across gov, higher-ed, and enterprise at scale" },
]

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="font-mono text-[10px] tracking-[0.3em] text-zinc-400 uppercase mb-5 mt-7">
      {children}
    </p>
  )
}

function TechChips({ tech }: { tech: string[] }) {
  if (tech.length === 0) return null
  return (
    <div className="flex flex-wrap gap-1.5 mt-3">
      {tech.map((t) => (
        <span key={t} className="font-mono text-[9.5px] text-zinc-500 bg-zinc-100 px-1.5 py-0.5 tracking-wide">
          {t}
        </span>
      ))}
    </div>
  )
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1.5 mt-2.5">
      {items.map((b) => (
        <li key={b} className="flex items-start gap-2 text-[12px] leading-normal text-zinc-600">
          <span className="text-chart-5 text-[10px] mt-[3px] shrink-0">▸</span>
          <span>{b}</span>
        </li>
      ))}
    </ul>
  )
}

function EntryHeader({
  title,
  subtitle,
  period,
  location,
}: {
  title: string
  subtitle: string
  period: string
  location?: string | null
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 mb-2">
      <p className="text-[14px] leading-tight">
        <span className="font-semibold text-zinc-900">{title}</span>
        <span className="text-zinc-500"> · {subtitle}</span>
      </p>
      <p className="font-mono text-[10px] text-zinc-400 tracking-wide shrink-0 text-right">
        {period}
        {location ? ` · ${location}` : ""}
      </p>
    </div>
  )
}

export function Resume() {
  return (
    <div className="resume-root min-h-svh bg-stone-100 py-10 print:bg-white print:py-0">
      <style>{`
        @page { size: A4; margin: 0; }
        @media print {
          .resume-root { background: white; }
          .resume-sheet { box-shadow: none !important; margin: 0 auto !important; }
          .resume-sheet:first-of-type { break-after: page; }
        }
      `}</style>

      {/* Screen-only toolbar */}
      <div className="mx-auto mb-6 flex w-[210mm] max-w-full items-center justify-between px-4 print:hidden">
        <a
          href="/"
          className="font-mono text-xs tracking-widest text-zinc-400 uppercase transition-colors hover:text-zinc-700"
        >
          ← gavinjaynes.xyz
        </a>
        <button
          onClick={() => window.print()}
          className="bg-zinc-900 px-5 py-2.5 font-mono text-xs tracking-widest text-white uppercase transition-colors hover:bg-zinc-700"
        >
          Download PDF
        </button>
      </div>

      {/* ── Page 1 ── */}
      <div className="resume-sheet mx-auto mb-8 w-[210mm] max-w-full min-h-[297mm] bg-white px-[16mm] py-[11mm] shadow-lg print:mb-0">
        {/* Header */}
        <header className="border-b border-zinc-200 pb-6">
          <p className="font-mono text-[10px] tracking-[0.3em] text-chart-5 uppercase mb-3">
            Frontend Engineer · Remote, available anywhere
          </p>
          <h1 className="font-display font-bold text-zinc-900 text-[30px] leading-none tracking-tight">
            GAVIN JAYNES
          </h1>
          <div className="flex items-baseline whitespace-nowrap mt-4">
            {CONTACTS.map(({ label, href }, i) => (
              <span key={label} className="font-mono text-[10px] text-zinc-500">
                {i > 0 && <span className="text-zinc-300 mx-3">·</span>}
                <a href={href} className="hover:text-zinc-900">{label}</a>
              </span>
            ))}
          </div>
          <p className="text-[12.5px] leading-relaxed text-zinc-600 mt-5 max-w-[160mm]">{SUMMARY}</p>
        </header>

        {/* Experience */}
        <SectionLabel>01: Experience</SectionLabel>
        <div className="space-y-7">
          {experience.map((job) => (
            <div key={job.company} className="break-inside-avoid">
              <EntryHeader title={job.role} subtitle={job.company} period={job.period} location={job.location} />
              <p className="text-[12px] leading-normal text-zinc-600">{job.intro}</p>
              <Bullets items={job.bullets} />
              <TechChips tech={job.tech} />
            </div>
          ))}
        </div>
      </div>

      {/* ── Page 2 ── */}
      <div className="resume-sheet mx-auto w-[210mm] max-w-full min-h-[297mm] bg-white px-[16mm] py-[11mm] shadow-lg">
        {/* Earlier roles */}
        <SectionLabel>Earlier</SectionLabel>
        <div className="space-y-4">
          {earlier.map((job) => (
            <div key={job.company} className="break-inside-avoid">
              <EntryHeader title={job.role} subtitle={job.company} period={job.period} location={job.location} />
              <p className="text-[12px] leading-normal text-zinc-600">{job.detail}</p>
            </div>
          ))}
        </div>

        {/* Projects */}
        <SectionLabel>02: Selected Projects</SectionLabel>
        <div className="space-y-7">
          {projects.map((project) => (
            <div key={project.name} className="break-inside-avoid">
              <EntryHeader
                title={project.name}
                subtitle={project.type}
                period={project.period}
                location={project.url}
              />
              <p className="text-[12px] leading-normal text-zinc-600">{project.intro}</p>
              <Bullets items={project.bullets} />
              <TechChips tech={project.tech} />
            </div>
          ))}
        </div>

        {/* Skills */}
        <SectionLabel>03: Skills</SectionLabel>
        <div className="grid grid-cols-[120px_1fr] gap-x-6 gap-y-2.5">
          {skills.map(({ label, items }) => (
            <div key={label} className="contents">
              <p className="font-mono text-[10px] tracking-wide text-zinc-400 uppercase pt-0.5">{label}</p>
              <p className="text-[12px] leading-normal text-zinc-600">{items}</p>
            </div>
          ))}
        </div>

        {/* Education */}
        <SectionLabel>04: Education</SectionLabel>
        <EntryHeader
          title="Bachelor of Multimedia"
          subtitle="Griffith University"
          period="2006 – 2009"
          location="Brisbane, AU"
        />

        <p className="font-mono text-[9.5px] tracking-[0.2em] text-zinc-300 uppercase mt-6">
          Generated from gavinjaynes.xyz/resume
        </p>
      </div>
    </div>
  )
}
