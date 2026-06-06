"use client";

import React, { useRef, useState } from "react";
import gsap from "gsap";

interface MagneticCardProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
}

export default function MagneticCard({ children, className = "", intensity = 0.2 }: MagneticCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(ref.current, {
      x: x * intensity,
      y: y * intensity,
      rotateX: -y * intensity * 0.1,
      rotateY: x * intensity * 0.1,
      duration: 0.8,
      ease: "power3.out",
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (!ref.current) return;
    gsap.to(ref.current, {
      x: 0,
      y: 0,
      rotateX: 0,
      rotateY: 0,
      duration: 1.2,
      ease: "elastic.out(1, 0.3)",
    });
  };

  return (
    <div
      ref={ref}
      className={`relative will-change-transform ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
}
