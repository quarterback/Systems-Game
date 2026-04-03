import type { GameResult, CascadeEvent, RoleId, Role, Scenario, OutcomeRule, OutcomeTone } from '../data/types';

/**
 * Substitute template tokens in a string.
 *   {daysElapsed}  → total days including baseline
 *   {extraDays}    → days elapsed minus the baseline start (3)
 */
function applyTemplate(text: string, daysElapsed: number): string {
  const extraDays = daysElapsed - 3;
  return text
    .replace(/\{daysElapsed\}/g, String(daysElapsed))
    .replace(/\{extraDays\}/g, String(extraDays));
}

/**
 * Check whether all `requires` conditions in a rule match the given decisions.
 */
function matchesRule(
  rule: Pick<OutcomeRule, 'requires'>,
  decisions: Record<RoleId, string>
): boolean {
  for (const [roleId, allowedIds] of Object.entries(rule.requires) as [RoleId, string[]][]) {
    if (!allowedIds.includes(decisions[roleId])) return false;
  }
  return true;
}

/**
 * Compute the full game result from a set of player decisions.
 * Role order and outcome logic are fully derived from the Scenario data.
 */
export function computeResult(
  decisions: Record<RoleId, string>,
  scenario: Scenario
): GameResult {
  let vpScore = 0;
  let veScore = 1; // Baseline burden: applicant arranged childcare, took half-day off
  let vrScore = 0;
  let daysElapsed = 3; // Day 3 when applicant first walked in

  const cascadeEvents: CascadeEvent[] = [];

  // Role order derived from scenario.decisions
  for (const decisionPoint of scenario.decisions) {
    const roleId = decisionPoint.roleId;
    const chosenId = decisions[roleId];
    const chosenOption = decisionPoint.options.find((o) => o.id === chosenId);
    if (!chosenOption) continue;

    const { effects } = chosenOption;
    vpScore += effects.vp;
    veScore += effects.ve;
    vrScore += effects.vr;
    daysElapsed += effects.daysAdded;

    cascadeEvents.push({
      roleId,
      actorName: decisionPoint.actorName,
      decisionId: chosenId,
      decisionLabel: chosenOption.label,
      backstageNote: effects.backstageNote,
      frontstageNote: effects.frontstageNote,
      vpDelta: effects.vp,
      veDelta: effects.ve,
      vrDelta: effects.vr,
      daysCumulative: daysElapsed,
    });
  }

  // Clamp component scores before computing Va so displayed values always sum correctly
  const clampedVp = Math.max(-10, Math.min(10, vpScore));
  const clampedVe = Math.max(0, Math.min(15, veScore));
  const clampedVr = Math.max(-5, Math.min(5, vrScore));
  const vaScore = clampedVp - clampedVe + clampedVr;

  // Resolve outcome type, headline, and narrative from scenario.outcomeRules
  let outcomeType = 'unresolved';
  let outcomeTone: OutcomeTone = 'mixed';
  let outcomeHeadline = 'Outcome unclear.';
  let outcomeNarrative = 'The system processed the case. The outcome is uncertain.';

  for (const rule of scenario.outcomeRules) {
    if (!matchesRule(rule, decisions)) continue;

    // Check optional score conditions
    if (rule.scoreCondition) {
      const { maxDaysElapsed, minVrScore } = rule.scoreCondition;
      const conditionMet =
        (maxDaysElapsed === undefined || daysElapsed <= maxDaysElapsed) &&
        (minVrScore === undefined || vrScore >= minVrScore);

      if (!conditionMet && rule.fallthrough) {
        // Use the fallthrough rule
        outcomeType = rule.fallthrough.outcomeType;
        outcomeTone = rule.fallthrough.outcomeTone;
        outcomeHeadline = applyTemplate(rule.fallthrough.headline, daysElapsed);
        outcomeNarrative = applyTemplate(rule.fallthrough.narrative, daysElapsed);
        break;
      }
    }

    outcomeType = rule.outcomeType;
    outcomeTone = rule.outcomeTone;
    outcomeHeadline = applyTemplate(rule.headline, daysElapsed);
    outcomeNarrative = applyTemplate(rule.narrative, daysElapsed);
    break;
  }

  // Determine approval status from the option that set effects.outcome
  let approved: boolean | 'pending' = false;
  for (const dp of scenario.decisions) {
    const option = dp.options.find((o) => o.id === decisions[dp.roleId] && o.effects.outcome);
    if (option) {
      const status = option.effects.outcome!;
      approved = status === 'approved' ? true : status === 'denied' ? false : 'pending';
    }
  }

  return {
    decisions,
    vpScore: clampedVp,
    veScore: clampedVe,
    vrScore: clampedVr,
    vaScore,
    daysElapsed,
    approved,
    cascadeEvents,
    outcomeNarrative,
    outcomeHeadline,
    outcomeType,
    outcomeTone,
  };
}

/**
 * Derive the Role list from scenario.roles, in decisions order.
 * The title is read from the matching DecisionPoint.
 */
export function getRolesFromScenario(scenario: Scenario): Role[] {
  return scenario.roles.map((sr) => {
    const dp = scenario.decisions.find((d) => d.roleId === sr.roleId);
    return {
      id: sr.roleId,
      title: dp?.actorTitle ?? sr.roleId,
      subtitle: sr.subtitle,
      description: sr.description,
      color: sr.color,
    };
  });
}
