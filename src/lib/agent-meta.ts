// Agent identity: logo path (if available), fallback colour + monogram.
// Shared by the feature table and the homepage cards.
export interface AgentMark {
  color: string;
  short: string;
  logo?: string;
  logoDark?: string;
}

export const agentMeta: Record<string, AgentMark> = {
  "claude-code": {
    color: "#D97757",
    short: "CC",
    logo: "/logos/claudecode.png",
  },
  "codex": { color: "#9CA3AF", short: "CX", logo: "/logos/codex.svg" },
  cursor: { color: "#E6B450", short: "CA", logo: "/logos/cursor_light.svg", logoDark: "/logos/cursor_dark.svg" },
  "cursor-agent": { color: "#E6B450", short: "CA", logo: "/logos/cursor_light.svg", logoDark: "/logos/cursor_dark.svg" },
  copilot: { color: "#6C63FF", short: "CP", logo: "/logos/copilot-light.svg", logoDark: "/logos/copilot-dark.svg" },
  opencode: { color: "#4AA8D8", short: "OC", logo: "/logos/opencode-light.svg", logoDark: "/logos/opencode-dark.svg" },
  devin: { color: "#7B61FF", short: "DV" },
  aider: { color: "#5BB67A", short: "AI" },
};

export function getAgentMark(id: string, name: string) {
  return (
    agentMeta[id] || { color: "#777", short: name.slice(0, 2).toUpperCase() }
  );
}
