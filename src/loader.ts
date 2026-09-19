import { animate } from 'animejs';

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Runs the loading sequence and resolves once the loader has been removed
 * from view. Sequence: three dots fade in -> middle dot drops -> the dots
 * cross-fade into a small smiley -> the whole cluster does a retro CRT
 * "power off" collapse (vertical, then horizontal, then gone).
 */
export function runLoader(): Promise<void> {
  return new Promise((resolve) => {
    const loader = document.getElementById('loader');
    const stage = document.querySelector<HTMLElement>('.loader__stage');
    const dots = Array.from(document.querySelectorAll<HTMLElement>('.loader__dot'));
    const midDot = document.querySelector<HTMLElement>('[data-dot="mid"]');
    const smiley = document.getElementById('loader-smiley');

    if (!loader || !stage || !midDot || !smiley || dots.length !== 3) {
      loader?.remove();
      resolve();
      return;
    }

    const finish = () => {
      loader.style.display = 'none';
      resolve();
    };

    if (prefersReducedMotion()) {
      finish();
      return;
    }

    const [leftDot, , rightDot] = dots;

    // 1. Dots fade + scale in.
    animate(dots, {
      opacity: [0, 1],
      scale: [0.4, 1],
      duration: 900,
      delay: (_el: unknown, i = 0) => i * 90,
      ease: 'outQuad',
      onComplete: () => {
        // 2. Middle dot drops and settles.
        animate(midDot, {
          translateY: [0, 16, 0],
          duration: 420,
          ease: 'outBounce',
          onComplete: () => {
            // 3. Side dots retire, middle dot morphs into the smiley.
            animate([leftDot, rightDot], {
              opacity: 0,
              scale: 0.4,
              duration: 200,
              ease: 'inQuad',
            });
            animate(midDot, { opacity: 0, duration: 140, ease: 'inQuad' });
            animate(smiley, {
              opacity: [0, 1],
              scale: [0.5, 1],
              duration: 260,
              ease: 'outBack',
              onComplete: () => {
                // 4. Hold briefly, then retro CRT blip-out on the whole cluster.
                window.setTimeout(() => {
                  animate(stage, {
                    scaleY: [1, 0.05],
                    duration: 150,
                    ease: 'inExpo',
                    onComplete: () => {
                      animate(stage, {
                        scaleX: [1, 0],
                        opacity: [1, 0],
                        duration: 130,
                        ease: 'inExpo',
                        onComplete: () => {
                          animate(loader, {
                            opacity: [1, 0],
                            duration: 180,
                            ease: 'outQuad',
                            onComplete: finish,
                          });
                        },
                      });
                    },
                  });
                }, 360);
              },
            });
          },
        });
      },
    });
  });
}
