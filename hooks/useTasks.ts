import { useState } from "react";

export function useTasks() {
  const [tasks, setTasks] = useState<string[]>([]);

  const addTask = (task: string) => {
    setTasks((prev) => [...prev, task]);
  };

  const removeTask = (index: number) => {
    setTasks((prev) => prev.filter((_, i) => i !== index));
  };

  return { tasks, addTask, removeTask };
}
