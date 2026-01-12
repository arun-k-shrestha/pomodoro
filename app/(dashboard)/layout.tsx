"use client"
import MenuPage from "@/components/menu/HamburgerMenu";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* ✅ Renders ONCE — never remounts on navigation */}
      <MenuPage variant="sidebar" onClose={() => {}} />

      {/* ✅ Only this part swaps on navigation */}
      <div style={{ flex: 1, overflow: "auto" }}>
        {children}
      </div>
    </div>
  );
}