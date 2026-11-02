import React, { useEffect, useRef, useState } from "react";
import MainContext from "../context/mainContext";
import {
  accents,
  apps,
  packages,
  profile,
  projects,
  site,
  wallpapers,
} from "../libs/data";

const PROMPT = "guest@pixelify.me";
const LOGO = [
  "  ██████╗",
  "  ██╔══██╗",
  "  ██████╔╝",
  "  ██╔═══╝",
  "  ██║",
  "  ╚═╝",
];

const helpText = [
  ["about", "who I am, in two sentences"],
  ["skills", "grouped skills and tools"],
  ["projects [term]", "list or filter projects"],
  ["project <name>", "open a project brief"],
  ["packages", "published npm packages"],
  ["install <package>", "npm install command"],
  ["apps", "running desktop applications"],
  ["open <app>", "launch an app by name"],
  ["wallpaper [id|list]", "switch the desktop wallpaper"],
  ["theme [id|list]", "switch the accent color"],
  ["contact", "email and social links"],
  ["neofetch", "system summary"],
  ["ls | cat <file>", "list and read virtual files"],
  ["date | whoami | pwd", "small utilities"],
  ["history", "previous commands"],
  ["clear", "clear the screen"],
  ["exit", "close this window"],
];

const Terminal = ({ windowId }) => {
  const {
    openApp,
    closeWindow,
    setWallpaper,
    setAccent,
    settings,
    isMobile,
  } = React.useContext(MainContext);

  const idRef = useRef(0);
  const nextId = () => {
    idRef.current += 1;
    return idRef.current;
  };

  const [lines, setLines] = useState(() => [
    { id: nextId(), type: "dim", text: `${site.identity.site.label} · portfolio shell` },
    { id: nextId(), type: "dim", text: `Last login: ${new Date().toLocaleString()}` },
    { id: nextId(), type: "output", text: "Type `help` to explore, or `open projects` to jump straight in." },
    { id: nextId(), type: "blank", text: "" },
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    const node = scrollRef.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [lines]);

  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 120);
    return () => clearTimeout(timer);
  }, []);

  const print = (entries) => {
    const list = Array.isArray(entries) ? entries : [entries];
    setLines((current) => [
      ...current,
      ...list.map((entry) => ({
        id: nextId(),
        type: typeof entry === "string" ? "output" : entry.type,
        text: typeof entry === "string" ? entry : entry.text,
      })),
    ]);
  };

  const describeProject = (project) => {
    const description =
      typeof project.description === "string"
        ? project.description
        : [
            project.description?.head,
            ...(project.description?.points ?? []).map((point) => `  • ${point}`),
            project.description?.footer,
          ]
            .filter(Boolean)
            .join("\n");

    return [
      { type: "accent", text: project.title },
      { type: "output", text: description },
      {
        type: "dim",
        text: `${project.duration ? `${project.duration.start} → ${project.duration.end}` : ""}${
          project.skills?.length ? `  ·  ${project.skills.join(", ")}` : ""
        }`,
      },
      ...(project.liveLink ? [{ type: "success", text: `live   ${project.liveLink}` }] : []),
      ...(project.github ? [{ type: "dim", text: `code   ${project.github}` }] : []),
      { type: "blank", text: "" },
    ];
  };

  const run = (raw) => {
    const command = raw.trim();
    setLines((current) => [
      ...current,
      { id: nextId(), type: "input", text: command },
    ]);
    if (!command) return;

    const [name, ...rest] = command.split(/\s+/);
    const arg = rest.join(" ");
    const cmd = name.toLowerCase();

    setHistory((current) => [...current, command]);
    setHistoryIndex(-1);

    switch (cmd) {
      case "help":
        print([
          { type: "accent", text: "Available commands" },
          ...helpText.map(([usage, description]) => ({
            type: "output",
            text: `  ${usage.padEnd(22, " ")} ${description}`,
          })),
          { type: "blank", text: "" },
        ]);
        break;

      case "about":
        print([
          { type: "accent", text: profile.name },
          { type: "dim", text: profile.role },
          { type: "output", text: profile.bio },
          { type: "blank", text: "" },
        ]);
        break;

      case "skills":
        print([
          { type: "accent", text: "Skills" },
          ...Object.entries(profile.skills).map(([group, items]) => ({
            type: "output",
            text: `  ${group.padEnd(14, " ")} ${items.join(" · ")}`,
          })),
          { type: "blank", text: "" },
        ]);
        break;

      case "projects": {
        const term = arg.toLowerCase();
        const matches = projects.filter((project) => {
          if (!term) return true;
          const haystack = [project.title, ...(project.skills ?? [])].join(" ").toLowerCase();
          return haystack.includes(term);
        });
        if (matches.length === 0) {
          print({ type: "error", text: `no projects matching “${arg}”` });
          break;
        }
        print([
          { type: "accent", text: `${matches.length} project${matches.length === 1 ? "" : "s"}` },
          ...matches.map((project, index) => ({
            type: "output",
            text: `  ${String(index + 1).padStart(2, " ")}. ${project.title.padEnd(20, " ")} ${
              project.duration ? `${project.duration.start} → ${project.duration.end}` : "—"
            }`,
          })),
          { type: "dim", text: "Run `project <name>` for details." },
          { type: "blank", text: "" },
        ]);
        break;
      }

      case "project": {
        if (!arg) {
          print({ type: "error", text: "usage: project <name>" });
          break;
        }
        const project = projects.find((item) =>
          item.title.toLowerCase().includes(arg.toLowerCase())
        );
        if (!project) {
          print({ type: "error", text: `project not found: ${arg}` });
          break;
        }
        print(describeProject(project));
        break;
      }

      case "packages":
        print([
          { type: "accent", text: `${packages.length} published package${packages.length === 1 ? "" : "s"}` },
          ...packages.map((pkg) => ({ type: "output", text: `  ${pkg.name}  v${pkg.version}` })),
          { type: "dim", text: "Run `open packages` to browse them." },
          { type: "blank", text: "" },
        ]);
        break;

      case "install": {
        const pkg =
          packages.find((item) => item.name.toLowerCase().includes(arg.toLowerCase())) ??
          packages[0];
        if (!pkg) {
          print({ type: "error", text: "no packages available" });
          break;
        }
        print({ type: "output", text: pkg.install });
        break;
      }

      case "apps":
        print([
          { type: "accent", text: "Applications" },
          ...apps
            .filter((app) => !app.hidden)
            .map((app) => ({ type: "output", text: `  ${app.id.padEnd(12, " ")} ${app.title}` })),
          { type: "blank", text: "" },
        ]);
        break;

      case "open": {
        const target = arg.toLowerCase();
        const app = apps.find(
          (item) =>
            !item.hidden &&
            (item.id === target || item.title.toLowerCase() === target)
        );
        if (!app) {
          print({ type: "error", text: `unknown app: ${arg || "(none)"}` });
          break;
        }
        openApp(app.id);
        print({ type: "success", text: `opening ${app.title}…` });
        break;
      }

      case "wallpaper": {
        if (!arg || arg === "list") {
          print([
            { type: "accent", text: "Wallpapers" },
            ...wallpapers.map((wallpaper) => ({
              type: wallpaper.id === settings.wallpaper ? "success" : "output",
              text: `  ${wallpaper.id.padEnd(16, " ")} ${wallpaper.name}${
                wallpaper.id === settings.wallpaper ? "  ← active" : ""
              }`,
            })),
            { type: "blank", text: "" },
          ]);
          break;
        }
        const wallpaper = wallpapers.find(
          (item) =>
            item.id === arg.toLowerCase() || item.name.toLowerCase() === arg.toLowerCase()
        );
        if (!wallpaper) {
          print({ type: "error", text: `unknown wallpaper: ${arg}` });
          break;
        }
        setWallpaper(wallpaper.id);
        print({ type: "success", text: `wallpaper → ${wallpaper.name}` });
        break;
      }

      case "theme": {
        if (!arg || arg === "list") {
          print([
            { type: "accent", text: "Accent colors" },
            ...accents.map((accent) => ({
              type: accent.id === settings.accent ? "success" : "output",
              text: `  ${accent.id.padEnd(10, " ")} ${accent.name}${
                accent.id === settings.accent ? "  ← active" : ""
              }`,
            })),
            { type: "blank", text: "" },
          ]);
          break;
        }
        const accent = accents.find(
          (item) => item.id === arg.toLowerCase() || item.name.toLowerCase() === arg.toLowerCase()
        );
        if (!accent) {
          print({ type: "error", text: `unknown theme: ${arg}` });
          break;
        }
        setAccent(accent.id);
        print({ type: "success", text: `accent → ${accent.name}` });
        break;
      }

      case "contact":
        print([
          { type: "accent", text: "Contact" },
          { type: "output", text: `  email  ${profile.email}` },
          ...profile.socials
            .filter((social) => social.id !== "email")
            .map((social) => ({
              type: "output",
              text: `  ${social.label.toLowerCase().padEnd(7, " ")}${social.href}`,
            })),
          { type: "blank", text: "" },
        ]);
        break;

      case "neofetch":
        print([
          ...LOGO.map((line, index) => ({
            type: "accent",
            text: `${line.padEnd(22, " ")} ${
              [
                `${profile.handle}@${site.identity.site.label}`,
                `OS       ${site.identity.site.label}`,
                "Shell    portfolio-sh",
                `Terminal ${window.innerWidth}×${window.innerHeight}`,
                `Theme    ${settings.accent} / ${settings.wallpaper}`,
                `Browser  ${navigator.userAgent.includes("Firefox") ? "Firefox" : navigator.userAgent.includes("Safari") && !navigator.userAgent.includes("Chrome") ? "Safari" : "Chromium"}`,
              ][index] ?? ""
            }`,
          })),
          { type: "blank", text: "" },
        ]);
        break;

      case "ls":
        print([
          { type: "output", text: "about.json    projects.json    packages.json" },
          { type: "output", text: "profile.json  wallpapers.json  site.json" },
          { type: "blank", text: "" },
        ]);
        break;

      case "cat": {
        const file = arg.toLowerCase().replace(/^src\/data\//, "");
        if (file === "about.json" || file === "profile.json") {
          print([
            { type: "output", text: `${profile.name} — ${profile.role}` },
            { type: "dim", text: profile.bio },
            { type: "blank", text: "" },
          ]);
          break;
        }
        if (file === "site.json") {
          print([
            { type: "output", text: `${site.identity.site.label} · interactive portfolio` },
            { type: "dim", text: site.home.intro },
            { type: "blank", text: "" },
          ]);
          break;
        }
        if (file === "projects.json") {
          print({ type: "output", text: `${projects.length} projects: ${projects.map((p) => p.title).join(", ")}` });
          break;
        }
        if (file === "packages.json") {
          print({ type: "output", text: `${packages.length} packages: ${packages.map((p) => p.name).join(", ")}` });
          break;
        }
        if (file === "wallpapers.json") {
          print({ type: "output", text: `${wallpapers.length} wallpapers: ${wallpapers.map((w) => w.name).join(", ")}` });
          break;
        }
        print({ type: "error", text: `cat: ${arg || "(none)"}: no such file` });
        break;
      }

      case "date":
        print({ type: "output", text: new Date().toString() });
        break;

      case "whoami":
        print({ type: "output", text: "guest — visiting the pixelify.me desktop" });
        break;

      case "pwd":
        print({ type: "output", text: "/Users/guest/pixelify.me" });
        break;

      case "echo":
        print({ type: "output", text: arg });
        break;

      case "history":
        print(
          history.length
            ? history.map((entry, index) => ({
                type: "output",
                text: `  ${String(index + 1).padStart(2, " ")}  ${entry}`,
              }))
            : { type: "dim", text: "no commands yet" }
        );
        break;

      case "clear":
        setLines([]);
        return;

      case "sudo":
        print({
          type: "error",
          text: "guest is not in the sudoers file. This incident has been reported. 🚨",
        });
        break;

      case "exit":
        print({ type: "dim", text: "closing session…" });
        closeWindow(windowId);
        break;

      default:
        print({ type: "error", text: `command not found: ${name} — try \`help\`` });
    }
  };

  const onKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      run(input);
      setInput("");
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (history.length === 0) return;
      const nextIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setInput(history[nextIndex] ?? "");
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (historyIndex === -1) return;
      const nextIndex = historyIndex + 1;
      if (nextIndex >= history.length) {
        setHistoryIndex(-1);
        setInput("");
        return;
      }
      setHistoryIndex(nextIndex);
      setInput(history[nextIndex] ?? "");
      return;
    }
    if (event.key === "l" && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      setLines([]);
    }
  };

  const renderLine = (line) => {
    if (line.type === "blank") return <div key={line.id} className="h-2" />;

    if (line.type === "input") {
      return (
        <div key={line.id} className="flex flex-wrap gap-x-1.5">
          <span className="text-emerald-300/90">{PROMPT}</span>
          <span className="text-sky-300/80">~</span>
          <span className="text-white/45">%</span>
          <span className="text-white/90">{line.text}</span>
        </div>
      );
    }

    const colors = {
      output: "text-white/65",
      dim: "text-white/35",
      error: "text-rose-300/90",
      success: "text-emerald-300/85",
      accent: "text-sky-300/90",
    };

    return (
      <div key={line.id} className={`whitespace-pre-wrap break-words ${colors[line.type] || "text-white/65"}`}>
        {line.text}
      </div>
    );
  };

  return (
    <div
      className="flex h-full flex-col bg-[#070a11]"
      onPointerDown={() => inputRef.current?.focus()}
    >
      <div className="flex shrink-0 items-center justify-between border-b border-white/[0.06] px-3.5 py-1.5">
        <span className="text-[10.5px] font-medium uppercase tracking-[0.16em] text-white/30">
          {profile.handle} — zsh
        </span>
        <button
          type="button"
          onClick={() => setLines([])}
          className="rounded px-1.5 py-0.5 text-[10px] text-white/30 transition hover:bg-white/10 hover:text-white/70"
        >
          Clear
        </button>
      </div>

      <div
        ref={scrollRef}
        className="os-scroll min-h-0 flex-1 overflow-y-auto px-3.5 py-3 font-mono text-[11.5px] leading-[1.75] sm:text-[12px]"
      >
        {lines.map(renderLine)}

        <div className="mt-1 flex flex-wrap items-center gap-x-1.5">
          <span className="text-emerald-300/90">{PROMPT}</span>
          <span className="text-sky-300/80">~</span>
          <span className="text-white/45">%</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={onKeyDown}
            aria-label="Terminal command"
            spellCheck={false}
            autoComplete="off"
            autoCapitalize="off"
            className="min-w-[60px] flex-1 bg-transparent font-mono text-[11.5px] text-white/90 caret-sky-300 focus:outline-none sm:text-[12px]"
          />
        </div>
      </div>

      {!isMobile && (
        <div className="shrink-0 border-t border-white/[0.06] px-3.5 py-1 text-[10px] text-white/25">
          ↑↓ history · Ctrl L clear · try `neofetch`
        </div>
      )}
    </div>
  );
};

export default Terminal;
