import { useWaveform } from "../hooks/useWaveform";

export default function Waveform({ active, mode }) {
  const bars = useWaveform(active);
  if (!active) return null;

  return (
    <div className="wave-container">
      {bars.map((v, i) => (
        <div
          key={i}
          className={
            mode === "assistant"
              ? "wave-bar-assistant"
              : "wave-bar-user"
          }
          style={{ height: `${12 + v * 40}px` }} // ⬅️ ONLY remaining inline
        />
      ))}
    </div>
  );
};