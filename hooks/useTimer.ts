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
    if (!running) {
      clearInterval(intervalRef.current!);
      return;
    }

    const endTime = Date.now() + timeLeft * 1000;

    intervalRef.current = setInterval(() => {
      const secondsLeft = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));

      if (secondsLeft <= 0) {
        clearInterval(intervalRef.current!);
        setRunning(false);
        onComplete?.();
        if (audioRef.current) {
          remainingSoundRepeatsRef.current = soundRepeats;
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch(console.error);
        }
        const nextMode: Mode = mode === "pomodoro" ? "shortBreak" : "pomodoro";
        setMode(nextMode);
        setTimeLeft(MODES[nextMode].duration);
        return;
      }

      setTimeLeft(secondsLeft);
    }, 250);
    return () => clearInterval(intervalRef.current!);
  }, [running, mode, soundRepeats]);

  const changeMode = (m: Mode) => {
    clearInterval(intervalRef.current!);
    setRunning(false);
    setMode(m);
    setTimeLeft(MODES[m].duration);
  };

  const toggleRunning = () => setRunning((r) => !r);

  // This will stop the current alarm and cancels its remaining repeats
  // It is needed when the user wants to stop the alarm mid way by clicking anywhere on the screen

  const stopAlarm = () => {
    remainingSoundRepeatsRef.current = 0;

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  return {
    mode,
    timeLeft,
    running,
    audioRef,
    changeMode,
    toggleRunning,
    stopAlarm,
  };
}
