"use client";

import type { Task } from "@/hooks/useTasks";

type Props = {
  tasks: Task[];
  onRemove: (id: string) => void;
};

export default function TaskList({ tasks, onRemove }: Props) {
  return (
    <div className="task-list">
      {tasks.map((item, index) => (
        <div key={item.id} className="task-item">
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
