export type RoleId = 'frontline' | 'operations' | 'policy' | 'interface';

export interface Role {
  id: RoleId;
  title: string;
  subtitle: string;
  description: string;
  color: string;
}

export interface DecisionOption {
  id: string;
  label: string;
  policyRef?: string;
  description: string;
  subtext: string;
  effects: {
    vp: number;
    ve: number;
    vr: number;
    daysAdded: number;
    outcome?: 'approved' | 'denied' | 'pending';
    backstageNote: string;
    frontstageNote: string;
  };
}

export interface DecisionPoint {
  roleId: RoleId;
  actorName: string;
  actorTitle: string;
  actorYears: number;
  systemPressure: string;
  contextIntro: string;
  conditionalContext?: Record<string, string>;
  framing: string;
  options: DecisionOption[];
}

export interface NarrativeBeat {
  type: 'heading' | 'body' | 'data' | 'aside' | 'divider' | 'pullquote';
  content: string;
  label?: string;
}

export interface Scenario {
  id: string;
  title: string;
  domain: string;
  narrativeBeats: NarrativeBeat[];
  decisions: DecisionPoint[];
}

export interface CascadeEvent {
  roleId: RoleId;
  actorName: string;
  decisionId: string;
  decisionLabel: string;
  backstageNote: string;
  frontstageNote: string;
  vpDelta: number;
  veDelta: number;
  vrDelta: number;
  daysCumulative: number;
}

export interface GameResult {
  decisions: Record<RoleId, string>;
  vpScore: number;
  veScore: number;
  vrScore: number;
  vaScore: number;
  daysElapsed: number;
  approved: boolean | 'pending';
  cascadeEvents: CascadeEvent[];
  outcomeNarrative: string;
  outcomeHeadline: string;
  outcomeType: 'housed-well' | 'housed-barely' | 'denied-appeal' | 'denied-lost';
}
