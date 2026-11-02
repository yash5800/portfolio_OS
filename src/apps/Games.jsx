import React, { useState } from "react";
import { Icon } from "../libs/icons";

const source = "https://mashukui.github.io/web-games";
const games = [
  { id: "maze-muncher", title: "Maze Muncher", genre: "Arcade · maze chase", icon: "🟡", description: "Clear the maze, grab power pellets and dodge the ghosts." },
  { id: "breakout", title: "Breakout", genre: "Arcade · brick breaker", icon: "🧱", description: "Keep the ball in play and smash through the brick wall." },
  { id: "dino-run", title: "Dino Run", genre: "Action · endless runner", icon: "🦖", description: "Jump the cacti, duck the birds and see how far you get." },
  { id: "paddle-duel", title: "Paddle Duel", genre: "Arcade · versus AI", icon: "🏓", description: "A fast Pong-style match with three difficulty levels." },
  { id: "fruit-slice", title: "Fruit Slice", genre: "Action · reflex", icon: "🍉", description: "Swipe through fruit, chain combos and avoid the bombs." },
  { id: "mini-golf", title: "Mini Golf", genre: "Sports · 9 holes", icon: "⛳", description: "Aim, set your power and putt around a nine-hole course." },
  { id: "whack-a-mole", title: "Whack-a-Mole", genre: "Arcade · reflex", icon: "🔨", description: "A one-minute reflex run: hit moles, grab stars, skip bombs." },
  { id: "merge-drop", title: "Merge Drop", genre: "Puzzle · merge", icon: "🍉", description: "Drop matching fruit together and keep the pile below the line." },
];

export default function Games() {
  const [selected, setSelected] = useState(null);
  const game = games.find((item) => item.id === selected);
  return (
    <div className="flex h-full min-h-0 flex-col bg-[#100b1b] text-white">
      <header className="flex items-center justify-between gap-3 border-b border-fuchsia-200/10 px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          {game && <button type="button" onClick={() => setSelected(null)} aria-label="Back to games" className="rounded-lg border border-white/10 bg-white/5 p-2 text-white/60 hover:bg-white/10"><Icon name="arrowRight" size={14} className="rotate-180" /></button>}
          <div><p className="font-arcade text-[11px] text-fuchsia-200">PIXEL ARCADE</p><p className="mt-1 text-[10px] text-white/35">{game ? game.title : "A hand-picked cabinet of browser games"}</p></div>
        </div>
        <span className="hidden rounded-full border border-emerald-300/20 bg-emerald-300/5 px-2 py-1 text-[8px] tracking-wider text-emerald-100/60 sm:inline">OPEN SOURCE · MIT</span>
      </header>
      {game ? <div className="flex min-h-0 flex-1 flex-col">
        <div className="flex items-center justify-between gap-3 border-b border-white/[.06] bg-black/15 px-3 py-2 text-[10px]">
          <span className="text-white/45">{game.genre} <span className="mx-1 text-white/20">·</span> by @mashukui</span>
          <a href={`${source}/${game.id}/`} target="_blank" rel="noreferrer" className="flex shrink-0 items-center gap-1 text-[var(--accent)] hover:text-white">Open in new tab <Icon name="external" size={11}/></a>
        </div>
        <iframe key={game.id} title={`${game.title} browser game`} src={`${source}/${game.id}/`} className="min-h-0 w-full flex-1 border-0 bg-[#111]" allow="fullscreen; gamepad; autoplay" sandbox="allow-scripts allow-same-origin allow-forms allow-pointer-lock allow-presentation" />
        <p className="border-t border-white/[.06] px-3 py-1.5 text-[9px] text-white/30">Game provided by the open-source Web Games collection. Its own site stores scores locally.</p>
      </div> : <div className="os-scroll min-h-0 flex-1 overflow-auto p-4 sm:p-6">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3"><div><p className="label">Press start</p><h1 className="mt-1 text-xl font-semibold text-white">Pick your next distraction<span className="text-fuchsia-300">.</span></h1><p className="mt-1 max-w-xl text-[11px] text-white/40">Real browser games, with keyboard and touch controls. Your desktop stays open while you play.</p></div><span className="rounded-full border border-emerald-300/20 bg-emerald-300/5 px-2 py-1 text-[8px] tracking-wider text-emerald-100/60 sm:hidden">OPEN SOURCE · MIT</span></div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{games.map((item, i) => <button key={item.id} type="button" onClick={() => setSelected(item.id)} className="group glass-card flex min-h-32 items-start gap-3 rounded-xl p-4 text-left transition hover:-translate-y-0.5 hover:border-fuchsia-200/30 hover:bg-fuchsia-200/[.04]"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-black/20 text-2xl transition group-hover:scale-105">{item.icon}</span><span className="min-w-0 flex-1"><span className="flex items-center justify-between gap-2"><b className="truncate text-[12px] text-white/90">{item.title}</b><span className="font-mono text-[9px] text-white/25">0{i+1}</span></span><span className="mt-1 block text-[9px] uppercase tracking-wide text-fuchsia-200/55">{item.genre}</span><span className="mt-2 block text-[10px] leading-relaxed text-white/40">{item.description}</span><span className="mt-3 inline-flex items-center gap-1 text-[9px] text-white/55 group-hover:text-white">Play <Icon name="play" size={10}/></span></span></button>)}</div>
        <footer className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-white/[.07] pt-3 text-[9px] text-white/30"><span>Games by <a className="text-white/55 underline decoration-white/20 underline-offset-2 hover:text-white" href="https://github.com/mashukui/web-games" target="_blank" rel="noreferrer">@mashukui</a> · MIT licensed</span><a href={`${source}/`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-white/65">Browse the full collection <Icon name="external" size={10}/></a></footer>
      </div>}
    </div>
  );
}
