import { content } from './content';
import { renderApp } from './sections';
import { runLoader } from './loader';
import { initHero } from './hero';
import { initPaging } from './paging';

// Eyebrow labels match the section eyebrows in sections.ts, one per page.
const PAGE_LABELS = [
  'hero',
  'about',
  'experience',
  'more about',
  'Role Preferences',
  'contact me :)',
];

async function bootstrap(): Promise<void> {
  const appRoot = document.getElementById('app');
  const navRoot = document.getElementById('page-nav');
  if (!appRoot || !navRoot) return;

  const { track, pages, hero: heroRefs } = renderApp(content, appRoot);
  const hero = initHero(heroRefs);

  // Loader plays first; the app underneath is fully built but hidden.
  await runLoader();

  // Unhide app and start the wipe immediately as the loader begins fading out.
  // The wipe blocks cover the dark stage so there is no flash.
  appRoot.hidden = false;
  void hero.playIntro();

  initPaging({
    track,
    pages,
    nav: navRoot,
    labels: PAGE_LABELS,
    onBeforeTransition: (from, to) => {
      // Leaving the hero to any page: shrink first, then scroll.
      if (from === 0 && to > 0) return hero.setShrunk(true);
    },
    onAfterTransition: (from, to) => {
      // Returning to the hero from any page: scroll first, then zoom back in.
      if (to === 0 && from > 0) return hero.setShrunk(false);
    },
  });
}

bootstrap();
