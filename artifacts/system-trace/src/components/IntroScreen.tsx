import type { Scenario } from '../data/types';

interface IntroScreenProps {
  scenario: Scenario;
  scenarioIds: string[];
  scenarioTitles: Record<string, string>;
  onSelectScenario: (id: string) => void;
  onBegin: () => void;
}

export function IntroScreen({ scenario, scenarioIds, scenarioTitles, onSelectScenario, onBegin }: IntroScreenProps) {
  const hasMultiple = scenarioIds.length > 1;

  return (
    <div className="intro-screen">
      <div className="intro-eyebrow">Service Design Simulation · {scenario.domain}</div>
      <h1 className="intro-title">System Trace</h1>
      <p className="intro-subtitle">{scenario.subtitle}</p>
      <p className="intro-anchor">
        "Trace how the system holds together."
      </p>

      {hasMultiple && (
        <div className="scenario-selector" style={{ margin: '32px auto 0', maxWidth: 360 }}>
          <label
            htmlFor="scenario-select"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
              display: 'block',
              marginBottom: 8,
            }}
          >
            Choose a scenario
          </label>
          <select
            id="scenario-select"
            value={scenario.id}
            onChange={(e) => onSelectScenario(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px',
              fontSize: 15,
              fontFamily: 'var(--font-serif)',
              fontWeight: 600,
              background: 'var(--bg-elevated)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              cursor: 'pointer',
              appearance: 'none',
              WebkitAppearance: 'none',
            }}
          >
            {scenarioIds.map((id) => (
              <option key={id} value={id}>
                {scenarioTitles[id]}
              </option>
            ))}
          </select>
        </div>
      )}

      <button className="btn-primary" style={{ marginTop: 32 }} onClick={onBegin}>
        Begin the Simulation
      </button>

      <div style={{ marginTop: 80, display: 'flex', gap: 48, flexWrap: 'wrap', justifyContent: 'center' }}>
        {[
          { label: 'Players', value: '4' },
          { label: 'Scenario', value: scenario.title },
          { label: 'Duration', value: '45 to 60 min' },
        ].map(({ label, value }) => (
          <div key={label} style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: 28, fontWeight: 700, color: 'var(--text-primary)' }}>
              {value}
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)', marginTop: 4 }}>
              {label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
