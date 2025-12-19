import { useEffect, useState } from "react";

export function useListeningWave(active) {
  const [bars, setBars] = useState(new Array(12).fill(0));

  useEffect(() => {
    if (!active) return setBars(new Array(12).fill(0));

    let raf;
    const animate = () => {
      setBars(bars.map(() => Math.random()));
      raf = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(raf);
  }, [active]);

  return bars;
};