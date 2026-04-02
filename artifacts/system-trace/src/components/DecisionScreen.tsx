import { useState } from 'react';
import type { Role, RoleId } from '../data/types';
import { HOUSING_SCENARIO } from '../data/scenario';

interface DecisionScreenProps {
  roleIndex: number;
  roles: Role[];
  playerNames: string[];
  decisions: Record<RoleId, string>;
  onDecide: (roleId: RoleId, optionId: string) => void;
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
  const progress = ((roleIndex) / roles.length) * 100;

  // Get conditional context based on previous decisions
  let contextNote = decisionPoint.contextIntro;
  if (decisionPoint.conditionalContext) {
    const prevRoleId = roleIndex > 0 ? roles[roleIndex - 1].id : null;
    if (prevRoleId && decisions[prevRoleId] && decisionPoint.conditionalContext[decisions[prevRoleId]]) {
      contextNote = decisionPoint.conditionalContext[decisions[prevRoleId]];
    }
    // For interface role, get approved/denied/pending from policy decision
    if (role.id === 'interface' && decisions['policy']) {
      const policyChoice = decisions['policy'];
      const contextKey = policyChoice === 'approve' ? 'approved' : policyChoice === 'deny' ? 'denied' : 'pending';
      if (decisionPoint.conditionalContext[contextKey]) {
        contextNote = decisionPoint.conditionalContext[contextKey];
      }
    }
  }

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
            {decisionPoint.options.map((option) => (
              <button
                key={option.id}
                className={`option-card${selected === option.id ? ' selected' : ''}`}
                style={{ '--role-color': role.color } as React.CSSProperties}
                onClick={() => setSelected(option.id)}
              >
                <div className="option-label">{option.label}</div>
                {option.policyRef && (
                  <div className="option-policy-ref">{option.policyRef}</div>
                )}
                <p className="option-description">{option.description}</p>
                <div className="option-subtext">{option.subtext}</div>
              </button>
            ))}
          </div>

          <div className="decision-action-row">
            <p className="decision-hint">
              Discuss as a team. {playerName} makes the final call.
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
