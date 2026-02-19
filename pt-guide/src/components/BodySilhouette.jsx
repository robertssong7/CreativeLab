import React from 'react';

export default function BodySilhouette({ side, selected = new Set(), onPartClick }) {
    const isFront = side === "front";
    const highlightShapes = [];

    // Helper to add highlight bands
    const addBand = (key, y, h) => {
        highlightShapes.push(
            <rect key={key} x={18} y={y} width={44} height={h} rx={12} fill="#0ea5e9" fillOpacity={0.18} />
        );
    };

    // Check overlaps for highlighting
    // The original logic checked if the single selected region string *included* a substring.
    // Here we check if the Set contains relevant IDs.
    // We can assume the IDs are simple: "head", "shoulder", "torso", "hip", "leg", "arm", "hand", "foot".
    // Or we scan the Set.

    const hasSelection = (pattern) => {
        for (let s of selected) {
            if (s.includes(pattern)) return true;
        }
        return false;
    };

    if (hasSelection("head")) addBand("h-head", 4, 30);
    if (hasSelection("shoulder")) addBand("h-shldr", 34, 16);
    if (hasSelection("torso") || hasSelection("back")) addBand("h-torso", 52, 48);
    if (hasSelection("hip") || hasSelection("glute")) addBand("h-hip", 102, 20);
    if (hasSelection("upper-leg") || hasSelection("thigh") || hasSelection("hamstring")) addBand("h-uleg", 124, 36);
    if (hasSelection("lower-leg") || hasSelection("calf") || hasSelection("shin")) addBand("h-lleg", 162, 38);

    if (hasSelection("arm") || hasSelection("elbow")) {
        highlightShapes.push(<path key="arms-l" d="M16 46 L14 90" stroke="#0ea5e9" strokeWidth="10" strokeOpacity="0.18" fill="none" strokeLinecap="round" />);
        highlightShapes.push(<path key="arms-r" d="M64 46 L66 90" stroke="#0ea5e9" strokeWidth="10" strokeOpacity="0.18" fill="none" strokeLinecap="round" />);
    }
    if (hasSelection("hand") || hasSelection("wrist")) {
        highlightShapes.push(<circle key="hand-l" cx="14" cy="100" r="8" fill="#0ea5e9" fillOpacity="0.18" />);
        highlightShapes.push(<circle key="hand-r" cx="66" cy="100" r="8" fill="#0ea5e9" fillOpacity="0.18" />);
    }

    const JointLine = ({ x1, y1, x2, y2 }) => (
        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="0.8" strokeDasharray="1.5,1.5" opacity="0.7" />
    );

    return (
        <svg viewBox="0 0 80 210" className="w-full h-full text-slate-400 pointer-events-none" aria-hidden="true" style={{ overflow: 'visible' }}>
            {/* Visual Guide Text */}
            <text x="6" y="20" fontSize="12" fill="currentColor" opacity="0.5">L</text>
            <text x="62" y="20" fontSize="12" fill="currentColor" opacity="0.5">R</text>

            {highlightShapes}

            {/* Head */}
            <circle cx="40" cy="20" r="12" fill="none" stroke="currentColor" strokeWidth="1.5" />
            {/* Neck */}
            <path d="M36 32 L44 32 L42 40 Q40 42 38 40 Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
            {/* Shoulders/Torso */}
            <path d="M22 42 Q40 34 58 42 L60 66 Q58 88 40 92 Q22 88 20 66 Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
            {/* Hips */}
            <path d="M20 66 Q40 72 60 66 Q58 92 50 104 Q40 110 30 104 Q22 92 20 66 Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
            {/* Arms */}
            <path d="M22 46 Q14 70 14 100" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <path d="M58 46 Q66 70 66 100" fill="none" stroke="currentColor" strokeWidth="1.5" />
            {/* Hands */}
            <path d="M14 100 Q12 110 14 115" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <path d="M66 100 Q68 110 66 115" fill="none" stroke="currentColor" strokeWidth="1.5" />
            {/* Legs */}
            <path d="M34 110 L32 156 Q30 180 32 195" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <path d="M46 110 L48 156 Q50 180 48 195" fill="none" stroke="currentColor" strokeWidth="1.5" />
            {/* Feet */}
            <path d="M32 195 L28 205 H36 Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <path d="M48 195 L44 205 H52 Z" fill="none" stroke="currentColor" strokeWidth="1.5" />

            {!isFront && <path d="M40 44 Q38 70 40 96 Q42 124 40 140" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 3" opacity="0.5" />}
            {!isFront && <path d="M30 104 Q40 108 50 104" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />}

            {/* Joint Lines */}
            <JointLine x1={35} y1={36} x2={45} y2={36} /> {/* Neck */}
            <JointLine x1={22} y1={46} x2={58} y2={46} /> {/* Shoulder */}
            <JointLine x1={15} y1={72} x2={25} y2={72} /> {/* Elbow L */}
            <JointLine x1={55} y1={72} x2={65} y2={72} /> {/* Elbow R */}
            <JointLine x1={12} y1={100} x2={16} y2={100} /> {/* Wrist L */}
            <JointLine x1={64} y1={100} x2={68} y2={100} /> {/* Wrist R */}
            <JointLine x1={25} y1={104} x2={55} y2={104} /> {/* Hip */}
            <JointLine x1={31} y1={156} x2={35} y2={156} /> {/* Knee L */}
            <JointLine x1={45} y1={156} x2={49} y2={156} /> {/* Knee R */}
            <JointLine x1={30} y1={195} x2={34} y2={195} /> {/* Ankle L */}
            <JointLine x1={46} y1={195} x2={50} y2={195} /> {/* Ankle R */}
        </svg>
    );
}
