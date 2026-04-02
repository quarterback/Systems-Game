import type { Scenario } from '../types';
import { HOUSING_SCENARIO } from './housing';

/**
 * Registry of all available scenarios.
 * To add a new scenario: import it here and add it to the SCENARIOS map.
 * The engine and UI derive role order from scenario.decisions — no engine edits needed.
 */
export const SCENARIOS: Record<string, Scenario> = {
  'housing-assistance': HOUSING_SCENARIO,
};

export { HOUSING_SCENARIO };

export const DEFAULT_SCENARIO_ID = 'housing-assistance';
