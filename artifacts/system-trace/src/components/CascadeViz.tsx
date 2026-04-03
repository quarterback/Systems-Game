import { useState, useEffect } from 'react';
import type { GameResult, Role, Scenario } from '../data/types';

interface CascadeVizProps {
  result: GameResult;
  roles: Role[];
  playerNames: string[];
  scenario: Scenario;
  onComplete: (result: GameResult) => void;
}

function deltaLabel(n: number, prefix: string) {
  if (n === 0) return null;
  const sign = n > 0 ? '+' : '';
  const cls = n > 0 ? 'positive' : 'negative';
  return (
    <span key={prefix} className={`cascade-delta ${cls}`}>
      {prefix} {sign}{n}
    </span>
  );
}

export function CascadeViz({ result, roles, playerNames, scenario, onComplete }: CascadeVizProps) {
  const [barsVisible, setBarsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setBarsVisible(true), 400);
    return () => clearTimeout(timer);
  }, []);

  const totalDays = result.daysElapsed - 3;

  const vpMax = 10;
  const veMax = 15;
  const vrMax = 10;

  const vpPct = Math.max(0, (result.vpScore / vpMax) * 100);
  const vePct = Math.min(100, (result.veScore / veMax) * 100);
  const vrPct = Math.max(0, ((result.vrScore + 5) / 10) * 100);

  const vaIsPositive = result.vaScore > 0;
  const vaIsNeutral = result.vaScore === 0;

  return (
    <div className="cascade-screen">
      <div className="cascade-header" style={{ maxWidth: 720, margin: '0 auto 64px' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 24 }}>
          Outcome · {scenario.title}
        </div>
        <h2 className={`cascade-headline ${result.outcomeTone}`}>{result.outcomeHeadline}</h2>
        <p className="cascade-outcome-narrative">{result.outcomeNarrative}</p>
      </div>

      <div className="cascade-flow" style={{ maxWidth: 720, margin: '0 auto 80px' }}>
        <div className="cascade-flow-label">Four decisions. One outcome.</div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 32,
          padding: '10px 16px',
          background: 'var(--bg-elevated)',
          borderRadius: 'var(--radius)',
          border: '1px solid var(--border-light)',
          width: 'fit-content',
        }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>Day 3</div>
          <div style={{ width: 1, height: 14, background: 'var(--border)', margin: '0 4px' }} />
          <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{scenario.entryDescription}</div>
        </div>

        <div className="cascade-nodes">
          {result.cascadeEvents.map((event, i) => {
            const role = roles.find((r) => r.id === event.roleId);
            const playerName = playerNames[i];
            const deltas = [
              deltaLabel(event.vpDelta, 'Vp'),
              deltaLabel(-event.veDelta, 'Ve'),
              deltaLabel(event.vrDelta, 'Vr'),
            ].filter(Boolean);

            return (
              <div
                key={event.roleId}
                className="cascade-node"
                style={{ '--role-color': role?.color ?? 'var(--accent-amber)' } as React.CSSProperties}
              >
                <div className="cascade-node-left">
                  <div className="cascade-role-tag" style={{ color: role?.color }}>
                    {role?.subtitle}
                  </div>
                  <div className="cascade-actor">{event.actorName}</div>
                  <div className="cascade-player">{playerName}</div>
                  <div style={{ marginTop: 8, fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)' }}>
                    Day {event.daysCumulative - 3}
                  </div>
                </div>

                <div className="cascade-node-right">
                  <div className="cascade-node-dot" style={{ background: role?.color }} />
                  <div className="cascade-decision-label">"{event.decisionLabel}"</div>

                  <div className="cascade-perspectives">
                    <div className="cascade-perspective">
                      <div className="cascade-perspective-label">Backstage</div>
                      <div className="cascade-perspective-text">{event.backstageNote}</div>
                    </div>
                    <div className="cascade-perspective">
                      <div className="cascade-perspective-label">What {scenario.applicantName} experienced</div>
                      <div className="cascade-perspective-text">{event.frontstageNote}</div>
                    </div>
                  </div>

                  {deltas.length > 0 && (
                    <div className="cascade-deltas">{deltas}</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="va-section" style={{ maxWidth: 720, margin: '0 auto 80px' }}>
        <div className="va-label">Value accounting: Va = Vp + Ve + Vr</div>

        <div className="va-equation">
          <span style={{ color: 'var(--vp-color)' }}>Vp (public value)</span>
          {' + '}
          <span style={{ color: 'var(--ve-color)' }}>Ve (externalities)</span>
          {' + '}
          <span style={{ color: 'var(--vr-color)' }}>Vr (relational trust)</span>
        </div>

        <div className="va-bars">
          <div className="va-bar-row">
            <div className="va-bar-header">
              <span className="va-bar-name vp">Vp: Public value delivered</span>
              <span className="va-bar-value" style={{ color: 'var(--vp-color)' }}>{result.vpScore >= 0 ? '+' : ''}{result.vpScore.toFixed(1)}</span>
            </div>
            <div className="va-bar-track">
              <div className="va-bar-fill vp" style={{ width: barsVisible ? `${vpPct}%` : '0%' }} />
            </div>
          </div>

          <div className="va-bar-row">
            <div className="va-bar-header">
              <span className="va-bar-name ve">Ve: Burden placed on others</span>
              <span className="va-bar-value" style={{ color: 'var(--ve-color)' }}>{result.veScore.toFixed(1)}</span>
            </div>
            <div className="va-bar-track">
              <div className="va-bar-fill ve" style={{ width: barsVisible ? `${vePct}%` : '0%' }} />
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
              Costs shifted to {scenario.applicantName}, their support network, and future public systems
            </div>
          </div>

          <div className="va-bar-row">
            <div className="va-bar-header">
              <span className="va-bar-name vr">Vr: Relational trust</span>
              <span className="va-bar-value" style={{ color: 'var(--vr-color)' }}>{result.vrScore >= 0 ? '+' : ''}{result.vrScore.toFixed(1)}</span>
            </div>
            <div className="va-bar-track">
              <div className="va-bar-fill vr" style={{ width: barsVisible ? `${vrPct}%` : '0%' }} />
            </div>
          </div>
        </div>

        <div className="va-total">
          <span className="va-total-label">Va: Total administrative value</span>
          <span className={`va-total-value ${vaIsPositive ? 'positive' : vaIsNeutral ? 'neutral' : 'negative'}`}>
            {result.vaScore >= 0 ? '+' : ''}{result.vaScore.toFixed(1)}
          </span>
        </div>

        <div className="va-days" style={{ marginTop: 20 }}>
          Total time from application to resolution:{' '}
          <strong>{totalDays} days</strong>
        </div>
      </div>

      <div className="cascade-continue" style={{ maxWidth: 720, margin: '0 auto' }}>
        <button className="btn-primary" onClick={() => onComplete(result)}>
          Debrief
        </button>
      </div>
    </div>
  );
}
