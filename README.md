# notcool.in

A wall of internet experiments. Every subdomain is a separate fever dream.

**Live at [notcool.in](https://notcool.in)** — this repo is the landing page.

## the wall

| subdomain | what it is |
| --- | --- |
| [droppie.notcool.in](https://droppie.notcool.in) | No-code Merkle airdrops on any EVM chain. CSV in, verifiable token drop out. |
| [gatekeep.notcool.in](https://gatekeep.notcool.in) | Stripe for AI agent API calls. x402 pay-per-call gates for any REST API. |
| `???.notcool.in` | soon™ |

## stack

- **Next.js 15** (App Router, fully static prerender) + **React 19** + **TypeScript**
- **Tailwind CSS v4** (CSS-first `@theme`, no config file)
- **framer-motion** — entrance choreography, scroll-linked parallax, magnetic buttons
- **lenis** — smooth scrolling
- **canvas 2D** — the hero void is inhabited by hand-drawn eye-creatures, no libraries

## the important features

- 👀 the "OO" in the wordmark are SVG eyes that follow your cursor, blink, and wander off when bored — this is the only tracking on the site
- 🌑 the hero void is full of little glowing eye-creatures lurking at different depths: they watch your cursor, get scared if you chase them, and reappear somewhere darker. one very large, very dim pair occasionally opens deep in the background. don't worry about it
- 🟢 the status dots on project cards are **real live pings** with latency, fired from your browser
- 🖼️ project screenshots are real captures of the live apps, framed in browser chrome with scroll parallax
- 📊 a bento "uncool dashboard": system status, privacy report (0 cookies), proof-of-uncool terminal
- ✍️ a manifesto that lights up word-by-word as you scroll
- 🪩 Konami code (`↑↑↓↓←→←→BA`) — or press the footer button that says not to
- ♿ full `prefers-reduced-motion` support; `?noanim=1` skips all animation (used by headless screenshot tests)

Also: `curl -sI notcool.in | grep -i x-certified`

## run it

```sh
npm install
npm run dev
```

## deploy

`vercel deploy --prod` → served at [notcool.in](https://notcool.in).
