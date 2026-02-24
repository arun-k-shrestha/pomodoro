"use client";

import MenuPage from "@/components/menu/HamburgerMenu";

type ActivePage = "home" | "progress" | "settings" | "about";

interface AppLayoutProps {
  menuOpen: boolean;
  isNarrow: boolean;
  isVeryNarrow: boolean;
  isMenuOverLay: boolean;
  activePage: ActivePage;
  onClose: () => void;
  onProgressClick: () => void;
  onSettingsClick: () => void;
  onAboutClick: () => void;
  children: React.ReactNode;
}

export function AppLayout({
  menuOpen,
  isNarrow,
  isVeryNarrow,
  isMenuOverLay,
  activePage,
  onClose,
  onProgressClick,
  onSettingsClick,
  onAboutClick,
  children,
}: AppLayoutProps) {
  const showFullscreenMenu = menuOpen && isVeryNarrow;
  const showPushMenu = menuOpen && isNarrow && !isVeryNarrow;
  const showOverlayMenu = menuOpen && !isNarrow;

  const menuProps = { onClose, onProgressClick, onSettingsClick, onAboutClick };

  if (showFullscreenMenu) {
    return <MenuPage variant="fullscreen" {...menuProps} />;
  }

  return (
    <>
      {showOverlayMenu && <MenuPage {...menuProps} />}
      <div className={`pomodoro-layout${showPushMenu ? " push" : ""}`}>
        {showPushMenu && <MenuPage variant="sidebar" {...menuProps} />}
        <div
          className="pomodoro-main-content"
          style={
            showOverlayMenu && activePage === "progress" && isMenuOverLay
              ? {
                  marginLeft: "300px",
                  transition:
                    "margin-left 0.26s cubic-bezier(0.22, 1, 0.36, 1)",
                }
              : {
                  transition:
                    "margin-left 0.26s cubic-bezier(0.22, 1, 0.36, 1)",
                }
          }
        >
          {children}
        </div>
      </div>
    </>
  );
}
