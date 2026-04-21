import { createConfig, http, cookieStorage, createStorage } from "wagmi";
import { base, mainnet } from "wagmi/chains";
import { injected, baseAccount } from "wagmi/connectors";

export const config = createConfig({
  chains: [base, mainnet],
  connectors: [
    injected(),
    baseAccount({
      appName: "Simple Battle Royale",
    }),
  ],
  storage: createStorage({ storage: cookieStorage }),
  ssr: true,
  transports: {
    [base.id]: http(),
    [mainnet.id]: http(),
  },
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
