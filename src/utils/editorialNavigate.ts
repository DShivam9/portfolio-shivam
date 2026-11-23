let isTransitioning = false;

function resolveTargetY(href: string): number {
  if (href === "#top") return 0;
  const el = document.querySelector(href);
  if (!el) return window.scrollY;
  return Math.max(0, el.getBoundingClientRect().top + window.scrollY - 64);
}

// 3-beat editorial page cut: recede (360ms) -> calm breath (90ms) -> emerge (520ms)
export function editorialNavigate(
  href: string,
  reducedMotion: boolean | null,
) {
  if (typeof window === "undefined" || isTransitioning) return;

  // If invoked from a non-home route (e.g. 404), navigate back to home with anchor
  if (window.location.pathname !== "/") {
    window.location.assign(href === "#top" ? "/" : `/${href}`);
    return;
  }

  const targetY = resolveTargetY(href);
  if (Math.abs(targetY - window.scrollY) < 32) return;

  if (reducedMotion) {
    window.scrollTo({ top: targetY, behavior: "instant" });
    return;
  }

  const targets = [
    document.querySelector("main"),
    document.querySelector("footer"),
  ].filter((el): el is HTMLElement => el !== null);

  if (targets.length === 0) {
    window.scrollTo({ top: targetY, behavior: "instant" });
    return;
  }

  isTransitioning = true;
  const goingUp = targetY < window.scrollY;
  const exitY = goingUp ? "12px" : "-12px";
  const enterY = goingUp ? "-14px" : "14px";

  const exitAnims = targets.map((el) =>
    el.animate(
      [
        { opacity: 1, transform: "translate3d(0, 0, 0)", filter: "blur(0px)" },
        {
          opacity: 0,
          transform: `translate3d(0, ${exitY}, 0)`,
          filter: "blur(4px)",
        },
      ],
      {
        duration: 360,
        easing: "cubic-bezier(0.32, 0.72, 0, 1)",
        fill: "forwards",
      },
    ),
  );

  Promise.all(exitAnims.map((a) => a.finished)).then(() => {
    window.scrollTo({ top: targetY, behavior: "instant" });

    window.setTimeout(() => {
      const enterAnims = targets.map((el) =>
        el.animate(
          [
            {
              opacity: 0,
              transform: `translate3d(0, ${enterY}, 0)`,
              filter: "blur(4px)",
            },
            {
              opacity: 1,
              transform: "translate3d(0, 0, 0)",
              filter: "blur(0px)",
            },
          ],
          {
            duration: 520,
            easing: "cubic-bezier(0.22, 1, 0.36, 1)",
            fill: "forwards",
          },
        ),
      );

      Promise.all(enterAnims.map((a) => a.finished)).then(() => {
        // Cancel fill-forwards animations so no lingering transform/filter breaks layout
        for (const a of exitAnims) a.cancel();
        for (const a of enterAnims) a.cancel();
        isTransitioning = false;
      });
    }, 90);
  });
}
