import { SessionProvider } from "@/components/providers/SessionProvider";
import { PomodoroApp } from "@/components/layout/PomodoroApp";

export default function Home() {
  return (
    // <SessionProvider>
    <PomodoroApp />
    // </SessionProvider>
  );
}
