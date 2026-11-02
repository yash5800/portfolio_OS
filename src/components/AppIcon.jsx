import React from "react";
import { Icon } from "../libs/icons";
import { asset } from "../libs/data";

const AppIcon = ({
  icon = "folder",
  tint = ["#475569", "#1e293b"],
  image,
  size = 48,
  alt = "",
  className = "",
}) => {
  const radius = Math.max(8, Math.round(size * 0.24));

  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        background: image
          ? "linear-gradient(145deg, #1b2030, #0a0d14)"
          : `linear-gradient(145deg, ${tint[0]}, ${tint[1]})`,
        boxShadow:
          "0 8px 20px -8px rgba(0,0,0,0.75), inset 0 1px 0 rgba(255,255,255,0.35), inset 0 0 0 1px rgba(255,255,255,0.09)",
      }}
    >
      {image ? (
        <img
          src={asset(image)}
          alt={alt}
          className="h-full w-full object-cover"
          draggable={false}
        />
      ) : (
        <>
          <span className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/25 via-white/5 to-transparent opacity-70" />
          <span
            className="relative flex items-center justify-center text-white"
            style={{ filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.45))" }}
          >
            <Icon name={icon} size={Math.round(size * 0.46)} />
          </span>
        </>
      )}
      <span className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-white/10" />
    </span>
  );
};

export default AppIcon;
