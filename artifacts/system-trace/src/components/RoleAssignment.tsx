import { useState } from 'react';
import type { Role } from '../data/types';

interface RoleAssignmentProps {
  roles: Role[];
  playerNames: string[];
  onComplete: (names: string[]) => void;
}

export function RoleAssignment({ roles, playerNames, onComplete }: RoleAssignmentProps) {
  const [names, setNames] = useState<string[]>(playerNames.map((n) => n || ''));

  const handleChange = (index: number, value: string) => {
    const next = [...names];
    next[index] = value;
    setNames(next);
  };

  const canContinue = names.every((n) => n.trim().length > 0);

  return (
    <div className="role-assignment">
      <div className="page-header">
        <div className="page-eyebrow">Step 1 of 3</div>
        <h2 className="page-title">Assign Your Roles</h2>
        <p className="page-subtitle">
          Each teammate plays one role in the housing system. You each make
          one decision. Then you see what those four choices produce together.
        </p>
      </div>

      <div className="roles-grid">
        {roles.map((role, index) => (
          <div
            key={role.id}
            className="role-card"
            style={{ '--role-color': role.color } as React.CSSProperties}
          >
            <div className="role-number">Player {index + 1}</div>
            <div className="role-subtitle">{role.subtitle}</div>
            <div className="role-title">{role.title}</div>
            <p className="role-description">{role.description}</p>
            <div className="role-player-input">
              <label className="role-player-label">Player name</label>
              <input
                className="role-player-field"
                type="text"
                placeholder="Enter name"
                value={names[index]}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && canContinue) onComplete(names.map((n) => n.trim()));
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="role-assignment-footer">
        <p className="assignment-note">
          You decide separately. The effects combine.
        </p>
        <button
          className="btn-primary"
          onClick={() => onComplete(names.map((n) => n.trim()))}
          disabled={!canContinue}
          style={{ opacity: canContinue ? 1 : 0.4, cursor: canContinue ? 'pointer' : 'not-allowed' }}
        >
          Meet Marcus
        </button>
      </div>
    </div>
  );
}
