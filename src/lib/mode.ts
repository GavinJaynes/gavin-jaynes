export type SiteMode = "web3" | "frontend" | "ai"

export const alternateModes = ["web3", "ai"] as const

export function homePath(mode: SiteMode) {
  return mode === "frontend" ? "/" : `/${mode}/`
}

export function resumePath(mode: SiteMode) {
  return mode === "frontend" ? "/resume/" : `/${mode}/resume/`
}
