import { CheckInPanel } from "@/components/CheckInPanel";
import { CyberBackground } from "@/components/CyberBackground";
import { GameClient } from "@/components/game/GameClient";
import { WalletBar } from "@/components/WalletBar";

export default function Home() {
  return (
    <main className="relative min-h-dvh">
      <CyberBackground />
      <WalletBar />
      <GameClient />
      <footer className="fixed bottom-0 left-0 right-0 z-30 border-t border-zinc-800/80 bg-black/60 p-3 backdrop-blur-md">
        <CheckInPanel />
      </footer>
    </main>
  );
}
