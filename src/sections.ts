import type { Content } from './content';

export interface HeroRefs {
  stage: HTMLElement;
  intro: HTMLElement;
  introLines: HTMLElement[];
  editorial: HTMLElement;
  wipe: HTMLElement;
  wipeBlocks: HTMLElement[];
}

export interface RenderResult {
  track: HTMLElement;
  pages: HTMLElement[];
  hero: HeroRefs;
}

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  text?: string,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

/** Wraps each word of a line in a span so it can be revealed word-by-word. */
function buildDrawnLine(text: string): HTMLElement {
  const line = el('h1', 'hero-intro__line');
  text.split(' ').forEach((word, i, arr) => {
    const inner = el('span', 'hero-intro__line-inner', word + (i < arr.length - 1 ? '\u00A0' : ''));
    line.appendChild(inner);
  });
  return line;
}

/** Wraps content in a card panel matching the hero's shrunk geometry. */
function buildCard(content: HTMLElement): HTMLElement {
  const card = el('div', 'content-card');
  card.appendChild(content);
  return card;
}

/**
 * Builds a pill-tab strip + panel switcher.
 * Used for Experience and Skills.
 */
function buildTabbedSection(
  tabs: Array<{ label: string; panel: HTMLElement }>,
): HTMLElement {
  const wrapper = el('div', 'tabbed');
  const strip = el('div', 'tabbed__strip');
  const panels = el('div', 'tabbed__panels');

  tabs.forEach(({ label, panel }, i) => {
    const btn = el('button', 'tabbed__tab', label);
    btn.type = 'button';
    btn.dataset.index = String(i);
    if (i === 0) btn.classList.add('tabbed__tab--active');
    btn.setAttribute('aria-selected', String(i === 0));
    btn.setAttribute('role', 'tab');
    strip.appendChild(btn);

    panel.classList.add('tabbed__panel');
    panel.dataset.index = String(i);
    if (i !== 0) panel.setAttribute('hidden', '');
    panels.appendChild(panel);
  });

  strip.addEventListener('click', (e) => {
    const target = (e.target as HTMLElement).closest<HTMLButtonElement>('.tabbed__tab');
    if (!target) return;
    const next = Number(target.dataset.index);
    strip.querySelectorAll<HTMLButtonElement>('.tabbed__tab').forEach((b, i) => {
      const active = i === next;
      b.classList.toggle('tabbed__tab--active', active);
      b.setAttribute('aria-selected', String(active));
    });
    panels.querySelectorAll<HTMLElement>('.tabbed__panel').forEach((p, i) => {
      if (i === next) p.removeAttribute('hidden');
      else p.setAttribute('hidden', '');
    });
  });

  wrapper.append(strip, panels);
  return wrapper;
}

// ─── Hero ────────────────────────────────────────────────────────────────────

function buildHero(content: Content): { page: HTMLElement; refs: HeroRefs } {
  const page = el('section', 'page page--hero');
  page.dataset.index = '0';

  const stage = el('div', 'hero-stage');

  // Intro (drawn-in typography)
  const intro = el('div', 'hero-intro');
  const introLines = content.heroIntroLines.map((lineText, i) => {
    const line = buildDrawnLine(lineText);
    if (i === content.heroIntroLines.length - 1) line.classList.add('hero-intro__line--name');
    return line;
  });
  introLines.forEach((l) => intro.appendChild(l));

  // Editorial cover state
  const editorial = el('div', 'hero-editorial');
  const grid = el('div', 'hero-editorial__grid');

  const eyebrow = el('p', 'hero-editorial__eyebrow', content.role);
  const title = el('h2', 'hero-editorial__title', content.name);
  const name2 = el('p', 'hero-editorial__name2', content.name2);
  const tagline = el('p', 'hero-editorial__tagline', content.tagline);

  const meta = el('ul', 'hero-editorial__meta');
  meta.appendChild(el('li', undefined, content.location));

  const metaEmail = el('li');
  const emailLink = el('a', undefined, content.email);
  emailLink.href = `mailto:${content.email}`;
  metaEmail.appendChild(emailLink);
  meta.appendChild(metaEmail);

  const metaSocial = el('li');
  const linkedinLink = el('a', undefined, 'LinkedIn');
  linkedinLink.href = content.linkedin;
  linkedinLink.target = '_blank';
  linkedinLink.rel = 'noreferrer';
  const sep = document.createTextNode(' \u00B7 ');
  const githubLink = el('a', undefined, 'GitHub');
  githubLink.href = content.github;
  githubLink.target = '_blank';
  githubLink.rel = 'noreferrer';
  metaSocial.append(linkedinLink, sep, githubLink);
  meta.appendChild(metaSocial);

  grid.append(eyebrow, title, name2, tagline, meta);
  editorial.appendChild(grid);

  // Wipe transition blocks
  const wipe = el('div', 'hero-wipe');
  const wipeBlocks = [0, 1, 2].map(() => el('span', 'hero-wipe__block'));
  wipeBlocks.forEach((b) => wipe.appendChild(b));

  stage.append(editorial, intro, wipe);
  page.appendChild(stage);

  return { page, refs: { stage, intro, introLines, editorial, wipe, wipeBlocks } };
}

// ─── About ───────────────────────────────────────────────────────────────────

function buildAbout(content: Content): HTMLElement {
  const page = el('section', 'page page--about');
  page.dataset.index = '1';

  const section = el('div', 'section');
  section.appendChild(el('p', 'section__eyebrow', 'About'));
  // Heading is a direct flex child of section — outside the two-col grid
  section.appendChild(el('h2', 'section__heading', 'A little\nbackground'));

  // Two-column layout: left col is intentionally empty (heading already above),
  // right col holds the body. Using a simple flex row keeps them from overlapping.
  const layout = el('div', 'about__layout');
  // Left placeholder keeps visual alignment with the 12-col feel
  layout.appendChild(el('div', 'about__label'));
  layout.appendChild(el('p', 'about__body', content.about));

  section.appendChild(layout);
  page.appendChild(buildCard(section));
  return page;
}

// ─── Experience ──────────────────────────────────────────────────────────────

function buildExperiencePanel(entry: Content['experience'][number]): HTMLElement {
  const panel = el('div');
  const item = el('div', 'experience__item');
  const period = el('div', 'experience__period', entry.period);
  const details = el('div');
  details.appendChild(el('h3', 'experience__role', entry.role));
  details.appendChild(el('p', 'experience__company', entry.company));
  const bullets = el('ul', 'experience__bullets');
  entry.bullets.forEach((b) => bullets.appendChild(el('li', undefined, b)));
  details.appendChild(bullets);
  item.append(period, details);
  panel.appendChild(item);
  return panel;
}

function buildExperience(content: Content): HTMLElement {
  const page = el('section', 'page page--experience');
  page.dataset.index = '2';

  const section = el('div', 'section');
  section.appendChild(el('p', 'section__eyebrow', 'Experience'));
  section.appendChild(el('h2', 'section__heading', 'Where I\u2019ve\nworked'));

  const tabs = content.experience.map((entry) => ({
    label: entry.company || entry.role,
    panel: buildExperiencePanel(entry),
  }));

  section.appendChild(buildTabbedSection(tabs));
  page.appendChild(buildCard(section));
  return page;
}

// ─── Skills ──────────────────────────────────────────────────────────────────

function buildSkillsPanel(group: Content['skills'][number]): HTMLElement {
  const panel = el('div');
  const col = el('div');
  col.appendChild(el('p', 'skills__category-label', group.category));
  const items = el('ul', 'skills__items');
  group.items.forEach((i) => items.appendChild(el('li', undefined, i)));
  col.appendChild(items);
  panel.appendChild(col);
  return panel;
}

function buildSkills(content: Content): HTMLElement {
  const page = el('section', 'page page--skills');
  page.dataset.index = '3';

  const section = el('div', 'section');
  section.appendChild(el('p', 'section__eyebrow', 'Skills'));
  section.appendChild(el('h2', 'section__heading', 'What I\nwork with'));

  const tabs = content.skills.map((group) => ({
    label: group.category,
    panel: buildSkillsPanel(group),
  }));

  section.appendChild(buildTabbedSection(tabs));
  page.appendChild(buildCard(section));
  return page;
}

// ─── Role Preferences ────────────────────────────────────────────────────────

const ORDINALS = [
  'First', 'Second', 'Third', 'Fourth', 'Fifth',
  'Sixth', 'Seventh', 'Eighth', 'Ninth', 'Tenth',
];

function buildRolePreferences(content: Content): HTMLElement {
  const page = el('section', 'page page--role-preferences');
  page.dataset.index = '4';

  const section = el('div', 'section');
  section.appendChild(el('p', 'section__eyebrow', 'Role Preferences'));
  section.appendChild(el('h2', 'section__heading', 'Where I\nwant to go'));

  const layout = el('div', 'role-pref__layout');
  const sidebar = el('div', 'role-pref__sidebar');

  // Carousel: clipping container + sliding track
  const carousel = el('div', 'role-pref__carousel');
  const track = el('div', 'role-pref__carousel-track');
  carousel.appendChild(track);

  let activeIndex = 0;

  function showPanel(next: number): void {
    activeIndex = next;
    // Shift by exact pixel offset — percentage is relative to track height, not panel height
    const h = carousel.clientHeight;
    track.style.transform = `translateY(-${next * h}px)`;
    sidebarItems.forEach((item, j) =>
      item.classList.toggle('role-pref__sidebar-item--active', j === next),
    );
  }

  // Build panels — each fills the carousel height via CSS
  content.rolePreferences.forEach((pref, i) => {
    const panel = el('div', 'role-pref__panel');
    const ordinal = ORDINALS[i] ?? `#${i + 1}`;
    panel.appendChild(el('p', 'role-pref__ordinal', `${ordinal} Preference`));
    panel.appendChild(el('h3', 'role-pref__role', pref.role));
    panel.appendChild(el('p', 'role-pref__subtitle', pref.subtitle));
    panel.appendChild(el('p', 'role-pref__body', pref.body));
    track.appendChild(panel);
  });

  // Build sidebar items
  const sidebarItems = content.rolePreferences.map((pref, i) => {
    const ordinal = ORDINALS[i] ?? `#${i + 1}`;
    const btn = el('button', 'role-pref__sidebar-item');
    btn.type = 'button';
    btn.append(
      el('span', 'role-pref__sidebar-number', String(i + 1)),
      el('span', 'role-pref__sidebar-label', pref.role || `${ordinal} Preference`),
    );
    if (i === 0) btn.classList.add('role-pref__sidebar-item--active');
    btn.addEventListener('click', () => showPanel(i));
    sidebar.appendChild(btn);
    return btn;
  });

  // Size the carousel track panels to match the carousel container height
  // We do this after mount via ResizeObserver
  const ro = new ResizeObserver(() => {
    const h = carousel.clientHeight;
    if (h === 0) return;
    track.querySelectorAll<HTMLElement>('.role-pref__panel').forEach((p) => {
      p.style.height = `${h}px`;
    });
    // Re-apply using px so the offset stays correct after resize
    track.style.transform = `translateY(-${activeIndex * h}px)`;
  });
  ro.observe(carousel);

  layout.append(sidebar, carousel);
  section.appendChild(layout);
  page.appendChild(buildCard(section));
  return page;
}

// ─── Contact ─────────────────────────────────────────────────────────────────

function buildContact(content: Content): HTMLElement {
  const page = el('section', 'page page--contact');
  page.dataset.index = '5';

  const section = el('div', 'section');
  section.appendChild(el('p', 'section__eyebrow', 'Contact'));
  section.appendChild(el('h2', 'section__heading', 'Let\u2019s\ntalk'));
  section.appendChild(el('p', 'contact__intro', content.contactLine));

  const emailLink = el('a', 'contact__email', content.email);
  emailLink.href = `mailto:${content.email}`;
  section.appendChild(emailLink);

  // Social links row: LinkedIn · GitHub · discord: dragonfayre
  const links = el('div', 'contact__links');

  const linkedinLink = el('a', undefined, 'LinkedIn');
  linkedinLink.href = content.linkedin;
  linkedinLink.target = '_blank';
  linkedinLink.rel = 'noreferrer';

  const githubLink = el('a', undefined, 'GitHub');
  githubLink.href = content.github;
  githubLink.target = '_blank';
  githubLink.rel = 'noreferrer';

  // Discord as inline text item (not a link — just a handle)
  const discordItem = el('span', 'contact__discord-inline');
  discordItem.appendChild(el('span', 'contact__discord-label', 'discord:\u00A0'));
  discordItem.appendChild(el('span', 'contact__discord-handle', content.discord));

  links.append(linkedinLink, githubLink, discordItem);
  section.appendChild(links);

  page.appendChild(buildCard(section));
  return page;
}

// ─── App entry ───────────────────────────────────────────────────────────────

export function renderApp(content: Content, mount: HTMLElement): RenderResult {
  const track = el('div', 'pager__track');
  track.id = 'pager-track';

  const { page: heroPage, refs: heroRefs } = buildHero(content);
  const pages = [
    heroPage,
    buildAbout(content),
    buildExperience(content),
    buildSkills(content),
    buildRolePreferences(content),
    buildContact(content),
  ];
  pages.forEach((p) => track.appendChild(p));
  mount.appendChild(track);

  return { track, pages, hero: heroRefs };
}
