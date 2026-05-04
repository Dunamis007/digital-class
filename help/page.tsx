import Link from 'next/link'

export default function HelpPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <Link href="/dashboard" className="text-sm text-accent underline">
        ← Back to dashboard
      </Link>
      <h1 className="mt-6 text-3xl font-bold">Help &amp; FAQ</h1>
      <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="text-lg font-semibold text-foreground">How automated systems work</h2>
          <p>
            Student Council assistants, Friday Pitch screening, incubation mentors, acceleration coaches, and daily
            missions can be powered by <strong>local Ollama models</strong> on your machine. They are AI personas, not
            human staff — we present them honestly as automated evaluation and coaching systems.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground">EduCoins (₦1 = 1 EduCoin)</h2>
          <p>
            EduCoins are shown in your wallet and ledger. Optional spends always ask for confirmation first; nothing is
            deducted automatically without your consent except clearly disclosed rules (for example weekly balance
            mechanics described on EduVault).
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground">Voice lessons</h2>
          <p>
            Spoken lessons use your browser&apos;s built-in text-to-speech. Install additional English voices in your
            device settings if prompted.
          </p>
        </section>
      </div>
    </div>
  )
}
