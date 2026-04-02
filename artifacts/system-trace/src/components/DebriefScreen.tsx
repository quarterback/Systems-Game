import type { GameResult, Role, Scenario } from '../data/types';

interface DebriefScreenProps {
  result: GameResult;
  roles: Role[];
  playerNames: string[];
  scenario: Scenario;
  onRestart: () => void;
}

export function DebriefScreen({ result, roles, playerNames, scenario, onRestart }: DebriefScreenProps) {
  const { readings, frameworks, discussionQuestions } = scenario.debrief;

  return (
    <div className="debrief-screen">
      <div className="debrief-content">
        <div className="page-eyebrow">Debrief · Diagnostic Artifact</div>

        <p className="debrief-intro">
          This is what your four decisions produced — not a score, not a grade.
          A trace of how the system held together, and where it didn't.
        </p>

        {/* Decision summary */}
        <div className="debrief-section-label">Your Decisions</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1, borderTop: '1px solid var(--border)' }}>
          {roles.map((role, i) => {
            const event = result.cascadeEvents.find((e) => e.roleId === role.id);
            return (
              <div key={role.id} style={{
                display: 'grid',
                gridTemplateColumns: '180px 1fr',
                gap: 24,
                padding: '20px 0',
                borderBottom: '1px solid var(--border-light)',
                alignItems: 'baseline',
              }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: role.color, marginBottom: 4 }}>
                    {role.subtitle}
                  </div>
                  <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{playerNames[i]}</div>
                </div>
                <div style={{ fontSize: 15, color: 'var(--text-primary)', fontFamily: 'var(--font-serif)', fontWeight: 600 }}>
                  {event?.decisionLabel ?? result.decisions[role.id]}
                </div>
              </div>
            );
          })}
        </div>

        {/* Readings */}
        <div className="debrief-section-label">What the Readings Say About What Just Happened</div>
        <div className="readings-list">
          {readings.map((r, i) => (
            <div key={i} className="reading-item">
              <div className="reading-source">
                <strong>{r.author}</strong>
                <span style={{ display: 'block', fontStyle: 'italic', marginTop: 2 }}>{r.source}</span>
              </div>
              <div>
                <span className="reading-concept">{r.concept}</span>
                <span className="reading-connection">{r.connection}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Frameworks */}
        <div className="debrief-section-label">Course Frameworks Visible in This Run</div>
        <div className="frameworks-grid">
          {frameworks.map((f) => (
            <div key={f.name} className="framework-card">
              <div className="framework-name">{f.name}</div>
              <p className="framework-text">{f.text}</p>
            </div>
          ))}
        </div>

        {/* Discussion questions */}
        <div className="debrief-section-label">For Discussion</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {discussionQuestions.map((q, i) => (
            <div key={i} style={{
              display: 'grid',
              gridTemplateColumns: '24px 1fr',
              gap: 16,
              padding: '16px 0',
              borderBottom: '1px solid var(--border-light)',
            }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)', paddingTop: 2 }}>
                {i + 1}.
              </div>
              <div style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{q}</div>
            </div>
          ))}
        </div>

        {/* Anchor + restart */}
        <div className="debrief-anchor">
          <p className="debrief-anchor-text">
            "You are not fixing the system. You are tracing how it holds together."
          </p>

          <div className="debrief-footer">
            <button className="btn-primary" onClick={onRestart}>
              Run Again
            </button>
            <button className="btn-secondary" onClick={onRestart}>
              Try Different Decisions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
