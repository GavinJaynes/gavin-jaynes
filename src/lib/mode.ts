export type SiteMode = "web3" | "frontend"

export function getSiteMode(): SiteMode {
  if (typeof window === "undefined") return "web3"
  return new URLSearchParams(window.location.search).get("mode") === "frontend" ? "frontend" : "web3"
}
