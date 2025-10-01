"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sticker } from "@/components/ui/sticker";
import { AuroraBackground } from "@/components/decor/aurora-background";
import { ParticleField } from "@/components/decor/particle-field";
import { useToast } from "@/components/ui/toast";

export default function SignUpPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    
    const form = new FormData(event.currentTarget);
    const payload = {
      email: form.get("email") as string,
      password: form.get("password") as string,
      name: form.get("name") as string
    };

    try {
      const response = await axios.post("/api/auth/register", payload);
      
      addToast({
        type: "success",
        title: "Account created successfully!",
        description: "You can now sign in with your credentials."
      });
      
      router.push("/sign-in");
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || "Failed to create account";
      
      addToast({
        type: "error",
        title: "Registration failed",
        description: errorMessage
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="relative overflow-hidden bg-slate-950 text-slate-100">
      <AuroraBackground className="absolute inset-0 opacity-85">
        <ParticleField quantity={40} />
      </AuroraBackground>

      <div className="relative z-10 mx-auto grid min-h-screen w-full max-w-6xl grid-cols-1 items-center gap-12 px-6 py-16 lg:grid-cols-[1fr_1fr] lg:px-12">
        <motion.div
          className="space-y-8"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.75, ease: "easeOut" }}
        >
          <Sticker icon={<span className="text-lg">🚀</span>} label="Kickstart your streak era" accent="#f472b6" />
          <div className="space-y-6">
            <h1 className="text-balance text-4xl font-semibold leading-tight md:text-5xl">
              Build habits with <span className="text-gradient">playful precision</span> alongside your favorite teammates.
            </h1>
            <p className="max-w-lg text-base text-slate-300">
              Design daily rituals, launch collaborative goals, and watch progress bloom with dynamic analytics, confetti, and reaction-driven motivation.
            </p>
          </div>
          <div className="grid gap-4 md:max-w-sm">
            {[
              "Personal dashboards with trending streak insight",
              "Workspaces, invite codes, and milestone reels",
              "Custom schedules: daily, weekdays, or your own rhythm"
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
                <span className="mt-1 inline-flex h-2.5 w-2.5 flex-shrink-0 rounded-full bg-gradient-to-r from-rose-400 to-sky-400" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="relative"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.75, ease: "easeOut", delay: 0.1 }}
        >
          <div className="absolute -inset-4 rounded-[32px] bg-gradient-to-br from-purple-500/25 via-fuchsia-500/20 to-sky-500/30 blur-3xl" />
          <div className="gradient-border relative rounded-[28px] border border-white/10 bg-slate-900/70 p-10 shadow-2xl shadow-black/40 backdrop-blur-2xl">
            <div className="mb-8 space-y-2 text-center">
              <h2 className="text-3xl font-semibold text-slate-100">Create your account</h2>
              <p className="text-sm text-slate-400">Set your goals, invite your crew, and keep the momentum alive.</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-400" htmlFor="name">
                  Display name
                </label>
                <input
                  id="name"
                  name="name"
                  required
                  className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-rose-400"
                  placeholder="Alex Morgan"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-400" htmlFor="email">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-rose-400"
                  placeholder="you@studio.com"
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
                  minLength={8}
                  className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-rose-400"
                  placeholder="At least 8 characters"
                />
              </div>
              <Button 
                type="submit" 
                disabled={isLoading}
                className="h-12 w-full rounded-xl bg-gradient-to-r from-rose-500 via-fuchsia-500 to-sky-500 text-sm font-semibold text-white shadow-lg shadow-rose-500/30 transition hover:brightness-110 disabled:opacity-50"
              >
                {isLoading ? "Creating account..." : "Launch my account"}
              </Button>
            </form>
            <p className="mt-6 text-center text-sm text-slate-400">
              Already have an account?{" "}
              <Link className="font-semibold text-rose-300 transition hover:text-rose-200" href="/sign-in">
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
