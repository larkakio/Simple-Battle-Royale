import { Attribution } from "ox/erc8021";
import type { Hex } from "viem";
import { getBuilderCode, getBuilderCodeSuffixHex } from "@/lib/env";

/**
 * ERC-8021 suffix for Builder Code attribution on `checkIn` calldata.
 * Prefer `NEXT_PUBLIC_BUILDER_CODE` (bc_…); optional hex override for edge cases.
 */
export function getCheckInDataSuffix(): Hex | undefined {
  const override = getBuilderCodeSuffixHex();
  if (override) return override;
  const code = getBuilderCode();
  if (!code) return undefined;
  return Attribution.toDataSuffix({ codes: [code] });
}
