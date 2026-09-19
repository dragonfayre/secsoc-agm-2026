import { content } from './content';
import { renderApp } from './sections';
import { runLoader } from './loader';
import { initHero } from './hero';
import { initPaging } from './paging';

async function bootstrap(): Promise<void> {
  const appRoot = document.getElementById('app');
  const navRoot = document.getElementById('page-nav');
  if (!appRoot || !navRoot) return;

  const { track, pages, hero: heroRefs } = renderApp(content, appRoot);
  const hero = initHero(heroRefs);

  // Loader plays first; the app underneath is fully built but hidden.
  await runLoader();

  appRoot.hidden = false;

  initPaging({
    track,
    pages,
    nav: navRoot,
    onBeforeTransition: (from, to) => {
      // The hero shrinks into a contained panel only on the hero <-> about boundary.
      if (from === 0 && to === 1) hero.setShrunk(true);
      if (from === 1 && to === 0) hero.setShrunk(false);
    },
  });

  // Kick off the drawn-in intro once the app is visible.
  void hero.playIntro();
}

bootstrap();
