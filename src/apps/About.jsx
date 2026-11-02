import React from "react";
import { asset, profile } from "../libs/data";
import { Icon } from "../libs/icons";

const About = () => {
  return (
    <div className="os-scroll h-full overflow-y-auto">
      <div className="relative overflow-hidden border-b border-white/[0.07] px-6 pb-6 pt-7 sm:px-8">
        <div
          className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full opacity-30 blur-3xl"
          style={{ background: "var(--accent)" }}
          aria-hidden="true"
        />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full ring-1 ring-white/20">
            <img
              src={asset(profile.avatar)}
              alt={profile.name}
              className="h-full w-full object-cover"
              draggable={false}
            />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-[0.2em] text-white/40">{profile.role}</p>
            <h1 className="mt-1 text-[26px] font-semibold leading-tight tracking-tight text-white">
              {profile.name}
            </h1>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-white/45">
              <span className="inline-flex items-center gap-1.5">
                <Icon name="user" size={12} /> {profile.handle}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Icon name="mail" size={12} /> {profile.location}
              </span>
            </div>
          </div>
        </div>

        <p className="relative mt-5 max-w-[62ch] text-[13.5px] leading-relaxed text-white/65">
          {profile.bio}
        </p>

        <div className="relative mt-5 flex flex-wrap gap-2">
          {profile.stats.map((stat) => (
            <div
              key={stat.label}
              className="glass-card flex min-w-[104px] flex-col rounded-xl px-3.5 py-2.5"
            >
              <span className="text-[18px] font-semibold leading-tight text-white/90">
                {stat.value}
              </span>
              <span className="text-[10.5px] uppercase tracking-[0.1em] text-white/40">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="px-6 py-6 sm:px-8">
        <h2 className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/40">
          Skills &amp; interests
        </h2>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          {Object.entries(profile.skills).map(([group, items]) => (
            <div key={group}>
              <h3 className="mb-2 text-[12px] font-medium text-white/70">{group}</h3>
              <div className="flex flex-wrap gap-1.5">
                {items.map((item) => (
                  <span
                    key={item}
                    className="glass-chip rounded-md px-2 py-1 text-[11.5px] text-white/65 transition hover:border-white/25 hover:text-white"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-7 flex flex-wrap items-center gap-2">
          {profile.socials.map((social) => (
            <a
              key={social.id}
              href={social.href}
              target="_blank"
              rel="noreferrer"
              className="glass-chip inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-[12px] text-white/70 transition hover:border-white/25 hover:text-white"
            >
              <Icon name={social.icon} size={13} />
              {social.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;
