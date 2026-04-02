interface IntroScreenProps {
  onBegin: () => void;
}

export function IntroScreen({ onBegin }: IntroScreenProps) {
  return (
    <div className="intro-screen">
      <div className="intro-eyebrow">Service Design Simulation · Housing</div>
      <h1 className="intro-title">System Trace</h1>
      <p className="intro-subtitle">
        A public service is not a single decision. It is a sequence of small ones —
        each made by a different person, under different pressure, with different information.
      </p>
      <p className="intro-anchor">
        "You are not fixing the system. You are tracing how it holds together."
      </p>
      <button className="btn-primary" onClick={onBegin}>
        Begin the Simulation
      </button>

      <div style={{ marginTop: 80, display: 'flex', gap: 48, flexWrap: 'wrap', justifyContent: 'center' }}>
        {[
          { label: 'Players', value: '4' },
          { label: 'Scenario', value: 'Housing Assistance' },
          { label: 'Duration', value: '45–60 min' },
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
