"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { ALL, ORDER, SOUL, archL, type ArchetypeKey, type Gender, type Psyche } from "@/lib/archetypes";
import { useLang } from "@/lib/i18n";
import { UI_TEXT } from "@/lib/ui";
import { fragment, vertex } from "./fluidShader";

// Must match the shader's camera.
const BODY_H = 1.76;
const CAM_Y = 0.86;
const FOCAL = 1.22;
const IDLE_SPIN = 0.18;

interface Props {
  psyche: Psyche;
  /** null = not chosen yet: an undecided vessel, halfway between */
  gender: Gender | null;
  /** Increments whenever a decision lands; triggers slosh + pulse */
  pulseTick: number;
  pulseKeys: ArchetypeKey[];
  showLabels?: boolean;
}

interface DragState {
  active: boolean;
  lastX: number;
  rot: number;
  vel: number;
}

/** Cumulative tops of the bottom three layers (Shadow, soul-image, Self); Persona fills the rest. */
function bounds(p: Psyche) {
  const a = p.shadow / 100;
  const b = a + p.soul / 100;
  const c = b + p.self / 100;
  return new THREE.Vector3(a, b, c);
}

function soulRgb(g: Gender | null) {
  const anima = new THREE.Vector3(...SOUL.man.rgb);
  const animus = new THREE.Vector3(...SOUL.woman.rgb);
  return g === "man" ? anima : g === "woman" ? animus : anima.lerp(animus, 0.5);
}
const femOf = (g: Gender | null) => (g === "woman" ? 1 : g === "man" ? 0 : 0.5);

function makeUniforms(psyche: Psyche, gender: Gender | null) {
  return {
    uTime: { value: 0 },
    uRes: { value: new THREE.Vector2(1, 1) },
    uRot: { value: 0.4 },
    uBounds: { value: bounds(psyche) },
    uC0: { value: new THREE.Vector3(...ALL.shadow.rgb) },
    uC1: { value: soulRgb(gender) },
    uC2: { value: new THREE.Vector3(...ALL.self.rgb) },
    uC3: { value: new THREE.Vector3(...ALL.persona.rgb) },
    uFem: { value: femOf(gender) },
    uSlosh: { value: 0 },
    uSpin: { value: 0 },
    uPulse: { value: new THREE.Vector4() },
    uSelf: { value: psyche.self / 100 },
    uFocal: { value: FOCAL },
    uCamY: { value: CAM_Y },
  };
}
type Uniforms = ReturnType<typeof makeUniforms>;

const PULSE_AXIS: Record<ArchetypeKey, "x" | "y" | "z" | "w"> = { shadow: "x", soul: "y", self: "z", persona: "w" };

function Vessel({ psyche, gender, pulseTick, pulseKeys, drag }: Props & { drag: React.RefObject<DragState> }) {
  const { size, gl } = useThree();
  const target = useRef(bounds(psyche));
  const selfTarget = useRef(psyche.self / 100);
  const soulTarget = useRef(soulRgb(gender));
  const femTarget = useRef(femOf(gender));
  const pulse = useRef<ArchetypeKey[] | null>(null);

  // Built once with its uniforms passed at construction, so per-frame writes
  // below land on exactly the objects the renderer uploads.
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        uniforms: makeUniforms(psyche, gender),
        transparent: true,
        premultipliedAlpha: true,
        depthWrite: false,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  useEffect(() => () => material.dispose(), [material]);

  useEffect(() => {
    target.current = bounds(psyche);
    selfTarget.current = psyche.self / 100;
  }, [psyche]);

  useEffect(() => {
    soulTarget.current = soulRgb(gender);
    femTarget.current = femOf(gender);
  }, [gender]);

  // a decision landed: queue a slosh + pulse for the next frame
  useEffect(() => {
    if (pulseTick) pulse.current = pulseKeys;
  }, [pulseTick, pulseKeys]);

  useFrame((_, dt) => {
    const u = material.uniforms as Uniforms;
    const d = Math.min(dt, 0.05);
    const dpr = gl.getPixelRatio();
    u.uRes.value.set(size.width * dpr, size.height * dpr);
    u.uTime.value += d;

    // fluid levels, soul colour and body shape ease toward their targets
    const k = 1 - Math.exp(-d * 2.2);
    u.uBounds.value.lerp(target.current, k);
    u.uSelf.value += (selfTarget.current - u.uSelf.value) * k;
    u.uC1.value.lerp(soulTarget.current, k);
    u.uFem.value += (femTarget.current - u.uFem.value) * (1 - Math.exp(-d * 1.6));

    if (pulse.current) {
      u.uSlosh.value = 1;
      pulse.current.forEach((key) => (u.uPulse.value[PULSE_AXIS[key]] = 1));
      pulse.current = null;
    }
    u.uSlosh.value *= Math.exp(-d * 0.9);
    u.uPulse.value.multiplyScalar(Math.exp(-d * 1.6));

    const st = drag.current;
    if (!st.active) st.vel += (IDLE_SPIN - st.vel) * (1 - Math.exp(-d * 1.5));
    st.rot += st.vel * d;
    u.uRot.value = st.rot;
    // the liquid lags behind the glass: it follows spin with some inertia
    const spin = st.vel - IDLE_SPIN;
    u.uSpin.value += (spin - u.uSpin.value) * (1 - Math.exp(-d * 3));
  });

  return (
    <mesh frustumCulled={false} material={material}>
      <planeGeometry args={[2, 2]} />
    </mesh>
  );
}

/** Vertical position (% from top) of a body height in metres, matching the shader camera. */
function screenTop(y: number) {
  return 50 - (((y - CAM_Y) * FOCAL) / 3.0) * 100;
}

export default function FluidAvatar(props: Props) {
  const drag = useRef<DragState>({ active: false, lastX: 0, rot: 0.4, vel: IDLE_SPIN });
  const { psyche, gender, showLabels = true } = props;
  const { lang } = useLang();

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

  return (
    <div
      className="avatar"
      onPointerDown={(e) => {
        drag.current.active = true;
        drag.current.lastX = e.clientX;
        (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
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
      <Canvas dpr={[1, 1.5]} gl={{ alpha: true, antialias: false, powerPreference: "high-performance" }}>
        <Vessel {...props} drag={drag} />
      </Canvas>
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
