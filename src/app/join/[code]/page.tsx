"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function JoinGroupPage() {
  const params = useParams();
  const router = useRouter();
  const code = params.code as string;
  const [step, setStep] = useState<"login" | "create" | "success">("login");
  const [isLoading, setIsLoading] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({ name: "", email: "", password: "" });

  // Demo group
  const groupName = "Goa Trip 2026";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setStep("success");
      setIsLoading(false);
    }, 800);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setStep("success");
      setIsLoading(false);
    }, 800);
  };

  if (step === "success") {
    return (
      <div className="min-h-screen flex flex-col">
        <header className="p-6">
          <Link href="/" className="text-[17px] font-semibold tracking-tight">SplitSpot</Link>
        </header>
        <main className="flex-1 flex items-center justify-center px-6">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-[var(--success)]/10 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">✓</span>
            </div>
            <h1 className="text-2xl font-semibold mb-2">You're in!</h1>
            <p className="text-[var(--muted-foreground)] mb-6">
              You've joined <strong>{groupName}</strong>
            </p>
            <Link href="/app/dashboard">
              <Button>Go to Dashboard</Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  if (step === "create") {
    return (
      <div className="min-h-screen flex flex-col">
        <header className="p-6">
          <Link href="/" className="text-[17px] font-semibold tracking-tight">SplitSpot</Link>
        </header>
        <main className="flex-1 flex items-center justify-center px-6 pb-20">
          <div className="w-full max-w-sm">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-semibold tracking-tight mb-2">Create Account</h1>
              <p className="text-[var(--muted-foreground)]">
                Join {groupName}
              </p>
            </div>
            <Card className="p-6">
              <form onSubmit={handleRegister} className="space-y-4">
                <Input
                  label="Full Name"
                  placeholder="Your name"
                  value={registerData.name}
                  onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                  required
                />
                <Input
                  type="email"
                  label="Email"
                  placeholder="you@example.com"
                  value={registerData.email}
                  onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                  required
                />
                <Input
                  type="password"
                  label="Password"
                  placeholder="••••••••"
                  value={registerData.password}
                  onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                  required
                />
                <Button type="submit" className="w-full" isLoading={isLoading}>
                  Create Account & Join
                </Button>
              </form>
            </Card>
            <p className="text-center text-sm text-[var(--muted-foreground)] mt-6">
              Already have an account?{" "}
              <button onClick={() => setStep("login")} className="text-[var(--primary)]">
                Sign in
              </button>
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-6">
        <Link href="/" className="text-[17px] font-semibold tracking-tight">SplitSpot</Link>
      </header>
      <main className="flex-1 flex items-center justify-center px-6 pb-20">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-[var(--secondary)] flex items-center justify-center mx-auto mb-4 text-xl font-semibold">
              {groupName.split(" ").map((w) => w[0]).join("")}
            </div>
            <h1 className="text-2xl font-semibold tracking-tight mb-2">Join {groupName}</h1>
            <p className="text-[var(--muted-foreground)]">
              Sign in or create an account to join
            </p>
          </div>

          <Card className="p-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="email"
                label="Email"
                placeholder="you@example.com"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                required
              />
              <Input
                type="password"
                label="Password"
                placeholder="••••••••"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                required
              />
              <Button type="submit" className="w-full" isLoading={isLoading}>
                Sign In & Join
              </Button>
            </form>
          </Card>

          <p className="text-center text-sm text-[var(--muted-foreground)] mt-6">
            Don't have an account?{" "}
            <button onClick={() => setStep("create")} className="text-[var(--primary)]">
              Create one
            </button>
          </p>
        </div>
      </main>
    </div>
  );
}
