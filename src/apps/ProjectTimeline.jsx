import React, { useMemo, useState } from "react";
import MainContext from "../context/mainContext";
import { projects } from "../libs/data";

const monthIndex = { jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11 };
const dateValue = (value = "") => { const parts = value.trim().split(/\s+/); const year = Number(parts.find((part) => /^20\d{2}$/.test(part)) || 0); const month = monthIndex[(parts.find((part) => monthIndex[part.slice(0,3).toLowerCase()] !== undefined) || "jan").slice(0,3).toLowerCase()] || 0; return year * 12 + month; };
const ProjectTimeline = () => {
  const { openApp } = React.useContext(MainContext);
  const years = useMemo(() => [...new Set(projects.map((project) => (project.duration?.start || "Undated").match(/20\d{2}/)?.[0] || "Undated"))].sort((a,b) => b.localeCompare(a)), []);
  const [year, setYear] = useState("All");
  const ordered = useMemo(() => projects.map((project,index)=>({project,index,year:(project.duration?.start||"").match(/20\d{2}/)?.[0]||"Undated",sort:dateValue(project.duration?.start)})).sort((a,b)=>b.sort-a.sort), []);
  const visible = year === "All" ? ordered : ordered.filter((item) => item.year === year);
  return <div className="os-scroll h-full overflow-y-auto bg-[#0b1019]/75 px-5 py-5 sm:px-7">
    <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="label">Build history</p><h1 className="mt-1 text-xl font-semibold text-white">Project Timeline<span className="text-amber-300">.</span></h1><p className="mt-1 max-w-xl text-[11px] leading-relaxed text-white/40">A time-ordered view of the projects in the portfolio, using their published start dates.</p></div><span className="font-mono text-[10px] text-white/35">{visible.length} builds</span></div>
    <div className="mt-4 flex gap-1.5 overflow-x-auto pb-1">{["All",...years].map((item)=><button key={item} onClick={()=>setYear(item)} aria-pressed={year===item} className={`shrink-0 rounded-full border px-3 py-1 text-[9px] ${year===item?"border-amber-200/50 bg-amber-200/10 text-amber-100":"border-white/10 text-white/40 hover:text-white/75"}`}>{item}</button>)}</div>
    <div className="relative mt-5 pl-5 before:absolute before:bottom-2 before:left-[7px] before:top-2 before:w-px before:bg-gradient-to-b before:from-amber-200/60 before:via-white/10 before:to-transparent">{visible.map(({project,index,year:projectYear})=><article key={project.title} className="relative mb-3"><span className="absolute -left-[22px] top-4 h-3 w-3 rounded-full border-2 border-[#10151d] bg-amber-200 shadow-[0_0_0_1px_rgba(251,191,36,.45)]"/><button onClick={()=>openApp("projects",{index})} className="glass-card w-full rounded-xl p-3 text-left transition hover:border-amber-200/25 hover:bg-amber-100/[.03] sm:p-4"><div className="flex flex-wrap items-center justify-between gap-2"><div className="flex items-baseline gap-2"><span className="font-mono text-[9px] text-amber-200/70">{project.duration?.start || "Date not listed"}</span><span className="text-white/15">/</span><span className="text-[8px] text-white/30">{projectYear}</span></div><span className="text-[9px] text-white/30">{project.duration?.end || ""}</span></div><h2 className="mt-1.5 text-[13px] font-medium text-white/85">{project.title}</h2><p className="mt-1 line-clamp-2 text-[10px] leading-relaxed text-white/40">{typeof project.description === "string"?project.description:project.description?.head}</p><div className="mt-2 flex flex-wrap gap-1">{(project.skills||[]).slice(0,4).map(skill=><span key={skill} className="rounded-full border border-white/[.08] px-1.5 py-0.5 text-[8px] text-white/35">{skill}</span>)}</div></button></article>)}</div>
    <p className="mt-4 text-[9px] text-white/25">Dates reflect the portfolio entries; undated items remain available under “All”.</p>
  </div>;
};
export default ProjectTimeline;
