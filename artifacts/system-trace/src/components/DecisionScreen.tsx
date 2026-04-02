import { useState } from 'react';
import type { Role, RoleId, DecisionOption } from '../data/types';
import { HOUSING_SCENARIO } from '../data/scenario';

interface DecisionScreenProps {
  roleIndex: number;
  roles: Role[];
  playerNames: string[];
  decisions: Record<RoleId, string>;
  onDecide: (roleId: RoleId, optionId: string) => void;
}

function getOptionAvailability(
  option: DecisionOption,
  decisions: Record<RoleId, string>
): { available: boolean; reason?: string } {
  if (option.unavailableWhen) {
    const priorDecision = decisions[option.unavailableWhen.roleId];
    if (priorDecision && option.unavailableWhen.optionIds.includes(priorDecision)) {
      return { available: false, reason: option.unavailableWhen.reason };
    }
  }
  if (option.availableWhen) {
    const priorDecision = decisions[option.availableWhen.roleId];
    if (!priorDecision || !option.availableWhen.optionIds.includes(priorDecision)) {
      return { available: false, reason: 'Not applicable given the current case state.' };
    }
  }
  return { available: true };
}

export function DecisionScreen({
  roleIndex,
  roles,
  playerNames,
  decisions,
  onDecide,
}: DecisionScreenProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const role = roles[roleIndex];
  const decisionPoint = HOUSING_SCENARIO.decisions.find((d) => d.roleId === role.id);
  if (!decisionPoint) return null;

  const playerName = playerNames[roleIndex] || `Player ${roleIndex + 1}`;
  const progress = (roleIndex / roles.length) * 100;

  // Resolve conditional context based on the prior role's decision
  let contextNote = decisionPoint.contextIntro;
  if (decisionPoint.conditionalContext) {
    if (role.id === 'interface') {
      // Interface context depends on the policy outcome
      const policyChoice = decisions['policy'];
      const contextKey =
        policyChoice === 'approve' ? 'approved' : policyChoice === 'deny' ? 'denied' : 'pending';
      if (decisionPoint.conditionalContext[contextKey]) {
        contextNote = decisionPoint.conditionalContext[contextKey];
      }
    } else {
      // For operations, use the frontline decision key
      const prevRoleId = roleIndex > 0 ? roles[roleIndex - 1].id : null;
      if (prevRoleId && decisions[prevRoleId] && decisionPoint.conditionalContext[decisions[prevRoleId]]) {
        contextNote = decisionPoint.conditionalContext[decisions[prevRoleId]];
      }
    }
  }

  // Annotate options with availability
  const annotatedOptions = decisionPoint.options.map((option) => ({
    option,
    ...getOptionAvailability(option, decisions),
  }));

  const hasSelectableOptions = annotatedOptions.some((o) => o.available);

  const handleConfirm = () => {
    if (selected) onDecide(role.id, selected);
  };

  return (
    <div className="decision-screen">
      <div className="progress-strip">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <div className="decision-layout" style={{ '--role-color': role.color } as React.CSSProperties}>
        {/* Sidebar */}
        <div className="decision-sidebar">
          <div className="decision-role-badge">{role.subtitle}</div>
          <div className="decision-actor-name">{decisionPoint.actorName}</div>
          <div className="decision-actor-title">{decisionPoint.actorTitle} · {decisionPoint.actorYears} years</div>

          <div className="decision-pressure-card">
            <div className="decision-pressure-label">System Pressure</div>
            <p className="decision-pressure-text">{decisionPoint.systemPressure}</p>
          </div>

          <p className="decision-context-text">{contextNote}</p>

          <div className="decision-player-label">Your player</div>
          <div className="decision-player-name">{playerName}</div>
        </div>

        {/* Main decision area */}
        <div className="decision-main">
          <div className="decision-step-indicator">
            Decision {roleIndex + 1} of {roles.length}
          </div>

          <h2 className="decision-framing">{decisionPoint.framing}</h2>

          <div className="options-list">
            {annotatedOptions.map(({ option, available, reason }) => {
              const isSelected = selected === option.id;
              const isLocked = !available;

              return (
                <button
                  key={option.id}
                  className={`option-card${isSelected ? ' selected' : ''}${isLocked ? ' locked' : ''}`}
                  style={
                    {
                      '--role-color': role.color,
                      opacity: isLocked ? 0.48 : 1,
                      cursor: isLocked ? 'not-allowed' : 'pointer',
                    } as React.CSSProperties
                  }
                  onClick={() => !isLocked && setSelected(option.id)}
                  disabled={isLocked}
                >
                  <div className="option-label">
                    {option.label}
                    {isLocked && (
                      <span
                        style={{
                          marginLeft: 10,
                          fontFamily: 'var(--font-mono)',
                          fontSize: 9,
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                          color: 'var(--ve-color)',
                          border: '1px solid var(--ve-color)',
                          padding: '2px 7px',
                          borderRadius: 2,
                          fontWeight: 400,
                          opacity: 0.7,
                        }}
                      >
                        Not available
                      </span>
                    )}
                  </div>
                  {option.policyRef && (
                    <div className="option-policy-ref">{option.policyRef}</div>
                  )}
                  <p className="option-description">{option.description}</p>
                  {isLocked && reason ? (
                    <div
                      className="option-subtext"
                      style={{ borderLeftColor: 'var(--ve-color)', color: 'var(--ve-color)', opacity: 0.75 }}
                    >
                      {reason}
                    </div>
                  ) : (
                    <div className="option-subtext">{option.subtext}</div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="decision-action-row">
            <p className="decision-hint">
              Discuss as a team. {playerName} makes the final call.
              {annotatedOptions.some((o) => !o.available) && (
                <span style={{ display: 'block', marginTop: 6, color: 'var(--text-dim)' }}>
                  Some options are unavailable given earlier decisions in this case.
                </span>
              )}
            </p>
            <button
              className="btn-primary"
              onClick={handleConfirm}
              disabled={!selected}
              style={{
                opacity: selected ? 1 : 0.4,
                cursor: selected ? 'pointer' : 'not-allowed',
                background: role.color,
              }}
            >
              {roleIndex < roles.length - 1 ? 'Confirm Decision' : 'See What Happened'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
