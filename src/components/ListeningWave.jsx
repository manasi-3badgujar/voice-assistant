import { useListeningWave } from "../hooks/useListeningWave";

export default function ListeningWave({ active }) {
  const bars = useListeningWave(active);
  if (!active) return null;

  return (
    <div className="wave">
      {bars.map((v, i) => (
        <div key={i} style={{ height: `${10 + v * 30}px` }} />
      ))}
    </div>
  );
};