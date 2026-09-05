import AuthButton from "@/components/AuthButton";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Shield, Rabbit, Bell, TrendingDown, Zap, Star } from "lucide-react";
import Image from "next/image";
import { createClient } from "@/lib/server.js";
import AddproductForm from "@/components/AddproductForm";
import { getProducts } from "./actions";
import ProductCard from "@/components/ProductCard";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const product = user ? await getProducts() : [];

  const FEATURES = [
    {
      icon: Rabbit,
      title: "Lightning Fast",
      description:
        "Deal Drop extracts prices in seconds, handling JavaScript and dynamic content with ease.",
      color: "from-amber-400 to-orange-500",
      bg: "bg-amber-50 dark:bg-amber-950/30",
    },
    {
      icon: Shield,
      title: "Always Reliable",
      description:
        "Works across all major e-commerce sites with built-in anti-bot protection and smart retries.",
      color: "from-emerald-400 to-teal-500",
      bg: "bg-emerald-50 dark:bg-emerald-950/30",
    },
    {
      icon: Bell,
      title: "Smart Alerts",
      description:
        "Get notified instantly when prices drop below your target. Never pay full price again.",
      color: "from-violet-400 to-purple-500",
      bg: "bg-violet-50 dark:bg-violet-950/30",
    },
  ];

  const STATS = [
    { value: "50K+", label: "Products Tracked" },
    { value: "₹2Cr+", label: "Saved by Users" },
    { value: "99.9%", label: "Uptime" },
  ];

  return (
    <main className="min-h-screen brand-gradient dark:bg-stone-950 dark:bg-none">
      {/* ── Header ─────────────────────────────────────────────────── */}
      <header className="glass sticky top-0 z-50 border-b border-orange-100/80 dark:border-stone-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="DealDrop logo"
              width={600}
              height={200}
              className="h-9 w-auto"
              priority
            />
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <AuthButton user={user} />
          </div>
        </div>
      </header>

      {/* ── Hero Section ─────────────────────────────────────────── */}
      <section className="relative py-20 sm:py-28 px-4 overflow-hidden">
        {/* Decorative blobs */}
        <div
          aria-hidden="true"
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-30 dark:opacity-10"
          style={{
            background:
              "radial-gradient(circle, #fed7aa 0%, #fbbf24 40%, transparent 70%)",
            filter: "blur(72px)",
            pointerEvents: "none",
          }}
        />

        <div className="max-w-4xl mx-auto text-center relative">
          {/* Badge pill */}
          <div className="inline-flex items-center gap-2 bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800/50 px-5 py-1.5 rounded-full text-sm font-medium mb-8 animate-fade-in-up shadow-sm">
            <Star className="w-3.5 h-3.5 fill-current" />
            Track prices like a pro — completely free
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-stone-900 dark:text-stone-50 mb-5 tracking-tight leading-[1.08] animate-fade-in-up">
            Never miss a{" "}
            <span className="bg-gradient-to-r from-orange-500 to-amber-400 bg-clip-text text-transparent">
              price drop
            </span>{" "}
            again
          </h1>

          {/* Subline */}
          <p className="text-lg sm:text-xl text-stone-500 dark:text-stone-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up">
            DealDrop monitors prices 24/7 on Amazon, Flipkart, and all major retailers.
            Paste a product URL and we'll handle the rest.
          </p>

          {/* URL form */}
          <div className="animate-fade-in-up">
            <AddproductForm user={user} />
          </div>

          {/* Stats row */}
          {!user && (
            <div className="flex flex-wrap justify-center gap-6 sm:gap-10 mt-12 animate-fade-in-up">
              {STATS.map(({ value, label }) => (
                <div key={label} className="text-center">
                  <p className="text-2xl font-bold text-stone-800 dark:text-stone-200">{value}</p>
                  <p className="text-sm text-stone-500 dark:text-stone-400 mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Feature Cards (shown when no products) ───────────────── */}
      {product.length === 0 && (
        <section className="pb-24 px-4">
          <div className="max-w-5xl mx-auto">
            <p className="text-center text-sm font-semibold uppercase tracking-widest text-orange-500 dark:text-orange-400 mb-10">
              Why DealDrop?
            </p>
            <div className="grid md:grid-cols-3 grid-cols-1 gap-6">
              {FEATURES.map(({ icon: Icon, title, description, color, bg }) => (
                <div
                  key={title}
                  className={`glass-card card-hover rounded-3xl px-7 py-8 text-center ${bg}`}
                >
                  <div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mx-auto mb-5 shadow-md`}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100 mb-2">
                    {title}
                  </h3>
                  <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Tracked Products Section ──────────────────────────────── */}
      {user && product.length > 0 && (
        <section className="max-w-7xl mx-auto pb-24 px-4 sm:px-6">
          {/* Section header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-8">
            <div>
              <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-orange-500" />
                Your Tracked Products
              </h2>
              <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
                Monitoring {product.length}{" "}
                {product.length === 1 ? "product" : "products"} for you
              </p>
            </div>
            <span className="inline-flex items-center gap-1 bg-orange-100 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400 text-xs font-semibold px-3 py-1.5 rounded-full border border-orange-200 dark:border-orange-800/50">
              <Zap className="w-3 h-3 fill-current" />
              Live tracking
            </span>
          </div>

          {/* Products grid */}
          <div className="grid gap-5 md:grid-cols-2 items-start">
            {product.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* ── Empty state (logged in, no products) ─────────────────── */}
      {user && product.length === 0 && (
        <section className="pb-20 px-4">
          <div className="max-w-lg mx-auto text-center glass-card rounded-3xl px-8 py-14">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-amber-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <TrendingDown className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100 mb-3">
              Start tracking your first deal
            </h2>
            <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed">
              Paste any product URL from Amazon, Flipkart, or other retailers
              in the search bar above and we'll monitor it 24/7.
            </p>
          </div>
        </section>
      )}

      {/* ── Footer ───────────────────────────────────────────────── */}
      <footer className="border-t border-orange-100/60 dark:border-stone-800/60 py-6 px-4 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-stone-400 dark:text-stone-500">
          <p>© 2026 DealDrop. Track smarter.</p>
          <p className="flex items-center gap-1">
            Made with <span className="text-orange-500">♥</span> for deal hunters
          </p>
        </div>
      </footer>
    </main>
  );
}
