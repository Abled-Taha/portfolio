"use client";

// HomePage.tsx — Full file (hydration-safe + robust smooth-scroll)
// Notes:
// - Framer Motion animations are gated behind `mounted` to avoid SSR/CSR mismatches.
// - In-page nav uses event delegation and guards to avoid null access.
// - Dev-only self-tests validate anchors and detect animation regressions.
// - The large blank space before the About section was from hero bottom padding (md:py-28).
//   We now use balanced paddings: pt-20 pb-12 (md:pt-28 md:pb-16).

import { useEffect, useMemo, useCallback, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import {
  Github,
  Linkedin,
  Mail,
  Instagram,
  Facebook,
  ExternalLink,
  FileDown,
  ArrowRight,
} from "lucide-react";

// ————————————————————————————————————————
// Configurable profile + data
// ————————————————————————————————————————
const PROFILE = {
  name: "Syed Taha Rizwan",
  role: "Web & Application Developer",
  focus: "Backend-first • Python-centric",
  email: "abledtaha@gmail.com",
  avatar: "/images/me/me.jpg",
  resumePath: "/files/resume/resume.pdf",
  socials: {
    github: "https://github.com/Abled-Taha",
    instagram: "https://instagram.com/abled_taha",
    facebook: "https://www.facebook.com/TahaRizwan03",
    linkedin: "", // add when ready
  },
};

const TECH = [
  { name: "Python", icon: "/images/technologies/python.svg" },
  { name: "Django", icon: "/images/technologies/django.svg" },
  { name: "Flask", icon: "/images/technologies/flask.svg" },
  { name: "PySide", icon: "/images/technologies/pyside.svg" },
  { name: "HTML5", icon: "/images/technologies/html5.svg" },
  { name: "CSS / SCSS", icon: "/images/technologies/css3.svg" },
  { name: "JavaScript", icon: "/images/technologies/javascript.svg" },
  { name: "React", icon: "/images/technologies/react.svg" },
  { name: "Next.js", icon: "/images/technologies/nextjs.svg" },
  { name: "Node.js", icon: "/images/technologies/nodejs.svg" },
  { name: "MySQL", icon: "/images/technologies/mysql.svg" },
  { name: "MongoDB", icon: "/images/technologies/mongodb.svg" },
  { name: "PostgreSQL", icon: "/images/technologies/postgresql.svg" },
  { name: "Linux", icon: "/images/technologies/linux.svg" },
];

const PROJECTS = [
  {
    name: "Portfolio (This Site)",
    description: "Portfolio website built using Next.js, Tailwind CSS, and Framer Motion.",
    github: "https://github.com/Abled-Taha/portfolio",
    deployment: "https://abledtaha.online",
  },
  {
    name: "Password Manager (APM)",
    description:
      "Secure password manager with Django backend, MongoDB, and cross-platform web-app. Planned rewrite in Rails, React, PostgreSQL, and Kotlin.",
    github: "https://github.com/Abled-Taha/apm-app-web",
    deployment: "",
  },
  {
    name: "Dynamic Website Project",
    description:
      "Full-stack web app with Django backend, MongoDB database, Flutter mobile app, and Flask API.",
    github: "https://github.com/Abled-Taha/abled-taha-website",
    deployment: "",
  },
];

// ————————————————————————————————————————
// Helpers
// ————————————————————————————————————————
function getAnchorFromTarget(target: EventTarget | null): HTMLAnchorElement | null {
  let node = target as Node | null;

  while (node && node !== document.body) {
    if (node instanceof HTMLAnchorElement) return node;

    if (node instanceof Element) {
      // for Element nodes, climb via parentElement (which is Element | null)
      node = node.parentElement;
    } else {
      // for non-Element Nodes (e.g., Text), climb via parentNode (Node | null)
      node = (node.parentNode as Node | null);
    }
  }
  return null;
}

function scrollToId(id: string, reduceMotion: boolean) {
  const el = document.getElementById(id);
  if (!el) return false;
  const header = document.querySelector<HTMLElement>("header[data-sticky]");
  const headerOffset = header?.offsetHeight ?? 0;
  const top = el.getBoundingClientRect().top + window.scrollY - headerOffset - 8; // little breathing room
  window.scrollTo({ top, behavior: reduceMotion ? "auto" : "smooth" });
  if (history.replaceState) history.replaceState(null, "", `#${id}`);
  return true;
}

// Motion helper — used only after mount to avoid hydration mismatches
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay },
  viewport: { once: true, amount: 0.4 },
});

export default function HomePage() {
  const reduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // In-page smooth scroll with robust guards
  const handleDocClick = useCallback(
    (e: Event) => {
      const anchor = getAnchorFromTarget(e.target);
      if (!anchor) return;
      const raw = anchor.getAttribute("href");
      if (!raw || !raw.startsWith("#") || raw === "#") return; // external or empty hash
      const id = raw.slice(1);
      if (!id) return;
      const ok = scrollToId(id, !!reduceMotion);
      if (ok) e.preventDefault();
      else if (process.env.NODE_ENV !== "production") {
        console.warn(`[smooth-scroll] Missing target element for #${id}`);
      }
    },
    [reduceMotion]
  );

  useEffect(() => {
    document.addEventListener("click", handleDocClick as EventListener, { passive: false });
    return () => document.removeEventListener("click", handleDocClick as EventListener);
  }, [handleDocClick]);

  // Dev-only self-tests (act as lightweight test cases)
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;

    // Test 1: required sections exist
    const required = ["home", "about", "stack", "projects", "contact"] as const;
    required.forEach((id) => {
      console.assert(!!document.getElementById(id), `[self-test] Section #${id} should exist`);
    });

    // Test 2: header anchors map to existing targets
    document.querySelectorAll<HTMLAnchorElement>("header a[href^='#']").forEach((a) => {
      const href = a.getAttribute("href");
      const id = href?.slice(1) ?? "";
      if (!id) console.warn(`[self-test] Anchor missing id in href:`, a.outerHTML);
      else if (!document.getElementById(id)) console.warn(`[self-test] No element found for ${href}. Add id='${id}'.`);
    });

    // Test 3: anchor resolver works on nested nodes
    const sample = document.querySelector("header a[href^='#']");
    if (sample) {
      const inner = sample.firstChild as EventTarget | null;
      const found = getAnchorFromTarget(inner);
      console.assert(found === sample, "[self-test] getAnchorFromTarget should resolve inner node to <a>");
    }

    // Test 4: ensure no server-injected inline animation styles before mount
    const hero = document.querySelector("section#home .space-y-6");
    const hasInlineStyle = hero instanceof HTMLElement && hero.getAttribute("style");
    console.assert(!hasInlineStyle, "[self-test] hero shouldn\'t have inline animation styles pre-hydration");
  }, []);

  // Avoid midnight rollover mismatch by resolving year on server (memo) and client agrees.
  const initialYear = useMemo(() => new Date().getFullYear(), []);
  const year = mounted ? new Date().getFullYear() : initialYear;

  const motionOn = mounted && !reduceMotion;

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white selection:bg-white/10 antialiased">
      {/* ——— NAV ——— */}
      <header
        data-sticky
        className="sticky top-0 z-50 border-b border-white/10 backdrop-blur supports-[backdrop-filter]:bg-black/40"
      >
        <div className="mx-auto max-w-7xl px-6">
          <nav className="flex h-16 items-center justify-between">
            <a href="#home" className="group inline-flex items-center gap-2">
              <div
                className="h-6 w-6 rounded-md"
                style={{
                  backgroundImage: "url('/images/icon.svg')",
                  backgroundSize: "contain",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                }}
              />
              <span className="text-sm font-semibold tracking-wide text-white/90 group-hover:text-white">
                {PROFILE.name}
              </span>
            </a>
            <ul className="hidden gap-6 text-sm text-white/70 md:flex">
              {[
                { href: "#about", label: "About" },
                { href: "#stack", label: "Stack" },
                { href: "#projects", label: "Projects" },
                { href: "#contact", label: "Contact" },
              ].map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="rounded-md px-1 py-0.5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500/60"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-3">
              <a
                href={PROFILE.resumePath}
                download
                className="group inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-1.5 text-sm font-medium hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500/60"
              >
                <FileDown className="h-4 w-4" />
                <span>Resume</span>
              </a>
            </div>
          </nav>
        </div>
      </header>

      {/* ——— HERO ——— */}
      <section id="home" className="relative overflow-hidden">
        {/* Decorative glow — absolutely positioned (no layout space) */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 left-0 right-0 h-[420px] bg-[radial-gradient(80%_60%_at_50%_0%,rgba(139,92,246,0.25),rgba(0,0,0,0))]"
        />

        <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 pt-20 pb-12 md:grid-cols-[1.2fr_.8fr] md:pt-28 md:pb-16">
          <motion.div
            {...(motionOn ? { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } } : { initial: false })}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400/80" />
              <span>Available for freelance & internships</span>
            </div>

            <h1 className="text-balance text-4xl font-bold tracking-tight md:text-6xl">{PROFILE.name}</h1>
            <p className="text-pretty text-lg text-white/70 md:text-xl">
              {PROFILE.role} — <span className="text-white/80">{PROFILE.focus}</span>
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#projects"
                className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 px-4 py-2 font-semibold shadow-lg shadow-pink-500/10 transition hover:scale-[1.01] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500/60"
              >
                View Projects <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </a>
              <a
                href={`mailto:${PROFILE.email}`}
                className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-4 py-2 font-medium text-white/90 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500/60"
              >
                <Mail className="h-4 w-4" /> Contact
              </a>
            </div>

            {/* Quick stats */}
            <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {[
                { k: "Stacks", v: "Python, JS/TS" },
                { k: "Focus", v: "Backend / APIs" },
                { k: "DB", v: "Postgres, Mongo" },
              ].map((s) => (
                <li key={s.k} className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <p className="text-xs text-white/60">{s.k}</p>
                  <p className="text-sm font-semibold">{s.v}</p>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            className="mx-auto w-full max-w-xs md:max-w-sm"
            {...(motionOn ? { initial: { opacity: 0, scale: 0.94 }, animate: { opacity: 1, scale: 1 } } : { initial: false })}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="relative aspect-square overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 p-2 shadow-2xl">
              <div className="absolute inset-0 -z-10 bg-[radial-gradient(50%_50%_at_50%_50%,rgba(236,72,153,0.2),transparent_60%)]" />
              <Image
                src={PROFILE.avatar}
                alt={PROFILE.name}
                fill
                sizes="(max-width: 768px) 300px, 420px"
                className="object-cover"
                priority
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ——— ABOUT ——— */}
      <section id="about" className="mx-auto max-w-5xl px-6 py-16 md:py-20">
        <motion.div {...(motionOn ? fadeUp(0) : { initial: false })} className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">About</h2>
          <p className="text-white/70">
            I’m a Computer Science student who loves turning problems into clean, scalable software. From
            full‑stack web apps to cross‑platform tooling, I ship with a strong focus on Python backends,
            robust APIs, and pragmatic DX.
          </p>
          <ul className="grid gap-3 sm:grid-cols-2">
            {["REST & GraphQL APIs", "Authentication & Security basics", "SQL/NoSQL data modeling", "CI/CD & containerization (beginner)"]
              .map((item) => (
                <li key={item} className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80">
                  <span className="h-1.5 w-1.5 rounded-full bg-pink-500" /> {item}
                </li>
              ))}
          </ul>
        </motion.div>
      </section>

      {/* ——— STACK ——— */}
      <section id="stack" className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <motion.h2 {...(motionOn ? fadeUp(0) : { initial: false })} className="mb-6 text-2xl font-semibold tracking-tight md:text-3xl">
          Technology Stack
        </motion.h2>
        <motion.p {...(motionOn ? fadeUp(0.05) : { initial: false })} className="mb-8 max-w-2xl text-white/70">
          Tools I use frequently and comfortably. I pick tech pragmatically based on the problem, not the hype.
        </motion.p>

        <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6">
          {TECH.map((t, i) => (
            <motion.div
              key={t.name}
              {...(motionOn ? fadeUp(i * 0.03) : { initial: false })}
              className="group flex flex-col items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-4 text-center hover:bg-white/[0.08]"
            >
              <div className="relative h-10 w-10">
                <Image src={t.icon} alt={t.name} fill className="object-contain" sizes="40px" />
              </div>
              <span className="text-xs text-white/70 group-hover:text-white">{t.name}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ——— PROJECTS ——— */}
      <section id="projects" className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <motion.h2 {...(motionOn ? fadeUp(0) : { initial: false })} className="mb-6 text-2xl font-semibold tracking-tight md:text-3xl">
          Selected Projects
        </motion.h2>
        <motion.p {...(motionOn ? fadeUp(0.05) : { initial: false })} className="mb-8 max-w-2xl text-white/70">
          A few things I’ve built and maintained. More on GitHub.
        </motion.p>

        <div className="grid gap-6 md:grid-cols-2">
          {PROJECTS.map((p, idx) => (
            <motion.article
              key={p.name}
              {...(motionOn ? fadeUp(idx * 0.06) : { initial: false })}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:bg-white/10"
            >
              <h3 className="text-lg font-semibold tracking-tight">{p.name}</h3>
              <p className="mt-2 text-sm text-white/70">{p.description}</p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                {p.deployment ? (
                  <a
                    href={p.deployment}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-sm hover:bg-white/10"
                  >
                    <ExternalLink className="h-4 w-4" /> Live
                  </a>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white/60">
                    <ExternalLink className="h-4 w-4" /> Not deployed
                  </span>
                )}
                <a
                  href={p.github}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-sm hover:bg-white/10"
                >
                  <Github className="h-4 w-4" /> Code
                </a>
              </div>
              <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gradient-to-tr from-pink-500/0 via-purple-500/0 to-indigo-500/0 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-40" />
            </motion.article>
          ))}
        </div>
      </section>

      {/* ——— RESUME CTA ——— */}
      <section className="mx-auto max-w-6xl px-6 pb-16 md:pb-20">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-white/0 p-6 md:p-10">
          <div aria-hidden className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,rgba(236,72,153,0.25),transparent_60%)]" />
          <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-xl font-semibold md:text-2xl">Grab the résumé</h3>
              <p className="mt-1 max-w-xl text-sm text-white/70">A concise PDF with experience, projects, and skills.</p>
            </div>
            <a
              href={PROFILE.resumePath}
              download
              className="group inline-flex items-center gap-2 rounded-2xl bg-white text-black px-4 py-2 font-semibold hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500/60"
            >
              <FileDown className="h-4 w-4" /> Download PDF
            </a>
          </div>
        </div>
      </section>

      {/* ——— CONTACT ——— */}
      <section id="contact" className="mx-auto max-w-5xl px-6 pb-20">
        <motion.div {...(motionOn ? fadeUp(0) : { initial: false })} className="rounded-3xl border border-white/10 bg-white/5 p-6 md:p-10">
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Let’s build something</h2>
          <p className="mt-2 text-white/70">
            I’m open to internships, freelance, and interesting collaborations. The fastest way to reach me is email.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a
              href={`mailto:${PROFILE.email}`}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 px-4 py-2 font-semibold shadow-lg shadow-pink-500/10 hover:scale-[1.01] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500/60"
            >
              <Mail className="h-4 w-4" /> {PROFILE.email}
            </a>
            <a
              href={PROFILE.socials.github}
              target="_blank"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
            >
              <Github className="h-4 w-4" /> GitHub
            </a>
            {PROFILE.socials.linkedin && (
              <a
                href={PROFILE.socials.linkedin}
                target="_blank"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
              >
                <Linkedin className="h-4 w-4" /> LinkedIn
              </a>
            )}
            <a
              href={PROFILE.socials.instagram}
              target="_blank"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
            >
              <Instagram className="h-4 w-4" /> Instagram
            </a>
            <a
              href={PROFILE.socials.facebook}
              target="_blank"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
            >
              <Facebook className="h-4 w-4" /> Facebook
            </a>
          </div>
        </motion.div>
      </section>

      {/* ——— FOOTER ——— */}
      <footer className="border-t border-white/10 py-8">
        <div className="mx-auto max-w-7xl px-6 text-center text-sm text-white/60">
          © {year} {PROFILE.name}. All rights reserved.
        </div>
      </footer>
    </main>
  );
}
