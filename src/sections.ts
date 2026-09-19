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
  const words = text.split(' ');
  words.forEach((word, i) => {
    const inner = el('span', 'hero-intro__line-inner', word + (i < words.length - 1 ? '\u00A0' : ''));
    line.appendChild(inner);
  });
  return line;
}

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
  const tagline = el('p', 'hero-editorial__tagline', content.tagline);
  const meta = el('ul', 'hero-editorial__meta');

  const metaLocation = el('li', undefined, content.location);
  const metaEmail = el('li');
  const emailLink = el('a', undefined, content.email);
  emailLink.href = `mailto:${content.email}`;
  metaEmail.appendChild(emailLink);

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

  meta.append(metaLocation, metaEmail, metaSocial);
  grid.append(eyebrow, title, tagline, meta);
  editorial.appendChild(grid);

  // Wipe transition blocks
  const wipe = el('div', 'hero-wipe');
  const wipeBlocks = [0, 1, 2].map(() => el('span', 'hero-wipe__block'));
  wipeBlocks.forEach((b) => wipe.appendChild(b));

  stage.append(editorial, intro, wipe);
  page.appendChild(stage);

  return {
    page,
    refs: { stage, intro, introLines, editorial, wipe, wipeBlocks },
  };
}

function buildAbout(content: Content): HTMLElement {
  const page = el('section', 'page page--about');
  page.dataset.index = '1';
  const section = el('div', 'section');
  section.appendChild(el('p', 'section__eyebrow', 'About'));

  const layout = el('div', 'about__layout');
  const label = el('div', 'about__label');
  label.appendChild(el('h2', 'section__heading', 'A little\nbackground'));
  const body = el('p', 'about__body', content.about);
  layout.append(label, body);

  section.appendChild(layout);
  page.appendChild(section);
  return page;
}

function buildExperience(content: Content): HTMLElement {
  const page = el('section', 'page page--experience');
  page.dataset.index = '2';
  const section = el('div', 'section');
  section.appendChild(el('p', 'section__eyebrow', 'Experience'));
  section.appendChild(el('h2', 'section__heading', 'Where I\u2019ve\nworked'));

  const list = el('div', 'experience__list');
  content.experience.forEach((entry) => {
    const item = el('div', 'experience__item');
    const period = el('div', 'experience__period', entry.period);
    const details = el('div');
    details.appendChild(el('h3', 'experience__role', entry.role));
    details.appendChild(el('p', 'experience__company', entry.company));
    const bullets = el('ul', 'experience__bullets');
    entry.bullets.forEach((b) => bullets.appendChild(el('li', undefined, b)));
    details.appendChild(bullets);
    item.append(period, details);
    list.appendChild(item);
  });

  section.appendChild(list);
  page.appendChild(section);
  return page;
}

function buildSkills(content: Content): HTMLElement {
  const page = el('section', 'page page--skills');
  page.dataset.index = '3';
  const section = el('div', 'section');
  section.appendChild(el('p', 'section__eyebrow', 'Skills'));
  section.appendChild(el('h2', 'section__heading', 'What I\nwork with'));

  const grid = el('div', 'skills__grid');
  content.skills.forEach((group) => {
    const col = el('div');
    col.appendChild(el('p', 'skills__category-label', group.category));
    const items = el('ul', 'skills__items');
    group.items.forEach((i) => items.appendChild(el('li', undefined, i)));
    col.appendChild(items);
    grid.appendChild(col);
  });

  section.appendChild(grid);
  page.appendChild(section);
  return page;
}

function buildContact(content: Content): HTMLElement {
  const page = el('section', 'page page--contact');
  page.dataset.index = '4';
  const section = el('div', 'section');
  section.appendChild(el('p', 'section__eyebrow', 'Contact'));
  section.appendChild(el('h2', 'section__heading', 'Let\u2019s\ntalk'));
  section.appendChild(el('p', 'contact__intro', content.contactLine));

  const emailLink = el('a', 'contact__email', content.email);
  emailLink.href = `mailto:${content.email}`;
  section.appendChild(emailLink);

  const links = el('div', 'contact__links');
  const linkedinLink = el('a', undefined, 'LinkedIn');
  linkedinLink.href = content.linkedin;
  linkedinLink.target = '_blank';
  linkedinLink.rel = 'noreferrer';
  const githubLink = el('a', undefined, 'GitHub');
  githubLink.href = content.github;
  githubLink.target = '_blank';
  githubLink.rel = 'noreferrer';
  links.append(linkedinLink, githubLink);
  section.appendChild(links);

  page.appendChild(section);
  return page;
}

export function renderApp(content: Content, mount: HTMLElement): RenderResult {
  const track = el('div', 'pager__track');
  track.id = 'pager-track';

  const { page: heroPage, refs: heroRefs } = buildHero(content);
  const pages = [
    heroPage,
    buildAbout(content),
    buildExperience(content),
    buildSkills(content),
    buildContact(content),
  ];
  pages.forEach((p) => track.appendChild(p));
  mount.appendChild(track);

  return { track, pages, hero: heroRefs };
}
