import React, { useEffect, useMemo, useState } from "react";
import { projectImageBase, projects } from "../libs/data";
import { Icon } from "../libs/icons";

const Projects = ({ payload }) => {
  const [activeIndex, setActiveIndex] = useState(payload?.index ?? 0);
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    if (typeof payload?.index === "number") setActiveIndex(payload.index);
  }, [payload]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return projects.map((project, index) => ({ project, index }));
    return projects
      .map((project, index) => ({ project, index }))
      .filter(({ project }) => {
        const haystack = [
          project.title,
          typeof project.description === "string"
            ? project.description
            : `${project.description?.head ?? ""} ${(project.description?.points ?? []).join(" ")}`,
          (project.skills ?? []).join(" "),
        ]
          .join(" ")
          .toLowerCase();
        return haystack.includes(q);
      });
  }, [query]);

  const selected = projects[activeIndex] || projects[0];
  const description = selected.description;

  return (
    <div className="flex h-full flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="flex shrink-0 flex-col border-b border-white/[0.07] bg-black/20 md:w-[248px] md:border-b-0 md:border-r">
        <div className="flex items-center justify-between gap-2 px-3.5 py-2.5">
          <span className="text-[10.5px] font-medium uppercase tracking-[0.16em] text-white/35">
            {filtered.length} items
          </span>
          <button
            type="button"
            onClick={() => setSearchOpen((open) => !open)}
            aria-label="Search projects"
            className={`rounded-md p-1.5 transition ${
              searchOpen ? "bg-white/12 text-white" : "text-white/40 hover:bg-white/10 hover:text-white/80"
            }`}
          >
            <Icon name="search" size={13} />
          </button>
        </div>

        {searchOpen && (
          <div className="px-3 pb-2">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search projects"
              aria-label="Search projects"
              className="glass-input w-full rounded-lg px-2.5 py-1.5 text-[12px] text-white placeholder:text-white/30 focus:outline-none"
            />
          </div>
        )}

        <div className="os-scroll flex gap-1.5 overflow-x-auto px-2.5 pb-2 md:flex-1 md:flex-col md:overflow-y-auto md:overflow-x-hidden md:pb-3">
          {filtered.map(({ project, index }) => {
            const active = index === activeIndex;
            return (
              <button
                key={project.title}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`group relative flex min-w-[150px] shrink-0 items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition md:min-w-0 md:shrink ${
                  active ? "bg-white/10" : "hover:bg-white/[0.06]"
                }`}
              >
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-white/80 ${
                    active ? "bg-sky-400/25" : "bg-white/[0.06]"
                  }`}
                >
                  <Icon name="folder" size={13} />
                </span>
                <span className="min-w-0">
                  <span
                    className={`block truncate text-[12.5px] ${
                      active ? "font-medium text-white" : "text-white/70"
                    }`}
                  >
                    {project.title}
                  </span>
                  <span className="block truncate text-[10.5px] text-white/35">
                    {project.duration?.start ?? "—"}
                  </span>
                </span>
                {active && (
                  <span
                    className="absolute left-0 top-1/2 h-4 w-[2px] -translate-y-1/2 rounded-full"
                    style={{ background: "var(--accent)" }}
                  />
                )}
              </button>
            );
          })}
          {filtered.length === 0 && (
            <p className="px-3 py-6 text-[12px] text-white/35">No matching projects.</p>
          )}
        </div>
      </aside>

      {/* Detail */}
      <section className="os-scroll min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-7">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-white">
              {selected.title}
            </h1>
            {selected.duration && (
              <p className="mt-1 inline-flex items-center gap-1.5 text-[11.5px] text-white/40">
                <Icon name="image" size={12} />
                {selected.duration.start} — {selected.duration.end}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {selected.liveLink && (
              <a
                href={selected.liveLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11.5px] font-medium text-black transition hover:brightness-110"
                style={{ background: "var(--accent)" }}
              >
                Live site
                <Icon name="external" size={11} />
              </a>
            )}
            {selected.github && (
              <a
                href={selected.github}
                target="_blank"
                rel="noreferrer"
                className="glass-chip inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11.5px] text-white/70 transition hover:border-white/25 hover:text-white"
              >
                <Icon name="github" size={12} />
                Code
              </a>
            )}
          </div>
        </div>

        {selected.images?.length > 0 && (
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {selected.images.map((image, index) => (
              <img
                key={`${selected.title}-${index}`}
                src={`${projectImageBase}${image}`}
                alt={`${selected.title} screenshot ${index + 1}`}
                loading="lazy"
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
                className="h-40 w-full rounded-lg object-cover ring-1 ring-white/10"
                draggable={false}
              />
            ))}
          </div>
        )}

        <div className="mt-5 max-w-[68ch] space-y-3">
          {typeof description === "string" ? (
            <p className="text-[13px] leading-relaxed text-white/60">{description}</p>
          ) : (
            <>
              <p className="text-[13px] leading-relaxed text-white/65">{description?.head}</p>
              {description?.points?.length > 0 && (
                <ul className="space-y-1.5">
                  {description.points.map((point) => (
                    <li key={point} className="flex gap-2 text-[12.5px] leading-relaxed text-white/55">
                      <span
                        className="mt-[7px] h-1 w-1 shrink-0 rounded-full"
                        style={{ background: "var(--accent)" }}
                      />
                      {point}
                    </li>
                  ))}
                </ul>
              )}
              {description?.footer && (
                <p className="text-[12.5px] leading-relaxed text-white/45">{description.footer}</p>
              )}
            </>
          )}
        </div>

        {selected.skills?.length > 0 && (
          <div className="mt-6">
            <h2 className="text-[10.5px] font-medium uppercase tracking-[0.16em] text-white/35">
              Built with
            </h2>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {selected.skills.map((skill) => (
                <span
                  key={skill}
                  className="glass-chip rounded-md px-2 py-1 text-[11.5px] text-white/65"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {selected.contributors?.length > 0 && (
          <div className="mt-6">
            <h2 className="text-[10.5px] font-medium uppercase tracking-[0.16em] text-white/35">
              Team
            </h2>
            <ul className="mt-2 space-y-1.5">
              {selected.contributors.map((contributor) => (
                <li key={contributor.name} className="flex flex-wrap items-center gap-2 text-[12.5px]">
                  <span className="text-white/75">{contributor.name}</span>
                  <span className="text-white/30">·</span>
                  <span className="text-white/40">{contributor.role}</span>
                  {contributor.github && (
                    <a
                      href={contributor.github}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11.5px] text-sky-300/80 transition hover:text-sky-200"
                    >
                      GitHub
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </div>
  );
};

export default Projects;
