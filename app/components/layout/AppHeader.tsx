import { LogIn } from "lucide-react";
import { useMabar } from "../../context/MabarContext";
import { formatDate } from "../../lib/format";

interface AppHeaderProps {
  onLogout: () => void;
}

export function AppHeader({ onLogout }: AppHeaderProps) {
  const { pbName, gorName, matchDate } = useMabar();

  return (
    <div className="bg-black text-yellow-400 p-3 sticky top-0 z-10 shadow-md flex flex-col items-center justify-center border-b-2 border-yellow-400 print:hidden relative">
      <button
        onClick={onLogout}
        className="absolute right-3 top-3 bg-zinc-800 p-1.5 rounded-lg text-gray-400 hover:text-white transition-colors"
        title="Logout"
      >
        <LogIn size={18} className="rotate-180" />
      </button>
      <div className="flex items-center gap-3">
        <img
          src="https://ui-avatars.com/api/?name=Ponde&background=000000&color=facc15&rounded=true&bold=true&size=128"
          alt="Logo Ponde"
          className="w-10 h-10 rounded-full border-2 border-yellow-400 shadow-sm object-cover bg-black"
        />
        <h1 className="text-xl font-black tracking-wide uppercase">{pbName || "NAMA PB"}</h1>
      </div>

      <div className="mt-2 text-[11px] font-medium bg-zinc-900 border border-yellow-500/30 text-yellow-200 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-inner">
        <span>{gorName || "Atur GOR di Resume"}</span>
        <span className="text-yellow-500/50 text-[10px]">•</span>
        <span>{matchDate ? formatDate(matchDate) : "Tanggal Belum Diatur"}</span>
      </div>
    </div>
  );
}
