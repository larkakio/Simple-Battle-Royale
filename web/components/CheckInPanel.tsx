"use client";

import { useMemo } from "react";
import { base } from "wagmi/chains";
import { useAccount, useChainId, useReadContract, useSwitchChain, useWriteContract } from "wagmi";
import { checkInAbi } from "@/lib/checkInAbi";
import { getCheckInDataSuffix } from "@/lib/builderAttribution";
import { getCheckInContractAddress } from "@/lib/env";

export function CheckInPanel() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const contractAddress = getCheckInContractAddress();
  const dataSuffix = useMemo(() => getCheckInDataSuffix(), []);

  const { data: streak } = useReadContract({
    address: contractAddress,
    abi: checkInAbi,
    functionName: "streak",
    args: address ? [address] : undefined,
    query: { enabled: !!contractAddress && !!address },
  });

  const { data: lastDay } = useReadContract({
    address: contractAddress,
    abi: checkInAbi,
    functionName: "lastCheckInDayIndex",
    args: address ? [address] : undefined,
    query: { enabled: !!contractAddress && !!address },
  });

  const { switchChainAsync, isPending: isSwitching } = useSwitchChain();
  const { writeContractAsync, isPending: isWriting, error } = useWriteContract();

  const baseId = base.id;
  const busy = isSwitching || isWriting;
  const canSubmit =
    isConnected && !!contractAddress && !!address && !busy;

  async function handleCheckIn() {
    if (!contractAddress || !address) return;
    if (chainId !== baseId) {
      await switchChainAsync({ chainId: baseId });
    }
    await writeContractAsync({
      address: contractAddress,
      abi: checkInAbi,
      functionName: "checkIn",
      args: [],
      chainId: baseId,
      ...(dataSuffix ? { dataSuffix } : {}),
    });
  }

  return (
    <section className="border border-zinc-700/80 bg-black/30 p-4">
      <h2 className="mb-2 font-[family-name:var(--font-orbitron)] text-xs font-bold uppercase tracking-[0.2em] text-neon-magenta">
        Daily check-in (Base)
      </h2>
      {!contractAddress && (
        <p className="font-mono text-[11px] text-zinc-500">
          Contract address not configured.
        </p>
      )}
      {contractAddress && isConnected && address && (
        <div className="mb-3 grid gap-1 font-mono text-[10px] text-zinc-400 sm:text-xs">
          <span>
            Streak:{" "}
            <span className="text-neon-cyan">{streak?.toString() ?? "—"}</span>
          </span>
          <span>
            Last day index:{" "}
            <span className="text-zinc-300">{lastDay?.toString() ?? "—"}</span>
          </span>
        </div>
      )}
      <button
        type="button"
        disabled={!canSubmit}
        onClick={() => void handleCheckIn()}
        className="w-full rounded border border-neon-magenta/50 bg-neon-magenta/10 py-2 font-mono text-xs uppercase tracking-wider text-neon-magenta shadow-[0_0_14px_rgba(255,0,170,0.25)] transition hover:bg-neon-magenta/20 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {busy ? "Confirm in wallet…" : "Check in on-chain"}
      </button>
      {error && (
        <p className="mt-2 font-mono text-[10px] text-red-400">
          {error.message.slice(0, 120)}
        </p>
      )}
    </section>
  );
}
