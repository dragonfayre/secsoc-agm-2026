import { animate } from 'animejs';

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function runLoader(): Promise<void> {
  return new Promise((resolve) => {
    const loader = document.getElementById('loader');
    const stage = document.querySelector<HTMLElement>('.loader__stage');
    const dots = Array.from(document.querySelectorAll<HTMLElement>('.loader__dot'));
    const midDot = document.querySelector<HTMLElement>('[data-dot="mid"]');
    const leftDot = document.querySelector<HTMLElement>('[data-dot="left"]');
    const rightDot = document.querySelector<HTMLElement>('[data-dot="right"]');
    const smiley = document.getElementById('loader-smiley');

    if (!loader || !stage || !midDot || !leftDot || !rightDot || !smiley || dots.length !== 3) {
      loader?.remove();
      resolve();
      return;
    }

    const finish = () => {
      loader.style.display = 'none';
    };

    if (prefersReducedMotion()) {
      finish();
      resolve();
      return;
    }

    // 1. Dots fade + scale in.
    animate(dots, {
      opacity: [0, 1],
      scale: [0.4, 1],
      duration: 900,
      delay: (_el: unknown, i = 0) => i * 90,
      ease: 'outQuad',
      onComplete: () => {
        // 2. Sequential bounce-up: left, then mid, then right.
        animate(leftDot, {
          translateY: [0, -18, 0],
          duration: 320,
          ease: 'outBounce',
          onComplete: () => {
            animate(midDot, {
              translateY: [0, -18, 0],
              duration: 320,
              ease: 'outBounce',
              onComplete: () => {
                animate(rightDot, {
                  translateY: [0, -18, 0],
                  duration: 320,
                  ease: 'outBounce',
                  onComplete: () => {
                    // 3. Middle dot drops down — no return bounce, stays dropped.
                    animate(midDot, {
                      translateY: 16,
                      duration: 260,
                      ease: 'inQuad',
                      onComplete: () => {
                        // 4. Side dots retire, middle dot morphs into smiley.
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
                            // 5. Hold briefly, then CRT blip-out.
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
                                      resolve();
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
              },
            });
          },
        });
      },
    });
  });
}
