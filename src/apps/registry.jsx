import React, { lazy, Suspense } from "react";

const About = lazy(() => import("./About"));
const Contact = lazy(() => import("./Contact"));
const PackageDetail = lazy(() => import("./PackageDetail"));
const Packages = lazy(() => import("./Packages"));
const Projects = lazy(() => import("./Projects"));
const Settings = lazy(() => import("./Settings"));
const Terminal = lazy(() => import("./Terminal"));
const Welcome = lazy(() => import("./Welcome"));
const Finder = lazy(() => import("./Finder"));
const Browser = lazy(() => import("./Browser"));
const Editor = lazy(() => import("./Editor"));
const Monitor = lazy(() => import("./Monitor"));
const Games = lazy(() => import("./Games"));
const StackAtlas = lazy(() => import("./StackAtlas"));
const ProjectTimeline = lazy(() => import("./ProjectTimeline"));

/** Map a JSON app `id` to its React implementation. */
export const appComponents = {
  home: Welcome,
  projects: Projects,
  packages: Packages,
  package: PackageDetail,
  terminal: Terminal,
  about: About,
  contact: Contact,
  settings: Settings,
  finder: Finder,
  browser: Browser,
  editor: Editor,
  monitor: Monitor,
  games: Games,
  "stack-atlas": StackAtlas,
  timeline: ProjectTimeline,
};

export const renderApp = (appId, payload, windowId) => {
  const Component = appComponents[appId];
  if (!Component) {
    return (
      <div className="flex h-full items-center justify-center px-6 text-center text-[12.5px] text-white/45">
        No implementation registered for “{appId}”. Add it to src/apps/registry.jsx.
      </div>
    );
  }
  return <Suspense fallback={<div className="flex h-full items-center justify-center gap-2 text-[11px] text-white/40"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--accent)]"/>Loading application…</div>}><Component payload={payload} windowId={windowId} /></Suspense>;
};
