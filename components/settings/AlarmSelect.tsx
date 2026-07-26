"use client";

import { useState } from "react";
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

  const selectedAlarm =
    alarmOptions.find((option) => option.value === value) ?? alarmOptions[0];

  const selectAlarm = (alarm: string) => {
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

                {selected && (
                  <span className={styles.checkmark} aria-hidden="true">
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
