"use client";

import { useState } from "react";
import type { Task } from "@/hooks/useTasks";

type Props = {
  tasks: Task[];
  onComplete: (id: string) => void;
  onRemove: (id: string) => void;
};

export default function TaskList({ tasks, onComplete, onRemove }: Props) {
  const [fadingTaskId, setFadingTaskId] = useState<string | null>(null);

  const completeTask = (id: string) => {
    setFadingTaskId(id);

    setTimeout(() => {
      // CHANGE: checkbox completes and auto-removes instead of deleting.
      onComplete(id);
    }, 600);
  };

  return (
    <div className="task-list">
      {tasks.map((item) => (
        <div
          key={item.id}
          className={`task-item ${fadingTaskId === item.id ? "task-item-fading" : ""}`}
        >
          <input
            className="task-checkbox"
            type="checkbox"
            checked={fadingTaskId === item.id}
            onChange={() => completeTask(item.id)}
            aria-label="Complete task"
          />

          <span className="task-item-text">{item.title}</span>

          <button
            className="task-remove-btn"
            onClick={() => onRemove(item.id)}
            aria-label="Remove task"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
