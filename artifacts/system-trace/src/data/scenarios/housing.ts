import type { Scenario } from '../types';

export const HOUSING_SCENARIO: Scenario = {
  id: 'housing-assistance',
  title: 'Emergency Housing Assistance',
  domain: 'Housing Services',

  narrativeBeats: [
    {
      type: 'heading',
      content: 'Meet Marcus Williams',
    },
    {
      type: 'body',
      content:
        'Marcus Williams is 34 years old. He has worked for the City Department of Public Works for seven years — fixing broken water mains, clearing storm drains, maintaining the infrastructure that makes the city function. He shows up every day. He has never missed a paycheck.',
    },
    {
      type: 'body',
      content:
        'He has two children: Destiny, who is 11, and Andre, who is 8. He raises them alone. He coaches Andre\'s soccer team on Saturdays.',
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
        'On September 4th, Marcus received a 30-day notice to vacate 2347 Alcott Street. His landlord had sold the building to Citadel Property Group. The building would be converted to market-rate condominiums. Marcus had lived there for six years. His children had grown up there.',
    },
    {
      type: 'pullquote',
      content:
        '"The threshold of $3,650 was set in 2011. It has not been adjusted for inflation or cost of living since."',
    },
    {
      type: 'body',
      content:
        'On September 7th — Day 3 of his 30 — Marcus arranged childcare, took a half-day from work without pay, and walked into the Office of Housing Services at 1650 Mission Street. He brought every document he could find: his government-issued ID, his eviction notice, his pay stub, his expired lease. He did not have a utility bill. Utilities were included in his rent.',
    },
    {
      type: 'aside',
      content:
        'Utilities included in rent is common in older rental stock. It is also common in the neighborhoods of the city where Black and Latino residents are concentrated — the same neighborhoods most affected by displacement.',
    },
    {
      type: 'body',
      content:
        'He stood in line for 40 minutes. Then he reached a window. His case was about to enter the system.',
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
        'None of them will make a decision that feels large. Each of them is operating within real constraints — caseloads, policies, supervisor expectations, systems that don\'t talk to each other. Each of them will do something that seems reasonable.',
    },
    {
      type: 'body',
      content:
        'Watch what happens when four reasonable decisions accumulate.',
    },
  ],

  decisions: [
    {
      roleId: 'frontline',
      actorName: 'Rosa Chen',
      actorTitle: 'Intake Coordinator',
      actorYears: 7,
      systemPressure:
        'Your case management system logs your processing time per file. Last week, your supervisor noted that "incomplete files are creating throughput problems." You have 23 more intakes scheduled today. It is 9:17am.',
      contextIntro:
        'Marcus Williams is at your window. He took a half-day from work. His children are waiting at a neighbor\'s. His building has been sold. He has 27 days left.',
      framing:
        'His documentation is incomplete — no utility bill. Expedited status requires supervisor approval and is reserved for "immediate shelter threat." He has a neighbor\'s couch for now. How do you categorize this intake?',
      options: [
        {
          id: 'standard',
          label: 'Standard Processing',
          policyRef: 'EHA Policy §2.1 — Standard Review Queue',
          description:
            'Log the case as standard intake. Marcus receives a queue number and a 18–21 business day review window.',
          subtext:
            '"Insufficient basis for expedited status. Applicant has temporary housing. Standard processing applies."',
          effects: {
            vp: 0,
            ve: 2,
            vr: -1,
            daysAdded: 21,
            backstageNote:
              'Case enters the standard queue at position 47. Processing will not begin for 21 business days.',
            frontstageNote:
              'Marcus is handed a queue number and a pamphlet. He is told to wait for a letter.',
          },
        },
        {
          id: 'expedited',
          label: 'Flag for Expedited Review',
          policyRef: 'EHA Policy §2.3 — Expedited Status: Children in Household',
          description:
            'Flag the case for priority processing. Requires your supervisor\'s countersignature. Delays your morning queue by approximately 40 minutes.',
          subtext:
            '"Two school-age children. Temporary housing only. This meets the spirit of the expedited criteria."',
          effects: {
            vp: 2,
            ve: 0,
            vr: 1,
            daysAdded: 3,
            backstageNote:
              'Supervisor signs off after 20 minutes. Case assigned to documentation within 3 days.',
            frontstageNote:
              'Marcus is told his case has been flagged for priority review. He leaves cautiously hopeful.',
          },
        },
        {
          id: 'hold',
          label: 'Issue a Deficiency Notice',
          policyRef: 'EHA Policy §3.2 — Documentation Requirements',
          description:
            'Case placed on hold. Marcus is given a checklist of required documents and asked to return when complete.',
          subtext:
            '"If I pass incomplete files they get kicked back anyway. I\'m actually helping him by being clear now."',
          effects: {
            vp: -1,
            ve: 3,
            vr: -2,
            daysAdded: 9,
            backstageNote:
              'Case flagged as "Pending Documentation." No review initiated. Marcus must return.',
            frontstageNote:
              'Marcus asks what a "utility bill in his name" means when utilities were included in his rent. He is told to contact his landlord.',
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
        'You have 40 files to process today. The system auto-rejects files with missing required documents unless you manually override. Section 4.2(b) allows "reasonable substitute documentation at reviewer discretion" — it was added in 2019 and has never been formally interpreted by your office.',
      contextIntro:
        'Marcus\'s file has arrived. His documents include: government-issued ID, eviction notice, pay stub, and an expired lease. Missing: a utility bill in his name.',
      conditionalContext: {
        standard:
          'The file entered the standard queue on Day 3. It sat in the system for 21 business days before reaching you. There is no utility bill on file.',
        expedited:
          'Your supervisor has flagged this as a priority file and asked you to clear it within 48 hours. There is no utility bill on file.',
        hold:
          'Marcus returned on Day 12 with a letter from his former landlord, Mr. Adeyemi, confirming that utilities were included in the rent at 2347 Alcott Street. This letter is now part of the file. He cannot be asked to supply a utility bill again.',
      },
      framing:
        'The documentation gap is real. But so is the policy that allows you to use discretion. How do you handle the missing utility bill?',
      options: [
        {
          id: 'return',
          label: 'Issue a Documentation Return',
          policyRef: 'EHA Policy §3.2(a) — Required Documentation',
          description:
            'Generate a deficiency notice. Marcus has 5 business days to submit a utility bill or approved alternative before the file is closed.',
          subtext:
            '"Policy is policy. I\'m not qualified to determine what counts as a substitute."',
          // If frontline issued a hold and Marcus came back with the landlord letter,
          // issuing another deficiency notice is procedurally blocked — he has already
          // returned with alternative documentation. This option is locked.
          unavailableWhen: {
            roleId: 'frontline',
            optionIds: ['hold'],
            reason:
              'Marcus already returned with a landlord letter confirming utilities-included rent. A second deficiency notice for the same item is procedurally invalid and would be overturned on supervisory review.',
          },
          effects: {
            vp: -1,
            ve: 2,
            vr: -1,
            daysAdded: 7,
            backstageNote:
              'Deficiency notice generated and mailed to 2347 Alcott Street — his former address. Marcus must respond within 5 business days.',
            frontstageNote:
              'Marcus does not receive the letter. He calls the main number four times over 5 days. He finally reaches someone on Day 6 who tells him to come in again.',
          },
        },
        {
          id: 'accept',
          label: 'Accept Alternative Documentation',
          policyRef: 'EHA Policy §4.2(b) — Reasonable Substitute Documentation',
          description:
            'Exercise discretion under §4.2(b). Accept the landlord letter or expired lease as proof of residency. Document your reasoning.',
          subtext:
            '"The landlord letter is exactly what this clause was written for. Utilities-included housing is standard in older rental stock."',
          effects: {
            vp: 1,
            ve: 0,
            vr: 1,
            daysAdded: 1,
            backstageNote:
              'File cleared and forwarded to Eligibility Review. Your reasoning note takes 20 minutes to write.',
            frontstageNote:
              'Marcus receives no communication. His file continues moving through the system without him knowing.',
          },
        },
        {
          id: 'escalate',
          label: 'Escalate for Policy Guidance',
          policyRef: 'EHA Admin §7 — Supervisor Review Protocol',
          description:
            'Flag to your supervisor for a formal policy interpretation before proceeding. Estimated 7–10 business day turnaround.',
          subtext:
            '"I shouldn\'t be making unilateral policy interpretations. This is above my authority."',
          // If Rosa already expedited, the supervisor has already reviewed this case
          // and a second escalation to the same supervisor reads as a stall.
          // We surface this as a locked option with explanation.
          unavailableWhen: {
            roleId: 'frontline',
            optionIds: ['expedited'],
            reason:
              'The supervisor already countersigned this file for expedited review. Escalating back to the same supervisor for a documentation question would be flagged as a delay. Your supervisor\'s countersignature implicitly authorizes discretion.',
          },
          effects: {
            vp: -1,
            ve: 1,
            vr: -1,
            daysAdded: 9,
            backstageNote:
              'File enters the supervisor interpretation queue. Your supervisor\'s response arrives on Day 9: "Use discretion per §4.2(b)." The file returns to you.',
            frontstageNote:
              'Marcus receives no communication for 9 days. He is still in temporary housing. He does not know what is happening.',
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
        'In the last fiscal year, 4 hardship exceptions were granted under the undefined "significant extenuating hardship" clause. All four applicants had legal representation. Your supervisor\'s email from last Tuesday: "Given the audit findings, please document all exception decisions thoroughly and flag for secondary review." Secondary review adds 10–15 business days.',
      contextIntro:
        'Marcus\'s gross monthly income is $3,847. The Emergency Housing Assistance threshold is $3,650 per month. He is $197 over. He has worked for the city for 7 years. He has two dependent children. He was displaced by a developer acquisition.',
      framing:
        'The threshold is real. So is the hardship exception clause. So is the pattern of who gets exceptions. How do you rule?',
      options: [
        {
          id: 'deny',
          label: 'Apply Standard Threshold — Deny',
          policyRef: 'EHA Policy §5.1 — Income Eligibility',
          description:
            'Marcus is over-income by $197/month. Issue a denial. The standard denial letter includes instructions for the 60-day appeal window.',
          subtext:
            '"I cannot create precedent by ignoring the threshold. The rules exist for a reason. He has an appeal right."',
          effects: {
            vp: -3,
            ve: 4,
            vr: -3,
            daysAdded: 1,
            outcome: 'denied',
            backstageNote:
              'Denial letter generated. Case marked closed. Appeal window begins.',
            frontstageNote:
              'Marcus will receive a denial letter — if it reaches him. The letter references the hardship exception in paragraph 11 of an 18-page policy document.',
          },
        },
        {
          id: 'approve',
          label: 'Apply Hardship Exception — Approve',
          policyRef: 'EHA Policy §5.4(c) — Hardship Exception',
          description:
            'Invoke the hardship exception. Document your reasoning thoroughly. Flag for secondary review per supervisor guidance.',
          subtext:
            '"The legislature wrote this clause for exactly this situation. Seven years with the city, two kids, displaced by a developer, $197 over a threshold set in 2011."',
          effects: {
            vp: 3,
            ve: 1,
            vr: 1,
            daysAdded: 13,
            outcome: 'approved',
            backstageNote:
              'Exception documented and submitted. Secondary review takes 12 days. Approval confirmed.',
            frontstageNote:
              'Marcus receives no communication for 12 days. His temporary housing situation becomes uncertain.',
          },
        },
        {
          id: 'verify',
          label: 'Request Income Verification',
          policyRef: 'EHA Policy §5.2 — Income Documentation Standards',
          description:
            'Pause the case. Request 30 days of bank statements and a letter from his employer confirming income before making a ruling.',
          subtext:
            '"I need more information before invoking an exception. Bank statements will clarify his actual financial position."',
          // If the case came in expedited and operations cleared it within 48 hours,
          // an income verification request at Day 4 is extremely difficult to defend —
          // his pay stub already shows verified city employment income.
          unavailableWhen: {
            roleId: 'frontline',
            optionIds: ['expedited'],
            reason:
              'This file was flagged expedited by intake and cleared by documentation within 48 hours. His income source is city employment — his pay stub is already a verified government document. A request for bank statements here would face supervisory challenge as a delay tactic and is not defensible on this file.',
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
              'Marcus receives no communication for several days. When he finally reaches someone, he is told his case is "under review."',
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
        'You have 12 other cases to contact today. The standard letter system is automated and sends notifications to the address of record. Marcus listed 2347 Alcott Street — his former address. He has no new permanent address.',
      contextIntro:
        'Marcus\'s case has been processed. The system has generated an outcome notification.',
      conditionalContext: {
        approved:
          'His application has been approved. A transitional housing unit is available at the Fillmore Transitional Center, with a start date 14 days from today.',
        denied:
          'His application has been denied. He has 60 days to file an appeal. The hardship exception clause he may qualify for is referenced in paragraph 11 of the policy appendix.',
        pending:
          'His case is in extended review. There is no resolution date. His application status is "Under Review."',
      },
      framing:
        'The system will send a notification to the address of record: 2347 Alcott Street. That address belongs to a developer. Marcus no longer lives there. How do you handle communication?',
      options: [
        {
          id: 'letter',
          label: 'Send Standard Notification Letter',
          policyRef: 'EHA Admin §9.1 — Standard Client Communication',
          description:
            'The auto-generated notification letter goes to the address on file. Turnaround is 2 business days.',
          subtext:
            '"Standard procedure. I have 12 other cases. I cannot personally contact every applicant."',
          // If policy denied: sending to wrong address means Marcus never learns
          // he can appeal. The legal aid referral is the only option that preserves
          // his rights — so we lock the standard letter for denied cases.
          unavailableWhen: {
            roleId: 'policy',
            optionIds: ['deny'],
            reason:
              'His address on file is his former address — now managed by a developer\'s building supervisor. Sending a denial letter there means Marcus will not know he was denied or that a 60-day appeal window is running. Procedurally, this is a due-process failure. Your supervisor would not approve this on a denial notice.',
          },
          effects: {
            vp: -1,
            ve: 2,
            vr: -2,
            daysAdded: 2,
            backstageNote:
              'Letter generated and mailed to 2347 Alcott Street. Delivered to Citadel Property Group\'s building manager.',
            frontstageNote:
              'Marcus never receives the letter. He calls the main line 6 times over the next two weeks. He is told to "wait for the letter."',
          },
        },
        {
          id: 'call',
          label: 'Call Marcus Directly',
          policyRef: 'EHA Admin §9.3 — Direct Client Contact (Discretionary)',
          description:
            'Spend 20 minutes with him on the phone. Explain the outcome, next steps, and any appeal or onboarding process.',
          subtext:
            '"His address on file is a building he was evicted from. If I don\'t call, he may never know what happened to his case."',
          effects: {
            vp: 1,
            ve: -1,
            vr: 2,
            daysAdded: 0,
            backstageNote:
              'You reach Marcus on the first call. The conversation takes 23 minutes.',
            frontstageNote:
              'Marcus learns his outcome. He knows what to do next. He says "thank you" three times.',
          },
        },
        {
          id: 'legalaid',
          label: 'Refer to Legal Aid Before Notifying',
          policyRef: 'EHA Admin §9.5 — Legal Aid Referral (Complex Cases)',
          description:
            'Given the complexity of his case, refer Marcus to Legal Aid SF housing unit before sending official notification. Adds 2–3 days.',
          subtext:
            '"He may not understand what the outcome means or what to do next. Legal aid can make sure he actually gets the benefit of whatever the system decided."',
          effects: {
            vp: 1,
            ve: 0,
            vr: 1,
            daysAdded: 2,
            backstageNote:
              'Referral made to Legal Aid SF. Case officer calls Marcus to explain the referral.',
            frontstageNote:
              'Marcus meets with a legal aid attorney who explains his outcome and next steps in plain language.',
          },
        },
      ],
    },
  ],
};
