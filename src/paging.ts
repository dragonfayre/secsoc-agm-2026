import { animate } from 'animejs';

export interface PagingOptions {
  track: HTMLElement;
  pages: HTMLElement[];
  nav: HTMLElement;
  /** Called just before the transition to `next` begins, with the outgoing index. */
  onBeforeTransition?: (from: number, to: number) => void;
}

export interface Paging {
  goTo: (index: number) => void;
}

const WHEEL_THRESHOLD = 14;
const TOUCH_THRESHOLD = 56;
const TRANSITION_DURATION = 850;
const COOLDOWN_MS = TRANSITION_DURATION + 120;

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function initPaging(opts: PagingOptions): Paging {
  const { track, pages, nav } = opts;
  let index = 0;
  let locked = false;
  let unlockTimer: number | undefined;

  const dots = pages.map((_, i) => {
    const btn = document.createElement('button');
    btn.className = 'page-nav__dot';
    btn.type = 'button';
    btn.setAttribute('aria-label', `Go to section ${i + 1}`);
    btn.addEventListener('click', () => goTo(i));
    nav.appendChild(btn);
    return btn;
  });

  function updateNav(): void {
    dots.forEach((dot, i) => {
      if (i === index) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });
  }

  function lock(): void {
    locked = true;
    window.clearTimeout(unlockTimer);
    unlockTimer = window.setTimeout(() => {
      locked = false;
    }, COOLDOWN_MS);
  }

  function goTo(next: number): void {
    const clamped = Math.max(0, Math.min(pages.length - 1, next));
    if (clamped === index || locked) return;

    opts.onBeforeTransition?.(index, clamped);
    lock();

    if (prefersReducedMotion()) {
      track.style.transform = `translateY(-${clamped * 100}vh)`;
      index = clamped;
      updateNav();
      return;
    }

    animate(track, {
      translateY: `-${clamped * 100}vh`,
      duration: TRANSITION_DURATION,
      ease: 'inOutQuad',
    });
    index = clamped;
    updateNav();
  }

  // ---- Wheel (desktop / trackpad) ----
  window.addEventListener(
    'wheel',
    (e) => {
      e.preventDefault();
      if (locked) return;
      if (e.deltaY > WHEEL_THRESHOLD) goTo(index + 1);
      else if (e.deltaY < -WHEEL_THRESHOLD) goTo(index - 1);
    },
    { passive: false },
  );

  // ---- Touch (mobile swipe) ----
  let touchStartY = 0;
  window.addEventListener(
    'touchstart',
    (e) => {
      touchStartY = e.touches[0].clientY;
    },
    { passive: true },
  );
  window.addEventListener(
    'touchmove',
    (e) => {
      e.preventDefault();
    },
    { passive: false },
  );
  window.addEventListener(
    'touchend',
    (e) => {
      if (locked) return;
      const delta = touchStartY - e.changedTouches[0].clientY;
      if (delta > TOUCH_THRESHOLD) goTo(index + 1);
      else if (delta < -TOUCH_THRESHOLD) goTo(index - 1);
    },
    { passive: true },
  );

  // ---- Keyboard ----
  window.addEventListener('keydown', (e) => {
    if (['ArrowDown', 'PageDown', ' '].includes(e.key)) {
      e.preventDefault();
      goTo(index + 1);
    } else if (['ArrowUp', 'PageUp'].includes(e.key)) {
      e.preventDefault();
      goTo(index - 1);
    }
  });

  updateNav();
  return { goTo };
}
