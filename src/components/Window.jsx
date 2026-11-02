import React, { useEffect, useRef, useState } from "react";
import MainContext from "../context/mainContext";
import AppIcon from "./AppIcon";

const MIN_VISIBLE = 110;

const Window = ({ win, app, children }) => {
  const {
    focusedId,
    focusWindow,
    closeWindow,
    minimizeWindow,
    toggleMaximize,
    moveWindow,
    resizeWindow,
    isMobile,
  } = React.useContext(MainContext);

  const [closing, setClosing] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState(false);
  const dragRef = useRef(null);
  const resizeRef = useRef(null);
  const closeTimer = useRef(null);

  const active = focusedId === win.id;
  const title = win.title || app?.title;
  const minimized = win.minimized;
  const maximized = win.maximized;

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  useEffect(() => {
    if (!dragging) return;
    const onMove = (event) => {
      const start = dragRef.current;
      if (!start) return;
      const nextX = start.x + (event.clientX - start.px);
      const nextY = start.y + (event.clientY - start.py);
      const maxX = window.innerWidth - MIN_VISIBLE;
      const maxY = window.innerHeight - 48;
      moveWindow(win.id, Math.min(maxX, Math.max(MIN_VISIBLE - start.w, nextX)), Math.min(maxY, Math.max(0, nextY)));
    };
    const onUp = () => setDragging(false);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp, { once: true });
    window.addEventListener("pointercancel", onUp, { once: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [dragging, moveWindow, win.id]);

  useEffect(() => {
    if (!resizing) return;
    const onMove = (event) => {
      const start = resizeRef.current;
      if (!start) return;
      const minWidth = app?.minSize?.width ?? 380;
      const minHeight = app?.minSize?.height ?? 260;
      const availableWidth = window.innerWidth - 16;
      const availableHeight = window.innerHeight - 32 - 40;
      const nextWidth = Math.max(
        Math.min(minWidth, availableWidth),
        Math.min(availableWidth, start.w + event.clientX - start.px)
      );
      const nextHeight = Math.max(
        Math.min(minHeight, availableHeight),
        Math.min(availableHeight - win.y, start.h + event.clientY - start.py)
      );
      resizeWindow(win.id, nextWidth, nextHeight);
    };
    const onUp = () => setResizing(false);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp, { once: true });
    window.addEventListener("pointercancel", onUp, { once: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [resizing, resizeWindow, win.id, win.y, app]);

  const handleDragStart = (event) => {
    if (event.button !== 0) return;
    if (event.target.closest("[data-no-drag]")) return;
    focusWindow(win.id);
    if (maximized || isMobile) return;
    dragRef.current = { px: event.clientX, py: event.clientY, x: win.x, y: win.y, w: win.w };
    setDragging(true);
  };

  const handleResizeStart = (event) => {
    event.stopPropagation();
    if (maximized || isMobile) return;
    focusWindow(win.id);
    resizeRef.current = { px: event.clientX, py: event.clientY, w: win.w, h: win.h };
    setResizing(true);
  };

  const handleClose = () => {
    setClosing(true);
    closeTimer.current = setTimeout(() => closeWindow(win.id), 170);
  };

  const style = maximized
    ? { left: 0, top: 0, width: "100%", height: "100%", zIndex: win.z }
    : { left: win.x, top: win.y, width: win.w, height: win.h, zIndex: win.z };

  return (
    <section
      data-window
      role="dialog"
      aria-label={title || "Window"}
      aria-hidden={minimized || undefined}
      inert={minimized ? true : undefined}
      onPointerDown={() => focusWindow(win.id)}
      className={[
        "window-shell glass-window absolute flex flex-col overflow-hidden",
        "window-enter",
        closing ? "window-exit" : "",
        dragging ? "window-dragging" : "",
        minimized ? "window-minimized" : "",
        active ? "window-focused" : "",
      ].join(" ")}
      style={style}
    >
      {/* Title bar */}
      <header
        className="titlebar-stripes relative flex h-8 shrink-0 cursor-default items-center gap-2 border-b border-white/[0.09] bg-[#0b1322]/85 px-2"
        onPointerDown={handleDragStart}
        onDoubleClick={() => !isMobile && toggleMaximize(win.id)}
        style={{ cursor: maximized || isMobile ? "default" : dragging ? "grabbing" : "grab" }}
      >
        <div className="group/lights flex items-center gap-1.5" data-no-drag>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close window"
            className="flex h-[11px] w-[11px] items-center justify-center rounded-full border border-black/40 bg-[#ff5f57] transition hover:brightness-110"
          >
            <span className="text-[7px] font-bold leading-none text-black/60 opacity-0 transition-opacity group-hover/lights:opacity-100">
              ×
            </span>
          </button>
          <button
            type="button"
            onClick={() => minimizeWindow(win.id)}
            aria-label="Minimize window"
            className="flex h-[11px] w-[11px] items-center justify-center rounded-full border border-black/40 bg-[#febc2e] transition hover:brightness-110"
          >
            <span className="text-[9px] font-bold leading-none text-black/60 opacity-0 transition-opacity group-hover/lights:opacity-100">
              −
            </span>
          </button>
          <button
            type="button"
            onClick={() => toggleMaximize(win.id)}
            aria-label={maximized ? "Restore window" : "Maximize window"}
            className="hidden h-[11px] w-[11px] items-center justify-center rounded-full border border-black/40 bg-[#28c840] transition hover:brightness-110 sm:flex"
          >
            <span className="text-[8px] font-bold leading-none text-black/60 opacity-0 transition-opacity group-hover/lights:opacity-100">
              +
            </span>
          </button>
        </div>

        <span className="pointer-events-none ml-1 hidden text-white/20 sm:inline" aria-hidden="true">
          │
        </span>

        <div className="pointer-events-none absolute inset-x-0 flex items-center justify-center gap-2">
          <AppIcon
            icon={app?.icon}
            tint={app?.tint}
            image={app?.image}
            size={14}
            className="opacity-85"
          />
          <h2 className="font-arcade max-w-[55%] truncate text-[10px] leading-none text-white/70">
            {title}
          </h2>
        </div>

        <div className="ml-auto flex items-center gap-1.5" aria-hidden="true">
          <span className="hidden h-1.5 w-1.5 bg-white/15 sm:block" />
          <span className="hidden h-1.5 w-1.5 bg-white/10 sm:block" />
          <span className="hidden h-1.5 w-1.5 bg-white/5 sm:block" />
        </div>
      </header>

      <div className="relative min-h-0 flex-1 overflow-hidden">{children}</div>

      {!maximized && !isMobile && (
        <div
          role="presentation"
          onPointerDown={handleResizeStart}
          className="absolute bottom-0 right-0 z-20 h-4 w-4 cursor-nwse-resize"
        >
          <div className="absolute bottom-[3px] right-[3px] h-2 w-2 border-b border-r border-white/30" />
        </div>
      )}
    </section>
  );
};

export default Window;
