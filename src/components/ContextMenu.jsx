import React, { useEffect, useRef } from "react";
import { Icon } from "../libs/icons";

const ContextMenu = ({ x, y, items, onClose }) => {
  const menuRef = useRef(null);

  useEffect(() => {
    const onPointerDown = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) onClose();
    };
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKey);
    window.addEventListener("blur", onClose);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("blur", onClose);
    };
  }, [onClose]);

  const width = 218;
  const left = Math.min(x, window.innerWidth - width - 10);
  const top = Math.min(y, window.innerHeight - items.length * 36 - 24);

  return (
    <div
      ref={menuRef}
      role="menu"
      className="menu-in fixed z-[9700] rounded-xl border border-white/12 bg-[#10131c]/92 p-1.5 shadow-2xl shadow-black/60 backdrop-blur-2xl"
      style={{ left, top, width }}
    >
      {items.map((item) => {
        if (item.type === "divider") {
          return <div key={item.id} className="my-1 h-px bg-white/10" />;
        }
        return (
          <button
            key={item.id}
            type="button"
            role="menuitem"
            onClick={() => {
              item.onClick();
              onClose();
            }}
            className="flex w-full items-center justify-between gap-4 rounded-md px-2.5 py-1.5 text-left text-[12.5px] text-white/85 transition hover:bg-white/12 hover:text-white"
          >
            <span>{item.label}</span>
            {item.icon && <Icon name={item.icon} size={13} className="text-white/40" />}
          </button>
        );
      })}
    </div>
  );
};

export default ContextMenu;
