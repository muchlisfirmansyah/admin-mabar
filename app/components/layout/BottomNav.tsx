import { Activity, History, PieChart, Users, Wallet, type LucideIcon } from "lucide-react";
import type { TabId } from "../../types/mabar";

interface NavItem {
  id: TabId;
  label: string;
  icon: LucideIcon;
}

const NAV_ITEMS: NavItem[] = [
  { id: "pemain", label: "Pemain", icon: Users },
  { id: "pertandingan", label: "Match", icon: Activity },
  { id: "rekap", label: "Rekap", icon: History },
  { id: "tagihan", label: "Resume", icon: Wallet },
  { id: "keuangan", label: "Keuangan", icon: PieChart },
];

interface BottomNavProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <div className="fixed bottom-0 w-full max-w-md bg-white border-t border-gray-200 flex justify-between p-2 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] pb-safe z-20 print:hidden">
      {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
        const isActive = activeTab === id;
        return (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`flex flex-1 flex-col items-center p-2 transition-colors ${
              isActive ? "text-yellow-500" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <Icon size={22} className={isActive ? "stroke-[2.5px]" : ""} />
            <span className="text-[9px] font-bold mt-1">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
