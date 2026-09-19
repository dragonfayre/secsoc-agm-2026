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
  d