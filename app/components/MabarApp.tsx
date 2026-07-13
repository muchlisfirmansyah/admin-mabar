import { useState } from "react";
import { MabarProvider } from "../context/MabarContext";
import type { TabId } from "../types/mabar";
import { LoginPage } from "./LoginPage";
import { AppHeader } from "./layout/AppHeader";
import { BottomNav } from "./layout/BottomNav";
import { AppModal } from "./modals/AppModal";
import { PemainTab } from "./pemain/PemainTab";
import { PertandinganTab } from "./pertandingan/PertandinganTab";
import { RekapTab } from "./rekap/RekapTab";
import { KlasemenTab } from "./klasemen/KlasemenTab";
import { TagihanTab } from "./tagihan/TagihanTab";
import { KeuanganTab } from "./keuangan/KeuanganTab";

export function MabarApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("pemain");

  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <MabarProvider>
      <div className="max-w-md mx-auto bg-gray-50 min-h-screen pb-24 shadow-xl border-x border-gray-100 font-sans relative print:max-w-none print:bg-white print:shadow-none print:border-none print:pb-0">
        <AppHeader onLogout={() => setIsAuthenticated(false)} />

        <main className="print:p-0">
          {activeTab === "pemain" && <PemainTab />}
          {activeTab === "pertandingan" && <PertandinganTab />}
          {activeTab === "rekap" && <RekapTab />}
          {activeTab === "klasemen" && <KlasemenTab />}
          {activeTab === "tagihan" && <TagihanTab />}
          {activeTab === "keuangan" && <KeuanganTab />}
        </main>

        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

        <AppModal />
      </div>
    </MabarProvider>
  );
}
