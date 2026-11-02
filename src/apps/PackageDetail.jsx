import React, { Suspense } from "react";
import { packages } from "../libs/data";
import { Icon } from "../libs/icons";

const CodeBlock = React.lazy(() => import("../components/CodeBlock"));

const CodeFallback = () => (
  <div className="h-24 animate-pulse rounded-lg border border-white/10 bg-white/[0.04]" />
);

const PackageDetail = ({ payload }) => {
  const pkg = packages[payload?.index ?? 0];

  if (!pkg) {
    return (
      <div className="flex h-full items-center justify-center px-6 text-center text-[12.5px] text-white/45">
        This package is no longer in packages.json.
      </div>
    );
  }

  return (
    <div className="os-scroll h-full overflow-y-auto px-5 py-5 sm:px-6">
      <div className="flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-400/15 text-rose-200">
          <Icon name="npm" size={22} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="truncate text-[16px] font-semibold text-white">{pkg.name}</h1>
            <span className="rounded border border-white/10 px-1.5 py-0.5 text-[10px] text-white/45">
              v{pkg.version}
            </span>
          </div>
          <div className="mt-1 flex flex-wrap gap-1">
            {(pkg.tags ?? []).map((tag) => (
              <span key={tag} className="text-[10.5px] text-white/35">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-4 text-[12.5px] leading-relaxed text-white/60">{pkg.description}</p>

      <div className="mt-5">
        <h2 className="mb-2 text-[10.5px] font-medium uppercase tracking-[0.16em] text-white/35">
          Install
        </h2>
        <Suspense fallback={<CodeFallback />}>
          <CodeBlock code={pkg.install} language="bash" compact />
        </Suspense>
      </div>

      <div className="mt-5">
        <h2 className="mb-2 text-[10.5px] font-medium uppercase tracking-[0.16em] text-white/35">
          Usage
        </h2>
        <Suspense fallback={<CodeFallback />}>
          <CodeBlock code={pkg.usage} language="javascript" />
        </Suspense>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <a
          href={pkg.npmUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-[11.5px] font-medium text-black transition hover:brightness-110"
          style={{ background: "var(--accent)" }}
        >
          <Icon name="npm" size={13} />
          Open on npm
        </a>
        <a
          href={pkg.npmUrl}
          target="_blank"
          rel="noreferrer"
          className="glass-chip inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] text-white/60 transition hover:text-white"
        >
          <Icon name="download" size={12} />
          Downloads
        </a>
      </div>

      {pkg.downloadsBadge && (
        <img
          src={pkg.downloadsBadge}
          alt={`${pkg.name} downloads`}
          className="mt-4 h-5 opacity-80"
          loading="lazy"
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />
      )}
    </div>
  );
};

export default PackageDetail;
