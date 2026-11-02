import React, { useState } from "react";
import { profile, projects, site } from "../libs/data";
import { Icon } from "../libs/icons";

const sourceFiles = [
  ["profile.json", JSON.stringify({ name: profile.name, role: profile.role, location: profile.location, email: profile.email, bio: profile.bio, socials: profile.socials }, null, 2)],
  ["skills.json", JSON.stringify(profile.skills, null, 2)],
  ["projects.json", JSON.stringify(projects.map(({title, description, skills, github, liveLink}) => ({title, description, skills, github, liveLink})), null, 2)],
  ["README.md", `# ${site.identity.display}\n\n${site.home.intro}\n\nBuilt with React, Vite and a little desktop nostalgia.`],
];
const Editor = () => {
  const [selected, setSelected] = useState(0);
  const [sidebar, setSidebar] = useState(true);
  const [name, code] = sourceFiles[selected];
  return <div className="flex h-full min-h-0 bg-[#0b1019] font-mono">
    {sidebar && <aside className="w-44 shrink-0 border-r border-white/10 bg-black/15"><div className="flex items-center justify-between px-3 py-3 text-[9px] uppercase tracking-[.16em] text-white/40">Explorer <span>···</span></div><p className="px-3 pb-2 text-[9px] font-semibold text-white/55">PORTFOLIO</p>{sourceFiles.map(([file], i) => <button key={file} onClick={() => setSelected(i)} className={`flex w-full items-center gap-2 px-3 py-2 text-left text-[10px] ${selected === i ? "bg-white/10 text-white" : "text-white/45 hover:bg-white/5"}`}><Icon name={file.endsWith("md") ? "info" : "code"} size={12}/>{file}</button>)}</aside>}
    <section className="flex min-w-0 flex-1 flex-col"><header className="flex items-center gap-2 border-b border-white/10 bg-black/10"><button onClick={() => setSidebar(!sidebar)} aria-label="Toggle explorer" className="px-3 py-2 text-white/35 hover:text-white"><Icon name="folder" size={13}/></button><span className="border-r border-white/10 border-t-2 border-t-[var(--accent)] bg-white/[.04] px-3 py-2 text-[10px] text-white/70">{name}</span></header><div className="os-scroll flex-1 overflow-auto py-3 text-[11px] leading-[1.75]">{code.split("\n").map((line, i) => <div key={i} className="flex min-w-max"><span className="sticky left-0 w-11 shrink-0 select-none bg-[#0b1019] pr-3 text-right text-white/20">{i + 1}</span><pre className="whitespace-pre pr-8 text-sky-100/80">{line || " "}</pre></div>)}</div><footer className="flex h-6 items-center justify-between border-t border-white/10 px-3 text-[9px] text-white/30"><span>JSON · read only</span><span>UTF-8 · {code.split("\n").length} lines</span></footer></section>
  </div>;
};
export default Editor;
