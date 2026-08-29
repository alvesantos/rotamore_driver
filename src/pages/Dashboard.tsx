import { useState } from "react";
import { useTheme } from "../context/useTheme";
import MobileHeader from "../components/layout/MobileHeader";
import BottomNav, { type TabType } from "../components/layout/BottomNav";
import Home from "./Home";
import Profile from "./Profile";
import Settings from "./Settings";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabType>("home");
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const { isDark } = useTheme();

  return (
    <div
      className={`min-h-screen flex flex-col justify-between pb-24 select-none transition-colors duration-200 ${
        isDark ? "bg-slate-950 text-slate-100" : "bg-slate-100 text-slate-800"
      }`}
    >
      {/* Top Mobile Header */}
      <MobileHeader
        isOnline={isOnline}
        onToggleOnline={() => setIsOnline(!isOnline)}
      />

      {/* Main Content View based on activeTab */}
      <main className="mx-auto w-full max-w-md flex-1 px-4 py-5 space-y-5">
        {activeTab === "home" && <Home />}
        {activeTab === "profile" && <Profile />}
        {activeTab === "settings" && <Settings />}
      </main>

      {/* Fixed Bottom Navigation */}
      <BottomNav activeTab={activeTab} onSelectTab={setActiveTab} />
    </div>
  );
}
