// Raymarched glass humanoid filled with four stratified, animated liquids:
//   0 Shadow (ink) · 1 Anima/Animus (soul-image) · 2 Self (gold) · 3 Persona (quicksilver mask)
// The body is a signed-distance field that morphs between male and female proportions (uFem).
// The liquid is integrated as a volume behind a thin glass skin. Each layer's thickness = archetype %.

export const vertex = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

export const fragment = /* glsl */ `
precision highp float;
varying vec2 vUv;

uniform float uTime;
uniform vec2  uRes;
uniform float uRot;
uniform vec3  uBounds;   // cumulative tops of layers 0,1,2 in 0..1 body height
uniform vec3  uC0;       // shadow
uniform vec3  uC1;       // soul-image (anima rose / animus blue)
uniform vec3  uC2;       // self
uniform vec3  uC3;       // persona
uniform float uFem;      // 0 = man (Anima), 1 = woman (Animus)
uniform float uSlosh;    // decision impulse, decays
uniform float uSpin;     // angular velocity of the body (drag)
uniform vec4  uPulse;    // per-layer flash: shadow, soul, self, persona
uniform float uSelf;     // self fraction (aura)
uniform float uFocal;
uniform float uCamY;

#define BODY_H 1.76

// ---------- noise ----------
float hash(vec3 p) {
  p = fract(p * 0.3183099 + 0.1);
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}
float noise(vec3 x) {
  vec3 i = floor(x);
  vec3 f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(hash(i + vec3(0,0,0)), hash(i + vec3(1,0,0)), f.x),
                 mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
             mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
                 mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z);
}
float fbm(vec3 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 3; i++) { v += a * noise(p); p = p * 2.07 + vec3(1.7, 9.2, 3.1); a *= 0.5; }
  return v / 0.875;
}

// ---------- sdf ----------
float sdEllipsoid(vec3 p, vec3 r) {
  float k0 = length(p / r);
  float k1 = length(p / (r * r));
  return k0 * (k0 - 1.0) / k1;
}
float sdCapsule(vec3 p, vec3 a, vec3 b, float r) {
  vec3 pa = p - a, ba = b - a;
  float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  return length(pa - ba * h) - r;
}
// round cone between a (radius r1) and b (radius r2), Inigo Quilez
float sdRoundCone(vec3 p, vec3 a, vec3 b, float r1, float r2) {
  vec3  ba = b - a;
  float l2 = dot(ba, ba);
  float rr = r1 - r2;
  float a2 = l2 - rr * rr;
  float il2 = 1.0 / l2;
  vec3 pa = p - a;
  float y = dot(pa, ba);
  float z = y - l2;
  vec3 xv = pa * l2 - ba * y;
  float x2 = dot(xv, xv);
  float y2 = y * y * l2;
  float z2 = z * z * l2;
  float k = sign(rr) * rr * rr * x2;
  if (sign(z) * a2 * z2 > k) return sqrt(x2 + z2) * il2 - r2;
  if (sign(y) * a2 * y2 < k) return sqrt(x2 + y2) * il2 - r1;
  return (sqrt(x2 * a2 * il2) + y * rr) * il2 - r1;
}
float smin(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}
mat2 rot(float a) { float c = cos(a), s = sin(a); return mat2(c, -s, s, c); }

float body(vec3 p) {
  float t = uTime;
  float f = uFem;
  float breath = sin(t * 1.2) * 0.006;
  vec3 q = p; q.x = abs(q.x);

  // head + jaw (slightly smaller, softer jaw for a woman)
  vec3 hp = p - vec3(0.0, 1.6, 0.0);
  hp.xy = rot(sin(t * 0.5) * 0.04) * hp.xy;
  float head = sdEllipsoid(hp, mix(vec3(0.118, 0.152, 0.138), vec3(0.11, 0.146, 0.132), f));
  head = smin(head, sdEllipsoid(hp - vec3(0.0, -0.075, 0.028), mix(vec3(0.088, 0.078, 0.095), vec3(0.074, 0.066, 0.086), f)), 0.05);
  // hair gathered in a bun (woman)
  float bun = sdEllipsoid(hp - vec3(0.0, 0.07, -0.13), vec3(0.06, 0.055, 0.055));
  head = smin(head, mix(1.0, bun, f), 0.04);

  // torso: broad shoulders / narrow hips (man) ↔ narrow shoulders, waist, wide hips (woman)
  float shX = mix(0.17, 0.148, f);
  float neck   = sdRoundCone(p, vec3(0.0, 1.36, -0.01), vec3(0.0, 1.5, 0.0), mix(0.06, 0.05, f), mix(0.048, 0.04, f));
  float traps  = sdCapsule(q, vec3(0.0, 1.355, -0.01), vec3(shX, 1.33, -0.01), mix(0.055, 0.045, f));
  float chest  = sdEllipsoid(p - vec3(0.0, 1.2, 0.0), mix(vec3(0.185, 0.16, 0.115), vec3(0.16, 0.15, 0.105), f) + vec3(breath, 0.0, breath));
  float delt   = sdEllipsoid(q - vec3(mix(0.2, 0.177, f), 1.29, 0.0), mix(vec3(0.062, 0.07, 0.065), vec3(0.048, 0.058, 0.052), f));
  float waist  = sdEllipsoid(p - vec3(0.0, 0.99, 0.0), mix(vec3(0.14, 0.16, 0.1), vec3(0.118, 0.15, 0.09), f));
  float pelvis = sdEllipsoid(p - vec3(0.0, mix(0.84, 0.83, f), 0.0), mix(vec3(0.165, 0.115, 0.11), vec3(0.19, 0.125, 0.12), f));
  float d = smin(chest, waist, 0.09);
  d = smin(d, pelvis, 0.07);
  d = smin(d, traps, 0.06);
  d = smin(d, delt, 0.04);
  d = smin(d, neck, 0.05);
  d = smin(d, head, 0.035);
  // bust (woman)
  float bust = sdEllipsoid(q - vec3(0.072, 1.165, 0.07), vec3(0.066, 0.062, 0.058));
  d = smin(d, mix(1.0, bust, f), 0.04);

  // arms, relaxed and slightly away from the body
  float sway = sin(t * 0.8) * 0.015;
  vec3 sh = vec3(mix(0.205, 0.183, f), 1.27, 0.0);
  vec3 el = vec3(mix(0.265, 0.245, f), 1.0, -0.03 + sway);
  vec3 wr = vec3(mix(0.3, 0.282, f), 0.77, 0.03 + sway);
  float arm = sdRoundCone(q, sh, el, mix(0.05, 0.042, f), mix(0.037, 0.032, f));
  arm = smin(arm, sdRoundCone(q, el, wr, mix(0.036, 0.03, f), mix(0.026, 0.022, f)), 0.02);
  vec3 hq = q - (wr + vec3(0.008, -0.07, 0.005));
  float hand = sdEllipsoid(hq, mix(vec3(0.026, 0.062, 0.042), vec3(0.022, 0.056, 0.036), f));
  arm = smin(arm, hand, 0.02);
  d = smin(d, arm, 0.035);

  // legs
  vec3 hip = vec3(mix(0.088, 0.098, f), 0.8, 0.0);
  vec3 kn  = vec3(mix(0.098, 0.085, f), 0.46, 0.01);
  vec3 an  = vec3(mix(0.095, 0.085, f), 0.08, -0.01);
  float leg = sdRoundCone(q, hip, kn, mix(0.085, 0.094, f), mix(0.048, 0.044, f));
  leg = smin(leg, sdRoundCone(q, kn, an, mix(0.046, 0.042, f), mix(0.03, 0.026, f)), 0.02);
  leg = smin(leg, sdEllipsoid(q - vec3(kn.x, 0.32, -0.018), mix(vec3(0.042, 0.09, 0.045), vec3(0.038, 0.085, 0.04), f)), 0.03);
  leg = smin(leg, sdEllipsoid(q - vec3(an.x + 0.004, 0.03, 0.035), mix(vec3(0.04, 0.03, 0.095), vec3(0.034, 0.027, 0.085), f)), 0.03);
  d = smin(d, leg, 0.05);
  return d;
}

vec3 toBody(vec3 p) {
  p.xz = rot(uRot) * p.xz;
  return p;
}
float map(vec3 p) { return body(toBody(p)); }

vec3 calcNormal(vec3 p) {
  vec2 e = vec2(0.0012, 0.0);
  return normalize(vec3(
    map(p + e.xyy) - map(p - e.xyy),
    map(p + e.yxy) - map(p - e.yxy),
    map(p + e.yyx) - map(p - e.yyx)));
}

// ---------- liquid ----------
// Returns colour; writes meniscus glow, absorption density and the persona (mask) weight.
vec3 liquid(vec3 bp, out float men, out float dens, out float mask) {
  float t = uTime;
  float h = bp.y / BODY_H;

  // liquid surface: idle ripples, + decision slosh, + spin paraboloid
  float amp = 0.007 + uSlosh * 0.03 + min(abs(uSpin), 4.0) * 0.004;
  float w = (sin(bp.x * 10.0 + t * 1.7) + sin(bp.z * 12.0 - t * 2.2)) * 0.5 * amp;
  w += sin(bp.x * 4.0 - t * 0.8 + bp.z * 3.0) * amp * 0.7;
  float r2 = dot(bp.xz, bp.xz);
  float hh = h + w - min(uSpin * uSpin, 12.0) * r2 * 0.05;

  float s = 0.0045;
  float m0 = smoothstep(uBounds.x - s, uBounds.x + s, hh);
  float m1 = smoothstep(uBounds.y - s, uBounds.y + s, hh);
  float m2 = smoothstep(uBounds.z - s, uBounds.z + s, hh);

  // domain-warped flow
  float n1 = fbm(bp * 3.5 + vec3(0.0, -t * 0.12, t * 0.06));
  float n  = fbm(bp * 6.5 + n1 * 1.8 + vec3(t * 0.05, -t * 0.1, 0.0));

  // 0 · shadow: ink with violet veins, slow and heavy
  vec3 c0 = mix(vec3(0.02, 0.008, 0.05), uC0 * 1.5, smoothstep(0.45, 0.85, n));
  c0 += vec3(0.55, 0.3, 1.0) * pow(smoothstep(0.6, 0.95, n1), 3.0) * 0.6;

  // 1 · soul-image: Anima = milky, swirling rose · Animus = crisp blue with striations
  vec3 anima = mix(uC1 * 0.85, vec3(1.0, 0.86, 0.93), smoothstep(0.42, 0.9, n) * 0.75);
  float streak = 0.5 + 0.5 * sin(bp.y * 60.0 + n * 9.0 - t * 1.4);
  vec3 animus = uC1 * (0.45 + 0.75 * n) + vec3(0.6, 0.85, 1.0) * pow(streak, 8.0) * 0.35;
  vec3 c1 = mix(anima, animus, uFem);

  // 2 · self: luminous gold with sparks
  vec3 c2 = uC2 * (0.95 + 0.6 * n) + vec3(1.0, 0.95, 0.7) * pow(n1, 5.0) * 1.4;

  // 3 · persona: quicksilver, a liquid mirror
  float sheen = pow(0.5 + 0.5 * sin(n * 14.0 + bp.y * 20.0 - t * 0.6), 6.0);
  vec3 c3 = uC3 * (0.45 + 0.45 * n) + vec3(0.95, 0.97, 1.0) * sheen * 0.7;

  c0 *= 1.0 + uPulse.x * 2.0;
  c1 *= 1.0 + uPulse.y * 1.4;
  c2 *= 1.0 + uPulse.z * 1.2;
  c3 *= 1.0 + uPulse.w * 1.2;

  vec3 c = mix(c0, c1, m0);
  c = mix(c, c2, m1);
  c = mix(c, c3, m2);
  dens = mix(mix(mix(17.0, 7.0, m0), 5.5, m1), 22.0, m2);
  mask = m2;

  // rising bubbles in the clear waters (not in ink or quicksilver)
  vec3 bq = bp * vec3(26.0, 10.0, 26.0) + vec3(0.0, -t * 1.3, 0.0);
  vec3 id = floor(bq);
  vec3 fq = fract(bq) - 0.5;
  float bub = smoothstep(0.17, 0.05, length(fq - (vec3(hash(id + 1.3), 0.0, hash(id + 7.1)) - 0.5) * 0.5));
  bub *= step(0.86, hash(id)) * m0 * (1.0 - m2);
  c += vec3(1.0) * bub * 0.5;

  men = exp(-abs(hh - uBounds.x) * 170.0) + exp(-abs(hh - uBounds.y) * 170.0) + exp(-abs(hh - uBounds.z) * 170.0);
  return c;
}

vec3 env(vec3 d) {
  vec3 c = mix(vec3(0.015, 0.012, 0.03), vec3(0.16, 0.14, 0.22), smoothstep(-0.3, 1.0, d.y));
  c += vec3(1.0, 0.95, 0.9) * pow(max(dot(d, normalize(vec3(0.5, 0.7, 0.6))), 0.0), 24.0) * 1.6;
  c += vec3(0.5, 0.65, 1.0) * pow(max(dot(d, normalize(vec3(-0.8, 0.2, 0.3))), 0.0), 10.0) * 0.35;
  c += vec3(1.0, 0.75, 0.35) * pow(max(dot(d, normalize(vec3(0.0, -0.4, 1.0))), 0.0), 6.0) * 0.25;
  return c;
}

vec2 cylinder(vec3 ro, vec3 rd, float r) {
  float a = dot(rd.xz, rd.xz);
  float b = dot(ro.xz, rd.xz);
  float c = dot(ro.xz, ro.xz) - r * r;
  float h = b * b - a * c;
  if (h < 0.0) return vec2(-1.0);
  h = sqrt(h);
  return vec2(-b - h, -b + h) / a;
}

void main() {
  vec2 frag = vUv * uRes;
  vec2 uv = (frag - 0.5 * uRes) / uRes.y;

  vec3 ro = vec3(0.0, uCamY, 3.0);
  vec3 rd = normalize(vec3(uv.x, uv.y, -uFocal));

  vec3 selfCol = uC2;
  vec2 cyl = cylinder(ro, rd, 0.62);
  if (cyl.y < 0.0) { gl_FragColor = vec4(0.0); return; }

  float t = max(cyl.x, 0.0);
  float tEnd = cyl.y;
  float minD = 1e9;
  bool hit = false;
  for (int i = 0; i < 90; i++) {
    vec3 p = ro + rd * t;
    float d = map(p);
    minD = min(minD, d);
    if (d < 0.0006) { hit = true; break; }
    t += d * 0.92;
    if (t > tEnd) break;
  }

  if (!hit) {
    // aura of the Self around the body
    float aura = exp(-max(minD, 0.0) * 20.0) * (0.12 + uSelf * 1.0);
    float aa = clamp(aura, 0.0, 1.0) * 0.75;
    gl_FragColor = vec4(selfCol * aa, aa);   // premultiplied
    return;
  }

  vec3 p = ro + rd * t;
  vec3 n = calcNormal(p);
  float cosi = max(dot(n, -rd), 0.0);
  float fres = 0.04 + 0.96 * pow(1.0 - cosi, 5.0);

  // ----- volume of liquid seen through the glass skin
  vec3 rdIn = refract(rd, n, 1.0 / 1.33);
  vec3 acc = vec3(0.0);
  float T = 1.0;
  float s = 0.006;
  float frontMen = 0.0;
  float frontMask = 0.0;
  vec3 lastC = vec3(0.0);
  for (int i = 0; i < 18; i++) {
    vec3 q = p + rdIn * s;
    float d = map(q);
    if (d > 0.0) break;
    float men, dens, mask;
    vec3 c = liquid(toBody(q), men, dens, mask);
    if (i == 0) { frontMen = men; frontMask = mask; }
    lastC = c;
    float wall = smoothstep(0.0, -0.01, d);       // thin clear glass wall
    float dt = 0.018;
    float a = (1.0 - exp(-dt * dens)) * wall;
    acc += T * a * (c + men * vec3(1.0, 0.95, 0.85) * 0.9);
    T *= 1.0 - a;
    s += dt;
    if (T < 0.03) break;
  }
  // light scattered back through the far wall
  acc += T * lastC * 0.45;
  T *= 0.55;

  vec3 L = normalize(vec3(0.5, 0.7, 0.6));
  float dif = 0.6 + 0.4 * clamp(dot(n, L), 0.0, 1.0);
  vec3 col = acc * dif;

  // glass: reflections, highlights, rim
  vec3 R = reflect(rd, n);
  col = mix(col, env(R), fres * 0.85);
  // the Persona is a mirror: where quicksilver touches the glass, reflect the world back
  col = mix(col, env(R) * vec3(0.9, 0.93, 1.0) * 1.3 + uC3 * 0.12, frontMask * 0.5);
  col += vec3(1.0) * pow(max(dot(R, L), 0.0), 90.0) * (1.2 + frontMask * 1.5);
  col += vec3(0.75, 0.85, 1.0) * pow(max(dot(R, normalize(vec3(-0.7, 0.35, 0.45))), 0.0), 40.0) * 0.3;
  col += selfCol * pow(1.0 - cosi, 3.0) * (0.15 + uSelf * 0.8);
  col += vec3(1.0, 0.96, 0.9) * frontMen * 0.18;

  float alpha = clamp(1.0 - T * 0.85 + fres * 0.5, 0.0, 1.0);
  col = col / (1.0 + col * 0.3);
  gl_FragColor = vec4(col, alpha);         // premultiplied
}
`;
