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

export interface Feature {
  id: string;
  group?: string;
  title: string;
  description: string;
  spec_url?: string;
}

export interface FeatureCategory {
  category: string;
  title: string;
  description: string;
  features: Feature[];
}

export interface Agent {
  id: string;
  name: string;
  vendor: string;
  url: string;
  logo?: string;
  current_version: string;
  features: Record<string, FeatureSupport>;
}
