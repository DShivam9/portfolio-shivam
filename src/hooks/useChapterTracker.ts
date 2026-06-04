import { useState, useEffect } from "react";

export const useChapterTracker = () => {
  const [activeChapter, setActiveChapter] = useState(1);

  useEffect(() => {
    const chapters = document.querySelectorAll("[data-chapter]");
    
    if (chapters.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const chapterNum = parseInt(entry.target.getAttribute("data-chapter") || "1", 10);
            setActiveChapter(chapterNum);
          }
        });
      },
      {
        root: null,
        rootMargin: "-40% 0px -40% 0px", // Trigger when chapter is near middle of screen
        threshold: 0,
      }
    );

    chapters.forEach((chapter) => observer.observe(chapter));

    return () => {
      chapters.forEach((chapter) => observer.unobserve(chapter));
    };
  }, []);

  return activeChapter;
};
