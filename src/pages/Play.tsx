import React, { useRef, useState, useEffect } from "react";
import scenario from "../scenarios/catapult_gap.json";
import SvgRenderer from "../renderer/SvgRenderer";

const g = 9.8;
const toRad = (d: number) => (d * Math.PI) / 180;
const range = (v: number, θ: number) => (v ** 2 * Math.sin(2 * toRad(θ))) / g;

export default function Play() {
  const [angle, setAngle] = useState<number | null>(null);
  const [result, setResult] = useState<"success" | "fail" | null>(null);
  const [timer, setTimer] = useState(15);
  const animRef = useRef<SVGAnimateMotionElement>(null);

  useEffect(() => {
    if (angle || result) return;
    const id = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [angle, result]);

  useEffect(() => {
    if (timer === 0 && !result) setResult("fail");
  }, [timer, result]);

  const choose = (θ: number) => {
    setAngle(θ);
    const x = range(scenario.v, θ);
    const hit = x >= scenario.target.start && x <= scenario.target.start + scenario.target.width;
    setResult(hit ? "success" : "fail");
    requestAnimationFrame(() => animRef.current?.beginElement());
  };

  const reset = () => {
    setAngle(null);
    setResult(null);
    setTimer(15);
  };

  const buildPath = (θ: number | null) =>
    θ == null ? "" : `M0 0 q ${(range(scenario.v, θ) * scenario.scale) / 2} -80 ${range(scenario.v, θ) * scenario.scale} 0`;

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-[640px] space-y-6 p-8 bg-white rounded-lg shadow-xl">
        <h1 className="text-xl font-bold">{scenario.title.en}</h1>

        <p>
          Using <em>R = v² sin 2θ ⁄ g</em>, launch a flare across the canyon and land it on the far wall 60&nbsp;m away.
        </p>
        <p>
          <strong>Constants:</strong> v = {scenario.v} m/s&nbsp;&nbsp;g = 9.8 m/s²
        </p>

        <div className="flex gap-2">
          {scenario.angles.map((a) => (
            <button
              key={a}
              disabled={!!angle}
              onClick={() => choose(a)}
              className="px-3 py-1 border rounded bg-amber-600 hover:bg-amber-700 text-white font-semibold disabled:opacity-40"
            >
              {a}°
            </button>
          ))}
        </div>

        {!result ? (
          <p className="font-mono">⏱ {timer}s</p>
        ) : (
          <p className="text-lg font-mono">
            {result === "success" ? "✔️ Success" : "❌ Crash"}
          </p>
        )}

        <SvgRenderer
          pathD={buildPath(angle)}
          flightDur={2}
          animRef={animRef}
          scenario={scenario}
          result={result}
        />

        {result && (
          <button onClick={reset} className="border px-3 py-1 rounded bg-slate-200 hover:bg-slate-300">
            Play Again
          </button>
        )}
      </div>
    </main>
  );
}