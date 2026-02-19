import React, { useState } from 'react';
import { RefreshCcw, ZoomIn } from 'lucide-react';
import { getRegionLabels } from '../data/config';

export default function BodySilhouette({ selected, onChange }) {
    const [side, setSide] = useState('front');
    const isFront = side === 'front';

    const toggleRegion = (id) => {
        const next = new Set(selected);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        onChange(next);
    };

    const isSelected = (id) => selected.has(id);

    // Dynamic Zoom Logic (Simulated by simple styling here for simplicity, or we can use the advanced transform from the original)
    // For this refactor, we keep standard SVG interactivity but clean up the code.

    // Path definitions (simplified for clarity but retaining interaction zones)
    // Note: In a real app these paths would be imported from an SVG file, but we embed for portability logic.
    const REGIONS = {
        front: [
            { id: "head-front", d: "M40 0 C55 0 55 15 40 18 C25 15 25 0 40 0 Z" },
            { id: "shoulder-front", d: "M20 20 L60 20 L65 30 L15 30 Z" },
            { id: "torso-front", d: "M25 30 L55 30 L50 80 L30 80 Z" },
            { id: "arm-front", d: "M15 30 L5 30 L0 70 L10 70 L20 35 L60 35 L70 70 L80 70 L75 30 L65 30" }, // Consolidated arms for simplicity or split? Original split.
            // Simplified Arm Left
            { id: "arm-front", d: "M15 30 L5 30 L2 60 L12 60 L22 32 Z", dual: "M65 30 L75 30 L78 60 L68 60 L58 32 Z" },
            // Simplified Hand Left/Right
            { id: "hand-front", d: "M2 60 L-2 75 L8 75 L12 60 Z", dual: "M78 60 L82 75 L72 75 L68 60 Z" },
            // Hips
            { id: "hip-front", d: "M30 80 L50 80 L55 100 L25 100 Z" },
            // Legs
            { id: "upper-leg-front", d: "M25 100 L55 100 L50 150 L30 150 Z" },
            // Lower Legs
            { id: "lower-leg-front", d: "M30 150 L50 150 L48 190 L32 190 Z" },
            // Feet
            { id: "lower-leg-front", d: "M32 190 L48 190 L50 205 L30 205 Z" }, // Included in lower leg
        ],
        back: [
            { id: "head-back", d: "M40 0 C55 0 55 15 40 18 C25 15 25 0 40 0 Z" },
            { id: "shoulder-back", d: "M20 20 L60 20 L65 40 L15 40 Z" },
            { id: "torso-back", d: "M25 40 L55 40 L52 80 L28 80 Z" }, // Mid/Low Back
            // Arms Back
            { id: "arm-back", d: "M15 30 L5 30 L2 60 L12 60 L22 32 Z", dual: "M65 30 L75 30 L78 60 L68 60 L58 32 Z" },
            // Hands Back
            { id: "hand-back", d: "M2 60 L-2 75 L8 75 L12 60 Z", dual: "M78 60 L82 75 L72 75 L68 60 Z" },
            { id: "hip-back", d: "M28 80 L52 80 L55 105 L25 105 Z" }, // Glutes
            { id: "upper-leg-back", d: "M25 105 L55 105 L50 150 L30 150 Z" }, // Hamstrings
            { id: "lower-leg-back", d: "M30 150 L50 150 L48 200 L32 200 Z" }, // Calves
        ]
    };

    // We render paths manually to keep it simple and dependency-free (no external SVG file needed).
    // Using a standard viewbox.

    return (
        <div className="flex flex-col items-center">
            <div className="relative mb-4 h-[400px] w-full max-w-[300px] cursor-pointer rounded-xl bg-slate-50 p-4 shadow-inner">
                <button
                    onClick={() => setSide(s => s === 'front' ? 'back' : 'front')}
                    className="absolute right-4 top-4 flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 shadow-sm hover:text-slate-900"
                >
                    <RefreshCcw className="h-3 w-3" /> Flip to {isFront ? 'Back' : 'Front'}
                </button>

                <svg viewBox="0 0 80 210" className="h-full w-full drop-shadow-xl" style={{ filter: 'drop-shadow(0px 10px 10px rgba(0,0,0,0.05))' }}>
                    <g transform="translate(0, 5)">
                        {REGIONS[side].map((region, i) => (
                            <React.Fragment key={i}>
                                <path
                                    d={region.d}
                                    onClick={() => toggleRegion(region.id)}
                                    className={`transition-all duration-300 hover:opacity-80 ${isSelected(region.id) ? 'fill-blue-500 stroke-blue-600' : 'fill-slate-200 stroke-slate-300'}`}
                                    strokeWidth="0.5"
                                />
                                {region.dual && ( // Render dual limb if defined
                                    <path
                                        d={region.dual}
                                        onClick={() => toggleRegion(region.id)}
                                        className={`transition-all duration-300 hover:opacity-80 ${isSelected(region.id) ? 'fill-blue-500 stroke-blue-600' : 'fill-slate-200 stroke-slate-300'}`}
                                        strokeWidth="0.5"
                                    />
                                )}
                            </React.Fragment>
                        ))}
                    </g>
                </svg>
            </div>

            <p className="text-center text-sm text-slate-400">
                Tap body parts to select. <br /> Currently selected: <span className="font-bold text-slate-900">{selected.size > 0 ? getRegionLabels(side, Array.from(selected)).join(", ") : "None"}</span>
            </p>
        </div>
    );
}
