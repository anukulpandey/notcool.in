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

None. Handwritten HTML, CSS, and vanilla JS. No framework, no build step, no cookies, no analytics.

The only tracking on the site is the pair of SVG eyeballs in the wordmark, which follow your cursor. They also blink, and they get bored and wander off if you stop moving.

Other things in the ~30KB:

- interactive particle constellation (canvas, mouse-repulsion)
- custom cursor with lerped trailing ring
- 3D tilt + glare project cards with **real live status pings** to each subdomain
- text scramble effects, scroll reveals, marquee, click sparks
- coming-soon cards with CRT scanline static
- a Konami code (`↑↑↓↓←→←→BA`), or press the button in the footer that says not to
- full `prefers-reduced-motion` support

## run it

```sh
python3 -m http.server 4321
# open http://localhost:4321
```

That's it. That's the build pipeline.

## deploy

Pushed to `main` → deployed on Vercel → served at [notcool.in](https://notcool.in).
