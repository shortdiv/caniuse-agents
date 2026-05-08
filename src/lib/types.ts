export type SupportLevel =
  | "full"
  | "partial"
  | "beta"
  | "flag"
  | "via-mcp"
  | "via-skill"
  | "via-extension"
  | "no"
  | "unknown"
  | "deprecated";

export interface SinceInfo {
  version: string;
  date: string;
}

export interface FeatureSupport {
  support: SupportLevel;
  since?: SinceInfo;
  notes?: string;
}

export interface AgentFeatureStats {
  notes?: string;
  version_notes?: Record<string, string>;
  stats: Record<string, CaniuseSupportCode>;
}

export interface Feature {
  id: string;
  group?: string;
  title: string;
  description: string;
  spec_url?: string;
  agent_mapping?: Record<string, string>;
  sub_capabilities?: string[];
  docs?: Record<string, string>;
}

export interface FeatureCategory {
  category: string;
  title: string;
  description: string;
  features: Feature[];
}

export interface AgentVersion {
  version: string;
  date: string;
  models?: string[];
}

export interface Agent {
  id: string;
  name: string;
  vendor: string;
  url: string;
  logo?: string;
  versions?: AgentVersion[];
  current_version?: string;
  features: Record<string, FeatureSupport | AgentFeatureStats>;
}

export interface CategorizedFeature extends Feature {
  category: Pick<FeatureCategory, "category" | "title" | "description">;
}

export interface SupportRow {
  agent: Agent;
  support: FeatureSupport;
}

export type CaniuseSupportCode =
  | "y"
  | "a"
  | "n"
  | "u"
  | "p"
  | "d";

export interface CaniuseFeatureStats {
  [agentId: string]: Record<string, CaniuseSupportCode>;
}

export interface CaniuseFeatureData {
  id: string;
  title: string;
  description: string;
  category: string;
  stats: CaniuseFeatureStats;
  versionNotes: Record<string, Record<string, string>>;
}
