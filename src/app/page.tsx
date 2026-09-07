"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Activity,
  Dumbbell,
  TrendingUp,
  UtensilsCrossed,
  Target,
  Zap,
  ArrowRight,
  Check,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { useAuthContext } from "@/components/providers/AuthProvider";

const features = [
  {
    icon: Dumbbell,
    title: "Workout Tracking",
    description: "Log exercises, sets, reps, and track your training progress over time.",
  },
  {
    icon: UtensilsCrossed,
    title: "Nutrition Logging",
    description: "Track meals, calories, and macros to fuel your fitness journey.",
  },
  {
    icon: TrendingUp,
    title: "Progress Analytics",
    description: "Visualize your progress with charts and insights that keep you motivated.",
  },
  {
    icon: Target,
    title: "Goal Setting",
    description: "Set daily and weekly targets for steps, calories, and workouts.",
  },
];

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    features: ["Basic workout logging", "Daily activity tracking", "3 meal logs per day"],
  },
  {
    name: "Pro",
    price: "$9",
    period: "/month",
    popular: true,
    features: [
      "Unlimited workout & meal logs",
      "Advanced analytics & charts",
      "Custom goals & reminders",
      "Export data & reports",
    ],
  },
  {
    name: "Team",
    price: "$29",
    period: "/month",
    features: [
      "Everything in Pro",
      "Up to 10 team members",
      "Shared workout plans",
      "Team leaderboards",
    ],
  },
];

export default function LandingPage() {
  const router = useRouter();
  const { signUp, signIn, isAuthenticated } = useAuthContext();
  const [showAuth, setShowAuth] = useState(false);
  const [isSignUp, setIsSignUp] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) {
    router.push("/dashboard");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Email and password are required");
      return;
    }
    if (isSignUp && !name.trim()) {
      setError("Name is required");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setSubmitting(true);
    const message = isSignUp
      ? await signUp(name.trim(), email.trim(), password)
      : await signIn(email.trim(), password);
    setSubmitting(false);

    if (message) {
      setError(message);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-surface-950">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-40 bg-surface-950/80 backdrop-blur-xl border-b border-surface-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-brand-500/20">
              <Activity className="w-6 h-6 text-brand-400" />
            </div>
            <span className="text-xl font-bold gradient-text">FitPulse</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setIsSignUp(false);
                setShowAuth(true);
              }}
              className="text-zinc-400 hover:text-zinc-200 transition-colors hidden sm:block"
            >
              Sign In
            </button>
            <Button onClick={() => { setIsSignUp(true); setShowAuth(true); }}>
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-sm mb-8 animate-fade-in">
            <Zap className="w-4 h-4" />
            Your fitness journey starts here
          </div>
          <h1 className="text-5xl sm:text-7xl font-bold text-zinc-50 mb-6 animate-slide-up">
            Track. Train.{" "}
            <span className="gradient-text">Transform.</span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-10 animate-slide-up">
            The all-in-one fitness tracker that helps you log workouts, monitor nutrition,
            and crush your goals — all in one beautiful dashboard.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up">
            <Button size="lg" onClick={() => { setIsSignUp(true); setShowAuth(true); }}>
              Start Free Trial
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button variant="secondary" size="lg" onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}>
              Learn More
            </Button>
          </div>

          {/* Hero Stats Preview */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { label: "Active Users", value: "50K+" },
              { label: "Workouts Logged", value: "2M+" },
              { label: "Calories Tracked", value: "500M+" },
              { label: "App Rating", value: "4.9", icon: Star },
            ].map((stat) => (
              <div key={stat.label} className="glass-card p-6 text-center">
                <div className="flex items-center justify-center gap-1">
                  <span className="text-2xl font-bold text-zinc-50">{stat.value}</span>
                  {stat.icon && <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />}
                </div>
                <p className="text-sm text-zinc-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-zinc-50 mb-4">
              Everything you need to stay fit
            </h2>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              Powerful tools designed to make fitness tracking effortless and enjoyable.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="glass-card p-6 hover:border-brand-500/30 transition-colors group">
                <div className="p-3 rounded-xl bg-brand-500/10 w-fit mb-4 group-hover:bg-brand-500/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-brand-400" />
                </div>
                <h3 className="text-lg font-semibold text-zinc-100 mb-2">{feature.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-zinc-50 mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-zinc-400 text-lg">Start free, upgrade when you&apos;re ready.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`glass-card p-8 relative ${
                  plan.popular ? "border-brand-500/50 ring-1 ring-brand-500/20" : ""
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-brand-500 text-white text-xs font-medium rounded-full">
                    Most Popular
                  </span>
                )}
                <h3 className="text-xl font-semibold text-zinc-100">{plan.name}</h3>
                <div className="mt-4 mb-6">
                  <span className="text-4xl font-bold text-zinc-50">{plan.price}</span>
                  <span className="text-zinc-500">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-zinc-300">
                      <Check className="w-4 h-4 text-brand-400 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  variant={plan.popular ? "primary" : "secondary"}
                  className="w-full"
                  onClick={() => { setIsSignUp(true); setShowAuth(true); }}
                >
                  Get Started
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto glass-card p-12 text-center">
          <h2 className="text-3xl font-bold text-zinc-50 mb-4">
            Ready to transform your fitness?
          </h2>
          <p className="text-zinc-400 mb-8">
            Join thousands of users who are already crushing their fitness goals with FitPulse.
          </p>
          <Button size="lg" onClick={() => { setIsSignUp(true); setShowAuth(true); }}>
            Start Your Free Trial
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-surface-800 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-brand-400" />
            <span className="font-semibold text-zinc-300">FitPulse</span>
          </div>
          <p className="text-sm text-zinc-500">
            &copy; {new Date().getFullYear()} FitPulse. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Auth Modal */}
      <Modal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        title={isSignUp ? "Create your account" : "Welcome back"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <Input
              label="Full Name"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            label="Password"
            type="password"
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting
              ? "Please wait..."
              : isSignUp
                ? "Create Account"
                : "Sign In"}
          </Button>
          <p className="text-center text-sm text-zinc-500">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              type="button"
              onClick={() => { setIsSignUp(!isSignUp); setError(""); }}
              className="text-brand-400 hover:text-brand-300"
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </button>
          </p>
        </form>
      </Modal>
    </div>
  );
}
