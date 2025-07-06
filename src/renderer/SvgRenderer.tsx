import React, { Ref } from "react";

export interface SvgProps {
  pathD: string;
  flightDur: number;
  animRef: Ref<SVGAnimateMotionElement>;
  scenario: any;
  result: "success" | "fail" | null;
}

export default function SvgRenderer({
  pathD,
  flightDur,
  animRef,
  scenario,
  result,
}: SvgProps) {
  const SCALE = scenario.scale;
  const { start, width } = scenario.target;
  const ledgeX = start * SCALE;

  return (
    <svg viewBox="0 -130 480 130" className="w-full border bg-[#eef]">
      <g transform="translate(0,-6)">
        {/* canyon walls */}
        <rect x="0" y="0" width={scenario.gap.leftX * SCALE} height="8" fill="#6d5a54" />
        <rect
          x={(scenario.gap.rightX + scenario.gap.width) * SCALE}
          y="0"
          width="480"
          height="8"
          fill="#6d5a54"
        />

        {/* target band */}
        <rect x={ledgeX} y="0" width={width * SCALE} height="8" fill="#84cc16" />

        {/* flare */}
        <g>
          <circle cx="0" cy="0" r="4" fill={scenario.projectile.color} stroke="#000" />
          {pathD && (
            <animateMotion
              ref={animRef}
              begin="indefinite"
              dur={`${flightDur}s`}
              fill="freeze"
            >
              <mpath xlinkHref="#flightPath" />
            </animateMotion>
          )}
        </g>

        {pathD && (
          <path id="flightPath" d={pathD} fill="none" stroke="transparent" />
        )}

        {result === "success" && (
          <circle
            cx={(start + width / 2) * SCALE}
            cy={0}
            r={10}
            fill="gold"
            className="animate-ping"
          />
        )}
      </g>
    </svg>
  );
}