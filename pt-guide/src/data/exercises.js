export const EXERCISES = {
    // LOWER BODY
    "Squat": {
        id: "squat",
        name: "Standard Squat",
        description: "A foundational movement for lower body strength.",
        painTarget: "Should feel it in the Quads and Glutes. Do NOT feel sharp pain in the front of your knee or lower back.",
        workingZones: ["Quads", "Glutes", "Hamstrings"],
        dangerZones: ["Patella (Knee Cap)", "Lumbar Spine"],
        regression: "wall-sit",
        progression: "jump-squat"
    },
    "Wall Sit": {
        id: "wall-sit",
        name: "Wall Sit",
        description: "Static hold to build quad endurance safely with back support.",
        painTarget: "Should feel a deep burn in the Quads. Do NOT feel joint pressure in the knees.",
        workingZones: ["Quads"],
        dangerZones: ["Knee Joint"],
        regression: null,
        progression: "squat"
    },
    "Jump Squat": {
        id: "jump-squat",
        name: "Jump Squat",
        description: "Explosive movement for power.",
        painTarget: "Should feel it in the Quads and Calves. Pain upon landing is a Red Light.",
        workingZones: ["Quads", "Calves", "Glutes"],
        dangerZones: ["Knees", "Ankles"],
        regression: "squat",
        progression: null
    },

    // UPPER BODY
    "Push-Up": {
        id: "push-up",
        name: "Standard Push-Up",
        description: "Core upper body pusher.",
        painTarget: "Should feel it in the Chest and Triceps. Do NOT feel pinching in the front of your shoulders.",
        workingZones: ["Chest", "Triceps", "Anterior Deltoid"],
        dangerZones: ["Rotator Cuff", "Lower Back (if sagging)"],
        regression: "knee-push-up",
        progression: "decline-push-up"
    },
    "Knee Push-Up": {
        id: "knee-push-up",
        name: "Knee Push-Up",
        description: "Reduced load pushing.",
        painTarget: "Should feel it in the Chest. Watch your lower back alignment.",
        workingZones: ["Chest", "Triceps"],
        dangerZones: ["Lower Back"],
        regression: null,
        progression: "push-up"
    },
    "Decline Push-Up": {
        id: "decline-push-up",
        name: "Decline Push-Up",
        description: "Advanced pushing targeting upper chest.",
        painTarget: "Should feel it in the Upper Chest and Shoulders. Stop if you feel neck strain.",
        workingZones: ["Upper Chest", "Front Deltoid"],
        dangerZones: ["Neck", "Rotator Cuff"],
        regression: "push-up",
        progression: null
    },

    // CORE/BACK
    "Plank": {
        id: "plank",
        name: "Forearm Plank",
        description: "Core stability hold.",
        painTarget: "Should feel an intense burn in your abdominals. Do NOT feel pinching in your lower back.",
        workingZones: ["Abs", "Obliques"],
        dangerZones: ["Lumbar Spine", "Shoulders"],
        regression: "knee-plank",
        progression: "plank-shoulder-tap"
    },
    "Knee Plank": {
        id: "knee-plank",
        name: "Knee Plank",
        description: "Core stability with reduced lever.",
        painTarget: "Should feel it in the Abs. No back pain.",
        workingZones: ["Abs"],
        dangerZones: ["Lumbar Spine"],
        regression: null,
        progression: "plank"
    },
    "Plank Shoulder Taps": {
        id: "plank-shoulder-tap",
        name: "Plank Shoulder Taps",
        description: "Anti-rotation core stability.",
        painTarget: "Should feel it in Abs and Shoulders. Hip shifting is a warning sign to regress.",
        workingZones: ["Abs", "Obliques", "Shoulders"],
        dangerZones: ["Lower Back"],
        regression: "plank",
        progression: null
    }
};

export function getExercise(idOrName) {
    const found = Object.values(EXERCISES).find(e => e.id === idOrName || e.name === idOrName);
    return found || EXERCISES["Squat"]; // Default
}
