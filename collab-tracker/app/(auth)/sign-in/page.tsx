"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sticker } from "@/components/ui/sticker";
import { AuroraBackground } from "@/components/decor/aurora-background";
import { ParticleField } from "@/components/decor/particle-field";
import { useToast } from "@/components/ui/toast";

export default function SignInPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    
    const form = new FormData(event.currentTarget);
    const email = form.get("email")?.toString();
    const password = form.get("password")?.toString();

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false
    });

    if (result?.error) {
      addToast({
        type: "error",
        title: "Sign in failed",
        description: "Invalid email or password. Please try again."
      });
      setIsLoading(false);
      return;
    }

    addToast({
      type: "success",
      title: "Welcome back!",
      description: "Successfully signed in to your account."
    });
    
    router.push("/dashboard");
  }

  return (
    <div className="relative overflow-hidden bg-slate-950 text-slate-100">
      <AuroraBackground className="absolute inset-0 opacity-80">
        <ParticleField quantity={36} />
      </AuroraBackground>

      <div className="relative z-10 mx-auto grid min-h-screen w-full max-w-6xl grid-cols-1 items-center gap-12 px-6 py-16 lg:grid-cols-[1fr_1fr] lg:px-12">
        <motion.div
          className="space-y-8"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <Sticker icon={<span className="text-lg">🔥</span>} label="Habit momentum unlocked" accent="#38bdf8" />
          <div className="space-y-6">
            <h1 className="text-balance text-4xl font-semibold leading-tight md:text-5xl">
              Slip back into your <span className="text-gradient">streak flow</span> and sync with your crew.
            </h1>
            <p className="max-w-lg text-base text-slate-300">
              Pick up exactly where you left off. Workspace updates, personal rituals, and collaborative goals are waiting with glowing feedback.
            </p>
          </div>
          <div className="grid gap-4 text-sm text-slate-300/80 md:max-w-sm">
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/20 text-sky-200">1</span>
              <span>Secure email + password sign-in with instant workspace sync.</span>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-fuchsia-500/20 text-fuchsia-200">2</span>
              <span>Celebrate streak milestones with animated badges and reactions.</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="relative"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
        >
          <div className="absolute -inset-4 rounded-[32px] bg-gradient-to-br from-sky-500/25 via-indigo-500/20 to-purple-500/25 blur-3xl" />
          <div className="gradient-border relative rounded-[28px] border border-white/10 bg-slate-900/70 p-10 shadow-2xl shadow-black/40 backdrop-blur-2xl">
            <div className="mb-8 space-y-2 text-center">
              <h2 className="text-3xl font-semibold text-slate-100">Sign back in</h2>
              <p className="text-sm text-slate-400">We kept the confetti ready for your next streak win.</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-400" htmlFor="email">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-400"
                  placeholder="you@team.com"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-400" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-400"
                  placeholder="••••••••"
                />
              </div>
              <Button 
                type="submit" 
                disabled={isLoading}
                className="h-12 w-full rounded-xl bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:brightness-110 disabled:opacity-50"
              >
                {isLoading ? "Signing in..." : "Sign in & continue"}
              </Button>
            </form>
            <p className="mt-6 text-center text-sm text-slate-400">
              Need an account? {""}
              <Link className="font-semibold text-sky-300 transition hover:text-sky-200" href="/sign-up">
                Create one here
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
