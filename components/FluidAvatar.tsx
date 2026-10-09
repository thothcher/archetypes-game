"use client";

import { useEffect, useRef, useState } from "react";
import { ALL, ORDER, SOUL, archL, type ArchetypeKey, type Gender, type Psyche } from "@/lib/archetypes";
import { useLang } from "@/lib/i18n";
import { UI_TEXT } from "@/lib/ui";
import type { DragState, Targets, VesselRenderer } from "@/lib/vesselRenderer";

// Must match the shader's camera.
const BODY_H = 1.76;
const CAM_Y = 0.86;
const FOCAL = 1.22;

interface Props {
  psyche: Psyche;
  /** null = not chosen yet: an undecided vessel, halfway between */
  gender: Gender | null;
  /** Increments whenever a decision lands; triggers slosh + pulse */
  pulseTick: number;
  pulseKeys: ArchetypeKey[];
  showLabels?: boolean;
}

function targets(p: Psyche, g: Gender | null): Targets {
  const a = p.shadow / 100;
  const b = a + p.soul / 100;
  const anima = SOUL.man.rgb;
  const animus = SOUL.woman.rgb;
  const soul = (g === "man" ? anima : g === "woman" ? animus : anima.map((v, i) => (v + animus[i]) / 2)) as Targets["soul"];
  return { bounds: [a, b, b + p.self / 100], self: p.self / 100, soul, fem: g === "woman" ? 1 : g === "man" ? 0 : 0.5 };
}

/** Vertical position (% from top) of a body height in metres, matching the shader camera. */
function screenTop(y: number) {
  return 50 - (((y - CAM_Y) * FOCAL) / 3.0) * 100;
}

export default function FluidAvatar({ psyche, gender, pulseTick, pulseKeys, showLabels = true }: Props) {
  const { lang } = useLang();
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const renderer = useRef<VesselRenderer | null>(null);
  const drag = useRef<DragState & { lastX: number }>({ active: false, rot: 0.4, vel: 0.18, lastX: 0 });
  const latest = useRef(targets(psyche, gender));
  const [status, setStatus] = useState<"idle" | "ready" | "failed">("idle");

  latest.current = targets(psyche, gender);

  // Start the renderer only when the vessel comes near the screen, and pause it when it leaves.
  useEffect(() => {
    const el = wrap.current!;
    let disposed = false;
    let loading = false;
    let visible = false;
    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        renderer.current?.setVisible(visible);
        if (visible && !renderer.current && !loading) {
          loading = true;
          import("@/lib/vesselRenderer").then(({ VesselRenderer }) => {
            if (disposed || !canvas.current) return;
            renderer.current = new VesselRenderer(canvas.current, drag.current, latest.current, {
              onReady: () => setStatus("ready"),
              onFail: () => setStatus("failed"),
            });
            renderer.current.setVisible(visible);
          });
        }
      },
      { rootMargin: "200px 0px" }
    );
    io.observe(el);
    return () => {
      disposed = true;
      io.disconnect();
      renderer.current?.dispose();
      renderer.current = null;
    };
  }, []);

  useEffect(() => {
    renderer.current?.setTargets(targets(psyche, gender));
  }, [psyche, gender]);

  useEffect(() => {
    if (pulseTick) renderer.current?.kick(pulseKeys);
  }, [pulseTick, pulseKeys]);

  // label at the middle of each layer, nudged apart so small layers don't collide
  let acc = 0;
  const labels = ORDER.map((k) => {
    const mid = acc + psyche[k] / 2;
    acc += psyche[k];
    const a =
      !gender && k === "soul" ? { name: UI_TEXT[lang].game.soulBoth, color: "#b98ee0" } : archL(k, gender ?? "man", lang);
    return { k, name: a.name, color: a.color, top: screenTop((mid / 100) * BODY_H) };
  });
  for (let i = 1; i < labels.length; i++) {
    labels[i].top = Math.min(labels[i].top, labels[i - 1].top - 3.6);
  }
  const summary = [...labels]
    .reverse()
    .map((l) => `${l.name} ${Math.round(psyche[l.k])}%`)
    .join(", ");

  return (
    <div
      ref={wrap}
      className={`avatar ${status}`}
      role="img"
      aria-label={`${UI_TEXT[lang].game.vesselLabel}: ${summary}`}
      onPointerDown={(e) => {
        drag.current.active = true;
        drag.current.lastX = e.clientX;
        e.currentTarget.setPointerCapture?.(e.pointerId);
      }}
      onPointerMove={(e) => {
        const st = drag.current;
        if (!st.active) return;
        const dx = e.clientX - st.lastX;
        st.lastX = e.clientX;
        st.rot += dx * 0.01;
        st.vel = Math.max(-8, Math.min(8, dx * 0.6));
      }}
      onPointerUp={() => (drag.current.active = false)}
      onPointerCancel={() => (drag.current.active = false)}
    >
      <canvas ref={canvas} />
      {status === "failed" && <FallbackVessel psyche={psyche} gender={gender} />}
      {showLabels && (
        <div className="avatar-labels" aria-hidden>
          {labels.map(({ k, name, color, top }) => (
            <div key={k} className="avatar-label" style={{ top: `${top}%`, ["--c" as string]: color }}>
              <span className="dot" />
              <span className="name">{name}</span>
              <span className="pct">{Math.round(psyche[k])}%</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/** Without WebGL: a flat glass flask with the same four layers. */
function FallbackVessel({ psyche, gender }: { psyche: Psyche; gender: Gender | null }) {
  let acc = 0;
  const stops = ORDER.map((k) => {
    const c = k === "soul" ? (gender === "woman" ? ALL.animus.color : ALL.anima.color) : ALL[k].color;
    const from = acc;
    acc += psyche[k];
    return `${c} ${from}% ${acc}%`;
  });
  return <div className="vessel-fallback" style={{ background: `linear-gradient(to top, ${stops.join(", ")})` }} />;
}
