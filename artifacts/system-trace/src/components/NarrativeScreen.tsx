import { HOUSING_SCENARIO } from '../data/scenario';

interface NarrativeScreenProps {
  onComplete: () => void;
}

export function NarrativeScreen({ onComplete }: NarrativeScreenProps) {
  const { narrativeBeats } = HOUSING_SCENARIO;

  const dataBeats = narrativeBeats.filter((b) => b.type === 'data');

  // Group data beats together
  let renderedDataBlock = false;

  return (
    <div className="narrative-screen">
      <div className="narrative-content">
        <div className="narrative-eyebrow">Scenario · Emergency Housing Assistance</div>

        {narrativeBeats.map((beat, i) => {
          if (beat.type === 'data') {
            if (renderedDataBlock) return null;
            renderedDataBlock = true;
            return (
              <div key={i} className="narrative-data-block">
                {dataBeats.map((db, di) => (
                  <div key={di} className="narrative-data-item">
                    <span className="narrative-data-label">{db.label}</span>
                    <span className={`narrative-data-value${db.content.includes('over') ? ' over' : ''}`}>
                      {db.content}
                    </span>
                  </div>
                ))}
              </div>
            );
          }

          if (beat.type === 'heading') {
            return (
              <h2 key={i} className="narrative-heading">
                {beat.content}
              </h2>
            );
          }

          if (beat.type === 'body') {
            return (
              <p key={i} className="narrative-body">
                {beat.content}
              </p>
            );
          }

          if (beat.type === 'pullquote') {
            return (
              <div key={i} className="narrative-pullquote">
                <p>{beat.content}</p>
              </div>
            );
          }

          if (beat.type === 'aside') {
            return (
              <div key={i} className="narrative-aside">
                {beat.content}
              </div>
            );
          }

          if (beat.type === 'divider') {
            return <hr key={i} className="narrative-divider" />;
          }

          return null;
        })}

        <div className="narrative-footer">
          <button className="btn-primary" onClick={onComplete}>
            Enter the System
          </button>
        </div>
      </div>
    </div>
  );
}
