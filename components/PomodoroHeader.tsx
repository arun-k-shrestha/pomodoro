import { useSession } from "next-auth/react";
import { useState } from "react";

type PomodoroHeaderProps = {
  onMenuClick: () => void;
  menuOpen: boolean;
};

export default function PomodoroHeader({
  onMenuClick,
  menuOpen,
}: PomodoroHeaderProps) {
  const [showAccount, setShowAccount] = useState(false);

  const handleAccountClick = () => {
    setShowAccount((current) => !current);
  };

  const { data: session, status } = useSession();
  const firstInitial =
    session?.user?.name?.trim().charAt(0).toUpperCase() ?? "?";
  return (
    <header className="pomodoro-header">
      {!menuOpen && (
        <button className="icon-btn" aria-label="Menu" onClick={onMenuClick}>
          <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
            <rect y="0" width="16" height="1.5" rx="1" fill="#575252ff" />
            <rect y="5.25" width="16" height="1.5" rx="1" fill="#575252ff" />
            <rect y="10.5" width="16" height="1.5" rx="1" fill="#575252ff" />
          </svg>
        </button>
      )}

      {/* <span className="brand-name"></span>
      {status != "authenticated" && (
        <button className="icon-btn" aria-label="Settings">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle
              cx="8"
              cy="8"
              r="2.5"
              stroke="#575252ff"
              strokeWidth="1.4"
            />
            <path
              d="M8 1v1.5M8 13.5V15M1 8h1.5M13.5 8H15M3.05 3.05l1.06 1.06M11.89 11.89l1.06 1.06M12.95 3.05l-1.06 1.06M4.11 11.89l-1.06 1.06"
              stroke="#575252ff"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>
        </button>
      )} */}

      {status === "authenticated" && (
        <div className="account-container">
          <div
            className="icon-btn"
            aria-label="Account"
            onClick={handleAccountClick}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <text
                x="8"
                y="10"
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="20"
                fill="#5f5959ff"
                fontFamily='"Helvetica Neue", Helvetica, Arial, sans-serif'
                fontWeight="bold"
              >
                {firstInitial}
              </text>
            </svg>
          </div>
          {showAccount && (
            <div className="account-popup">
              <p>{session.user?.name}</p>
              <p>{session.user?.email}</p>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
