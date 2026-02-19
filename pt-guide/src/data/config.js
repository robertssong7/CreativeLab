export const PAIN_QUALITIES = [
    "Sharp or stabbing",
    "Dull or aching",
    "Burning or hot",
    "Throbbing or pulsating",
    "Shooting or electric",
    "Cramping or spasmodic",
    "Tingling or pins and needles",
    "Numb or heavy",
];

export const DURATION_OPTIONS = [
    "1–3 days",
    "3–7 days",
    "1–2 weeks",
    "More than 2 weeks",
];

export const FRONT_REGIONS = [
    { id: "head-front", label: "Head & Neck" },
    { id: "shoulder-front", label: "Shoulders" },
    { id: "arm-front", label: "Arms & Elbows" },
    { id: "hand-front", label: "Hands & Wrists" },
    { id: "torso-front", label: "Chest & Abs" },
    { id: "hip-front", label: "Hips & Pelvis" },
    { id: "upper-leg-front", label: "Thigh & Knee" },
    { id: "lower-leg-front", label: "Shin, Ankle & Foot" },
];

export const BACK_REGIONS = [
    { id: "head-back", label: "Head & Neck" },
    { id: "shoulder-back", label: "Shoulder Blades" },
    { id: "arm-back", label: "Arms & Elbows" },
    { id: "hand-back", label: "Hands & Wrists" },
    { id: "torso-back", label: "Mid & Low Back" },
    { id: "hip-back", label: "Hips & Glutes" },
    { id: "upper-leg-back", label: "Hamstring & Knee" },
    { id: "lower-leg-back", label: "Calf, Ankle & Foot" },
];

export function getRegionsForSide(side) {
    return side === "back" ? BACK_REGIONS : FRONT_REGIONS;
}

export function getRegionLabels(side, selectedIds) {
    const regionMap = new Map(
        getRegionsForSide(side).map((r) => [r.id, r.label])
    );
    return selectedIds.map((id) => regionMap.get(id)).filter(Boolean);
}
