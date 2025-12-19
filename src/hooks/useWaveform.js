import { useEffect, useRef, useState } from "react";

export function useWaveform(active) {
  const [bars, setBars] = useState(new Array(20).fill(0));
  const frame = useRef(0);

  useEffect(() => {
    if (!active) {
      setBars(new Array(20).fill(0));
      return;
    }

    let raf;
    const animate = () => {
      frame.current += 0.03; // 👈 slow movement
      const next = bars.map((_, i) =>
        0.4 + 0.4 * Math.sin(frame.current + i * 0.35)
      );
      setBars(next);
      raf = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(raf);
  }, [active]);

  return bars;
};