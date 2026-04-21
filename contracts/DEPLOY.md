# Deploy `CheckIn` to Base mainnet

1. Set `BASE_RPC_URL` (or use a public Base RPC) and deployer private key in your environment (never commit keys).
2. From this directory:

```bash
forge create src/CheckIn.sol:CheckIn --rpc-url "$BASE_RPC_URL" --private-key "$PRIVATE_KEY" --broadcast
```

3. Copy the deployed address into Vercel / `.env` as `NEXT_PUBLIC_CHECK_IN_CONTRACT_ADDRESS`.
4. Verify on Basescan if desired:

```bash
forge verify-contract --chain base <ADDRESS> src/CheckIn.sol:CheckIn
```

Gas is paid on Base L2; the contract rejects any `msg.value` on `checkIn`.
