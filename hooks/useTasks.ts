import { useCallback, useEffect, useState } from "react";

export type Task = {
  id: string;
  title: string;
  completed: boolean;
  created_at: string;
};

export function useTasks(isAuthenticated: boolean) {
  const [tasks, setTasks] = useState<Task[]>([]);

  const loadTasks = useCallback(async () => {
    if (!isAuthenticated) {
      setTasks([]);
      return;
    }

    const response = await fetch("/api/tasks");

    if (!response.ok) {
      console.error("Failed to load tasks");
      return;
    }

    const data = (await response.json()) as { tasks: Task[] };
    setTasks(data.tasks);
  }, [isAuthenticated]);

  useEffect(() => {
    void loadTasks();
  }, [loadTasks]);

  const addTask = async (title: string) => {
    if (!isAuthenticated) {
      setTasks((prev) => [
        {
          id: crypto.randomUUID(),
          title,
          completed: false,
          created_at: new Date().toISOString(),
        },
        ...prev,
      ]);
      return;
    }

    const response = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });

    if (!response.ok) {
      console.error("Failed to save task");
      return;
    }

    const data = (await response.json()) as { task: Task };
    setTasks((prev) => [data.task, ...prev]);
  };

  const removeTask = async (id: string) => {
    if (isAuthenticated) {
      await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    }

    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  return { tasks, addTask, removeTask };
}
