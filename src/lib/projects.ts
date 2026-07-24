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
    slug: "tryo",
    name: "tryo",
    url: "https://tryo.notcool.in",
    host: "tryo.notcool.in",
    tagline: "Try any makeup before you buy it.",
    description:
      "Paste a lipstick, blush or foundation link from Nykaa, Sephora, Amazon or anywhere — tryo's AI extracts the true pigment and renders it live on your face, in real time, entirely in your browser.",
    tags: ["beauty tech", "AR try-on", "AI shade match"],
    accent: "#e11d74",
    screenshot: "/screens/tryo.png",
  },
  {
    slug: "cj",
    name: "coding jungle",
    url: "https://cj.notcool.in",
    host: "cj.notcool.in",
    tagline: "Your hub for hacking, AI & tech.",
    description:
      "Bite-sized ethical hacking, cyber security, AI tools and tech hacks — the kind you actually remember. Educational content for learning and defending your own devices, from @coding_jungle_.",
    tags: ["ethical hacking", "cyber security", "AI tools"],
    accent: "#a855f7",
    screenshot: "/screens/cj.png",
  },
  {
    slug: "wa-spammer",
    name: "wa-repeater",
    url: "https://anukulpandey.github.io/wa-spammer/?msg=hello&count=10&delay=600",
    host: "anukulpandey.github.io/wa-spammer",
    tagline: "Test repeated sends on your own account.",
    description:
      "An educational demo: enter a message, a count and a delay, and it generates a one-line console snippet for testing repeated sends against your own WhatsApp Web chats. The page sends nothing itself — it just writes the code for you to run on your own account.",
    tags: ["dev toy", "console snippet", "educational"],
    accent: "#25d366",
    screenshot: "/screens/wa-spammer.png",
  },
  {
    slug: "veilpay",
    name: "veilpay",
    url: "https://veilpay.notcool.in",
    host: "veilpay.notcool.in",
    tagline: "Payroll on-chain, salaries invisible.",
    description:
      "Pay your team in an encrypted stablecoin on Avalanche. Salary amounts are sealed with zk-SNARKs + ElGamal encryption and payslips ride encrypted inside the transaction — yet a designated auditor can still decrypt for compliance. Live on Fuji.",
    tags: ["zk-SNARKs", "eERC", "avalanche"],
    accent: "#ec4899",
    screenshot: "/screens/veilpay.png",
  },
  {
    slug: "owlnighter",
    name: "owlnighter",
    url: "https://owlnighter.notcool.in",
    host: "owlnighter.notcool.in",
    tagline: "Close the lid. The owl stays up.",
    description:
      "A tiny pixel-owl menu bar app for macOS that keeps downloads downloading, builds building and servers serving — even with the lid shut. No Electron, no accounts, ~0.5 MB. He blinks. You can boop him.",
    tags: ["macos", "menu bar", "native app"],
    accent: "#2563eb",
    screenshot: "/screens/owlnighter.png",
  },
  {
    slug: "kleos",
    name: "kleos",
    url: "https://kleos.notcool.in",
    host: "kleos.notcool.in",
    tagline: "The long way home.",
    description:
      "A dark mythological action-platformer inspired by Homer's Odyssey. Ten winters of war are over — one cursed king must carve a road home through the gods of Olympus. Join the waitlist.",
    tags: ["game", "action-platformer", "waitlist"],
    accent: "#5eead4",
    screenshot: "/screens/kleos.png",
  },
];
