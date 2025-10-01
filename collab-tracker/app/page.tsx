import Link from "next/link";
import { Sparkles, Users, Zap, CalendarRange } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sticker } from "@/components/ui/sticker";
import { Card } from "@/components/ui/card";
import { AuroraBackground } from "@/components/decor/aurora-background";
import { ParticleField } from "@/components/decor/particle-field";

const features = [
  {
    title: "Collaborative Workbenches",
    description: "Invite your crew, align on shared goals, and keep motivation high with live streak feeds.",
    icon: <Users className="h-6 w-6 text-sky-300" />
  },
  {
    title: "Playful Streak Celebrations",
    description: "Confetti bursts, milestone badges, and animated stickers keep wins loud and proud.",
    icon: <Sparkles className="h-6 w-6 text-fuchsia-300" />
  },
  {
    title: "Flexible Goal Schedules",
    description: "Mix daily rituals, weekday habits, and custom routines with effortless tracking.",
    icon: <CalendarRange className="h-6 w-6 text-emerald-300" />
  }
];

export default function HomePage() {
  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <AuroraBackground className="absolute inset-0">
        <ParticleField quantity={28} />
      </AuroraBackground>

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-24 px-6 pb-24 pt-32 md:px-10">
        <section className="grid grid-cols-1 items-center gap-12 md:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-8">
            <Sticker
              icon={<Zap className="h-5 w-5 text-white" />}
              label="New: Social streak feed + goal reactions"
              accent="#ec4899"
              className="shadow-[0_18px_50px_-24px_rgba(236,72,153,0.65)]"
            />
            <div className="space-y-6">
              <h1 className="text-balance text-5xl font-semibold tracking-tight md:text-6xl">
                <span className="text-gradient">Ignite habits together,</span> keep the streaks alive.
              </h1>
              <p className="max-w-xl text-lg text-slate-300">
                StreakForge blends playful gamification with serious productivity. Smash personal goals, rally workspace crews, and watch streaks glow in real time with gorgeous feedback.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <Button asChild size="lg" className="h-12 gap-2 rounded-full px-6 text-base font-semibold">
                <Link href="/sign-up">
                  Start for free
                  <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </Link>
              </Button>
              <Button asChild variant="secondary" size="lg" className="h-12 rounded-full border border-white/10 bg-white/5 px-6 text-base text-slate-100">
                <Link href="/sign-in">I already have an account</Link>
              </Button>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-slate-400">
              <span className="flex items-center gap-2">
                <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                Real-time streak sync
              </span>
              <span className="flex items-center gap-2">
                <span className="inline-flex h-2 w-2 rounded-full bg-sky-400" />
                Workspace collaboration
              </span>
              <span className="flex items-center gap-2">
                <span className="inline-flex h-2 w-2 rounded-full bg-fuchsia-400" />
                Custom goal rhythms
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-indigo-500/30 via-sky-500/20 to-purple-500/30 blur-3xl" />
            <Card className="relative z-10 flex flex-col gap-6 rounded-3xl border-white/10 bg-slate-900/70 p-8">
              <div className="space-y-3">
                <h2 className="text-xl font-semibold text-slate-100">Streak energy on display</h2>
                <p className="text-sm text-slate-400">
                  Follow the pulse of your workspace with animated accomplishments, streak trophies, and live reactions.
                </p>
              </div>
              <div className="grid gap-4">
                {["Alice crushed Meditation", "Nina hit 21-day design streak", "Team Flow unlocked Focus badge"].map((item, index) => (
                  <div
                    key={item}
                    className="relative overflow-hidden rounded-2xl border border-white/5 bg-white/5 p-4 text-sm text-slate-200"
                  >
                    <span className="absolute right-4 top-4 h-1.5 w-24 rounded-full bg-gradient-to-r from-purple-400 via-sky-400 to-emerald-400" />
                    <span className="font-medium text-slate-100">{item}</span>
                    <p className="mt-2 text-xs text-slate-400">Success ripple • {index * 3 + 2} mins ago</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="group h-full border-white/10 bg-white/5 p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white shadow-inner shadow-slate-950/40 group-hover:scale-110 group-hover:shadow-slate-900/50 transition-transform">
                {feature.icon}
              </div>
              <h3 className="mt-6 text-lg font-semibold text-slate-100">{feature.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-400">{feature.description}</p>
            </Card>
          ))}
        </section>
      </div>
    </main>
  );
}
