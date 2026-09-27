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
  roleshort: string;
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
  tagline: 'bottom text - Mobile Layout is COOKED sorry',
  location: 'SecSoc Conferences Subcommittee 2026',
  email: 'alexl@unswsecurity.com',
  discord: 'dragonfayre',
  linkedin: 'https://linkedin.com/in/alexanderkangshao',
  github: 'https://github.com/dragonfayre',

  heroIntroLines: ['Hi, I\u2019m', 'Alexander Liu'],

  about:
    'Nice to meet you, my name is Alex! ' +
    'I am currently completing my first year in the Bachelor of Cybersecurity, ' +
    'and I\u2019m on the Conferences Subcommittee for SecSoc 2026 :) ',

  experience: [
    {
      role: 'Conferences Subcommittee',
      company: 'Security Society UNSW',
      period: '2026',
      bullets: ['I am super proud to have been a part of developing and running our flagship conference SCONES, where I reached out to Academics and Industry Experts for our Panel QA, writing a combination of general and targetted questions to challenge the speakers knowledge and understanding of their fields. In addition to help organise the PECAN+ CTF, I developed and co-mentored the Network Forensics training sessions.'],
    },
    {
      role: 'Casual Academic \u2013 COMP 1511 | 1911',
      company: 'School of Computer Science & Engineering',
      period: '2026 T2-T3',
      bullets: ['In my role, I engage with approximately 25 students per class, assisting with problem solving, delivering course content and marking assignments. \n I have really enjoyed working as a tutor because I love engaging with others to share the joys of programming, and my ABSOLuTE FAVOURITE moment being when I see the lightbulb moment flash across a student\'s face :)'],
    },
    {
      role: 'Co-Founder & Mentor',
      company: 'NBHS Programming Club',
      period: '2024\u20132025',
      bullets: ['My friends & I had a vision to foster a compentitve programming environment at my highschool. The first step was to create a club.. which turned out to be a really long step. We developed a curriculum using popular topics from our EOI, ran weekly lessons to deliver our content (in a style not far from 1511), and held an in-house competition with questions we wrote ourselves (we wouldve liked to do a real one but admin issues -_-  ).'],
    },
    {
      role: 'Prefect - Media & Student Liaison',
      company: 'NBHS Prefects',
      period: '2024\u20132025',
      bullets: ['THERE HAS BEEN A LOT OF READING SO FAR - thanks for reading :) Ill keep this one short: basically I spoke in front of a lot of people to announce things, ask people about what we could do better, organise fundraising events and make advertisements!'],
    },
  ],

  skills: [
    { category: 'Fun Facts', items: ['I can make trumpet noises with my mouth :P', 'I started playing my violin again!', 'I have perfect pitch... yeah I ran out of fun ones sorry'] },
    { category: 'Hobbies', items: ['Composing music :O', 'Playing Ultimate Frisbee (LOOKING FOR TEAM!!!) & Badminton', 'Gaming. we shall leave it at that'] },
    { category: 'Interests', items: ['MUSICCC - despite having to uninstall spotify cuz i ran out of space', 'eating *yummy* food', 'hanging out w friendoss (or meetting new friendos!)'] },
  ],

  contactLine: 'Connect with me & say hi! - ALSO just came back from BSides, committed a cheeky amount of LinkedIning for future potential sponsors and partnerships :P yayyy',

  rolePreferences: [
    {
      role: 'Vice President - Externals',
      roleshort: 'VP Externals',
      subtitle: 'Connecting SecSoc with the worlddd (but maybe uni first..)',
      body:
        'My BIG vision for VPE would be to expand SecSoc in two main ways: 1. (politely) Badgering companies to partner with us for new Workshop, Experience and Careers opportunities. 2. Create more outreach events for Cyber/CSE/Eng/Highschool to make omega big loop of YIPPEE MORE SECSOC!! lwk tho ill keep Arc & SecEdu happy so yall can do the cool shi frr',
    },

    {
      role: 'GEDI Officer',
      roleshort: 'GEDI',
      subtitle: 'Diversity & Inclusion for all (+ ill become a Discord Mod)',
      body:
        'Basically, I want to keep SecSoc a happy space for everyone :3 ' +
        'Overall I think our society is a nice happy family (not cult ahemahem liam ahemahem) and im really glad to be a part of this community. i want to be able to give back by being someone people can trust with their concerns AND creating a holistically accessible environment for everyone to prosper.',
    },
    
    {
      role: 'President',
      roleshort: 'President',
      subtitle: 'hear me out',
      body: 'actually nvm',
    },
  ],
};