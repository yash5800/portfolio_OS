import React, { useEffect, useState } from "react";
import MainContext from "../context/mainContext";
import { accents, asset, settingsStorageKey, site, wallpapers } from "../libs/data";
import { Icon } from "../libs/icons";

const tabs = [
  { id: "wallpapers", label: "Wallpapers", icon: "image" },
  { id: "appearance", label: "Appearance", icon: "aperture" },
  { id: "system", label: "System", icon: "info" },
];

const WallpaperThumb = ({ wallpaper, active, onSelect }) => {
  const isImage = wallpaper.type === "image";
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-label={`Use ${wallpaper.name} wallpaper`}
      aria-pressed={active}
      className={`group relative aspect-[16/10] overflow-hidden rounded-lg border transition ${
        active ? "border-white/70" : "border-white/10 hover:border-white/35"
      }`}
    >
      {isImage ? (
        <img
          src={asset(wallpaper.src)}
          alt={wallpaper.name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          draggable={false}
        />
      ) : (
        <span
          className="block h-full w-full transition duration-500 group-hover:scale-105"
          style={{ backgroundImage: wallpaper.value }}
        />
      )}
      <span className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 bg-gradient-to-t from-black/75 to-transparent px-2 pb-1.5 pt-4 text-[10.5px] text-white/80">
        {wallpaper.name}
        {active && <Icon name="check" size={11} className="text-white" />}
      </span>
    </button>
  );
};

const Toggle = ({ checked, onChange, label }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    onClick={() => onChange(!checked)}
    className={`relative h-[22px] w-[38px] shrink-0 rounded-full transition ${
      checked ? "" : "bg-white/15"
    }`}
    style={checked ? { background: "var(--accent)" } : undefined}
  >
    <span
      className={`absolute top-[2px] h-[18px] w-[18px] rounded-full bg-white shadow transition-all ${
        checked ? "left-[18px]" : "left-[2px]"
      }`}
    />
  </button>
);

const Settings = ({ payload }) => {
  const {
    settings,
    setWallpaper,
    setAccent,
    setReduceMotion,
    setRetro,
    setSound,
    setShowDock,
    setBootEnabled,
    setLight,
    canInstall,
    promptInstall,
  } = React.useContext(MainContext);
  const [tab, setTab] = useState(payload?.tab ?? "wallpapers");
  const [installNote, setInstallNote] = useState("");

  useEffect(() => {
    if (payload?.tab) setTab(payload.tab);
  }, [payload]);

  const install = async () => {
    if (!canInstall) {
      setInstallNote("Use your browser menu → Install app / Add to Home Screen.");
      return;
    }
    const accepted = await promptInstall();
    setInstallNote(accepted ? "Installed." : "Install dismissed.");
  };

  const reset = () => {
    try {
      localStorage.removeItem(settingsStorageKey);
    } catch {
      /* storage may be unavailable */
    }
    window.location.reload();
  };

  return (
    <div className="flex h-full flex-col sm:flex-row">
      <aside className="shrink-0 border-b border-white/[0.07] bg-black/20 px-2 py-2 sm:w-[184px] sm:border-b-0 sm:border-r sm:py-3">
        <div className="flex gap-1 overflow-x-auto sm:flex-col">
          {tabs.map((item) => {
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={`flex shrink-0 items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[12.5px] transition sm:w-full ${
                  active ? "bg-white/10 text-white" : "text-white/55 hover:bg-white/[0.06] hover:text-white/85"
                }`}
              >
                <Icon
                  name={item.icon}
                  size={14}
                  className={active ? "text-white/85" : "text-white/40"}
                />
                {item.label}
              </button>
            );
          })}
        </div>
        <p className="mt-3 hidden px-2 text-[10px] leading-relaxed text-white/25 sm:block">
          Preferences are saved locally on this device.
        </p>
      </aside>

      <section className="os-scroll min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">
        {tab === "wallpapers" && (
          <>
            <h1 className="text-[17px] font-semibold tracking-tight text-white">Wallpaper</h1>
            <p className="mt-0.5 text-[12px] text-white/40">
              Gradient scenes ship with the desktop; image wallpapers live in{" "}
              <span className="font-mono text-white/50">public/wallpapers</span>.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              {wallpapers.map((wallpaper) => (
                <WallpaperThumb
                  key={wallpaper.id}
                  wallpaper={wallpaper}
                  active={settings.wallpaper === wallpaper.id}
                  onSelect={() => setWallpaper(wallpaper.id)}
                />
              ))}
            </div>
          </>
        )}

        {tab === "appearance" && (
          <>
            <h1 className="text-[17px] font-semibold tracking-tight text-white">Appearance</h1>
            <p className="mt-0.5 text-[12px] text-white/40">
              Tune the accent that highlights active windows, buttons and dock indicators.
            </p>

            <div className="mt-5 rounded-xl border border-white/10 bg-black/20 p-4">
              <h2 className="text-[11px] font-medium uppercase tracking-[0.14em] text-white/35">
                Accent color
              </h2>
              <div className="mt-3 flex flex-wrap gap-2.5">
                {accents.map((accent) => {
                  const active = settings.accent === accent.id;
                  return (
                    <button
                      key={accent.id}
                      type="button"
                      onClick={() => setAccent(accent.id)}
                      aria-label={`Use ${accent.name} accent`}
                      aria-pressed={active}
                      className="group flex flex-col items-center gap-1.5"
                    >
                      <span
                        className={`flex h-9 w-9 items-center justify-center rounded-full transition ${
                          active ? "ring-2 ring-white/80 ring-offset-2 ring-offset-[#0b0e16]" : "ring-1 ring-white/20"
                        }`}
                        style={{ background: accent.color }}
                      >
                        {active && <Icon name="check" size={14} className="text-black/70" />}
                      </span>
                      <span className="text-[10.5px] text-white/45">{accent.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-black/20 p-4">
              <div>
                <h2 className="text-[12.5px] font-medium text-white/85">Reduce motion</h2>
                <p className="mt-0.5 text-[11.5px] text-white/40">
                  Disable the window spring, dock bounce and wallpaper drift.
                </p>
              </div>
              <Toggle
                checked={settings.reduceMotion}
                onChange={setReduceMotion}
                label="Reduce motion"
              />
            </div>

            {[
              ["Retro mode", "Windows 95 inspired borders and pixel styling", settings.retro, setRetro],
              ["Light appearance", "Use a brighter window and menu palette", settings.light, setLight],
              ["Sound effects", "Enable subtle interface sounds", settings.sound, setSound],
              ["Show Dock", "Keep the app Dock visible", settings.showDock, setShowDock],
              ["Boot animation", "Show the short startup screen on a new session", settings.bootEnabled, setBootEnabled],
            ].map(([title, detail, checked, onChange]) => (
              <div key={title} className="mt-3 flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-black/20 p-4">
                <div><h2 className="text-[12.5px] font-medium text-white/85">{title}</h2><p className="mt-0.5 text-[11.5px] text-white/40">{detail}</p></div>
                <Toggle checked={checked} onChange={onChange} label={title} />
              </div>
            ))}

            <div className="mt-3 rounded-xl border border-white/10 bg-black/20 p-4">
              <h2 className="text-[11px] font-medium uppercase tracking-[0.14em] text-white/35">
                Preview
              </h2>
              <div className="mt-3 flex items-center gap-3">
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-lg"
                  style={{ background: "var(--accent)" }}
                >
                  <Icon name="aperture" size={18} className="text-black/70" />
                </span>
                <div>
                  <p className="text-[12.5px] text-white/85">Accent applied system-wide</p>
                  <p className="text-[11px] text-white/35">Windows · dock · focus states</p>
                </div>
              </div>
            </div>
          </>
        )}

        {tab === "system" && (
          <>
            <h1 className="text-[17px] font-semibold tracking-tight text-white">System</h1>
            <p className="mt-1 text-[12px] text-white/40">Manage this desktop session and its saved preferences.</p>

            <div className="mt-3 space-y-2">
              <button
                type="button"
                onClick={install}
                className="flex w-full items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-left transition hover:border-white/25"
              >
                <span>
                  <span className="block text-[12.5px] text-white/85">Install desktop app</span>
                  <span className="block text-[11px] text-white/40">
                    Pin {site.identity.site.label} to your dock or home screen
                  </span>
                </span>
                <Icon name="download" size={15} className="text-white/45" />
              </button>

              <button
                type="button"
                onClick={reset}
                className="flex w-full items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-left transition hover:border-rose-300/40"
              >
                <span>
                  <span className="block text-[12.5px] text-white/85">Reset preferences</span>
                  <span className="block text-[11px] text-white/40">
                    Clear wallpaper, accent and motion settings
                  </span>
                </span>
                <Icon name="close" size={14} className="text-white/45" />
              </button>
            </div>

            {installNote && (
              <p className="mt-2 text-[11.5px] text-white/45" role="status">
                {installNote}
              </p>
            )}

            <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-4">
              <h2 className="text-[11px] font-medium uppercase tracking-[0.14em] text-white/35">
                Editable content
              </h2>
              <p className="mt-2 text-[11.5px] leading-relaxed text-white/45">
                Projects, packages, wallpapers, profile details, apps, dock and desktop icons are all
                JSON. Edit files in{" "}
                <span className="font-mono text-white/60">src/data</span> and the desktop updates.
              </p>
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default Settings;
