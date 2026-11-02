import React, { useMemo, useState } from "react";
import MainContext from "../context/mainContext";
import { profile, projects } from "../libs/data";

const keyOf = (value) => value.toLowerCase().replace(/\.js\b/g, "").replace(/[^a-z0-9+#]/g, "");
const StackAtlas = () => {
  const { openApp } = React.useContext(MainContext);
  const [selected, setSelected] = useState(null);
  const skills = useMemo(() => {
    const all = new Map();
    Object.entries(profile.skills).forEach(([group, values]) => values.forEach((name) => all.set(name, group)));
    projects.forEach((project) => (project.skills || []).forEach((name) => { if (!all.has(name)) all.set(name, "Used in projects"); }));
    return [...all.entries()].map(([name, group]) => ({ name, group, count: projects.filter((project) => (project.skills || []).some((value) => keyOf(value) === keyOf(name))).length })).sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  }, []);
  const related = selected ? projects.map((project, index) => ({ project, index })).filter(({ project }) => (project.skills || []).some((value) => keyOf(value) === keyOf(selected.name))) : [];

  return <div className="os-scroll h-full overflow-y-auto bg-[#08111c]/70 px-5 py-5 sm:px-7">
    <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="label">Explore the toolkit</p><h1 className="mt-1 text-xl font-semibold text-white">Stack Atlas<span className="text-[var(--accent)]">.</span></h1><p className="mt-1 max-w-xl text-[11px] leading-relaxed text-white/40">Choose a technology to trace it into the projects where it appears. Connections are based on the published project tags.</p></div><span className="text-[10px] text-white/35">{skills.length} technologies · {projects.length} projects</span></div>
    <section className="mt-5 rounded-2xl border border-white/10 bg-[radial-gradient(ellipse_at_top,rgba(34,211,238,.08),transparent_60%),rgba(0,0,0,.18)] p-4 sm:p-5">
      <div className="mb-3 flex items-center justify-between"><p className="label">Technology field</p><button onClick={() => setSelected(null)} className="text-[10px] text-white/35 hover:text-white">Clear focus</button></div>
      <div className="flex flex-wrap gap-2">{skills.map((skill) => { const active = selected?.name === skill.name; const opacity = selected && !active && skill.count === 0 ? "opacity-35" : ""; return <button key={skill.name} onClick={() => setSelected(active ? null : skill)} aria-pressed={active} title={`${skill.group} · ${skill.count} tagged projects`} className={`group relative rounded-full border px-3 py-1.5 text-[10px] transition ${active ? "border-[var(--accent)] bg-[var(--accent-soft)] text-white shadow-[0_0_18px_var(--accent-soft)]" : `border-white/10 bg-white/[.035] text-white/55 hover:border-white/30 hover:text-white ${opacity}`}`}><span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full" style={{background: active ? "var(--accent)" : skill.count ? "#a78bfa" : "rgba(255,255,255,.25)"}}/>{skill.name}<span className="ml-1.5 font-mono text-[8px] text-white/30">{skill.count}</span></button>; })}</div>
      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 border-t border-white/[.07] pt-3 text-[9px] text-white/30"><span><i className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-violet-300"/>tagged in project</span><span><i className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-white/25"/>profile skill</span><span>number = matching projects</span></div>
    </section>
    <section className="mt-5"><div className="mb-3 flex items-center justify-between"><h2 className="text-[12px] font-medium text-white/75">{selected ? `Projects using ${selected.name}` : "Connected projects"}</h2><span className="text-[9px] text-white/30">{selected ? related.length : projects.length} results</span></div>{(selected ? related : projects.map((project, index) => ({project,index}))).length ? <div className="grid gap-2 sm:grid-cols-2">{(selected ? related : projects.map((project, index) => ({project,index}))).map(({project,index}) => <button key={project.title} onClick={() => openApp("projects", { index })} className="glass-card group rounded-xl p-3 text-left transition hover:border-white/25 hover:bg-white/[.05]"><div className="flex items-start justify-between gap-2"><b className="text-[12px] text-white/85">{project.title}</b><span className="font-mono text-[9px] text-white/25">{project.duration?.start || "PROJECT"}</span></div><p className="mt-1 line-clamp-2 text-[10px] leading-relaxed text-white/40">{typeof project.description === "string" ? project.description : project.description?.head}</p><div className="mt-2 flex flex-wrap gap-1">{(project.skills || []).slice(0, 5).map((tag) => <span key={tag} className={`rounded-full border px-1.5 py-0.5 text-[8px] ${selected && keyOf(tag) === keyOf(selected.name) ? "border-[var(--accent)]/40 text-[var(--accent)]" : "border-white/[.08] text-white/35"}`}>{tag}</span>)}</div></button>)}</div> : <p className="rounded-xl border border-white/10 bg-black/20 p-5 text-[11px] text-white/40">No project is tagged with this technology yet.</p>}</section>
  </div>;
};
export default StackAtlas;
