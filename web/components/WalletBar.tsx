"use client";

import { useState } from "react";
import { base } from "wagmi/chains";
import {
  useAccount,
  useChainId,
  useConnect,
  useConnectors,
  useDisconnect,
  useSwitchChain,
} from "wagmi";

export function WalletBar() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const connectors = useConnectors();
  const { connectAsync, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChainAsync, isPending: isSwitching } = useSwitchChain();
  const [sheetOpen, setSheetOpen] = useState(false);

  const wrongNetwork = isConnected && chainId !== base.id;

  return (
    <>
      {wrongNetwork && (
        <div
          className="flex flex-wrap items-center justify-center gap-3 border-b border-neon-amber/40 bg-neon-amber/10 px-4 py-2 font-mono text-xs text-neon-amber sm:text-sm"
          role="status"
        >
          <span>Wrong network — use Base for check-in.</span>
          <button
            type="button"
            disabled={isSwitching}
            onClick={() => void switchChainAsync({ chainId: base.id })}
            className="rounded border border-neon-amber/60 px-3 py-1 uppercase tracking-wide text-neon-amber hover:bg-neon-amber/10 disabled:opacity-50"
          >
            {isSwitching ? "Switching…" : "Switch to Base"}
          </button>
        </div>
      )}
      <div className="flex items-center justify-end gap-2 px-4 py-3">
        {!isConnected ? (
          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            className="rounded border border-neon-cyan/60 bg-neon-cyan/10 px-4 py-2 font-mono text-xs uppercase tracking-wider text-neon-cyan shadow-[0_0_12px_rgba(0,245,255,0.35)] transition hover:bg-neon-cyan/20"
          >
            Connect wallet
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <span className="max-w-[140px] truncate font-mono text-[10px] text-zinc-400 sm:text-xs">
              {address}
            </span>
            <button
              type="button"
              onClick={() => disconnect()}
              className="rounded border border-zinc-600 px-2 py-1 font-mono text-[10px] uppercase text-zinc-300 hover:border-neon-magenta/50 hover:text-neon-magenta"
            >
              Disconnect
            </button>
          </div>
        )}
      </div>

      {sheetOpen && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
            aria-label="Close wallet picker"
            onClick={() => setSheetOpen(false)}
          />
          <div className="fixed bottom-0 left-0 right-0 z-50 max-h-[55vh] overflow-y-auto rounded-t-2xl border border-neon-cyan/30 bg-cyber-surface/95 p-4 shadow-[0_-8px_40px_rgba(0,245,255,0.12)]">
            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-zinc-600" />
            <p className="mb-3 font-[family-name:var(--font-orbitron)] text-sm font-bold uppercase tracking-widest text-neon-cyan">
              Choose wallet
            </p>
            <ul className="flex flex-col gap-2">
              {connectors.map((connector) => (
                <li key={connector.uid}>
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={async () => {
                      await connectAsync({
                        connector,
                        chainId: base.id,
                      });
                      setSheetOpen(false);
                    }}
                    className="w-full rounded border border-zinc-600 bg-black/40 py-3 text-left font-mono text-sm text-zinc-200 transition hover:border-neon-cyan/50 hover:text-neon-cyan disabled:opacity-50"
                  >
                    {connector.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </>
  );
}
