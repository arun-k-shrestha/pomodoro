"use client";

type Props = {
  tasks: string[];
  onRemove: (index: number) => void;
};

export default function TaskList({ tasks, onRemove }: Props) {
  return (
    <div className="task-list">
      {tasks.map((item, index) => (
        <div key={index} className="task-item">
          <span className="task-item-text">{item}</span>
          <button
            className="task-remove-btn"
            onClick={() => onRemove(index)}
            aria-label="Remove task"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}