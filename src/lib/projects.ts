export type Project = {
  slug: string;
  name: string;
  url: string;
  host: string;
  tagline: string;
  description: string;
  tags: string[];
  accent: string;
  screenshot: string;
};

export const projects: Project[] = [
  {
    slug: "droppie",
    name: "droppie",
    url: "https://droppie.notcool.in",
    host: "droppie.notcool.in",
    tagline: "Airdrops that land.",
    description:
      "No-code Merkle airdrops on any EVM chain. Turn a CSV into a verifiable token drop — deployed straight from your wallet, claimable in one click. No scripts, no gas-guzzling loops.",
    tags: ["web3", "airdrops", "merkle", "7 chains"],
    accent: "#3dffa0",
    screenshot: "/screens/droppie.png",
  },
  {
    slug: "gatekeep",
    name: "gatekeep",
    url: "https://gatekeep.notcool.in",
    host: "gatekeep.notcool.in",
    tagline: "Stripe for AI agent API calls.",
    description:
      "Wrap any REST API in an x402 pay-per-call gate. AI agents pay per request in USDC — automatically, on-chain, with no API keys, no subscriptions, and no humans in the loop.",
    tags: ["x402", "ai agents", "USDC", "payments"],
    accent: "#818cf8",
    screenshot: "/screens/gatekeep.png",
  },
  {
    slug: "sarae",
    name: "sarae",
    url: "https://sarae.notcool.in",
    host: "sarae.notcool.in",
    tagline: "Try any makeup before you buy it.",
    description:
      "Paste a lipstick, blush or foundation link from Nykaa, Sephora, Amazon or anywhere — Sarae's AI extracts the true pigment and renders it live on your face, in real time, entirely in your browser.",
    tags: ["beauty tech", "AR try-on", "AI shade match"],
    accent: "#ff2f8e",
    screenshot: "/screens/sarae.png",
  },
];
