"use client";
import { useState } from "react";

type Props = {
  onAdd: (task: string) => void;
};

export default function TaskInput({ onAdd }: Props) {
  const [task, setTask] = useState("");

  const handleAdd = () => {
    const trimmed = task.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setTask("");
  };

  return (
    <div className="task-input-row">
      <input
        className="task-name"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="CURRENT TASK"
        onKeyDown={(e) => {
          if (e.key === "Enter") handleAdd();
        }}
      />
      <button
        className="add-task-btn"
        onClick={handleAdd}
        aria-label="Add task"
      >
        <span>+</span>
      </button>
    </div>
  );
}
