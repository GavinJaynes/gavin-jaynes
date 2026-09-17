import type { SiteMode } from "@/lib/mode"

export const summaries: Record<SiteMode, string> = {
  web3: "14+ years of production frontend engineering. DeFi native: shipped DeFi protocols with $1M+ revenue, an open-source registry of onchain UI components, commercial AI products, and autonomous trading systems. TypeScript-first.",
  frontend:
    "14+ years of production frontend engineering across enterprise, government, and startup products. Shipped performance-critical, real-time interfaces (including four years deep in DeFi), commercial AI products, and enterprise design systems at scale. TypeScript-first.",
  ai: "Founder and senior product engineer with 14+ years shipping production software, including a commercial AI assistant platform, autonomous agent workflows, and correctness-critical financial systems. Hands-on across TypeScript, React, data, APIs, testing, and infrastructure.",
}

export const experience = [
  {
    company: "ClawOps",
    role: "Founder",
    period: "Feb 2026 – Present",
    location: "Remote",
    intro:
      "Commercial SaaS AI assistant platform. React 19 + Convex monorepo with automated Hetzner VPS provisioning over SSH, Stripe subscriptions, and per-customer OpenRouter API keys with spending caps, checkout to a live personal AI assistant on a dedicated VPS in ~5 minutes, accessible via Telegram and backed by 600+ models.",
    aiIntro:
      "Founded and shipped a commercial AI assistant platform that takes a customer from checkout to a live personal agent on dedicated infrastructure in about five minutes. Own the product, system architecture, data, subscriptions, provisioning, observability, documentation, and production operations.",
    bullets: [
      "Companions platform: installable AI personality layers with domain knowledge, persistent memory, their own data stores, third-party API integrations, and dedicated dashboard UIs, first companion live in alpha",
      "Smart Switching: real-time credit monitoring with automatic model fallback across providers",
      "Built on the open-source OpenClaw foundation; own product docs spanning onboarding, configuration, features, and troubleshooting",
    ],
    aiBullets: [
      "Designed per-customer isolation: dedicated Hetzner VPS, OpenRouter API keys with spending caps, automated provisioning over SSH, and Stripe-backed lifecycle management",
      "Built multi-model Smart Switching with real-time credit monitoring and automatic provider fallback",
      "Companions platform: installable agent personalities with domain knowledge, QMD-indexed persistent memory, dedicated data stores, third-party tools, and dashboard UIs",
    ],
    tech: [
      "React 19",
      "TypeScript",
      "Convex",
      "Vite",
      "Tailwind CSS",
      "shadcn/ui",
      "Stripe",
      "OpenRouter",
    ],
    aiTech: [
      "TypeScript",
      "React 19",
      "Convex",
      "OpenRouter",
      "QMD",
      "Stripe",
      "Hetzner",
      "SSH",
      "Telegram",
    ],
  },
  {
    company: "Brewlabs",
    role: "Co-founder & Lead Engineer",
    period: "2022 – 2025",
    location: "Remote",
    intro:
      "Co-founded and led engineering on a full DeFi product suite, swap, bridge, staking, yield farming, and NFT platform, across Base, Ethereum, BSC, and Arbitrum. $1M+ protocol revenue, community in the thousands. Spun out INDX, an on-chain index protocol: deposit USDC, receive basket exposure to up to 20 tokens via real swaps. No proxies, no synthetics.",
    frontendIntro:
      "Co-founded and led engineering on a full product suite, swap, bridge, staking, yield farming, and an NFT platform, built for real-time data, wallet state, and transaction feedback under sub-second response requirements, deployed across four chains. $1M+ revenue, community in the thousands. Spun out INDX, a novel index protocol in the DeFi space.",
    aiIntro:
      "Co-founded and led engineering across correctness-critical financial products where software controlled real transactions across four blockchains. Shipped a swap, bridge, staking, yield and NFT suite with $1M+ revenue, then spun out INDX, an index protocol executing real asset purchases rather than proxies or synthetics.",
    bullets: [
      "Performance-critical interfaces: real-time on-chain data, wallet state, and transaction feedback demanding sub-second responsiveness",
      "Supabase Edge Functions computed and periodically refreshed complex on-chain aggregates for fast, reliable product interfaces",
      "Next.js SSR with mixed rendering strategies balancing performance, SEO, and live chain data",
    ],
    aiBullets: [
      "Owned transaction lifecycles, wallet state, API integrations, failure handling, and real-time feedback where incorrect state could directly affect customer funds",
      "Used Supabase Edge Functions to compute and periodically refresh complex on-chain aggregates through a controlled application data layer",
      "Designed performance-critical interfaces and data flows for sub-second responsiveness across four networks",
    ],
    tech: [
      "Next.js",
      "TypeScript",
      "Supabase",
      "Edge Functions",
      "Wagmi",
      "Viem",
      "The Graph",
      "Moralis",
    ],
    aiTech: [
      "TypeScript",
      "Next.js",
      "Supabase",
      "Edge Functions",
      "REST",
      "The Graph",
      "Wagmi",
      "Viem",
    ],
  },
  {
    company: "Squiz",
    role: "Frontend Engineer → Senior → Quality & Standards Manager, CoE",
    period: "2016 – Aug 2023",
    location: "Brisbane, AU",
    intro:
      "Seven years on enterprise CMS delivery (Squiz Matrix) for government, university, and healthcare clients, progressing into an international leadership role owning the definition and rollout of development standards across Squiz's globally distributed engineering teams.",
    aiIntro:
      "Seven years delivering production software for government, university, and healthcare clients, progressing from frontend engineer to an international Quality & Standards leadership role responsible for how distributed engineering teams built, tested, and shipped software.",
    bullets: [
      "WCAG AAA-compliant interfaces at government scale; performance as a baseline, render paths, asset loading, and CLS on high-traffic properties",
      "Built and maintained test pipelines from unit to E2E (Jest, Vitest, Cypress, Puppeteer) integrated into CI/CD",
      "Led frontend modernisation: component-driven architecture, TypeScript, Vue, React; sprint facilitation and junior mentoring",
      "As Quality & Standards Manager: audited and standardised development processes across international teams",
    ],
    aiBullets: [
      "Built and maintained deterministic test pipelines from unit to E2E with Jest, Vitest, Cypress, and Puppeteer integrated into CI/CD",
      "Audited delivery practices, standardised engineering processes across international teams, and turned recurring regressions into automated checks",
      "Delivered WCAG AAA interfaces for high-traffic government clients; mentored engineers and led frontend modernisation",
    ],
    tech: [],
    aiTech: [
      "TypeScript",
      "JavaScript",
      "Jest",
      "Vitest",
      "Cypress",
      "Puppeteer",
      "Docker",
      "CI/CD",
    ],
  },
]

export const earlier = [
  {
    company: "Logic Spot",
    role: "Developer",
    period: "2013 – 2015",
    location: "London, UK",
    detail:
      "Membership sites and eCommerce platforms for agency clients; client-facing build specifications and small-team coordination.",
  },
  {
    company: "NOUS Group",
    role: "Developer",
    period: "2012 – 2013",
    location: "Brisbane, AU",
    detail:
      "Small and medium website builds; client meetings and discovery workshops.",
  },
]

export const resumeProjects = [
  {
    name: "onchain-ui",
    type: "Open Source",
    period: "2026 – Present",
    url: "onchain-ui.dev",
    intro:
      "Open-source shadcn registry of copy-paste web3 components for teams building onchain interfaces: address display and ENS/Base identity, token logos, prices, balances, network badges, and portfolio asset rows, installed straight into any shadcn app via the shadcn CLI.",
    frontendIntro:
      "Open-source shadcn registry: a component distribution model for teams building modern web interfaces, currently focused on web3 primitives (address display, token logos, prices, balances, network badges), installed straight into any shadcn app via the shadcn CLI, inspectable and editable in the consumer's own codebase.",
    aiIntro:
      "Open-source component registry designed for both developers and coding agents: inspectable TypeScript components, documented integration patterns, live examples, contract tests, and MCP guidance for reliable reuse.",
    bullets: [
      "Registry-first architecture: components land in the consumer's codebase, inspectable, editable, wired to their own data layer",
      "Built Fumadocs docs site with component references, live demos, integration recipes, and MCP guidance",
    ],
    aiBullets: [
      "Registry-first distribution puts inspectable, editable TypeScript directly in the consumer's codebase",
      "Built documentation with live examples, integration recipes, contract tests, and MCP guidance for agent-assisted development",
    ],
    tech: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "shadcn",
      "wagmi",
      "viem",
      "Fumadocs",
    ],
  },
  {
    name: "HyperLiquid Algo Trading System",
    type: "Personal / ClawOps Companion MVP",
    period: "2024 – Present",
    url: null,
    intro:
      "Autonomous trading system for HyperLiquid perpetual futures. Trade via natural language through Telegram, or let it run: every 4 hours it scores RSI, funding rate, and momentum signals alongside a DBRCI breakout scanner, then decides whether to act.",
    aiIntro:
      "Autonomous trading agent for HyperLiquid perpetual futures. Accepts natural-language instructions through Telegram or runs on schedule, combining deterministic market signals with automated decision and execution workflows.",
    bullets: [
      "Full execution layer: configurable leverage, GTC limit orders, fill polling, TP/SL bracket management",
      "Prototype for the ClawOps Trading Companion",
    ],
    aiBullets: [
      "Deterministic execution guardrails: configurable leverage, GTC limit orders, fill polling, and TP/SL bracket management",
      "Scheduled signal pipeline scores RSI, funding, momentum, and DBRCI breakouts before deciding whether to act",
    ],
    tech: ["Python", "HyperLiquid SDK", "Telegram Bot API"],
  },
]

export const skills = [
  { label: "Languages", items: "TypeScript, JavaScript, HTML, CSS" },
  {
    label: "Frontend",
    items:
      "React, Vue, Next.js, Nuxt, Astro, Vite, Tailwind CSS, shadcn/ui, SSR, i18n",
  },
  {
    label: "Design Systems",
    items:
      "Reusable component libraries, design tokens, Tailwind theme architecture",
  },
  {
    label: "Web3",
    items:
      "wagmi, viem, ethers.js, The Graph, Hardhat, smart contract integration",
  },
  {
    label: "Testing",
    items:
      "Jest, Vitest, Cypress, Puppeteer, unit to E2E, integrated into CI/CD",
  },
  {
    label: "Backend & Infra",
    items:
      "Node.js, Supabase, Edge Functions, Convex, WebSockets, Hetzner VPS, Nginx, Netlify, CI/CD",
  },
  {
    label: "AI Engineering",
    items:
      "Claude Code, Cursor, OpenRouter, multi-model routing, Telegram bots",
  },
  {
    label: "Accessibility",
    items: "WCAG AAA across gov, higher-ed, and enterprise at scale",
  },
]

export const aiSkills = [
  {
    label: "AI Systems",
    items:
      "Production AI assistants, OpenRouter, multi-model routing, persistent memory, tool integrations, Telegram bots",
  },
  { label: "Languages", items: "TypeScript, JavaScript, Python, HTML, CSS" },
  {
    label: "Backend & Data",
    items:
      "Node.js, Convex, Supabase, Edge Functions, REST APIs, WebSockets, data modelling",
  },
  {
    label: "Infrastructure",
    items:
      "Hetzner VPS, SSH automation, Docker, Nginx, Netlify, CI/CD, observability",
  },
  {
    label: "Testing",
    items:
      "Jest, Vitest, Cypress, Puppeteer, deterministic regression testing, unit to E2E",
  },
  {
    label: "Agentic Workflow",
    items:
      "Claude Code, Codex, Cursor, AI-assisted design review and peer review",
  },
  {
    label: "Frontend",
    items:
      "React, Next.js, Vite, Tailwind CSS, shadcn/ui, SSR, accessible design systems",
  },
  {
    label: "Reliability",
    items:
      "Transaction lifecycles, controlled data refreshes, provider fallbacks, spending caps, production operations",
  },
]

export function getResumeContent(mode: SiteMode) {
  return {
    contacts: [
      {
        label: "gavin.jaynes@gmail.com",
        href: "mailto:gavin.jaynes@gmail.com",
      },
      {
        label: "gavinjaynes.xyz",
        href:
          mode === "frontend"
            ? "https://gavinjaynes.xyz"
            : `https://gavinjaynes.xyz/${mode}/`,
      },
      { label: "GitHub", href: "https://github.com/GavinJaynes" },
      {
        label: "LinkedIn",
        href: "https://linkedin.com/in/gavin-jaynes-45a0192b",
      },
    ],
    experience: experience.map((job) => ({
      ...job,
      intro:
        mode === "ai" && job.aiIntro
          ? job.aiIntro
          : mode === "frontend" && job.frontendIntro
            ? job.frontendIntro
            : job.intro,
      bullets: mode === "ai" && job.aiBullets ? job.aiBullets : job.bullets,
      tech: mode === "ai" && job.aiTech ? job.aiTech : job.tech,
    })),
    projects: [...resumeProjects]
      .sort((a, b) =>
        mode === "ai"
          ? Number(b.name.startsWith("HyperLiquid")) -
            Number(a.name.startsWith("HyperLiquid"))
          : 0
      )
      .map((project) => ({
        ...project,
        intro:
          mode === "ai" && project.aiIntro
            ? project.aiIntro
            : mode === "frontend" && project.frontendIntro
              ? project.frontendIntro
              : project.intro,
        bullets:
          mode === "ai" && project.aiBullets
            ? project.aiBullets
            : project.bullets,
      })),
    skills: mode === "ai" ? aiSkills : skills,
    profileTitle:
      mode === "ai" ? "Founder / AI Product Engineer" : "Frontend Engineer",
  }
}
