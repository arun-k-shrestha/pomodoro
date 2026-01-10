"use client";

type Props = {
  running: boolean;
  onToggle: () => void;
};

export default function StartButton({ running, onToggle }: Props) {
  return (
    <button onClick={onToggle} className="start-btn">
      {running ? "PAUSE" : "START"}
    </button>
  );
}