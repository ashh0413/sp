import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--background)]/80 backdrop-blur-xl border-b border-[var(--border)]/50">
        <div className="max-w-5xl mx-auto px-6 h-14 flex justify-between items-center">
          <h1 className="text-[17px] font-semibold tracking-tight">SplitSpot</h1>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link href="/auth/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link href="/auth/register">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-semibold tracking-tight mb-6 leading-tight">
            Split expenses<br />with anyone
          </h2>
          <p className="text-xl text-[var(--muted-foreground)] mb-10 max-w-lg mx-auto leading-relaxed">
            Create groups, track what you owe, and settle up — no app install needed for your friends.
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/auth/register">
              <Button size="lg">Start Free</Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="secondary" size="lg">Sign In</Button>
            </Link>
          </div>
        </div>

        {/* Preview */}
        <div className="mt-20 max-w-4xl mx-auto">
          <div className="bg-[var(--card)] rounded-3xl border border-[var(--border)] shadow-2xl shadow-black/5 overflow-hidden">
            <div className="bg-[var(--secondary)] px-5 py-3 border-b border-[var(--border)] flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <div className="p-8 text-left">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-[var(--secondary)] rounded-2xl">
                  <div>
                    <p className="font-medium">Goa Trip 2026</p>
                    <p className="text-sm text-[var(--muted-foreground)]">4 members · 8 expenses</p>
                  </div>
                  <p className="text-sm font-medium">₹2,350</p>
                </div>
                <div className="flex items-center justify-between p-4 bg-[var(--secondary)] rounded-2xl">
                  <div>
                    <p className="font-medium">Dinner at Sando</p>
                    <p className="text-sm text-[var(--muted-foreground)]">3 members · Split equally</p>
                  </div>
                  <p className="text-sm font-medium text-[var(--success)]">Settled</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-[var(--border)]">
        <p className="text-center text-sm text-[var(--muted-foreground)]">
          Built with Next.js
        </p>
      </footer>
    </div>
  );
}
