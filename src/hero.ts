import { animate } from 'animejs';
import type { HeroRefs } from './sections';

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function cssNumber(varName: string, fallback: number): number {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  const parsed = parseFloat(raw);
  return Number.isNaN(parsed) ? fallback : parsed;
}

/** Reveals a single word span left-to-right, as if it were being written. */
function drawWord(word: HTMLElement, delay: number): Promise<void> {
  return new Promise((resolve) => {
    word.style.clipPath = 'inset(0 100% 0 0)';
    animate(word, {
      opacity: [0, 1],
      duration: 520,
      delay,
      ease: 'outQuad',
      onUpdate: (self) => {
        const reveal = self.progress * 100;
        word.style.clipPath = `inset(0 ${100 - reveal}% 0 0)`;
      },
      onComplete: () => resolve(),
    });
  });
}

export interface Hero {
  /** Plays the drawn-in intro, then the three-block wipe into the editorial state. */
  playIntro: () => Promise<void>;
  /**
   * Toggles the hero between full-bleed and a contained, inset panel.
   * Returns a Promise that resolves when the animation completes so callers
   * can await it before triggering the next page transition.
   */
  setShrunk: (shrunk: boolean) => Promise<void>;
}

export function initHero(refs: HeroRefs): Hero {
  const words = refs.introLines.flatMap((line) =>
    Array.from(line.querySelectorAll<HTMLElement>('.hero-intro__line-inner')),
  );

  async function playIntro(): Promise<void> {
    if (prefersReducedMotion()) {
      words.forEach((w) => (w.style.clipPath = 'inset(0 0% 0 0)'));
      refs.intro.style.opacity = '0';
      refs.wipeBlocks.forEach((b) => (b.style.transform = 'translateY(-100%)'));
      refs.wipe.style.display = 'none';
      return;
    }

    // Draw each word in, left to right, line by line.
    await Promise.all(words.map((w, i) => drawWord(w, i * 90)));

    // Hold for a beat so the composition can be read.
    await new Promise((r) => window.setTimeout(r, 550));

    // Fade the intro out just as the wipe begins.
    animate(refs.intro, { opacity: [1, 0], duration: 200, ease: 'inQuad' });

    await new Promise<void>((resolve) => {
      animate(refs.wipeBlocks, {
        translateY: ['0%', '-100%'],
        duration: 650,
        delay: (_el: unknown, i = 0) => i * 90,
        ease: 'inOutQuad',
        onComplete: (self) => {
          if (self.progress === 1) {
            refs.wipe.style.display = 'none';
            resolve();
          }
        },
      });
    });
  }

  function setShrunk(shrunk: boolean): Promise<void> {
    const margin = cssNumber('--hero-margin', 28);
    const radius = cssNumber('--radius-panel', 18);

    if (prefersReducedMotion()) {
      // Apply final state immediately and resolve.
      refs.stage.style.top = shrunk ? `${margin}px` : '0px';
      refs.stage.style.right = shrunk ? `${margin}px` : '0px';
      refs.stage.style.bottom = shrunk ? `${margin}px` : '0px';