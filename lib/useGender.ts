"use client";

import { useEffect, useState } from "react";
import type { Gender } from "./archetypes";

const KEY = "vas-gender";

/** The player's chosen vessel, remembered in this browser and shared by both pages. */
export function useGender(): [Gender | null, (g: Gender | null) => void] {
  const [gender, setGender] = useState<Gender | null>(null);

  useEffect(() => {
    try {
      const v = localStorage.getItem(KEY);
      if (v === "man" || v === "woman") setGender(v);
    } catch {}
  }, []);

  function update(g: Gender | null) {
    setGender(g);
    try {
      if (g) localStorage.setItem(KEY, g);
      else localStorage.removeItem(KEY);
    } catch {}
  }

  return [gender, update];
}
