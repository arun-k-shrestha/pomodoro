import { useCallback, useEffect, useRef, useState } from "react";

const TASK_SAVE_DELAY_MS = 10_000;

export type Task = {
  id: string;
  title: string;
  completed: boolean;
  started_at: string;
  completed_at: string | null;
  session_name: string | null;
  completion_duration_seconds: number | null;
  pomodoro_started_seconds: number;
  created_at: string;
};

export function useTasks(
  isAuthenticated: boolean,
  getPomodoroElapsedSeconds: () => number,
) {
  const [tasks, setTasks] = useState<Task[]>([]);

  // CHANGE: track unsaved local tasks and their 10-second save timers.
  const pendingSaveTimersRef = useRef<
    Record<string, ReturnType<typeof setTimeout>>
  >({});

  const clearPendingSave = useCallback((id: string) => {
    const timer = pendingSaveTimersRef.current[id];

    if (timer) {
      clearTimeout(timer);
      delete pendingSaveTimersRef.current[id];
    }
  }, []);

  const saveTask = useCallback(
    async (
      task: Task,
      completed: boolean,
      completionDurationSeconds?: number,
    ) => {
      if (!isAuthenticated) return null;

      const completedAt = completed ? new Date().toISOString() : null;

      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: task.title,
          startedAt: task.started_at,
          completed,
          completedAt,
          sessionName: task.session_name,
          pomodoroStartedSeconds: task.pomodoro_started_seconds,
          completionDurationSeconds,
        }),
      });

      if (!response.ok) {
        console.error("Failed to save task");
        return null;
      }

      const data = (await response.json()) as { task: Task };
      return data.task;
    },
    [isAuthenticated],
  );

  const loadTasks = useCallback(async (): Promise<Task[] | null> => {
    if (!isAuthenticated) {
      return [];
    }

    const response = await fetch("/api/tasks");

    if (!response.ok) {
      console.error("Failed to load tasks");
      return null;
    }

    const data = (await response.json()) as { tasks: Task[] };
    return data.tasks;
  }, [isAuthenticated]);

  useEffect(() => {
    let ignore = false;

    void loadTasks().then((loadedTasks) => {
      if (!ignore && loadedTasks) {
        setTasks(loadedTasks.slice(0, 1));
      }
    });

    return () => {
      ignore = true;
    };
  }, [loadTasks]);

  useEffect(() => {
    return () => {
      Object.values(pendingSaveTimersRef.current).forEach(clearTimeout);
    };
  }, []);

  const addTask = async (
    title: string,
    sessionName: string | null,
    elapsedSeconds: number,
  ) => {
    const pomodoroStartedSeconds = getPomodoroElapsedSeconds();
    const localTask: Task = {
      id: crypto.randomUUID(),
      title,
      completed: false,
      started_at: new Date().toISOString(),
      completed_at: null,
      session_name: sessionName,
      completion_duration_seconds: null,
      pomodoro_started_seconds: pomodoroStartedSeconds,
      created_at: new Date().toISOString(),
    };

    setTasks([localTask]);

    if (!isAuthenticated) {
      return;
    }
    // If the user adds a task after 10 seconds, save it immediately.
    const remainingDelayMs = Math.max(
      TASK_SAVE_DELAY_MS - elapsedSeconds * 1000,
      0,
    );

    // CHANGE: save as incomplete only if the task still exists after 10 seconds.
    pendingSaveTimersRef.current[localTask.id] = setTimeout(() => {
      void saveTask(localTask, false).then((savedTask) => {
        delete pendingSaveTimersRef.current[localTask.id];

        if (!savedTask) return;

        setTasks((prev) =>
          prev.map((task) =>
            task.id === localTask.id
              ? {
                  ...savedTask,
                  // CHANGE: keep local pomodoro start time because the DB row does not store it.
                  pomodoro_started_seconds: localTask.pomodoro_started_seconds,
                }
              : task,
          ),
        );
      });
    }, remainingDelayMs);
  };

  const completeTask = async (id: string) => {
    const task = tasks.find((item) => item.id === id);

    if (!task) return;

    const wasPendingSave = Boolean(pendingSaveTimersRef.current[id]);
    clearPendingSave(id);

    // CHANGE: auto-remove visually after checkbox completion.
    setTasks((prev) => prev.filter((item) => item.id !== id));

    if (!isAuthenticated) {
      return;
    }

    const getTaskCompletionDuration = (task: Task) =>
      Math.max(
        0,
        Math.round(getPomodoroElapsedSeconds() - task.pomodoro_started_seconds),
      );
    if (wasPendingSave) {
      // CHANGE: if completed before 10 seconds, create the DB row as completed.
      await saveTask(task, true, getTaskCompletionDuration(task));
      return;
    }

    // CHANGE: if already saved, mark the DB row completed.
    const response = await fetch("/api/tasks", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        completedAt: new Date().toISOString(),
        completionDurationSeconds: getTaskCompletionDuration(task),
      }),
    });

    if (!response.ok) {
      console.error("Failed to complete task");
    }
  };

  const removeTask = async (id: string) => {
    clearPendingSave(id);

    if (isAuthenticated) {
      await fetch(`/api/tasks?id=${id}`, { method: "DELETE" });
    }

    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  return { tasks, addTask, completeTask, removeTask };
}
