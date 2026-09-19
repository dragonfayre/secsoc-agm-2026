import { animate } from 'animejs';

export interface PagingOptions {
  track: HTMLElement;
  pages: HTMLElement[];
  nav: HTMLElement;
  /**
   * Called just before the page slide begins.
   * Return a Promise to delay the slide until the animation resolves
   * (e.g. hero shrink before scrolling away from it).
   */
  onBeforeTransition?: (from: number, to: number) => Promise<void> | void;
  /**
   * Called just after the page slide completes.
   * Return a Promise if you want the lock held until it resolves
   * (e.g. hero unshrink after scrolling back to it).
   */
  onAfterTransition?: (from: number, to: number) => Promise<void> | void;
}

export interface Paging {
  goTo: (index: number) => void;
}

const WHEEL_THRESHOLD = 14;
const TOUCH_THRESHOLD = 56;
const TRANSITION_DURATION = 850;

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function initPaging(opts: PagingOptions): Paging {
  const { track, pages, nav } = opts;
  let index = 0;
  let locked = false;

  const dots = pages.map((_, i) => {
    const btn = document.createElement('button');
    btn.className = 'page-nav__dot';
    btn.type = 'button';
    btn.setAttribute('aria-label', `Go to section ${i + 1}`);
    btn.addEventListener('click', () => void goTo(i));
    nav.appendChild(btn);
    return btn;
  });

  function updateNav(): void {
    dots.forEach((dot, i) => {
      if (i === index) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });
  }

  async function goTo(next: number): Promise<void> {
    const clamped = Math.max(0, Math.min(pages.length - 1, next));
    if (clamped === index || locked) return;

    locked = true;
    const from = index;
    index = clamped;
    updateNav();

    // 1. Pre-transition hook — awaited before the slide starts.
    const beforePromise = opts.onBeforeTransition?.(from, clamped);
    if (beforePromise) await beforePromise;

    // 2. Slide the track.
    if (prefersReducedMotion()) {
      track.style.transform = `translateY(-${clamped * 100}vh)`;
    } else {
      await new Promise<void>((resolve) => {
        animate(track, {
          translateY: `-${clamped * 100}vh`,
          duration: TRANSITION_DURATION,
          ease: 'inOutQuad',
          onComplete: () => resolve(),
        });
      });
    }

    // 3. Post-transition hook — awaited before unlocking.
    const afterPromise = opts.onAfterTransition?.(from, clamped);
    if (afterPromise) await afterPromise;

    locked = false;
  }

  // ---- Wheel (desktop / trackpad) ----
  window.addEventListener(
    'wheel',
    (e) => {
      e.preventDefault();
      if (locked) return;
      if (e.deltaY > WHEEL_THRESHOLD) void goTo(index + 1);
      else if (e.deltaY < -WHEEL_THRESHOLD) void goTo(index - 1);
    },
    { passive: false },
  );

  // ---- Touch (mobile swipe) ----
  let touchStartY = 0;
  window.addEventListener(
    'touchstart',
    (e) => { touchStartY = e.touches[0].clientY; },
    { passive: true },
  );
  window.addEventListener(
    'touchmove',
    (e) => { e.preventDefault(); },
    { passive: false },
  );
  window.addEventListener(
    'touchend',
    (e) => {
      if (locked) return;
      const delta = touchStartY - e.changedTouches[0].clientY;
      if (delta > TOUCH_THRESHOLD) void goTo(index + 1);
      else if (delta < -TOUCH_THRESHOLD) void goTo(index - 1);
    },
    { passive: true },
  );

  // ---- Keyboard ----
  window.addEventListener('keydown', (e) => {
    if (['ArrowDown', 'PageDown', ' '].includes(e.key)) {
      e.preventDefault();
      void goTo(index + 1);
    } else if (['ArrowUp', 'PageUp'].includes(e.key)) {
      e.preventDefault();
      void goTo(index - 1);
    }
  });

  updateNav();
  return { goTo: (i) => void goTo(i) };
}
