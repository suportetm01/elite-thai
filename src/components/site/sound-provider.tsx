"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";

/**
 * Som do site: ligado por padrão (o botão do cabeçalho desliga, e a escolha fica salva no
 * aparelho). Efeitos 100% sintetizados (Web Audio API), sem arquivos de terceiros.
 * Os navegadores só liberam áudio depois do primeiro toque, clique ou tecla do visitante:
 * até lá o som fica "armado" (`unlocked = false`) e o vídeo de destaques toca sem som.
 */
export type SoundName = "impact" | "whoosh" | "bag" | "crowd" | "transition";

type SoundContextValue = {
  enabled: boolean;
  /** o visitante já interagiu com a página: o navegador permite tocar áudio */
  unlocked: boolean;
  toggle: () => void;
  play: (name: SoundName, intensity?: number) => void;
  setAmbience: (on: boolean) => void;
};

const SoundContext = createContext<SoundContextValue>({
  enabled: true,
  unlocked: false,
  toggle: () => undefined,
  play: () => undefined,
  setAmbience: () => undefined,
});

class SoundEngine {
  ctx: AudioContext;
  master: GainNode;
  noise: AudioBuffer;
  ambience: { source: AudioBufferSourceNode; gain: GainNode } | null = null;

  constructor() {
    const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new Ctor();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0.55;
    const compressor = this.ctx.createDynamicsCompressor();
    this.master.connect(compressor).connect(this.ctx.destination);
    this.noise = this.makeNoise(2);
  }

  makeNoise(seconds: number, brown = false) {
    const length = Math.floor(this.ctx.sampleRate * seconds);
    const buffer = this.ctx.createBuffer(1, length, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let last = 0;
    for (let i = 0; i < length; i++) {
      const white = Math.random() * 2 - 1;
      if (brown) {
        last = (last + 0.02 * white) / 1.02;
        data[i] = last * 3.5;
      } else data[i] = white;
    }
    return buffer;
  }

  noiseBurst(t: number, duration: number, filterType: BiquadFilterType, freq: number, gain: number, q = 0.8) {
    const src = this.ctx.createBufferSource();
    src.buffer = this.noise;
    const filter = this.ctx.createBiquadFilter();
    filter.type = filterType;
    filter.frequency.value = freq;
    filter.Q.value = q;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0001, t + duration);
    src.connect(filter).connect(g).connect(this.master);
    src.start(t, Math.random() * 1.2);
    src.stop(t + duration + 0.05);
    return { filter, gain: g };
  }

  thump(t: number, freq: number, duration: number, gain: number) {
    const osc = this.ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq * 1.8, t);
    osc.frequency.exponentialRampToValueAtTime(freq, t + duration * 0.4);
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t + duration);
    osc.connect(g).connect(this.master);
    osc.start(t);
    osc.stop(t + duration + 0.05);
  }

  play(name: SoundName, intensity = 1) {
    const t = this.ctx.currentTime + 0.005;
    const k = Math.max(0.2, Math.min(1.5, intensity));
    switch (name) {
      case "impact": // luva/canela no alvo
        this.noiseBurst(t, 0.09, "lowpass", 2200, 0.55 * k);
        this.thump(t, 70, 0.16, 0.7 * k);
        break;
      case "bag": // saco de pancada pesado + corrente
        this.thump(t, 52, 0.32, 0.9 * k);
        this.noiseBurst(t, 0.18, "lowpass", 520, 0.6 * k);
        this.noiseBurst(t + 0.05, 0.22, "highpass", 5200, 0.05 * k, 2);
        break;
      case "whoosh": {
        const { filter } = this.noiseBurst(t, 0.28, "bandpass", 500, 0.22 * k, 1.4);
        filter.frequency.setValueAtTime(380, t);
        filter.frequency.exponentialRampToValueAtTime(2400, t + 0.22);
        break;
      }
      case "transition": {
        const { filter } = this.noiseBurst(t, 0.9, "lowpass", 300, 0.16 * k, 0.6);
        filter.frequency.setValueAtTime(140, t);
        filter.frequency.exponentialRampToValueAtTime(900, t + 0.7);
        break;
      }
      case "crowd": {
        // Ondas de torcida: ruído filtrado com envelope lento
        for (let i = 0; i < 3; i++) {
          const { filter, gain } = this.noiseBurst(t + i * 0.25, 2.4, "bandpass", 1100 + i * 380, 0.09 * k, 0.9);
          filter.frequency.linearRampToValueAtTime(1500 + i * 300, t + 1.2);
          gain.gain.cancelScheduledValues(t + i * 0.25);
          gain.gain.setValueAtTime(0.0001, t + i * 0.25);
          gain.gain.linearRampToValueAtTime(0.08 * k, t + i * 0.25 + 0.7);
          gain.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.25 + 2.4);
        }
        break;
      }
    }
  }

  setAmbience(on: boolean) {
    if (on && !this.ambience) {
      const source = this.ctx.createBufferSource();
      source.buffer = this.makeNoise(4, true);
      source.loop = true;
      const filter = this.ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 420;
      const gain = this.ctx.createGain();
      gain.gain.value = 0;
      gain.gain.linearRampToValueAtTime(0.12, this.ctx.currentTime + 1.5);
      source.connect(filter).connect(gain).connect(this.master);
      source.start();
      this.ambience = { source, gain };
    } else if (!on && this.ambience) {
      const { source, gain } = this.ambience;
      gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.6);
      source.stop(this.ctx.currentTime + 0.7);
      this.ambience = null;
    }
  }
}

// Preferência salva no aparelho ("off" = o visitante desligou o som)
const PREF_KEY = "et-sound";
const prefListeners = new Set<() => void>();
const readPref = () => {
  try {
    return window.localStorage.getItem(PREF_KEY) !== "off";
  } catch {
    return true;
  }
};
const subscribePref = (cb: () => void) => {
  prefListeners.add(cb);
  return () => prefListeners.delete(cb);
};
const writePref = (on: boolean) => {
  try {
    window.localStorage.setItem(PREF_KEY, on ? "on" : "off");
  } catch {
    /* modo privado: vale só para esta visita */
  }
  prefListeners.forEach((cb) => cb());
};

/** Gestos que liberam o áudio no navegador (rolar a página não conta). */
const UNLOCK_EVENTS = ["pointerdown", "keydown", "touchend"] as const;

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const enabled = useSyncExternalStore(subscribePref, readPref, () => true);
  const [unlocked, setUnlocked] = useState(false);
  const engine = useRef<SoundEngine | null>(null);
  const ambienceWanted = useRef(false);

  /** Cria/retoma o motor de áudio — precisa acontecer dentro de um gesto do visitante. */
  const start = useCallback(() => {
    engine.current ??= new SoundEngine();
    void engine.current.ctx.resume();
    if (ambienceWanted.current) engine.current.setAmbience(true);
  }, []);

  useEffect(() => {
    const unlock = () => {
      setUnlocked(true);
      if (readPref()) start();
      UNLOCK_EVENTS.forEach((type) => window.removeEventListener(type, unlock, true));
    };
    UNLOCK_EVENTS.forEach((type) => window.addEventListener(type, unlock, { capture: true, passive: true }));
    return () => UNLOCK_EVENTS.forEach((type) => window.removeEventListener(type, unlock, true));
  }, [start]);

  const toggle = useCallback(() => {
    const next = !readPref();
    writePref(next);
    if (next) start();
    else if (engine.current) {
      engine.current.setAmbience(false);
      void engine.current.ctx.suspend();
    }
  }, [start]);

  const play = useCallback(
    (name: SoundName, intensity?: number) => {
      if (!enabled || !engine.current) return;
      engine.current.play(name, intensity);
    },
    [enabled],
  );

  const setAmbience = useCallback(
    (on: boolean) => {
      ambienceWanted.current = on;
      if (enabled && engine.current) engine.current.setAmbience(on);
    },
    [enabled],
  );

  useEffect(() => {
    const onHide = () => {
      if (document.hidden && engine.current) void engine.current.ctx.suspend();
      else if (!document.hidden && enabled && engine.current) void engine.current.ctx.resume();
    };
    document.addEventListener("visibilitychange", onHide);
    return () => document.removeEventListener("visibilitychange", onHide);
  }, [enabled]);

  const value = useMemo(() => ({ enabled, unlocked, toggle, play, setAmbience }), [enabled, unlocked, toggle, play, setAmbience]);
  return <SoundContext value={value}>{children}</SoundContext>;
}

export function useSound() {
  return useContext(SoundContext);
}
