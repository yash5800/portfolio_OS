import React, { useState } from "react";
import { profile } from "../libs/data";
import { Icon } from "../libs/icons";
import { copyText } from "../libs/clipboard";

const Contact = () => {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    const ok = await copyText(profile.email);
    setCopied(ok);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="os-scroll h-full overflow-y-auto px-6 py-7 sm:px-8">
      <p className="text-[11px] uppercase tracking-[0.2em] text-white/40">Say hello</p>
      <h1 className="mt-1 text-[24px] font-semibold tracking-tight text-white">
        Let&apos;s build something.
      </h1>
      <p className="mt-2 max-w-[52ch] text-[13px] leading-relaxed text-white/55">
        Open to collaborations, freelance work and interesting problems. The fastest way to reach me
        is email — everything else is a click away.
      </p>

      <div className="mt-6 rounded-xl border border-white/10 bg-black/25 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-[0.14em] text-white/35">Email</p>
            <a
              href={`mailto:${profile.email}`}
              className="mt-1 block truncate text-[14px] text-white/85 transition hover:text-white"
            >
              {profile.email}
            </a>
          </div>
          <button
            type="button"
            onClick={copyEmail}
            className="inline-flex items-center gap-2 rounded-lg border border-white/12 bg-white/[0.06] px-3 py-1.5 text-[12px] text-white/75 transition hover:bg-white/12 hover:text-white"
          >
            <Icon name={copied ? "check" : "copy"} size={13} />
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        <a
          href={`mailto:${profile.email}`}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-[12.5px] font-medium text-black transition hover:brightness-110"
          style={{ background: "var(--accent)", boxShadow: "0 10px 30px -12px var(--accent)" }}
        >
          <Icon name="mail" size={14} />
          Write an email
        </a>
      </div>

      <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
        {profile.socials
          .filter((social) => social.id !== "email")
          .map((social) => (
            <a
              key={social.id}
              href={social.href}
              target="_blank"
              rel="noreferrer"
              className="group glass-card flex items-center justify-between gap-3 rounded-xl px-4 py-3 transition hover:border-white/25 hover:bg-white/[0.08]"
            >
              <span className="flex min-w-0 items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white/75">
                  <Icon name={social.icon} size={15} />
                </span>
                <span className="min-w-0">
                  <span className="block text-[12.5px] text-white/85">{social.label}</span>
                  <span className="block truncate text-[11px] text-white/40">{social.handle}</span>
                </span>
              </span>
              <Icon
                name="external"
                size={13}
                className="shrink-0 text-white/30 transition group-hover:text-white/70"
              />
            </a>
          ))}
      </div>

      <p className="mt-6 text-[11px] text-white/30">
        Based in {profile.location} · Working remotely worldwide
      </p>
    </div>
  );
};

export default Contact;
