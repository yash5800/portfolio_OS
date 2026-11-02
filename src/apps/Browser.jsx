import React, { useState } from "react";
import { profile, projects } from "../libs/data";
import { Icon } from "../libs/icons";

const Browser = () => {
  const [query, setQuery] = useState("https://github.com/yash5800");
  const [page, setPage] = useState("github");
  const links = [
    ...profile.socials.filter((s) => s.id !== "email").map((s) => ({ title: s.label, url: s.href, detail: s.handle, icon: s.icon })),
    ...projects.filter((p) => p.liveLink).map((p) => ({ title: p.title, url: p.liveLink, detail: "Live project", icon: "globe" })),
  ];
  const go = (url) => { let safe = url.trim(); if (!/^https?:\/\//i.test(safe)) safe = `https://${safe}`; try { const parsed = new URL(safe); if (["http:", "https:"].includes(parsed.protocol)) { setQuery(parsed.href); setPage("external"); } } catch { /* leave current page */ } };
  return <div className="flex h-full min-h-0 flex-col bg-[#0a101c]">
    <div className="flex items-center gap-2 border-b border-white/10 bg-black/20 p-2"><button aria-label="Back" onClick={() => setPage("home")} className="rounded p-2 text-white/45 hover:bg-white/10"><Icon name="arrowRight" size={14}/></button><form className="flex min-w-0 flex-1 gap-2" onSubmit={(e) => {e.preventDefault(); go(query);}}><input value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Address" className="glass-input min-w-0 flex-1 rounded-lg px-3 py-2 font-mono text-[11px] text-white/70"/><button className="rounded-lg bg-white/10 px-3 text-[11px] text-white/70">Go</button></form></div>
    {page === "external" ? <div className="flex flex-1 flex-col items-center justify-center p-6 text-center"><span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-400/15 text-sky-200"><Icon name="globe" size={25}/></span><h2 className="text-lg text-white">Open this page?</h2><p className="mt-2 max-w-lg break-all text-[11px] text-white/40">{query}</p><a href={query} target="_blank" rel="noreferrer" className="pixel-btn pixel-btn-accent mt-5">Open in new tab <Icon name="external" size={12}/></a><p className="mt-4 text-[10px] text-white/30">External pages open in a separate browser tab.</p></div> : <div className="os-scroll flex-1 overflow-auto p-5 sm:p-8"><p className="label">Bookmarks · curated profiles</p><h1 className="mt-2 text-2xl font-semibold text-white">Around the web<span className="text-[var(--accent)]">.</span></h1><p className="mt-2 max-w-xl text-[12px] leading-relaxed text-white/45">A small launchpad for my work, code and profiles. External destinations open in a new tab.</p><div className="mt-6 grid gap-3 sm:grid-cols-2">{links.map((link) => <a key={link.url} href={link.url} target="_blank" rel="noreferrer" className="glass-card group flex items-center gap-3 rounded-xl p-4 transition hover:border-white/25 hover:bg-white/[0.06]"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.07] text-[var(--accent)]"><Icon name={link.icon} size={18}/></span><span className="min-w-0 flex-1"><b className="block text-[12px] text-white/85">{link.title}</b><small className="block truncate text-[10px] text-white/35">{link.detail}</small></span><Icon name="external" size={13} className="text-white/30 group-hover:text-white/80"/></a>)}</div></div>}
  </div>;
};
export default Browser;
