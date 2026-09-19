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
  location: 'SecSoc Conferences Subcommittee 2026',
  email: 'alexl@unswsecurity.com',
  discord: 'dragonfayre',
  linkedin: 'https://linkedin.com/in/alexanderkangshao',
  github: 'https://github.com/dragonfayre',

  heroIntroLines: ['Hi, I\u2019m', 'Alexander Liu'],

  about:
    'Nice to meet you, my name is Alex! ' +
    'I am currently completing my first year in the Bachelor of Cybersecurity, ' +
    'and I\u2019m on the Conferences Subcommittee for SecSoc 2026 :)',

  experience: [
    {
      role: 'Conferences Subcommittee',
      company: 'Security Society UNSW',
      period: '2026',
      bullets: ['[Placeholder \u2014 what you did or achieved here.]'],
    },
    {
      role: 'Casual Academic \u2013 1511 | 1911',
      company: 'School of Computer Science & Engineering',
      period: '2026',
      bullets: ['[Placeholder \u2014 what you did or achieved here.]'],
    },
    {
      role: 'Co-Founder & Mentor',
      company: 'NBHS Programming Club',
      period: '2024\u20132025',
      bullets: ['[Placeholder \u2014 what you did or achieved here.]'],
    },
    {
      role: 'Student Liaison',
      company: 'NBHS Prefects',
      period: '2024\u20132025',
      bullets: ['[Placeholder \u2014 what you did or achieved here.]'],
    },
  ],

  skills: [
    { category: 'Languages', items: ['[e.g. TypeScript]', '[e.g. Go]', '[e.g. Python]'] },
    { category: 'Tools & platforms', items: ['[e.g. AWS]', '[e.g. Postgres]', '[e.g. Kubernetes]'] },
    { category: 'Focus areas', items: ['[e.g. Distributed systems]', '[e.g. API design]', '[e.g. Performance]'] },
  ],

  contactLine: 'Connect with me & say hi!',

  rolePreferences: [
    {
      role: 'GEDI Officer',
      subtitle: 'Diversity & Inclusion for all (+ being a Discord Mod)',
      body:
        'Basically, I want to keep SecSoc a happy space for everyone :3 ' +
        'errrrr... yeh',
    },
    {
      role: 'Vice President - Externals',
      subtitle: 'Connecting SecSoc with the worlddd (but maybe uni first..)',
      body:
        'Lowkey just want to keep Arc & SecEdu happy so that we can do all the cool ' +
        'shi AHEM i mean stuff. I GOT YALL frrrr',
    },
    {
      role: '[Third Preference Role Name]',
      subtitle: '[Role subtitle or team]',
      body: '[Describe why this role appeals to you, what you would bring, and what you hope to achieve in it.]',
    },
  ],
};