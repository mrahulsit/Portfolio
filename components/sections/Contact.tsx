"use client";

import { useState } from "react";
import {
  FaEnvelope as Mail,
  FaLinkedin as Linkedin,
  FaGithub as Github,
  FaFile as FileText,
  FaDownload as Download,
  FaCopy as Copy,
  FaCheck as Check,
  FaExternalLinkAlt as ArrowUpRight,
} from "react-icons/fa";
import SectionHead from "@/components/ui/SectionHead";
import { Reveal } from "@/components/ui/Reveal";
import { useToast } from "@/lib/toast";
import { contact, profile } from "@/lib/data";

type Errors = { name?: string; email?: string; message?: string };

export default function Contact() {
  const toast = useToast();
  const [copied, setCopied] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState("");

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email);
    } catch {
      /* fallback: execCommand path removed; clipboard is available in modern browsers */
    }
    setCopied(true);
    toast("Email copied");
    setTimeout(() => setCopied(false), 2000);
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    const next: Errors = {};
    if (!name) next.name = "Add your name so I know who's writing.";
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      next.email = "Add an email address I can reply to.";
    if (!message) next.message = "Add a message.";
    setErrors(next);
    if (Object.keys(next).length) return;

    const subject = `Portfolio contact — ${name}`;
    const body = encodeURIComponent(`${message}\n\n— ${name}\n${email}`);
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
    setStatus("Opening your email app…");
    form.reset();
  }

  const fieldCls = (invalid?: boolean) =>
    `w-full rounded-[10px] border bg-bg px-3.5 py-3 font-ui text-[15px] text-ink placeholder:font-normal placeholder:text-faint transition-all duration-200 focus:outline-none focus:border-accent focus:shadow-[0_0_0_3px_var(--accent-soft)] ${
      invalid ? "border-[#a4372a]" : "border-line-strong"
    }`;

  return (
    <section id="contact" className="bg-sink py-20 max-sm:py-14">
      <div className="shell">
        <SectionHead
          label="Contact"
          meta={
            <span className="inline-flex items-center gap-2">
              <span
                aria-hidden
                className="inline-block h-2 w-2 shrink-0 rounded-full bg-accent-strong shadow-[0_0_8px_rgba(205,242,43,0.55)]"
              />
              {profile.availability.shortLabel}
            </span>
          }
          title={contact.title}
          lede={contact.lede}
        />

        <div className="grid gap-[60px] lg:grid-cols-[1fr_1.2fr]">
          {/* Direct links */}
          <Reveal className="flex h-full min-w-0 flex-col">
            <div className="flex flex-col items-start gap-2 border-b border-line py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:py-[18px]">
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-faint">
                <Mail size={12} className="text-accent-strong" />
                Email
              </p>
              <div className="flex flex-wrap items-center gap-3.5">
                <a
                  href={`mailto:${profile.email}`}
                  className="font-semibold text-ink transition-colors hover:text-accent-strong"
                >
                  {profile.email}
                </a>
                <button
                  type="button"
                  onClick={copyEmail}
                  aria-label="Copy email address"
                  className="inline-flex items-center gap-1.5 rounded-full border border-line-strong px-[11px] py-1 text-xs font-semibold text-muted transition-all duration-200 hover:border-accent hover:text-accent-strong"
                >
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                  <span aria-hidden>{copied ? "Copied" : "Copy"}</span>
                </button>
              </div>
            </div>

            <div className="flex flex-col items-start gap-2 border-b border-line py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:py-[18px]">
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-faint">
                <Linkedin size={12} className="text-accent-strong" />
                LinkedIn
              </p>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-semibold text-ink transition-colors hover:text-accent-strong"
              >
                linkedin.com/in/{profile.linkedinHandle}
                <ArrowUpRight size={11} className="opacity-70" />
              </a>
            </div>

            <div className="flex flex-col items-start gap-2 border-b border-line py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:py-[18px]">
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-faint">
                <Github size={12} className="text-accent-strong" />
                GitHub
              </p>
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-semibold text-ink transition-colors hover:text-accent-strong"
              >
                {profile.githubHandle}
                <ArrowUpRight size={11} className="opacity-70" />
              </a>
            </div>

            <div className="flex flex-col items-start gap-2 border-b border-line py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:py-[18px]">
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-faint">
                <FileText size={12} className="text-accent-strong" />
                Résumé
              </p>
              <a
                href="/resume"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-semibold text-ink transition-colors hover:text-accent-strong"
              >
                <Download size={12} />
                Download PDF
              </a>
            </div>

            <div className="mt-8 rounded-card border border-line bg-elev p-6">
              <p className="mb-3.5 font-ui text-[10.5px] font-[650] uppercase tracking-[0.14em] text-faint">
                What I'm looking for
              </p>
              <ul className="grid gap-2.5 text-[14px]">
                {[
                  "Software engineering and full-stack roles",
                  "On-site, hybrid or remote teams",
                  "Available to join immediately",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 leading-relaxed text-ink-2 before:mt-[0.55em] before:h-1 before:w-1 before:shrink-0 before:rounded-full before:bg-accent-strong before:content-['']"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* Form */}
          <Reveal delay={0.08} className="min-w-0">
            <form
              noValidate
              onSubmit={onSubmit}
              className="rounded-card border border-line bg-elev p-[30px] shadow-card max-sm:p-6"
            >
              <p className="mb-[22px] text-[14.5px] text-muted">
                Or send a message — this opens your email app with the message ready to send.
              </p>

              <div className="mb-[18px]">
                <label htmlFor="cf-name" className="mb-1.5 block text-[13px] font-semibold text-ink">
                  Name
                </label>
                <input
                  id="cf-name"
                  name="name"
                  autoComplete="name"
                  required
                  placeholder="Your name"
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "cf-name-error" : undefined}
                  className={fieldCls(!!errors.name)}
                />
                {errors.name && (
                  <p id="cf-name-error" className="mt-1.5 text-[13px] text-[#a4372a]">
                    {errors.name}
                  </p>
                )}
              </div>

              <div className="mb-[18px]">
                <label htmlFor="cf-email" className="mb-1.5 block text-[13px] font-semibold text-ink">
                  Email
                </label>
                <input
                  id="cf-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="you@example.com"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "cf-email-error" : undefined}
                  className={fieldCls(!!errors.email)}
                />
                {errors.email && (
                  <p id="cf-email-error" className="mt-1.5 text-[13px] text-[#a4372a]">
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="mb-[18px]">
                <label
                  htmlFor="cf-message"
                  className="mb-1.5 block text-[13px] font-semibold text-ink"
                >
                  Message
                </label>
                <textarea
                  id="cf-message"
                  name="message"
                  rows={5}
                  required
                  placeholder="Tell me about the role, project or problem…"
                  aria-invalid={!!errors.message}
                  aria-describedby={errors.message ? "cf-message-error" : undefined}
                  className={`${fieldCls(!!errors.message)} min-h-[110px] resize-y`}
                />
                {errors.message && (
                  <p id="cf-message-error" className="mt-1.5 text-[13px] text-[#a4372a]">
                    {errors.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent border border-accent px-[18px] py-2.5 text-[14.5px] font-[550] text-accent-text transition-all duration-200 hover:bg-accent-ink hover:border-accent-ink"
              >
                Open in email app
              </button>
              <p className="mt-2.5 text-center text-[12px] text-faint">
                Opens your email app with the message ready — nothing is stored here.
              </p>
              <p role="status" aria-live="polite" className="mt-3 min-h-[1.2em] text-center text-sm font-semibold text-accent-strong">
                {status}
              </p>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
