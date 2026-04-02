import { useState } from 'react';
import type { RoleId, GameResult, Scenario } from './data/types';
import { SCENARIOS, DEFAULT_SCENARIO_ID } from './data/scenarios/index';
import { computeResult, getRolesFromScenario } from './lib/gameEngine';
import { IntroScreen } from './components/IntroScreen';
import { RoleAssignment } from './components/RoleAssignment';
import { NarrativeScreen } from './components/NarrativeScreen';
import { DecisionScreen } from './components/DecisionScreen';
import { CascadeViz } from './components/CascadeViz';
import { DebriefScreen } from './components/DebriefScreen';

type Stage =
  | { name: 'intro' }
  | { name: 'role-select' }
  | { name: 'narrative' }
  | { name: 'decision'; roleIndex: number }
  | { name: 'cascade'; result: GameResult }
  | { name: 'debrief'; result: GameResult };

export default function App() {
  const [stage, setStage] = useState<Stage>({ name: 'intro' });
  const [playerNames, setPlayerNames] = useState<string[]>(['', '', '', '']);
  const [decisions, setDecisions] = useState<Record<RoleId, string>>(
    {} as Record<RoleId, string>
  );

  // Scenario derived from registry — swap the id to change scenarios
  const scenario: Scenario = SCENARIOS[DEFAULT_SCENARIO_ID];
  const roles = getRolesFromScenario(scenario);

  const handleIntroComplete = () => setStage({ name: 'role-select' });

  const handleRolesComplete = (names: string[]) => {
    setPlayerNames(names);
    setStage({ name: 'narrative' });
  };

  const handleNarrativeComplete = () => {
    setStage({ name: 'decision', roleIndex: 0 });
  };

  const handleDecision = (roleId: RoleId, optionId: string) => {
    const newDecisions = { ...decisions, [roleId]: optionId };
    setDecisions(newDecisions);

    const currentRoleIndex = roles.findIndex((r) => r.id === roleId);
    const nextIndex = currentRoleIndex + 1;

    if (nextIndex >= roles.length) {
      const result = computeResult(newDecisions, scenario);
      setStage({ name: 'cascade', result });
    } else {
      setStage({ name: 'decision', roleIndex: nextIndex });
    }
  };

  const handleCascadeComplete = (result: GameResult) => {
    setStage({ name: 'debrief', result });
  };

  const handleRestart = () => {
    setStage({ name: 'intro' });
    setPlayerNames(['', '', '', '']);
    setDecisions({} as Record<RoleId, string>);
  };

  return (
    <div className="app-root">
      {stage.name === 'intro' && (
        <IntroScreen onBegin={handleIntroComplete} />
      )}
      {stage.name === 'role-select' && (
        <RoleAssignment
          roles={roles}
          playerNames={playerNames}
          onComplete={handleRolesComplete}
        />
      )}
      {stage.name === 'narrative' && (
        <NarrativeScreen scenario={scenario} onComplete={handleNarrativeComplete} />
      )}
      {stage.name === 'decision' && (
        <DecisionScreen
          key={stage.roleIndex}
          roleIndex={stage.roleIndex}
          roles={roles}
          scenario={scenario}
          playerNames={playerNames}
          decisions={decisions}
          onDecide={handleDecision}
        />
      )}
      {stage.name === 'cascade' && (
        <CascadeViz
          result={stage.result}
          roles={roles}
          playerNames={playerNames}
          onComplete={handleCascadeComplete}
        />
      )}
      {stage.name === 'debrief' && (
        <DebriefScreen
          result={stage.result}
          roles={roles}
          playerNames={playerNames}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}
