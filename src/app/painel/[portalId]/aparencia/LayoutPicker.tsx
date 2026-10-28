"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { LAYOUTS, type LayoutId } from "@/lib/layouts";
import { LayoutThumb } from "@/components/LayoutThumb";
import { publishLayout } from "../../actions";

const DEVICES = { desktop: 1280, celular: 390 } as const;

export function LayoutPicker({
  portalId,
  siteUrl,
  current,
  color,
}: {
  portalId: string;
  siteUrl: string;
  current: LayoutId;
  color: string;
}) {
  const [selected, setSelected] = useState<LayoutId>(current);
  const [device, setDevice] = useState<keyof typeof DEVICES>("desktop");
  const [pending, startTransition] = useTransition();
  const [justPublished, setJustPublished] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);

  // A prévia renderiza o portal em tamanho real e encolhe para caber no painel.
  const frameWidth = DEVICES[device];
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setScale(Math.min(1, entry.contentRect.width / frameWidth)));
    ro.observe(el);
    return () => ro.disconnect();
  }, [frameWidth]);

  const isLive = selected === current;
  const selectedInfo = LAYOUTS.find((l) => l.id === selected)!;
  const frameHeight = device === "desktop" ? 1100 : 780;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {LAYOUTS.map((l) => {
          const active = l.id === selected;
          return (
            <button
              key={l.id}
              type="button"
              onClick={() => { setSelected(l.id); setJustPublished(false); }}
              className={`group overflow-hidden rounded-xl border-2 bg-white text-left transition-[border-color,transform] duration-150 active:scale-[0.98] ${
                active ? "border-accent" : "border-line hover:border-ink/30"
              }`}
            >
              <div className="relative border-b border-line">
                <LayoutThumb layout={l.id} color={color} />
                {l.id === current && (
                  <span className="absolute top-2 right-2 inline-flex items-center gap-1 rounded-full bg-ink px-2 py-0.5 text-[11px] font-semibold text-white">
                    <span className="size-1.5 rounded-full bg-live" /> No ar
                  </span>
                )}
              </div>
              <div className="p-3">
                <p className="font-display font-bold">{l.name}</p>
                <p className="mt-0.5 text-xs leading-snug text-muted">{l.tagline}</p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="overflow-hidden rounded-xl border border-line bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3">
          <div>
            <p className="font-display font-bold">Prévia: {selectedInfo.name}</p>
            <p className="text-sm text-muted">
              {isLive
                ? justPublished ? "Publicado. Os leitores já veem este layout." : "Este é o layout que está no ar."
                : "Só você está vendo. O portal no ar não muda até você publicar."}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="grid grid-cols-2 gap-1 rounded-lg bg-paper p-1 text-sm">
              {(Object.keys(DEVICES) as (keyof typeof DEVICES)[]).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDevice(d)}
                  className={`rounded-md px-3 py-1 font-semibold capitalize transition-colors ${device === d ? "bg-white shadow-sm" : "text-muted"}`}
                >
                  {d}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="btn btn-brand"
              disabled={isLive || pending}
              onClick={() =>
                startTransition(async () => {
                  await publishLayout(portalId, selected);
                  setJustPublished(true);
                })
              }
            >
              {pending ? "Publicando…" : isLive ? "No ar" : "Publicar layout"}
            </button>
          </div>
        </div>

        <div ref={boxRef} className="bg-paper p-4">
          <div
            className="mx-auto overflow-hidden rounded-lg border border-line bg-white shadow-sm"
            style={{ width: frameWidth * scale, height: frameHeight * scale }}
          >
            <iframe
              key={`${selected}-${device}`}
              src={`${siteUrl}/?previa=${selected}`}
              title={`Prévia do layout ${selectedInfo.name}`}
              style={{ width: frameWidth, height: frameHeight, transform: `scale(${scale})`, transformOrigin: "0 0" }}
              className="border-0"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
