import React, { useMemo, useState } from "react";
import MainContext from "../context/mainContext";
import { packages } from "../libs/data";
import { Icon } from "../libs/icons";

const Packages = () => {
  const { openApp } = React.useContext(MainContext);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return packages
      .map((pkg, index) => ({ pkg, index }))
      .filter(({ pkg }) => {
        if (!q) return true;
        return `${pkg.name} ${pkg.description} ${(pkg.tags ?? []).join(" ")}`
          .toLowerCase()
          .includes(q);
      });
  }, [query]);

  return (
    <div className="os-scroll h-full overflow-y-auto px-5 py-5 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-[19px] font-semibold tracking-tight text-white">npm packages</h1>
          <p className="mt-0.5 text-[12px] text-white/40">
            Open-source utilities published to the npm registry.
          </p>
        </div>
        <div className="relative">
          <Icon
            name="search"
            size={13}
            className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-white/35"
          />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Filter packages"
            aria-label="Filter packages"
            className="glass-input w-44 rounded-lg py-1.5 pl-8 pr-2.5 text-[12px] text-white placeholder:text-white/30 focus:outline-none"
          />
        </div>
      </div>

      <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
        {filtered.map(({ pkg, index }) => (
          <button
            key={pkg.name}
            type="button"
            onClick={() => openApp("package", { index, title: pkg.name })}
            className="group glass-card flex flex-col items-start gap-3 rounded-xl px-4 py-4 text-left transition hover:border-white/25 hover:bg-white/[0.09]"
          >
            <div className="flex w-full items-start justify-between gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-400/15 text-rose-200">
                <Icon name="npm" size={18} />
              </span>
              <span className="inline-flex items-center gap-1 rounded-md border border-white/10 px-1.5 py-0.5 text-[10px] text-white/45">
                v{pkg.version}
              </span>
            </div>
            <div className="min-w-0">
              <h2 className="truncate text-[13.5px] font-medium text-white/90">
                {pkg.name.replace(/^@[^/]+\//, "")}
              </h2>
              <p className="mt-1 line-clamp-2 text-[11.5px] leading-relaxed text-white/45">
                {pkg.description}
              </p>
            </div>
            <div className="mt-auto flex flex-wrap gap-1">
              {(pkg.tags ?? []).map((tag) => (
                <span
                  key={tag}
                  className="rounded border border-white/10 bg-white/[0.04] px-1.5 py-0.5 text-[10px] text-white/45"
                >
                  {tag}
                </span>
              ))}
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] text-white/35 transition group-hover:text-white/70">
              View details
              <Icon
                name="chevronRight"
                size={11}
                className="transition group-hover:translate-x-0.5"
              />
            </span>
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="py-12 text-center text-[12.5px] text-white/35">
          No packages match “{query.trim()}”.
        </p>
      )}

      <p className="mt-6 text-[11px] text-white/25">
        Add new packages in <span className="font-mono text-white/40">src/data/packages.json</span>.
      </p>
    </div>
  );
};

export default Packages;
