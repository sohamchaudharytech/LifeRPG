"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Sparkles, Shield, User, Mail, KeyRound } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background cyber-grid relative">
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-violet-600 to-cyan-500 mx-auto flex items-center justify-center shadow-lg shadow-violet-600/30 mb-4 ring-1 ring-white/30">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-black font-sans tracking-tight text-white mb-2">
            FORGE YOUR HERO
          </h1>
          <p className="text-xs text-slate-400 font-mono">
            Register to claim your initial stats, 50 Gold, and starter quests
          </p>
        </div>

        <Card className="p-8 bg-surface-elevated/95 border-white/10 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div
                className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-mono"
                role="alert"
              >
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="reg-username"
                className="block text-xs font-mono uppercase text-slate-300 mb-1.5"
              >
                Hero Name (Username) *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="reg-username"
                  type="text"
                  required
                  minLength={3}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. CyberVanguard"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-violet-400 font-sans"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="reg-email"
                className="block text-xs font-mono uppercase text-slate-300 mb-1.5"
              >
                Communications (Email) *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="reg-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="hero@liferpg.dev"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-violet-400 font-sans"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="reg-password"
                className="block text-xs font-mono uppercase text-slate-300 mb-1.5"
              >
                Secret Passcode (Min. 8 characters) *
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="reg-password"
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-violet-400 font-sans"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full mt-2 font-mono uppercase tracking-wider text-sm"
            >
              INITIALIZE CHARACTER
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <p className="text-xs text-slate-400 font-sans">
              Already have an active hero?{" "}
              <Link
                href="/login"
                className="text-violet-400 hover:text-violet-300 font-bold underline underline-offset-4 ml-1 outline-none focus-visible:ring-1 focus-visible:ring-violet-400"
              >
                Sign in to your realm
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
