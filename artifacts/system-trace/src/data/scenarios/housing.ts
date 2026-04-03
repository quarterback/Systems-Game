import type { Scenario } from '../types';

export const HOUSING_SCENARIO: Scenario = {
  id: 'housing-assistance',
  title: 'Emergency Housing Assistance',
  domain: 'Housing Services',
  applicantName: 'Marcus',
  subtitle: 'Four people make four decisions about one person\'s housing. See how small bureaucratic choices accumulate.',
  entryDescription: 'Marcus walks into the Office of Housing Services',

  narrativeBeats: [
    {
      type: 'heading',
      content: 'Meet Marcus Williams',
    },
    {
      type: 'body',
      content:
        'Marcus Williams is 34. He has worked for the City Department of Public Works for seven years, fixing water mains, clearing storm drains, keeping the city\'s infrastructure running. He shows up every day. He has made every paycheck.',
    },
    {
      type: 'body',
      content:
        'He has two kids: Destiny, 11, and Andre, 8. He raises them alone. He coaches Andre\'s soccer team on Saturdays.',
    },
    {
      type: 'divider',
      content: '',
    },
    {
      type: 'data',
      label: 'Monthly income',
      content: '$3,847',
    },
    {
      type: 'data',
      label: 'Emergency Housing Assistance threshold',
      content: '$3,650',
    },
    {
      type: 'data',
      label: 'Difference',
      content: '$197 over',
    },
    {
      type: 'divider',
      content: '',
    },
    {
      type: 'body',
      content:
        'On September 4th, Marcus got a 30-day notice to vacate 2347 Alcott Street. His landlord sold the building to Citadel Property Group. The building is being converted to market-rate condos. Marcus lived there six years. His kids grew up there.',
    },
    {
      type: 'pullquote',
      content:
        '"The threshold of $3,650 was set in 2011. It has remained unchanged since then."',
    },
    {
      type: 'body',
      content:
        'On September 7th, Day 3 of his 30, Marcus arranged childcare, took a half-day without pay, and walked into the Office of Housing Services at 1650 Mission Street. He brought his government ID, eviction notice, pay stub, and expired lease. His rent covered utilities, so he had only his lease as proof of address.',
    },
    {
      type: 'aside',
      content:
        'Utilities-included rent is common in older housing stock, especially in neighborhoods where Black and Latino residents are concentrated. Those are also the neighborhoods most affected by displacement.',
    },
    {
      type: 'body',
      content:
        'He waited in line for 40 minutes. Then he reached a window. His case was about to enter the system.',
    },
    {
      type: 'divider',
      content: '',
    },
    {
      type: 'heading',
      content: 'Four people will handle his case.',
    },
    {
      type: 'body',
      content:
        'Each one is working within real constraints: caseloads, policies, supervisor expectations, and systems that operate independently of each other. Each one will do something that seems reasonable.',
    },
    {
      type: 'body',
      content:
        'Watch what happens when four reasonable decisions stack up.',
    },
  ],

  decisions: [
    {
      roleId: 'frontline',
      actorName: 'Rosa Chen',
      actorTitle: 'Intake Coordinator',
      actorYears: 7,
      systemPressure:
        'Your system logs processing time per file. Your supervisor flagged last week that incomplete files are slowing throughput. You have 23 more intakes today. It\'s 9:17am.',
      contextIntro:
        'Marcus Williams is at your window. He took a half-day from work. His kids are at a neighbor\'s. His building was sold. He has 27 days left.',
      framing:
        'His documentation is incomplete: the utility bill is missing. Expedited status requires supervisor approval and is reserved for immediate shelter threats. He has a neighbor\'s couch for now. How do you categorize this intake?',
      options: [
        {
          id: 'standard',
          label: 'Standard Processing',
          policyRef: 'EHA Policy §2.1: Standard Review Queue',
          description:
            'Log the case as standard intake. Marcus gets a queue number and an 18 to 21 business day review window.',
          subtext:
            '"Standard track. He has temporary housing. Processing begins when the queue reaches his number."',
          effects: {
            vp: 0,
            ve: 2,
            vr: -1,
            daysAdded: 21,
            backstageNote:
              'Case enters the standard queue at position 47. Processing starts in 21 business days.',
            frontstageNote:
              'Marcus gets a queue number and a pamphlet. He\'s told to wait for a letter.',
          },
        },
        {
          id: 'expedited',
          label: 'Flag for Expedited Review',
          policyRef: 'EHA Policy §2.3: Expedited Status, Children in Household',
          description:
            'Flag for priority processing. Requires your supervisor\'s countersignature. Delays your morning queue by about 40 minutes.',
          subtext:
            '"Two school-age kids. Temporary housing only. This fits the expedited criteria."',
          effects: {
            vp: 2,
            ve: 0,
            vr: 1,
            daysAdded: 3,
            backstageNote:
              'Supervisor signs off after 20 minutes. Case assigned to documentation review within 3 days.',
            frontstageNote:
              'Marcus is told his case was flagged for priority. He leaves cautiously hopeful.',
          },
        },
        {
          id: 'hold',
          label: 'Issue a Deficiency Notice',
          policyRef: 'EHA Policy §3.2: Documentation Requirements',
          description:
            'Place the case on hold. Marcus gets a checklist of required documents and is asked to return when complete.',
          subtext:
            '"Incomplete files get kicked back anyway. Better to be clear now."',
          effects: {
            vp: -1,
            ve: 3,
            vr: -2,
            daysAdded: 9,
            backstageNote:
              'Case flagged as Pending Documentation. Review paused. Marcus must return.',
            frontstageNote:
              'Marcus asks what "utility bill in his name" means when his rent covered utilities. He\'s told to contact his landlord.',
          },
        },
      ],
    },

    {
      roleId: 'operations',
      actorName: 'James Torres',
      actorTitle: 'Documentation Specialist',
      actorYears: 3,
      systemPressure:
        'You have 40 files today. The system auto-rejects files with missing documents unless you manually override. Section 4.2(b) allows "reasonable substitute documentation at reviewer discretion." Added in 2019. Your office has left this clause uninterpreted.',
      contextIntro:
        'Marcus\'s file has arrived. It includes: government ID, eviction notice, pay stub, expired lease. Missing: a utility bill in his name.',
      conditionalContext: {
        standard:
          'The file entered the standard queue on Day 3. It sat for 21 business days before reaching you. The utility bill field is empty.',
        expedited:
          'Your supervisor flagged this as priority and asked you to clear it within 48 hours. The utility bill field is empty.',
        hold:
          'Marcus came back on Day 12 with a letter from his former landlord, Mr. Adeyemi, confirming that utilities were included in rent at 2347 Alcott Street. The letter is now in the file.',
      },
      framing:
        'The documentation gap is real. So is the policy that allows discretion. How do you handle the missing utility bill?',
      options: [
        {
          id: 'return',
          label: 'Issue a Documentation Return',
          policyRef: 'EHA Policy §3.2(a): Required Documentation',
          description:
            'Generate a deficiency notice. Marcus has 5 business days to submit a utility bill or approved alternative before the file is closed.',
          subtext:
            '"Policy is policy. Deciding what counts as a substitute is above my role."',
          unavailableWhen: {
            roleId: 'frontline',
            optionIds: ['hold'],
            reason:
              'Marcus already returned with a landlord letter confirming utilities-included rent. A second deficiency notice for the same item is procedurally invalid.',
          },
          effects: {
            vp: -1,
            ve: 2,
            vr: -1,
            daysAdded: 7,
            backstageNote:
              'Deficiency notice mailed to 2347 Alcott Street, his former address. Marcus must respond within 5 business days.',
            frontstageNote:
              'The letter goes to his old address. Marcus calls the main number four times over 5 days. On day six, someone tells him to come in again.',
          },
        },
        {
          id: 'accept',
          label: 'Accept Alternative Documentation',
          policyRef: 'EHA Policy §4.2(b): Reasonable Substitute Documentation',
          description:
            'Use your discretion under §4.2(b). Accept the landlord letter or expired lease as proof of residency. Document your reasoning.',
          subtext:
            '"The landlord letter is exactly what this clause was written for. Utilities-included housing is standard in older rental stock."',
          effects: {
            vp: 1,
            ve: 0,
            vr: 1,
            daysAdded: 1,
            backstageNote:
              'File cleared and forwarded to Eligibility Review. Your reasoning note takes 20 minutes.',
            frontstageNote:
              'Marcus receives silence. His file keeps moving through the system without his knowledge.',
          },
        },
        {
          id: 'escalate',
          label: 'Escalate for Policy Guidance',
          policyRef: 'EHA Admin §7: Supervisor Review Protocol',
          description:
            'Flag the file to your supervisor for a formal policy interpretation. Estimated turnaround: 7 to 10 business days.',
          subtext:
            '"Policy calls at this level belong with my supervisor."',
          unavailableWhen: {
            roleId: 'frontline',
            optionIds: ['expedited'],
            reason:
              'The supervisor already countersigned this file for expedited review. Sending it back for a documentation question would be flagged as a delay.',
          },
          effects: {
            vp: -1,
            ve: 1,
            vr: -1,
            daysAdded: 9,
            backstageNote:
              'File enters the supervisor queue. Response arrives on Day 9: "Use discretion per §4.2(b)." File returns to you.',
            frontstageNote:
              'Marcus hears silence for 9 days. He remains in temporary housing, waiting.',
          },
        },
      ],
    },

    {
      roleId: 'policy',
      actorName: 'Patricia Okonkwo',
      actorTitle: 'Eligibility Officer',
      actorYears: 12,
      systemPressure:
        'Last fiscal year, 4 hardship exceptions were granted under the undefined "significant extenuating hardship" clause. All four applicants had lawyers. Your supervisor\'s email from Tuesday: "Document all exception decisions thoroughly and flag for secondary review." Secondary review adds 10 to 15 business days.',
      contextIntro:
        'Marcus\'s gross monthly income is $3,847. The threshold is $3,650. He\'s $197 over. Seven years with the city. Two kids. Displaced by a developer acquisition.',
      framing:
        'The threshold is clear. The hardship exception clause exists. How do you rule?',
      options: [
        {
          id: 'deny',
          label: 'Apply Standard Threshold: Deny',
          policyRef: 'EHA Policy §5.1: Income Eligibility',
          description:
            'Marcus is $197 over the income limit. Issue a denial. The standard denial letter includes instructions for the 60-day appeal window.',
          subtext:
            '"Ignoring the threshold sets a precedent. He has appeal rights."',
          effects: {
            vp: -3,
            ve: 4,
            vr: -3,
            daysAdded: 1,
            outcome: 'denied',
            backstageNote:
              'Denial letter generated. Case closed. Appeal window begins.',
            frontstageNote:
              'Marcus will get a denial letter, if it reaches him. The letter references the hardship exception in paragraph 11 of an 18-page policy document.',
          },
        },
        {
          id: 'approve',
          label: 'Apply Hardship Exception: Approve',
          policyRef: 'EHA Policy §5.4(c): Hardship Exception',
          description:
            'Invoke the hardship exception. Document your reasoning thoroughly. Flag for secondary review per supervisor guidance.',
          subtext:
            '"This clause was written for exactly this. Seven years with the city, two kids, displaced by a developer, $197 over a threshold set in 2011."',
          effects: {
            vp: 3,
            ve: 1,
            vr: 1,
            daysAdded: 13,
            outcome: 'approved',
            backstageNote:
              'Exception documented and submitted. Secondary review takes 12 days. Approval confirmed.',
            frontstageNote:
              'Marcus hears silence for 12 days. His temporary housing situation grows uncertain.',
          },
        },
        {
          id: 'verify',
          label: 'Request Income Verification',
          policyRef: 'EHA Policy §5.2: Income Documentation Standards',
          description:
            'Pause the case. Request 30 days of bank statements and an employer letter before ruling.',
          subtext:
            '"I need more information before invoking an exception. Bank statements will clarify his actual position."',
          unavailableWhen: {
            roleId: 'frontline',
            optionIds: ['expedited'],
            reason:
              'This file was flagged expedited and cleared within 48 hours. His pay stub is a verified government document. A bank statement request here would be flagged as a delay tactic.',
          },
          effects: {
            vp: -1,
            ve: 2,
            vr: -1,
            daysAdded: 30,
            outcome: 'pending',
            backstageNote:
              'Case paused pending verification. Request letter mailed to 2347 Alcott Street.',
            frontstageNote:
              'Marcus hears silence for days. When he finally reaches someone, he\'s told his case is "under review."',
          },
        },
      ],
    },

    {
      roleId: 'interface',
      actorName: 'Diana Park',
      actorTitle: 'Navigation Counselor',
      actorYears: 5,
      systemPressure:
        'You have 12 other cases to contact today. The letter system is automated and sends notifications to the address of record. Marcus listed 2347 Alcott Street, his former address. He lacks a new permanent address.',
      contextIntro:
        'Marcus\'s case has been processed. The system generated an outcome notification.',
      conditionalContext: {
        approved:
          'His application was approved. A transitional housing unit is available at the Fillmore Transitional Center, with a start date 14 days from today.',
        denied:
          'His application was denied. He has 60 days to file an appeal. The hardship exception clause he may qualify for is in paragraph 11 of the policy appendix.',
        pending:
          'His case is in extended review. The resolution date is open-ended. His status reads "Under Review."',
      },
      framing:
        'The system will send a notification to 2347 Alcott Street. That address belongs to a developer now. Marcus was evicted from there. How do you handle communication?',
      options: [
        {
          id: 'letter',
          label: 'Send Standard Notification Letter',
          policyRef: 'EHA Admin §9.1: Standard Client Communication',
          description:
            'The auto-generated letter goes to the address on file. Turnaround: 2 business days.',
          subtext:
            '"Standard procedure. I have 12 other cases."',
          unavailableWhen: {
            roleId: 'policy',
            optionIds: ['deny'],
            reason:
              'His address on file is his old address, now managed by a developer. Sending a denial there means the letter reaches the developer. Marcus remains unaware of the denial and the running 60-day appeal window. That is a due-process failure.',
          },
          effects: {
            vp: -1,
            ve: 2,
            vr: -2,
            daysAdded: 2,
            backstageNote:
              'Letter mailed to 2347 Alcott Street. Delivered to Citadel Property Group\'s building manager.',
            frontstageNote:
              'The letter goes to his old address. Marcus calls the main line 6 times over two weeks. He\'s told to wait for the letter.',
          },
        },
        {
          id: 'call',
          label: 'Call Marcus Directly',
          policyRef: 'EHA Admin §9.3: Direct Client Contact (Discretionary)',
          description:
            'Spend 20 minutes on the phone with him. Walk him through the outcome, next steps, and any appeal or onboarding process.',
          subtext:
            '"His address on file is the building he was evicted from. A phone call is the only way to reach him."',
          effects: {
            vp: 1,
            ve: -1,
            vr: 2,
            daysAdded: 0,
            backstageNote:
              'You reach Marcus on the first call. Conversation takes 23 minutes.',
            frontstageNote:
              'Marcus learns his outcome. He knows what to do next. He says "thank you" three times.',
          },
        },
        {
          id: 'legalaid',
          label: 'Refer to Legal Aid Before Notifying',
          policyRef: 'EHA Admin §9.5: Legal Aid Referral (Complex Cases)',
          description:
            'Refer Marcus to Legal Aid SF\'s housing unit before sending official notification. Adds 2 to 3 days.',
          subtext:
            '"He may lack the context to understand what the outcome means. Legal aid can make sure he gets the full benefit of whatever the system decided."',
          effects: {
            vp: 1,
            ve: 0,
            vr: 1,
            daysAdded: 2,
            backstageNote:
              'Referral made to Legal Aid SF. A case officer calls Marcus to explain.',
            frontstageNote:
              'Marcus meets with a legal aid attorney who walks him through his outcome and next steps.',
          },
        },
      ],
    },
  ],

  roles: [
    {
      roleId: 'frontline',
      subtitle: 'Frontline Worker',
      description:
        'You\'re the first point of contact. You decide how Marcus enters the system. Your authority covers urgency level only. You set the pace.',
      color: '#c8974a',
    },
    {
      roleId: 'operations',
      subtitle: 'Operations & Coordination',
      description:
        'You manage how information moves through the system. You verify documents, apply standards, and decide what "complete" means in practice. You interpret policy.',
      color: '#4a90a3',
    },
    {
      roleId: 'policy',
      subtitle: 'Policy & Compliance',
      description:
        'You make the eligibility ruling. You interpret the rules and apply them to Marcus\'s case. The threshold is fixed. The exception clause is yours to use.',
      color: '#8a7ab0',
    },
    {
      roleId: 'interface',
      subtitle: 'Service Interface Layer',
      description:
        'You translate the system\'s decision into Marcus\'s actual experience. The outcome is already set. You control whether he learns what it is and what he can do about it.',
      color: '#5a9a6a',
    },
  ],

  outcomeRules: [
    {
      requires: { policy: ['deny'], interface: ['legalaid'] },
      outcomeType: 'denied-appeal',
      outcomeTone: 'mixed',
      headline: 'Denied, and fighting back.',
      narrative:
        'Marcus\'s application was denied. He\'s $197 over a threshold set in 2011 that has remained unchanged. He was referred to Legal Aid SF before the official letter went out. He filed an appeal citing the hardship exception. His case is pending. He\'s been in emergency shelter for six weeks. He has made every shift at work.',
    },
    {
      requires: { policy: ['deny'], interface: ['call'] },
      outcomeType: 'denied-lost',
      outcomeTone: 'negative',
      headline: 'Denied, searching for options.',
      narrative:
        'Marcus\'s application was denied. He\'s $197 over a threshold set in 2011 that has remained unchanged. He was told over the phone. He asked what he could do. He was told he could appeal within 60 days. He was unclear on the process. He\'s in a family shelter on Turk Street with Destiny and Andre. He has made every shift at work.',
    },
    {
      requires: { policy: ['verify'] },
      outcomeType: 'housed-barely',
      outcomeTone: 'mixed',
      headline: 'Marcus is still waiting.',
      narrative:
        'Marcus\'s case has been in extended income verification for {extraDays} days. He submitted bank statements on Day 7. He\'s called the main line 8 times. Every time, he\'s told his case is "under review." His temporary housing fell through. He and his kids are staying with his mother in Oakland. He commutes 2.5 hours each way to keep his job. Destiny transferred schools. Andre quit soccer.',
    },
    {
      requires: { policy: ['approve'] },
      outcomeType: 'housed-well',
      outcomeTone: 'positive',
      headline: 'Housed in {extraDays} days.',
      narrative:
        'Marcus was housed {extraDays} days after walking into 1650 Mission Street. His kids stayed at Alcott Elementary. He kept his job. He kept his mother from worrying. Four people used their discretion generously within the system\'s constraints. The threshold that almost excluded him remains unchanged.',
      scoreCondition: { maxDaysElapsed: 22, minVrScore: 1 },
      fallthrough: {
        requires: { policy: ['approve'] },
        outcomeType: 'housed-barely',
        outcomeTone: 'mixed',
        headline: 'Housed on Day {extraDays}, eventually.',
        narrative:
          'Marcus was housed {extraDays} days after applying. During that time, he stayed with his mother in Oakland, adding 90 minutes each way to his commute. He used all his sick leave. Andre transferred schools mid-semester. He kept his job, barely. The outcome meets the measure. The experience fell short. The threshold that almost excluded him remains unchanged.',
      },
    },
  ],

  debrief: {
    readings: [
      {
        author: 'Michael Lipsky',
        source: 'Street-Level Bureaucracy (1980)',
        concept: 'Bounded discretion as policy',
        connection:
          'Every decision in this simulation was shaped by caseload, supervisor expectations, and vague policy language. Lipsky argues these conditions turn frontline workers into de facto policymakers. They shape outcomes through accumulated small judgments.',
      },
      {
        author: 'Richard Rothstein',
        source: 'The Color of Law (2017)',
        concept: 'Structural bias in neutral-looking systems',
        connection:
          'The $3,650 threshold was set in 2011 and has remained unchanged. The neighborhoods most affected by displacement are where Black and Latino residents are concentrated. The system looks neutral. It reflects decades of explicit decisions.',
      },
      {
        author: 'David Graeber',
        source: 'Utopia of Rules (2015)',
        concept: 'Bureaucratic friction is structural',
        connection:
          'The documentation requirement, the deficiency notice, the vague policy clause: these are the system working as designed. Graeber argues that bureaucratic friction functions as a filter. It hits hardest on people with the least capacity to navigate it.',
      },
      {
        author: 'Lou Downe',
        source: 'Good Services (2020)',
        concept: 'Services exist in the experience',
        connection:
          'What Marcus experienced was fundamentally different from what happened backstage. A service that "works" by its own metrics (file processed, case closed) can still fail the person it was built for.',
      },
      {
        author: 'Jenny L. Davis',
        source: 'How Artifacts Afford (2020)',
        concept: 'What the system makes possible',
        connection:
          'Each decision changed what was possible next, for Marcus and for the workers after him. Section 4.2(b) exists. The hardship exception exists. Whether they are usable depends on conditions the system itself creates.',
      },
      {
        author: 'Deb Chachra',
        source: 'How Infrastructure Works (2023)',
        concept: 'Invisible labor and system maintenance',
        connection:
          'This system requires ongoing human effort: the coordinator who flags a case, the specialist who writes a reasoning note, the counselor who picks up the phone. This labor is absent from the formal record. When it\'s withdrawn, the system fails.',
      },
    ],
    frameworks: [
      {
        name: 'Public Mechanics',
        text: 'This simulation models how services actually work: through routines, coordination across roles, and accumulated small decisions.',
      },
      {
        name: 'Civil Stack',
        text: 'Each decision operated at a different layer: policy (the eligibility threshold), infrastructure (the documentation system), software (the notification letter), and human judgment (the call you made).',
      },
      {
        name: 'Delivery Forensics',
        text: 'The cascade visualization is delivery forensics: using the outcome of a service encounter to trace where the system held and where it broke down.',
      },
      {
        name: 'Trajectory Management',
        text: 'Decision 1 constrained Decision 2. Decision 3 shaped what Decision 4 could accomplish. Small choices redirected the trajectory before any single actor saw the full path.',
      },
    ],
    discussionQuestions: [
      'Which decision had the biggest downstream impact? Could you see it at the time?',
      'What would need to change so that a good outcome is built into the system, rather than depending on individual discretion?',
      'When a decision shifted a burden, where did it land? Who absorbed it?',
      'Rothstein argues that neutral-looking systems can produce unequal outcomes by design. Where do you see that in this scenario?',
      'What was each worker missing? What did they know that Marcus lacked?',
    ],
  },
};
