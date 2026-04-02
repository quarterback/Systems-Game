import type { GameResult, Role } from '../data/types';

interface DebriefScreenProps {
  result: GameResult;
  roles: Role[];
  playerNames: string[];
  onRestart: () => void;
}

const READINGS = [
  {
    source: 'Michael Lipsky\nStreet-Level Bureaucracy (1980)',
    concept: 'Bounded Discretion as Policy',
    connection:
      'Each decision in this simulation was made under constraint: caseload pressure, supervisor expectations, undefined policy clauses. Lipsky argues that these conditions make frontline workers into effective policymakers — not through authority, but through the accumulation of small judgments.',
  },
  {
    source: 'Richard Rothstein\nThe Color of Law (2017)',
    concept: 'Structural Bias in Neutral-Seeming Systems',
    connection:
      'The $3,650 threshold was set in 2011 and has not been adjusted. The neighborhoods most affected by displacement are those where Black and Latino residents are concentrated. The system that produces Marcus\'s case is not neutral — it is the result of explicit decisions made over decades.',
  },
  {
    source: 'David Graeber\nUtopia of Rules (2015)',
    concept: 'Bureaucratic Friction is Structural, Not Accidental',
    connection:
      'The documentation requirement, the deficiency notice, the undefined policy clause — these are not failures of the system. They are the system. Graeber argues that bureaucratic friction often functions as a filter, one that disadvantages those with less capacity to navigate it.',
  },
  {
    source: 'Lou Downe\nGood Services (2020)',
    concept: 'Services Exist in the Experience, Not the Procedure',
    connection:
      'Marcus\'s experience of the system differed fundamentally from what happened backstage. A service that "works" by its own metrics — file processed, case closed — may not work for the person it was designed to serve.',
  },
  {
    source: 'Jenny L. Davis\nHow Artifacts Afford (2020)',
    concept: 'What the System Makes Possible or Impossible',
    connection:
      'Each decision changed what was possible next — not just for Marcus, but for the workers who followed. Section 4.2(b) exists. The hardship exception exists. But whether they are invocable depends on conditions the system itself creates.',
  },
  {
    source: 'Deb Chachra\nHow Infrastructure Works (2023)',
    concept: 'Invisible Labor and System Maintenance',
    connection:
      'The system requires ongoing human effort to function — the intake coordinator who flags a case, the specialist who writes a reasoning note, the counselor who makes a call. This labor is invisible in the formal record. When it is withdrawn, the system fails.',
  },
];

const FRAMEWORKS = [
  {
    name: 'Public Mechanics',
    text: 'The simulation models how services actually function: through routines, coordination across actors, and accumulated small decisions — not through single points of authority.',
  },
  {
    name: 'Civil Stack',
    text: 'Each decision operated at a different layer: policy (eligibility threshold), infrastructure (the documentation system), software (the notification letter), and human judgment (the call you made).',
  },
  {
    name: 'Delivery Forensics',
    text: 'The cascade visualization is a form of delivery forensics — using the breakdown or outcome of a service encounter to trace where the system held and where it didn\'t.',
  },
  {
    name: 'Trajectory Management',
    text: 'Decision 1 constrained Decision 2. Decision 3 determined what Decision 4 could accomplish. Small choices redirected the trajectory before any single actor saw the full path.',
  },
];

export function DebriefScreen({ result, roles, playerNames, onRestart }: DebriefScreenProps) {
  const outcomeColor =
    result.outcomeType === 'housed-well'
      ? 'var(--vp-color)'
      : result.outcomeType === 'denied-lost'
      ? 'var(--ve-color)'
      : 'var(--accent-amber)';

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
            const decisionId = result.decisions[role.id];
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
                  {event?.decisionLabel ?? decisionId}
                </div>
              </div>
            );
          })}
        </div>

        {/* What this means */}
        <div className="debrief-section-label">What the Readings Say About What Just Happened</div>
        <div className="readings-list">
          {READINGS.map((r, i) => (
            <div key={i} className="reading-item">
              <div className="reading-source">
                {r.source.split('\n').map((line, li) => (
                  <span key={li} style={{ display: 'block', fontStyle: li === 0 ? 'normal' : 'italic' }}>
                    {li === 0 ? <strong>{line}</strong> : line}
                  </span>
                ))}
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
          {FRAMEWORKS.map((f) => (
            <div key={f.name} className="framework-card">
              <div className="framework-name">{f.name}</div>
              <p className="framework-text">{f.text}</p>
            </div>
          ))}
        </div>

        {/* Reflection questions */}
        <div className="debrief-section-label">For Discussion</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[
            'Which decision had the most downstream impact? Was that visible at the time it was made?',
            'What would you need to change to make a different outcome structurally reliable — not dependent on individual discretion?',
            'Where did the burden go when a decision shifted it? Who absorbed it?',
            'Rothstein argues that neutral-seeming systems can produce unequal outcomes by design. Where do you see that logic in this scenario?',
            'What information was each worker missing? What information did they have that Marcus did not?',
          ].map((q, i) => (
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
