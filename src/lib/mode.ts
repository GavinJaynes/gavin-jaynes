export type SiteMode = "web3" | "frontend" | "ai"

export function getSiteMode(): SiteMode {
  if (typeof window === "undefined") return "web3"
  const mode = new URLSearchParams(window.location.search).get("mode")
  if (mode === "frontend" || mode === "ai") return mode
  return "web3"
}
