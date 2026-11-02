import React, { useState } from "react";
import MainContext from "../context/mainContext";
import { profile, projects, packages } from "../libs/data";
import { Icon } from "../libs/icons";

const Finder = () => {
  const { openApp } = React.useContext(MainContext);
  const [folder, setFolder] = useState("Home");
  const files = {
    Home: [["About", "user", "about"], ["Projects", "folder", "projects"], ["Skills", "code", "about"], ["Experience", "briefcase", "about"], ["Certificates", "award", "about"], ["Resume", "file", "contact"]],
    Projects: projects.map((p, i) => [p.title, "folder", "project", i]),
    Skills: Object.entries(profile.skills).map(([key, values]) => [key, "code", "about", null, values.join(", ")]),
    About: [["Profile", "user", "about"], ["Contact details", "mail", "contact"]],
    Experience: [["Developer profile", "briefcase", "about", null, profile.role]],
    Certificates: [["Portfolio certificates", "award", "about", null, "No certificate records are published in the current portfolio."]],
    Resume: [["Resume", "file", "contact", null, `Contact ${profile.email} for a copy of my resume.`], ...packages.map((p) => [p.name, "box", "packages"])],
  };
  const open = (item) => item[2] === "project" ? openApp("projects", { index: item[3] }) : openApp(item[2]);
  return <div className="flex h-full min-h-0 bg-[#080d17]/70">
    <aside className="hidden w-44 shrink-0 border-r border-white/10 bg-black/15 p-3 sm:block"><p className="label px-2 py-2">Favorites</p>{Object.keys(files).map((name) => <button key={name} onClick={() => setFolder(name)} className={`flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-[12px] ${folder === name ? "bg-white/10 text-white" : "text-white/55 hover:bg-white/5"}`}><Icon name={name === "Projects" ? "folder" : "info"} size={14}/>{name}</button>)}</aside>
    <section className="min-w-0 flex-1 overflow-auto p-4 sm:p-6"><div className="mb-5 flex items-center justify-between"><div><p className="label">Yaswanth’s Mac</p><h1 className="mt-1 text-lg font-semibold text-white">{folder}</h1></div><span className="text-[11px] text-white/35">{files[folder]?.length ?? 0} items</span></div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">{(files[folder] ?? []).map((item) => <button key={item[0]} onDoubleClick={() => open(item)} onClick={() => item[2] !== "project" && setFolder(folder)} className="group flex min-h-28 flex-col items-center justify-center gap-2 rounded-xl border border-transparent p-3 text-center transition hover:border-white/10 hover:bg-white/[0.04]"><span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-400/15 text-blue-200"><Icon name={item[1]} size={23}/></span><span className="max-w-full truncate text-[11.5px] text-white/75">{item[0]}</span>{item[4] && <span className="line-clamp-2 text-[10px] text-white/35">{item[4]}</span>}</button>)}</div>
      <p className="mt-5 text-[10px] text-white/30">Double-click a folder or file to open it.</p></section>
  </div>;
};
export default Finder;
