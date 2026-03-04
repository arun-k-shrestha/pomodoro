import { useState, useEffect, useRef } from "react";
import { MODES, Mode } from "@/lib/constants";

export function useTimer(soundRepeats: number, onComplete?: () => void) {
  const [mode, setMode] = useState<Mode>("pomodoro");
  const [timeLeft, setTimeLeft] = useState(MODES.pomodoro.duration);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const remainingSoundRepeatsRef = useRef(0);

  // Document title
  const mm = Math.floor(timeLeft / 60)
    .toString()
    .padStart(2, "0");
  const ss = (timeLeft % 60).toString().padStart(2, "0");

  useEffect(() => {
    const modeLabel =
      mode === "pomodoro"
        ? "Pomodoro"
        : mode === "shortBreak"
          ? "Short Break"
          : "Long Break";
    document.title = `${mm}:${ss} • ${modeLabel}`;
    return () => {
      document.title = "Pomodoro";
    };
  }, [mm, ss, mode]);

  // Audio ended handler
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      if (remainingSoundRepeatsRef.current > 1) {
        remainingSoundRepeatsRef.current -= 1;
        audio.currentTime = 0;
        audio.play().catch(console.error);
        return;
      }
      remainingSoundRepeatsRef.current = 0;
    };

    audio.addEventListener("ended", handleEnded);
    return () => audio.removeEventListener("ended", handleEnded);
  }, []);

  // Timer countdown
  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            clearInterval(intervalRef.current!);
            setRunning(false);
            onComplete?.();
            if (audioRef.current) {
              remainingSoundRepeatsRef.current = soundRepeats;
              audioRef.current.currentTime = 0;
              audioRef.current.play().catch(console.error);
            }
            const nextMode: Mode =
              mode === "pomodoro" ? "shortBreak" : "pomodoro";
            setMode(nextMode);
            setTimeLeft(MODES[nextMode].duration);
            return MODES[nextMode].duration;
          }
          return t - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current!);
    }
    return () => clearInterval(intervalRef.current!);
  }, [running, mode, soundRepeats]);

  const changeMode = (m: Mode) => {
    clearInterval(intervalRef.current!);
    setRunning(false);
    setMode(m);
    setTimeLeft(MODES[m].duration);
  };

  const toggleRunning = () => setRunning((r) => !r);

  return { mode, timeLeft, running, audioRef, changeMode, toggleRunning };
}
