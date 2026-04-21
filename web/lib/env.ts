export function getBaseAppId(): string {
  return (
    process.env.NEXT_PUBLIC_BASE_APP_ID?.trim() ||
    "base-app-id-placeholder"
  );
}

export function getSiteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    (typeof window !== "undefined"
      ? window.location.origin
      : "http://localhost:3000")
  );
}

export function getChainId(): number {
  const raw = process.env.NEXT_PUBLIC_CHAIN_ID;
  if (raw) return Number.parseInt(raw, 10);
  return 8453;
}

export function getCheckInContractAddress(): `0x${string}` | undefined {
  const a = process.env.NEXT_PUBLIC_CHECK_IN_CONTRACT_ADDRESS?.trim();
  if (a?.startsWith("0x") && a.length === 42) return a as `0x${string}`;
  return undefined;
}

export function getBuilderCode(): string | undefined {
  const c = process.env.NEXT_PUBLIC_BUILDER_CODE?.trim();
  return c || undefined;
}

export function getBuilderCodeSuffixHex(): `0x${string}` | undefined {
  const s = process.env.NEXT_PUBLIC_BUILDER_CODE_SUFFIX?.trim();
  if (s?.startsWith("0x")) return s as `0x${string}`;
  return undefined;
}
