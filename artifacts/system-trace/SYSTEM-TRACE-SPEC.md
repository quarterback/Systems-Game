# System Trace: Technical Specification for Scenario Authors

## What This Tool Is

System Trace is an interactive service design simulation built for undergraduate Service Design courses. Groups of 4 students play through a scenario where a real person (the "applicant") needs something from a public service system. Each student takes on one bureaucratic role and makes one constrained decision. The four decisions cascade to produce a final outcome, which is then visualized using a value-accounting framework.

The tool is a diagnostic artifact. It is not a quiz, game, or optimization exercise. There is no score to maximize. The point is to trace how small, individually reasonable bureaucratic decisions combine to produce systemic outcomes — and to connect those outcomes to course readings and frameworks.

## How It Works (User Flow)

The app is a frontend-only React state machine with 6 screens, played in order:

1. **Intro Screen** — Title, tagline, metadata (players, scenario, duration). One button: "Begin the Simulation."

2. **Role Assignment** — Shows 4 role cards. Each student enters their name next to a role. Roles are defined by the scenario (e.g., Frontline Worker, Operations, Policy, Service Interface). Each card shows a short description of what that role controls. Button: "Meet [Applicant Name]."

3. **Narrative Screen** — A scrollable story introducing the applicant. Uses structured "narrative beats" — headings, body paragraphs, data blocks (income, threshold, difference), pull quotes, asides, and dividers. Written in plain, direct language. Button: "Enter the System."

4. **Decision Screen** (repeats 4 times, once per role) — Each role sees:
   - Their character name, title, and years of experience
   - A "System Pressure" card describing the constraints they're under
   - Context about the applicant's case (which may change based on prior decisions via `conditionalContext`)
   - A framing question
   - 2-3 option cards, each with a policy reference, description, and an internal-monologue subtext
   - Some options may be locked based on prior decisions (`unavailableWhen` / `availableWhen` conditions), shown with a "Not available" badge and explanation
   - Button: "Confirm Decision" (or "See What Happened" for the last role)

5. **Cascade Visualization** — Shows what happened:
   - Outcome headline and narrative paragraph (resolved from `outcomeRules`)
   - A timeline of all 4 decisions showing backstage vs. frontstage perspectives for each
   - Animated bar chart of Vp (public value), Ve (externalized burden), Vr (relational trust)
   - Computed Va (total administrative value) = Vp - Ve + Vr
   - Total days elapsed
   - Button: "Debrief"

6. **Debrief Screen** — Connects the simulation to course material:
   - Summary of all 4 decisions
   - Readings section: each reading shows author, source, concept name, and a paragraph explaining how it connects to what just happened
   - Frameworks section: cards naming course frameworks visible in this run
   - Numbered discussion questions for group conversation
   - Buttons: "Run Again" / "Try Different Decisions"

## Architecture

- **Frontend-only**: Pure React + TypeScript + Vite. No backend, no database, no authentication. Each browser session is independent.
- **State machine**: App.tsx manages a `Stage` union type (`intro` → `role-select` → `narrative` → `decision` → `cascade` → `debrief`). The `decision` stage carries a `roleIndex` that increments through the 4 roles.
- **Scenario-driven**: All content lives in a single `Scenario` object. The engine and UI components are generic — they read everything from the scenario data. Adding a new scenario requires zero engine or component changes.

## The Scenario Data Structure

A scenario is a single TypeScript object of type `Scenario`. Here is every field:

```typescript
interface Scenario {
  id: string;                    // unique key, e.g. 'housing-assistance'
  title: string;                 // display name, e.g. 'Emergency Housing Assistance'
  domain: string;                // category label, e.g. 'Housing Services'
  narrativeBeats: NarrativeBeat[];
  roles: ScenarioRole[];
  decisions: DecisionPoint[];
  outcomeRules: OutcomeRule[];
  debrief: ScenarioDebrief;
}
```

### narrativeBeats

An ordered array of content blocks for the narrative screen. Each beat has a `type` and `content`:

- `heading` — Large serif heading text
- `body` — Paragraph text
- `data` — Key-value pair (also needs `label`). All `data` beats are grouped into a single data block visually.
- `pullquote` — Styled blockquote
- `aside` — Contextual note (smaller, muted text)
- `divider` — Horizontal rule separator

### roles

An array of 4 role definitions, in play order:

```typescript
interface ScenarioRole {
  roleId: RoleId;       // 'frontline' | 'operations' | 'policy' | 'interface'
  subtitle: string;     // e.g. 'Frontline Worker'
  description: string;  // 1-2 sentences explaining what this role controls
  color: string;        // hex color for UI theming, e.g. '#c8974a'
}
```

The four `RoleId` values are fixed: `frontline`, `operations`, `policy`, `interface`. These represent layers of a service system, not specific job titles. The scenario gives each role a specific character.

### decisions

An array of 4 `DecisionPoint` objects, one per role, in play order. Each contains:

```typescript
interface DecisionPoint {
  roleId: RoleId;
  actorName: string;            // character name, e.g. 'Rosa Chen'
  actorTitle: string;           // job title, e.g. 'Intake Coordinator'
  actorYears: number;           // years in role
  systemPressure: string;       // 2-3 sentences describing the constraints on this role
  contextIntro: string;         // default context paragraph about the applicant's case
  conditionalContext?: Record<string, string>;  // keyed by prior decision optionId or outcome status
  framing: string;              // the question this role must answer
  options: DecisionOption[];    // 2-3 choices
}
```

**conditionalContext**: If present, replaces `contextIntro` based on what happened earlier. For most roles, the key is the optionId chosen by the previous role (e.g., `'standard'`, `'expedited'`, `'hold'`). For the `interface` role specifically, the key is the outcome status: `'approved'`, `'denied'`, or `'pending'`.

Each `DecisionOption`:

```typescript
interface DecisionOption {
  id: string;                   // unique within this decision, e.g. 'standard'
  label: string;                // display name, e.g. 'Standard Processing'
  policyRef?: string;           // policy citation, e.g. 'EHA Policy §2.1: Standard Review Queue'
  description: string;          // 1-2 sentences explaining what this choice does
  subtext: string;              // internal monologue — what the worker is thinking (in quotes)
  availableWhen?: { roleId: RoleId; optionIds: string[] };
  unavailableWhen?: { roleId: RoleId; optionIds: string[]; reason: string };
  effects: {
    vp: number;                 // public value delta (positive = good)
    ve: number;                 // externalized burden delta (positive = more burden on applicant)
    vr: number;                 // relational trust delta (positive = trust built)
    daysAdded: number;          // days this choice adds to the timeline
    outcome?: 'approved' | 'denied' | 'pending';  // only set on the policy role's options
    backstageNote: string;      // what happened inside the system
    frontstageNote: string;     // what the applicant experienced
  };
}
```

**Option gating**: 
- `unavailableWhen`: This option is locked if the specified role chose one of the listed optionIds. Include a `reason` explaining why.
- `availableWhen`: This option is only available if the specified role chose one of the listed optionIds. If the condition is not met, the UI shows "Not applicable given the current case state."

**Effects scoring guidelines**:
- `vp` (public value): ranges roughly -3 to +3 per decision. Positive means the system delivered value. Negative means it failed to.
- `ve` (externalized burden): ranges roughly 0 to +4 per decision. Higher means more burden shifted onto the applicant. Baseline starts at 1 (the applicant already had to take time off to show up).
- `vr` (relational trust): ranges roughly -3 to +2 per decision. Positive means trust was built. Negative means trust was eroded.
- `daysAdded`: realistic processing times. Total should range from ~6 days (best case) to ~60+ days (worst case).
- `outcome`: only the `policy` role's options set this. It determines the case outcome: approved, denied, or pending (extended review).

### outcomeRules

An ordered array of rules. The engine evaluates them top-to-bottom; the first match wins.

```typescript
interface OutcomeRule {
  requires: Partial<Record<RoleId, string[]>>;  // which optionIds must match
  outcomeType: 'housed-well' | 'housed-barely' | 'denied-appeal' | 'denied-lost';
  headline: string;             // short, punchy (may contain {extraDays}, {daysElapsed})
  narrative: string;            // 3-5 sentences (may contain {extraDays}, {daysElapsed})
  scoreCondition?: {            // optional secondary gate
    maxDaysElapsed?: number;
    minVrScore?: number;
  };
  fallthrough?: OutcomeRule;    // used if scoreCondition fails
}
```

**Template tokens**: `{daysElapsed}` = total days from Day 3. `{extraDays}` = daysElapsed minus 3 (the baseline).

**outcomeType meanings**:
- `housed-well` — Best outcome. Applicant housed quickly with dignity.
- `housed-barely` — Approved but the process was slow/painful. The measure was met but the experience was bad.
- `denied-appeal` — Denied but the applicant has a viable path to fight it.
- `denied-lost` — Denied and the applicant has no realistic recourse.

**scoreCondition + fallthrough**: For outcomes that depend on speed/trust thresholds. Example: "housed-well" only if daysElapsed <= 22 AND vrScore >= 1, otherwise falls through to "housed-barely." This means the same policy decision (approve) can produce different experiential outcomes depending on how the earlier decisions affected the timeline and trust.

**Rule ordering**: Put the most specific rules first (e.g., deny+legalaid before deny+call). Put broad catch-all rules last. The engine stops at the first match.

### debrief

```typescript
interface ScenarioDebrief {
  readings: DebriefReading[];
  frameworks: DebriefFramework[];
  discussionQuestions: string[];
}

interface DebriefReading {
  author: string;       // e.g. 'Michael Lipsky'
  source: string;       // e.g. 'Street-Level Bureaucracy (1980)'
  concept: string;      // e.g. 'Bounded discretion as policy'
  connection: string;   // 2-3 sentences connecting this concept to the simulation
}

interface DebriefFramework {
  name: string;         // e.g. 'Public Mechanics'
  text: string;         // 1-2 sentences explaining how this framework applies
}
```

## How to Add a New Scenario

1. Create a new file in `src/data/scenarios/` (e.g., `benefits.ts`).
2. Export a `Scenario` object following the structure above.
3. Import it in `src/data/scenarios/index.ts` and add it to the `SCENARIOS` map.
4. Optionally change `DEFAULT_SCENARIO_ID`.

No engine or component changes needed. The UI reads everything from the scenario data.

## Design Principles for Writing Scenarios

**Voice**: Direct, plain, no filler. Short sentences. No em-dashes. No contrastive negation ("not X, but Y"). Think Teen Vogue meets policy analysis — culturally aware, structurally literate, accessible.

**The applicant** should be a specific person with a name, age, job, family, and a concrete situation. Include enough detail that students feel the human stakes. The data block (income, threshold, gap) should make the structural tension immediately visible.

**The four roles** should represent different layers of the system: point of contact, information processing, eligibility/policy, and communication/interface. Each role should have real constraints (caseload, supervisor expectations, ambiguous policy language) that make every option feel defensible in isolation.

**Options** should all be "reasonable." There should be no obviously correct answer. Each option should have a real policy basis. The subtext (internal monologue) should show why a real person in that role might choose it.

**Option gating** should reflect procedural logic: if Decision 1 already addressed something, Decision 2 shouldn't be able to re-raise it. The lock reasons should be procedural, not moral.

**Outcome narratives** should describe what happened to the applicant in concrete, human terms. Include what happened to their housing, their job, their kids, their daily life. End with a structural observation (e.g., "the threshold still hasn't been updated").

**Backstage vs. frontstage notes** are critical. Backstage describes what happened inside the system (file queued, letter generated, supervisor responded). Frontstage describes what the applicant experienced (waited, called, was told to come back). The gap between these two is the pedagogical core of the tool.

**The debrief** should connect simulation outcomes to specific course readings and frameworks. Each reading connection should be concrete: "Here is what happened in the simulation. Here is what [Author] says about why."

## Value Framework: Va = Vp - Ve + Vr

- **Vp** (Public Value Delivered): Did the system produce its intended outcome? Clamped to [-10, 10].
- **Ve** (Externalized Burden): How much cost, time, stress, and navigation labor was shifted onto the applicant and their support network? Clamped to [0, 15]. This is subtracted in the Va calculation.
- **Vr** (Relational Trust): Did the applicant's trust in public institutions increase or decrease? Clamped to [-5, 5].
- **Va** (Total Administrative Value): Vp - Ve + Vr. Can be negative. A positive Va means the system created net value. A negative Va means it destroyed value even if it technically "worked."

## Deploying to GitHub Pages

The project builds to static HTML/CSS/JS with no server required. To deploy on GitHub Pages:

1. Copy the `artifacts/system-trace/` directory into its own repo (or use it as the root of a new repo).
2. The `package.json` has no Replit-specific hard dependencies. Replit plugins are in `optionalDependencies` and the vite config only loads them when `REPL_ID` is set, so they're skipped on GitHub Actions.
3. Add a `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 10
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm
      - run: pnpm install --no-optional
      - run: BASE_PATH=/your-repo-name/ pnpm run build
      - uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: dist/public
```

4. Replace `your-repo-name` with the actual GitHub repo name.
5. In GitHub repo settings, set Pages source to the `gh-pages` branch.
6. The app will be live at `https://yourusername.github.io/your-repo-name/`.

If deploying to the root of a custom domain, set `BASE_PATH=/` instead.

## File Structure

```
src/
  App.tsx                         — State machine, screen routing
  data/
    types.ts                      — All TypeScript interfaces
    scenarios/
      index.ts                    — Scenario registry
      housing.ts                  — Housing assistance scenario (example)
  lib/
    gameEngine.ts                 — computeResult(), getRolesFromScenario()
  components/
    IntroScreen.tsx
    RoleAssignment.tsx
    NarrativeScreen.tsx
    DecisionScreen.tsx
    CascadeViz.tsx
    DebriefScreen.tsx
  index.css                       — All styles (dark editorial aesthetic)
```
