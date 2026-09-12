import React from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  Sparkles,
  Shield,
  Zap,
  Flame,
  Coins,
  ArrowRight,
  Brain,
  Dumbbell,
  CheckCircle2,
  Lock,
  Smartphone,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

// Dynamic import of 3D Canvas with ssr: false for zero hydration errors
const Hero3DCore = dynamic(
  () => import("@/components/effects/Hero3DCore").then((mod) => mod.Hero3DCore),
  { ssr: false }
);

export default function LandingPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Life RPG",
    "operatingSystem": "Web",
    "applicationCategory": "ProductivityApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "Transform real-world productivity into an RPG progression system with quests, XP, non-linear leveling, streaks, and shop economy."
  };

  return (
    <div className="min-h-screen bg-background text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Top Navigation */}
      <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-background/80 backdrop-blur-xl px-6 md:px-12 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-violet-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 ring-1 ring-white/30">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-black font-sans tracking-widest bg-gradient-to-r from-cyan-400 via-teal-300 to-violet-400 bg-clip-text text-transparent">
                LIFE RPG
              </span>
              <p className="text-[10px] text-slate-400 font-mono tracking-wider hidden sm:block">
                LEVEL UP YOUR REAL LIFE
              </p>
            </div>
          </Link>

          <nav className="flex items-center gap-3 md:gap-4" aria-label="Main Navigation">
            <Link
              href="/login"
              className="px-4 py-2 rounded-xl text-sm font-mono text-slate-300 hover:text-white hover:bg-white/5 transition-colors focus-visible:ring-2 focus-visible:ring-cyan-400 outline-none"
            >
              SIGN IN
            </Link>
            <Link href="/register">
              <Button variant="secondary" size="md" className="font-mono text-xs uppercase tracking-wider">
                START JOURNEY
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-24 md:pt-24 md:pb-32 px-6 md:px-12 overflow-hidden cyber-grid">
        {/* Glow Spheres */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-cyan-500/15 via-violet-600/15 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Left Hero Pitch */}
          <div className="lg:col-span-7 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-elevated/90 border border-cyan-500/30 text-cyan-300 font-mono text-xs uppercase tracking-wider mb-6 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>THE NEXT-GEN REAL-LIFE GAMIFICATION REALM</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black font-sans tracking-tight text-white leading-[1.1] mb-6">
              LEVEL UP <br />
              <span className="text-transparent bg-gradient-to-r from-cyan-400 via-teal-300 to-violet-400 bg-clip-text text-glow-cyan">
                YOUR REAL LIFE.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 font-sans leading-relaxed mb-8">
              Turn your daily studying, workouts, and coding goals into epic RPG quests.
              Earn authoritative XP, unlock non-linear levels, forge attributes, and become
              the protagonist of your own life.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link href="/register" className="w-full sm:w-auto">
                <Button variant="secondary" size="lg" className="w-full font-mono tracking-wider">
                  <span>START YOUR JOURNEY</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/login" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full font-mono">
                  EXPLORE THE REALM
                </Button>
              </Link>
            </div>

            {/* Micro proof badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 mt-10 text-xs font-mono text-slate-400">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>Zero Fake Persistence</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-violet-400" />
                <span>Non-Linear XP Engine</span>
              </div>
              <div className="flex items-center gap-2">
                <Coins className="w-4 h-4 text-amber-400" />
                <span>Virtual Shop Economy</span>
              </div>
            </div>
          </div>

          {/* Right Hero 3D Interactive Core */}
          <div className="lg:col-span-5 flex justify-center">
            <Hero3DCore />
          </div>
        </div>
      </section>

      {/* The Core Feedback Loop */}
      <section className="py-20 px-6 md:px-12 bg-surface/50 border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="primary" size="md" className="mb-3">
              THE CORE HABIT ENGINE
            </Badge>
            <h2 className="text-3xl font-black font-sans text-white">
              HOW LIFE RPG REWIRES YOUR BRAIN
            </h2>
            <p className="text-sm text-slate-400 font-sans mt-2">
              Transform tedious to-dos into an intoxicating, dopamine-rich loop of authentic advancement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                title: "Real-Life Action",
                desc: "Study 30 mins, complete coding problems, or hit the gym.",
                icon: Dumbbell,
                color: "text-rose-400",
                border: "border-rose-500/30",
              },
              {
                step: "02",
                title: "Complete Quest",
                desc: "One click triggers instant tactile celebratory particle bursts.",
                icon: CheckCircle2,
                color: "text-emerald-400",
                border: "border-emerald-500/30",
              },
              {
                step: "03",
                title: "XP & Attribute Boost",
                desc: "Server authoritatively calculates non-linear XP, level-ups, and attributes.",
                icon: Zap,
                color: "text-cyan-400",
                border: "border-cyan-500/30",
              },
              {
                step: "04",
                title: "Claim Virtual Glory",
                desc: "Spend gold in the Bazaar to customize your frame, theme, and aura.",
                icon: Coins,
                color: "text-amber-400",
                border: "border-amber-500/30",
              },
            ].map((card) => {
              const Icon = card.icon;
              return (
                <Card
                  key={card.step}
                  className={`p-6 bg-surface-elevated/80 border ${card.border} hover:-translate-y-1 transition-all`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-2xl font-black text-slate-600">
                      {card.step}
                    </span>
                    <Icon className={`w-6 h-6 ${card.color}`} />
                  </div>
                  <h3 className="text-base font-bold font-sans text-white mb-2">
                    {card.title}
                  </h3>
                  <p className="text-xs text-slate-400 font-sans leading-relaxed">
                    {card.desc}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="secondary" size="md" className="mb-3">
              PILLARS OF EMPOWERMENT
            </Badge>
            <h2 className="text-3xl font-black font-sans text-white">
              BUILT FOR AUTHENTIC PROGRESSION
            </h2>
            <p className="text-sm text-slate-400 font-sans mt-2">
              Every system is engineered from the ground up to guarantee real accountability and game satisfaction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8 hover:border-cyan-500/40 transition-all">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center mb-6 text-cyan-400">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-sans text-white mb-3">
                Non-Linear Progression
              </h3>
              <p className="text-sm text-slate-400 font-sans leading-relaxed">
                No linear point systems. Levels follow exponential curves requiring deeper mastery as you ascend from Level 1 to 50+.
              </p>
            </Card>

            <Card className="p-8 hover:border-purple-500/40 transition-all">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-6 text-purple-400">
                <Brain className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-sans text-white mb-3">
                5 Heroic Attributes
              </h3>
              <p className="text-sm text-slate-400 font-sans leading-relaxed">
                Balance Strength, Intellect, Discipline, Vitality, and Creativity to build a versatile, unstoppable real-life character.
              </p>
            </Card>

            <Card className="p-8 hover:border-amber-500/40 transition-all">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center mb-6 text-amber-400">
                <Flame className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-sans text-white mb-3">
                Streak Defense Engine
              </h3>
              <p className="text-sm text-slate-400 font-sans leading-relaxed">
                Server-validated UTC streak mechanics that reward unrelenting daily discipline while holding you strictly accountable.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-20 px-6 md:px-12 bg-gradient-to-b from-surface to-background border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-black font-sans text-white mb-4">
            READY TO BECOME THE PROTAGONIST?
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto mb-8 font-sans">
            Join the realm today. Claim your initial 5 starter quests, receive 50 bonus gold, and embark on the ultimate self-transformation.
          </p>
          <Link href="/register">
            <Button variant="secondary" size="lg" className="font-mono tracking-wider">
              CLAIM HERO ACCOUNT & PLAY FREE
            </Button>
          </Link>
        </div>
      </section>

      {/* Accessible Semantic Footer */}
      <footer className="py-12 px-6 md:px-12 border-t border-white/10 bg-background font-mono text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-slate-300 font-bold">LIFE RPG &bull; Tech Zephyr 4.0</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/login" className="hover:text-cyan-400 transition-colors">
              Sign In
            </Link>
            <Link href="/register" className="hover:text-cyan-400 transition-colors">
              Create Account
            </Link>
            <Link href="/dashboard" className="hover:text-cyan-400 transition-colors">
              Dashboard
            </Link>
            <Link href="/shop" className="hover:text-cyan-400 transition-colors">
              Realm Shop
            </Link>
          </div>

          <div>
            &copy; {new Date().getFullYear()} Life RPG. Built for Hackathon Tech Zephyr 4.0.
          </div>
        </div>
      </footer>
    </div>
  );
}
