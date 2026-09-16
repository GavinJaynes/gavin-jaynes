export type SiteMode = "web3" | "frontend" | "ai"

export function getSiteMode(): SiteMode {
  if (typeof window === "undefined") return "frontend"
  const mode = new URLSearchParams(window.location.search).get("mode")
  if (mode === "web3" || mode === "frontend" || mode === "ai") return mode
  return "frontend"
}
