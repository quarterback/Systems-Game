import type { GameResult, CascadeEvent, RoleId, Role, Scenario } from '../data/types';

/**
 * Compute the full game result from a set of player decisions.
 * The engine derives role order from scenario.decisions — no hardcoded ordering.
 */
export function computeResult(
  decisions: Record<RoleId, string>,
  scenario: Scenario
): GameResult {
  let vpScore = 0;
  let veScore = 1; // Marcus's baseline burden: took half-day off, arranged childcare
  let vrScore = 0;
  let daysElapsed = 3; // Day 3 when he first walked in

  const cascadeEvents: CascadeEvent[] = [];

  // Role order derived from scenario.decisions, not hardcoded
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

  const vaScore = vpScore - veScore + vrScore;

  const policyDecision = decisions['policy'];
  const interfaceDecision = decisions['interface'];

  let outcomeType: GameResult['outcomeType'];
  let outcomeHeadline: string;
  let outcomeNarrative: string;

  if (policyDecision === 'deny') {
    if (interfaceDecision === 'legalaid') {
      outcomeType = 'denied-appeal';
      outcomeHeadline = 'Denied. Fighting back.';
      outcomeNarrative = `Marcus's application was denied. He is $197 over a threshold that was set in 2011 and has not been adjusted since. But he was referred to Legal Aid SF before the official letter went out. He has filed an appeal citing the hardship exception clause. His case is pending. He has been in emergency shelter for six weeks. He has not missed a day of work.`;
    } else {
      outcomeType = 'denied-lost';
      outcomeHeadline = 'Denied. Never knew why.';
      const letterNote =
        interfaceDecision === 'letter'
          ? ' His denial letter was sent to 2347 Alcott Street — his former address, now managed by Citadel Property Group\'s building supervisor. He never received it. His appeal window expired 60 days later.'
          : ' He was informed of the denial by phone. He asked what he could do. He was told he could appeal within 60 days. He did not know how.';
      outcomeNarrative = `Marcus's application was denied. He is $197 over a threshold that was set in 2011 and has not been adjusted for inflation or cost of living since.${letterNote} He is currently in a family shelter on Turk Street with Destiny and Andre. He has not missed a day of work.`;
    }
  } else if (policyDecision === 'verify') {
    outcomeType = 'housed-barely';
    outcomeHeadline = 'Still waiting.';
    outcomeNarrative = `Marcus's case has been in extended income verification for ${daysElapsed - 3} days. He submitted his bank statements on Day 7. He has called the main line 8 times. He is told his case is "under review." His temporary housing arrangement ended ${Math.max(0, daysElapsed - 30)} days ago. He and his children are staying with his mother in Oakland. He now commutes 2.5 hours each way to maintain his job. Destiny was transferred to a new school. Andre stopped playing soccer.`;
  } else if (policyDecision === 'approve') {
    if (daysElapsed <= 22 && vrScore >= 1) {
      outcomeType = 'housed-well';
      outcomeHeadline = `Housed in ${daysElapsed - 3} days.`;
      outcomeNarrative = `Marcus was housed ${daysElapsed - 3} days after he walked into 1650 Mission Street. His children stayed enrolled at Alcott Elementary. He retained his job. He kept his mother from worrying. The system worked — not because it was designed to work for Marcus, but because four people chose to use their discretion generously within its constraints. The threshold that nearly excluded him has still not been updated.`;
    } else {
      outcomeType = 'housed-barely';
      outcomeHeadline = `Housed. Eventually. Day ${daysElapsed - 3}.`;
      outcomeNarrative = `Marcus was housed ${daysElapsed - 3} days after he applied. During that period, he stayed with his mother in Oakland — adding 90 minutes each way to his commute. He used all of his sick leave. His son Andre was transferred to a different school mid-semester. He kept his job, barely. The outcome meets the measure. The experience did not. The threshold that nearly excluded him has still not been updated.`;
    }
  } else {
    outcomeType = 'housed-barely';
    outcomeHeadline = 'Outcome unclear.';
    outcomeNarrative = 'The system processed Marcus\'s case. The outcome is uncertain.';
  }

  return {
    decisions,
    vpScore: Math.max(-10, Math.min(10, vpScore)),
    veScore: Math.max(0, Math.min(15, veScore)),
    vrScore: Math.max(-5, Math.min(5, vrScore)),
    vaScore,
    daysElapsed,
    approved: policyDecision === 'approve' ? true : policyDecision === 'deny' ? false : 'pending',
    cascadeEvents,
    outcomeNarrative,
    outcomeHeadline,
    outcomeType,
  };
}

/**
 * Derive the role list from scenario decisions — no hardcoded role order.
 */
export function getRolesFromScenario(scenario: Scenario): Role[] {
  const colorMap: Record<string, string> = {
    frontline: '#c8974a',
    operations: '#4a90a3',
    policy: '#8a7ab0',
    interface: '#5a9a6a',
  };
  const subtitleMap: Record<string, string> = {
    frontline: 'Frontline Worker',
    operations: 'Operations & Coordination',
    policy: 'Policy & Compliance',
    interface: 'Service Interface Layer',
  };
  const descriptionMap: Record<string, string> = {
    frontline:
      'You are the first point of contact. You decide how Marcus enters the system — or whether he does at all. Your authority is bounded: you cannot change policy, waive requirements, or allocate housing. You can determine urgency.',
    operations:
      'You manage the flow of information through the system. You verify documents, apply policy standards, and decide what "complete" means in practice. You cannot write policy. You can interpret it.',
    policy:
      'You make the eligibility ruling. You interpret the rules and apply them to Marcus\'s case. You cannot change the threshold. You can exercise the exception that exists — if you choose to.',
    interface:
      'You translate the system\'s decision into Marcus\'s lived experience. You cannot change the outcome. You can determine whether he learns what it is — and what, if anything, he can do.',
  };

  return scenario.decisions.map((dp) => ({
    id: dp.roleId,
    title: dp.actorTitle,
    subtitle: subtitleMap[dp.roleId] ?? dp.roleId,
    description: descriptionMap[dp.roleId] ?? '',
    color: colorMap[dp.roleId] ?? '#888',
  }));
}
