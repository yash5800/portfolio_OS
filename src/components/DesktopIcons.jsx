import React, { useState } from "react";
import MainContext from "../context/mainContext";
import AppIcon from "./AppIcon";
import { site } from "../libs/data";
import { resolveIcon } from "../libs/visuals";

const DesktopIcons = ({ onAction }) => {
  const { isMobile } = React.useContext(MainContext);
  const [selected, setSelected] = useState(null);

  const icons = site.desktop.icons;

  const activate = (item) => {
    setSelected(item.id);
    onAction(item.action, item);
  };

  return (
    <div
      dir="rtl"
      className="absolute inset-y-3 right-2 z-10 grid auto-cols-[84px] grid-flow-col content-start gap-1 pb-24 sm:right-3 sm:auto-cols-[92px]"
      style={{ gridTemplateRows: "repeat(auto-fill, 96px)" }}
      onPointerDown={(event) => {
        if (event.target === event.currentTarget) setSelected(null);
      }}
    >
      {icons.map((item, index) => {
        const visual = resolveIcon(item.icon, item.image);
        const isSelected = selected === item.id;
        return (
          <button
            key={item.id}
            type="button"
            dir="ltr"
            onClick={() => activate(item)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                activate(item);
              }
            }}
            title={item.label}
            aria-label={`Open ${item.label}`}
            className={`group flex h-[92px] w-[82px] flex-col items-center justify-start gap-1 rounded px-1 pt-1.5 transition-colors sm:w-[90px] ${
              isSelected
                ? "bg-white/12 ring-1 ring-[var(--accent)]/60"
                : "hover:bg-white/[0.06]"
            }`}
            style={{
              animation: "rise-in 380ms var(--ease-out-soft) both",
              animationDelay: `${80 + index * 40}ms`,
            }}
          >
            <span className="transition-transform duration-150 ease-out group-hover:-translate-y-0.5 group-active:translate-y-0.5">
              <AppIcon
                icon={visual.icon}
                tint={visual.tint}
                image={visual.image}
                size={isMobile ? 44 : 48}
                alt={item.label}
              />
            </span>
            <span className="desktop-icon-label line-clamp-2 max-w-full break-words px-0.5 text-center leading-[1.25] text-white/85">
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default DesktopIcons;
