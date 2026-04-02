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
  /**
   * If present, this option is only available when the prior decision
   * for the specified role matches one of the listed option IDs.
   */
  availableWhen?: {
    roleId: RoleId;
    optionIds: string[];
  };
  /**
   * If present, this option is locked when the prior decision for the
   * specified role matches one of the listed option IDs.
   */
  unavailableWhen?: {
    roleId: RoleId;
    optionIds: string[];
    reason: string;
  };
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

/**
 * A declarative outcome rule. Rules are evaluated in order; the first match wins.
 * `requires` maps roleId → allowed optionId values for that role.
 * All specified roles must match; unspecified roles are unconstrained.
 *
 * `narrative` may contain {daysElapsed} and {extraDays} template tokens which the
 * engine substitutes at runtime.
 */
export interface OutcomeRule {
  requires: Partial<Record<RoleId, string[]>>;
  outcomeType: 'housed-well' | 'housed-barely' | 'denied-appeal' | 'denied-lost';
  headline: string;
  narrative: string;
  /**
   * Optional secondary condition evaluated after Va/days are computed.
   * Useful for threshold-based outcomes (e.g. "housed-well only if fast").
   */
  scoreCondition?: {
    maxDaysElapsed?: number;
    minVrScore?: number;
  };
  /**
   * If scoreCondition exists and is not met, fall through to this rule instead.
   */
  fallthrough?: Omit<OutcomeRule, 'fallthrough'>;
}

export interface DebriefReading {
  author: string;
  source: string;
  concept: string;
  connection: string;
}

export interface DebriefFramework {
  name: string;
  text: string;
}

export interface ScenarioDebrief {
  readings: DebriefReading[];
  frameworks: DebriefFramework[];
  discussionQuestions: string[];
}

export interface ScenarioRole {
  roleId: RoleId;
  subtitle: string;
  description: string;
  color: string;
}

export interface Scenario {
  id: string;
  title: string;
  domain: string;
  narrativeBeats: NarrativeBeat[];
  roles: ScenarioRole[];
  decisions: DecisionPoint[];
  outcomeRules: OutcomeRule[];
  debrief: ScenarioDebrief;
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
