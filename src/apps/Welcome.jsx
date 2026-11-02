import React from "react";
import MainContext from "../context/mainContext";
import { asset, profile, projects, site } from "../libs/data";
import { Icon } from "../libs/icons";

const Welcome = () => {
  const { openApp } = React.useContext(MainContext);
  const featured = projects.slice(0, 3);
  return (
    <div className="os-scroll h-full overflow-y-auto">
      <section className="relative overflow-hidden border-b border-white/[.07] px-6 py-7 sm:px-9 sm:py-9">
        <div className="pointer-events-none absolute -right-20 -top-28 h-72 w-72 rounded-full bg-[var(--accent)] opacity-[.12] blur-3xl" />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">
          <img src={asset(profile.avatar)} alt={profile.name} className="h-[76px] w-[76px] rounded-2xl border border-white/15 object-cover shadow-xl shadow-black/30" draggable={false}/>
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-[.22em] text-white/40">{profile.location} <span className="px-1 text-white/20">/</span> {profile.role}</p>
            <h1 className="mt-1 text-[25px] font-semibold leading-tight tracking-tight text-white sm:text-[30px]">{profile.name}<span className="text-[var(--accent)]">.</span></h1>
            <p className="mt-2 text-[17px] font-medium text-white/70">{site.home.headline}</p>
          </div>
        </div>
        <p className="relative mt-5 max-w-[68ch] text-[13px] leading-relaxed text-white/55">{profile.bio}</p>
        <div className="relative mt-5 flex flex-wrap gap-2">
          <button type="button" onClick={() => openApp("projects")} className="pixel-btn pixel-btn-accent">Explore projects <Icon name="arrowRight" size={12}/></button>
          <button type="button" onClick={() => openApp("contact")} className="pixel-btn"><Icon name="mail" size={12}/> Get in touch</button>
          <button type="button" onClick={() => openApp("stack-atlas")} className="pixel-btn"><Icon name="aperture" size={12}/> Stack Atlas</button>
          <button type="button" onClick={() => openApp("timeline")} className="pixel-btn"><Icon name="clock" size={12}/> Project Timeline</button>
          {profile.socials.filter((item) => item.id === "github" || item.id === "linkedin").map((social) => <a key={social.id} href={social.href} target="_blank" rel="noreferrer" className="pixel-btn"><Icon name={social.icon} size={12}/>{social.label}</a>)}
        </div>
      </section>

      <section className="px-6 py-5 sm:px-9">
        <div className="grid grid-cols-3 gap-2">{profile.stats.map((stat) => <div key={stat.label} className="glass-card rounded-xl px-3 py-3"><p className="text-xl font-semibold text-white/90">{stat.value}</p><p className="mt-1 text-[9px] uppercase tracking-wider text-white/35">{stat.label}</p></div>)}</div>
      </section>

      <section className="px-6 pb-7 sm:px-9">
        <div className="mb-3 flex items-center justify-between"><div><p className="label">Selected work</p><h2 className="mt-1 text-[15px] font-medium text-white/85">A few things I’ve built</h2></div><button onClick={() => openApp("projects")} className="text-[10px] text-[var(--accent)] hover:text-white">All projects →</button></div>
        <div className="grid gap-2 sm:grid-cols-3">{featured.map((project, index) => <button key={project.title} onClick={() => openApp("projects", { index })} className="glass-card rounded-xl p-3 text-left transition hover:border-white/25 hover:bg-white/[.05]"><span className="font-mono text-[9px] text-[var(--accent)]">0{index+1} / BUILD</span><b className="mt-1.5 block text-[12px] text-white/85">{project.title}</b><span className="mt-1 line-clamp-2 block text-[10px] leading-relaxed text-white/40">{typeof project.description === "string" ? project.description : project.description?.head}</span></button>)}</div>
      </section>
    </div>
  );
};

export default Welcome;
