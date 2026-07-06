import Eyes from "@/components/Eyes";

export default function NotFound() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-6 px-6 text-center">
      <Eyes eyeClass="h-12 w-12" />
      <h1 className="font-display text-7xl lowercase tracking-tight sm:text-8xl">404</h1>
      <p className="max-w-sm text-fog">
        this page is so uncool it doesn&apos;t exist. the eyes looked everywhere.
      </p>
      <a
        href="/"
        className="glow-acid mt-2 inline-flex items-center gap-2 rounded-full bg-acid px-8 py-4 font-mono text-sm font-bold text-void"
      >
        ← back to the wall
      </a>
    </main>
  );
}
