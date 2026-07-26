"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./settings.module.css";

const alarmOptions = [
  { value: "morning-alarm-short.wav", label: "Morning alarm" },
  { value: "calm-elegant.wav", label: "Calm" },
  { value: "kitchen-timer.wav", label: "Kitchen timer" },
  { value: "school-bell.wav", label: "School bell" },
];

type AlarmSelectProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function AlarmSelect({ value, onChange }: AlarmSelectProps) {
  const [open, setOpen] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);

  const previewRef = useRef<HTMLAudioElement | null>(null);

  const selectedAlarm =
    alarmOptions.find((option) => option.value === value) ?? alarmOptions[0];

  // stops and resets the preview
  const stopPreview = () => {
    if (!previewRef.current) return;

    previewRef.current.pause();
    previewRef.current.currentTime = 0;
    previewRef.current = null;
    setIsPreviewing(false);
  };

  // the next click anywhere stops the preview
  useEffect(() => {
    if (!isPreviewing) return;

    document.addEventListener("click", stopPreview, { once: true });

    return () => {
      document.removeEventListener("click", stopPreview);
    };
  }, [isPreviewing]);

  const selectAlarm = (alarm: string) => {
    // Stop any previous preview
    stopPreview();
    previewRef.current?.pause();

    const preview = new Audio(`/assets/sounds/${alarm}`);

    previewRef.current = preview;

    // Stop listening automatically when the sound finishes
    preview.addEventListener(
      "ended",
      () => {
        previewRef.current = null;
        setIsPreviewing(false);
      },
      { once: true },
    );

    preview
      .play()
      .then(() => setIsPreviewing(true))
      .catch((error) => {
        previewRef.current = null;
        console.error(error);
      });
    onChange(alarm);
    setOpen(false);
  };

  return (
    <div className={styles.alarmSelect}>
      <button
        type="button"
        className={styles.alarmSelectButton}
        onClick={() => setOpen((current) => !current)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span>{selectedAlarm.label}</span>
        <span className={styles.chevron} aria-hidden="true">
          {open ? "⌃" : "⌄"}
        </span>
      </button>

      {open && (
        <div className={styles.alarmOptions} role="listbox">
          {alarmOptions.map((option) => {
            const selected = option.value === value;

            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={selected}
                className={`${styles.alarmOption} ${
                  selected ? styles.alarmOptionSelected : ""
                }`}
                onClick={() => selectAlarm(option.value)}
              >
                <span>{option.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
