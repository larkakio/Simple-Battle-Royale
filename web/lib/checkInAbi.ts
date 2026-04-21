export const checkInAbi = [
  {
    type: "function",
    name: "checkIn",
    stateMutability: "payable",
    inputs: [],
    outputs: [],
  },
  {
    type: "function",
    name: "lastCheckInDayIndex",
    stateMutability: "view",
    inputs: [{ name: "user", type: "address" }],
    outputs: [{ name: "dayIndex", type: "uint256" }],
  },
  {
    type: "function",
    name: "streak",
    stateMutability: "view",
    inputs: [{ name: "user", type: "address" }],
    outputs: [{ type: "uint256" }],
  },
  {
    type: "event",
    name: "CheckedIn",
    inputs: [
      { name: "user", type: "address", indexed: true },
      { name: "dayIndex", type: "uint256", indexed: false },
      { name: "streak", type: "uint256", indexed: false },
    ],
  },
] as const;
