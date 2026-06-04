import gsap from "gsap";

/**
 * Creates a cinematic text reveal timeline
 * Splitting text manually or using a library is usually required before applying this,
 * but this function assumes the elements passed are individual words or lines.
 */
export const createTextReveal = (elements: Element | Element[] | NodeListOf<Element>, delay: number = 0) => {
  return gsap.fromTo(
    elements,
    {
      y: 40,
      opacity: 0,
      filter: "blur(8px)",
    },
    {
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      duration: 1.2,
      stagger: 0.05,
      ease: "power3.out",
      delay,
    }
  );
};

/**
 * Creates a fade-in timeline for a section when it scrolls into view
 */
export const createChapterEntrance = (sectionElement: Element) => {
  return gsap.fromTo(
    sectionElement,
    {
      opacity: 0,
      y: 100,
    },
    {
      opacity: 1,
      y: 0,
      duration: 1.5,
      ease: "power2.out",
      scrollTrigger: {
        trigger: sectionElement,
        start: "top 80%", // Trigger when top of section hits 80% down viewport
        toggleActions: "play none none reverse",
      },
    }
  );
};
