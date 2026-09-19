/*
  All site copy lives here. Replace the bracketed placeholders with real
  content — nothing else in the codebase needs to change when you do.
*/

export interface ExperienceEntry {
  role: string;
  company: string;
  period: string;
  bullets: string[];
}

export interface SkillGroup {
  category: string;
  items: string[];
}

export interface RolePreference {
  role: string;
  subtitle: string;
  body: string;
}

export interface Content {
  name: string;
  name2: string;
  role: string;
  tagline: string;
  location: string;
  email: string;
  discord: string;
  linkedin: string;
  github: string;
  heroIntroLines: string[];
  about: string;
  experience: ExperienceEntry[];
  skills: SkillGroup[];
  rolePreferences: RolePreference[];
  contactLine: string;
}

export const content: Content = {
  name: 'Alexander Liu',
  name2: 'dragonfayre',
  role: 'Security Society AGM 2026',
  tagline: 'Building [what you build] with [what you\u2019re known for].',
  location: 'SecSoc Conferences Subcomittee 2026',
  email: 'alexl@unswsecurity.com',
  discord: 'dragonfayre',
  linkedin: 'https://linkedin.com/in/alexanderkangshao',
  github: 'https://github.com/dragonfayre',

  heroIntroLines: ['Hi, I\u2019m', '[Full Name]'],

  about:
    'I\u2019m a [role, e.g. \u201cbackend engineer\u201d] focused on [area, e.g. \u201cdistributed systems and developer tooling\u201d]. ' +
    'Over the past [X years], I\u2019ve worked on [one concrete thread, e.g. \u201cpayment infrastructure that processes millions of transactions daily\u201d]. ' +
    'I care most about [a genuine working principle, e.g. \u201csystems that fail predictably and are easy to reason about at 3am\u201d].',

  experience: [
    {
      role: '[Job Title]',
      company: '[Company]',
      period: '[Start]\u2013[End]',
      bullets: [
        '[Quantified outcome, e.g. "Cut checkout latency 40% by redesigning the payment retry path"]',
        '[Scope or ownership, e.g. "Owned the migration of 12 services to a shared event bus"]',
      ],
    },
    {
      role: '[Job Title]',
      company: '[Company]',
      period: '[Start]\u2013[End]',
      bullets: ['[Outcome]', '[Outcome]'],
    },
    {
      role: '[Job Title]',
      company: '[Company]',
      period: '[Start]\u2013[End]',
      bullets: ['[Outcome]'],
    },
  ],

  skills: [
    { category: 'Languages', items: ['[e.g. TypeScript]', '[e.g. Go]', '[e.g. Python]'] },
    { category: 'Tools & platforms', items: ['[e.g. AWS]', '[e.g. Postgres]', '[e.g. Kubernetes]'] },
    { category: 'Focus areas', items: ['[e.g. Distributed systems]', '[e.g. API design]', '[e.g. Performance]'] },
  ],

  contactLine: '[Short line inviting outreach, e.g. "Open to backend and infrastructure roles \u2014 happy to talk."]',

  rolePreferences: [
    {
      role: '[First Preference Role Name]',
      subtitle: '[Role subtitle or team, e.g. "Platform Engineering · Full-time"]',
      body: '[Describe why this role appeals to you, what you would bring, and what you hope to achieve in it.]',
    },
    {
      role: '[Second Preference Role Name]',
      subtitle: '[Role subtitle or team]',
      body: '[Describe why this role appeals to you, what you would bring, and what you hope to achieve in it.]',
    },
    {
      role: '[Third Preference Role Name]',
      subtitle: '[Role subtitle or team]',
      body: '[Describe why this role appeals to you, what you would bring, and what you hope to achieve in it.]',
    },
  ],
};
