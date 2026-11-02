import React, { useState } from "react";
import MainContext from "../context/mainContext";
import { appMap } from "../libs/data";
import { renderApp } from "../apps/registry";
import MenuBar from "./MenuBar";
import DesktopIcons from "./DesktopIcons";
import Dock from "./Dock";
import Window from "./Window";
import ContextMenu from "./ContextMenu";

const Desktop = () => {
  const { windows, openApp, closeAllWindows, setSpotlightOpen } =
    React.useContext(MainContext);
  const [menu, setMenu] = useState(null);

  const handleAction = (action) => {
    if (!action) return;
    if (action.type === "app") {
      openApp(action.app, action.payload);
      return;
    }
    if (action.type === "link" && action.href) {
      window.open(action.href, "_blank", "noreferrer");
    }
  };

  const menuItems = [
    { id: "home", label: "Open Home", icon: "home", onClick: () => openApp("home") },
    { id: "terminal", label: "Open Terminal", icon: "terminal", onClick: () => openApp("terminal") },
    { id: "search", label: "Spotlight Search", icon: "search", onClick: () => setSpotlightOpen(true) },
    { id: "divider-1", type: "divider" },
    {
      id: "wallpaper",
      label: "Change Wallpaper…",
      icon: "image",
      onClick: () => openApp("settings", { tab: "wallpapers" }),
    },
    { id: "divider-2", type: "divider" },
    { id: "close-all", label: "Close All Windows", icon: "close", onClick: closeAllWindows },
  ];

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden">
      <MenuBar />

      <main
        className="relative min-h-0 flex-1"
        onContextMenu={(event) => {
          event.preventDefault();
          if (event.target.closest("[data-window]")) return;
          setMenu({ x: event.clientX, y: event.clientY });
        }}
      >
        <DesktopIcons onAction={handleAction} />

        {windows.map((win) => {
          const app = appMap[win.app];
          return (
            <Window key={win.id} win={win} app={app}>
              {renderApp(win.app, win.payload, win.id)}
            </Window>
          );
        })}

        <div className="pointer-events-none absolute bottom-24 left-4 hidden select-none sm:block">
          <p className="font-arcade text-[10px] leading-relaxed text-white/35">
            click an icon to open
          </p>
          <p className="mt-1 font-mono text-[10px] leading-relaxed text-white/25">
            right-click desktop · ctrl+k spotlight
          </p>
        </div>

        <Dock />

        {menu && (
          <ContextMenu
            x={menu.x}
            y={menu.y}
            items={menuItems}
            onClose={() => setMenu(null)}
          />
        )}
      </main>
    </div>
  );
};

export default Desktop;
