// Clinical Logic Engine - Based on APTA Guidelines & Orthopedic Triage Patterns

export function computeSeverity({ intensity, duration, qualities = [], notes = "" }) {
    let score = 0;
    const notesLower = notes.toLowerCase();

    // 1. INTENSITY (NPRS)
    if (intensity >= 8) score += 4;
    else if (intensity >= 6) score += 2;
    else if (intensity >= 4) score += 1;

    // 2. DURATION
    if (duration === "1–2 weeks") score += 1;
    if (duration === "More than 2 weeks") score += 2;

    // 3. QUALITIES (Neuropathic/Acute)
    const concernQualities = [
        "Sharp or stabbing",
        "Shooting or electric",
        "Throbbing or pulsating", // Active inflammation
        "Numb or heavy" // Neurological
    ];
    const hasConcern = qualities.some((q) => concernQualities.includes(q));
    if (hasConcern) score += 2;

    // 4. FUNCTIONAL LOSS & RED FLAGS (The "Expert" Filter)
    const redFlags = ["walk", "weight", "buckl", "fall", "numb", "urine", "bladder", "fever", "night pain", "unexplained weight loss"];
    const hasRedFlag = redFlags.some(flag => notesLower.includes(flag));

    if (hasRedFlag) {
        score += 4; // Immediate bump
    }

    if (score <= 3) return "green";
    if (score <= 6) return "yellow";
    return "orange";
}

export function makePlan({ severity, regionLabels }) {
    const areaText = regionLabels.length ? regionLabels.join(", ") : "this area";

    let title = `Support for your ${areaText}`;
    let steps = [];

    if (severity === "orange") {
        title = `Clinical Evaluation Recommended`;
        steps = [
            `**APTA Guideline:** Symptoms of high intensity, functional loss (inability to bear weight), or potential neurological involvement (numbness/radiating pain) require differential diagnosis.`,
            "We recommend seeing a Physical Therapist or Physician to rule out fractures, ligamentous instability, or significant nerve compression.",
            "**Immediate Action:** Protect the area. Do not force movement through sharp pain.",
            "Use ice (15-20 min) for acute pain control if less than 48 hours since onset.",
            "If you experience bladder/bowel changes or constitutional symptoms (fever, night sweats), seek medical attention immediately."
        ];
    } else if (severity === "yellow") {
        title = `Active Monitoring & Modification`;
        steps = [
            `**Clinical Pattern:** Symptoms suggest mechanical sensitivity or tissue irritation (e.g., tendinopathy or minor strain) in the ${areaText}.`,
            "**Load Management:** Reduce the intensity of aggravating activities by 50% for 3-5 days. Do not stop completely unless pain is >5/10.",
            "**Motion is Medicine:** Gentle, pain-free range of motion is crucial to prevent stiffness.",
            "Monitor for 5 days. If pain persists or worsens, a skilled PT assessment is warranted to identify movement faults."
        ];
    } else {
        title = `Self-Management Routine`;
        steps = [
            `**Clinical Pattern:** Profile consistent with mechanical ache, postural tension, or DOMS (Delayed Onset Muscle Soreness) in the ${areaText}.`,
            "**Active Recovery:** Movement is preferred over bed rest. Avoid static postures for >30 mins.",
            "It is safe to move through mild discomfort (pain level < 3/10).",
            "Focus on gradual strengthening and mobility exercises (see specific drills below)."
        ];
    }

    return { title, steps };
}

export function makeIssues({ severity, regionLabels, notes = "", qualities = [], duration = "", intensity }) {
    const areaText = regionLabels.length ? regionLabels.join(", ") : "the area you selected";
    const notesLower = notes.toLowerCase();
    const areaLower = areaText.toLowerCase();
    const isChronic = duration === "More than 2 weeks" || duration === "1–2 weeks";
    const isAcute = !isChronic;

    // Database of Pathologies
    const baseIssues = [
        {
            id: "structural-compromise",
            title: "Potential Structural/Joint Issue",
            description: `High intensity or sharp pain, especially if causing difficulty moving or bearing weight, may indicate a sprain, internal joint issue (like meniscus/labrum), or bone stress.`,
            remedyShort: "Protect + Clinician Eval",
        },
        {
            id: "radiculopathy", // NEW: Nerve Root
            title: "Radiculopathy / Nerve Entrapment",
            description: `Shooting/electric pain or numbness often suggests a nerve is being compressed (e.g., Sciatica, Carpal Tunnel).`,
            remedyShort: "Nerve Glides (Gentle)",
        },
        {
            id: "acute-inflammation",
            title: "Acute Inflammation",
            description: `Throbbing or hot sensations often mean the tissue is actively inflamed (e.g., tendonitis or bursitis).`,
            remedyShort: "Ice + Relative Rest",
        },
        {
            id: "soft-tissue",
            title: "Muscular Tension/Strain",
            description: `Muscles in the ${areaText} may be in protective spasm or mildly strained.`,
            remedyShort: "Heat + Gentle Massage",
        },
        {
            id: "stiffness",
            title: "Joint Hypomobility (Stiffness)",
            description: `The joints in the ${areaText} may be restricted, forcing muscles to work overtime.`,
            remedyShort: "Daily Mobility Drills",
        },
        {
            id: "movement-pattern",
            title: "Movement/Postural Habits",
            description: `How you sit, stand, or move the ${areaText} repeatedly might be the root cause.`,
            remedyShort: "Ergonomic Check",
        },
        {
            id: "impact",
            title: "Load/Impact Sensitivity",
            description: `The tissues may currently lack the capacity for high-impact loads (running/jumping).`,
            remedyShort: "Unload + Low Impact",
        },
        {
            id: "overuse",
            title: "Repetitive Overuse",
            description: `Doing too much, too soon, or for too long without adequate recovery.`,
            remedyShort: "Pacing + Micro-breaks",
        },
        {
            id: "core-control",
            title: "Stability Deficit",
            description: `Lack of deep stability may be causing the ${areaText} to compensate and overwork.`,
            remedyShort: "Activation Exercises",
        },
        {
            id: "knee-tracking",
            title: "Patellofemoral Tracking",
            description: `Alignment issues at the knee cap often cause sharp front-knee pain.`,
            remedyShort: "Hip Strengthening",
        },
        {
            id: "plantar-fascia", // NEW
            title: "Plantar Fasciitis Pattern",
            description: `Pain in the heel/arch, especially with the first few steps in the morning.`,
            remedyShort: "Calf Stretch + Arch Rolling",
        },
    ];

    const scoreIssue = (issue) => {
        let score = 10;
        const strongKeywords = (words) => words.some(w => w && (notesLower.includes(w)));
        const weakKeywords = (words) => words.some(w => w && (notesLower.includes(w)));
        const hasQuality = (qList) => qualities.some(q => qList.includes(q));

        switch (issue.id) {
            case "structural-compromise":
                if (intensity >= 7) score += 20;
                if (hasQuality(["Sharp or stabbing", "Shooting or electric"])) score += 15;
                if (strongKeywords(["pop", "snap", "give way", "buckle", "lock", "swollen", "bruise"])) score += 30;
                if (strongKeywords(["walk", "weight", "limp", "stair"])) score += 20;
                if (isAcute) score += 10;
                break;
            case "radiculopathy":
                if (strongKeywords(["shoot", "electric", "radiat", "spine", "leg", "arm"])) score += 25;
                if (hasQuality(["Shooting or electric", "Tingling or pins and needles", "Numb or heavy"])) score += 35;
                if (intensity >= 6) score += 10;
                break;
            case "acute-inflammation":
                if (hasQuality(["Throbbing or pulsating", "Burning or hot"])) score += 30;
                if (strongKeywords(["swoll", "puff", "hot", "red"])) score += 25;
                if (isAcute) score += 10;
                break;
            case "plantar-fascia":
                if (strongKeywords(["morning", "first step", "heel", "arch", "foot"])) score += 40;
                break;
            case "soft-tissue":
                score += 5;
                if (intensity < 6) score += 10;
                if (strongKeywords(["tight", "knot", "sore", "rub", "stiff"])) score += 15;
                if (hasQuality(["Dull or aching", "Cramping or spasmodic"])) score += 15;
                break;
            case "stiffness":
                if (strongKeywords(["stuck", "locked", "frozen", "bend", "reach"])) score += 25;
                if (weakKeywords(["morning", "start", "warm up"])) score += 15;
                if (isChronic) score += 10;
                break;
            case "movement-pattern":
                if (strongKeywords(["posture", "slouch", "technique", "form", "desk"])) score += 20;
                if (isChronic) score += 15;
                break;
            case "impact":
                if (strongKeywords(["land", "pounding", "concrete", "run", "jump"])) score += 25;
                if (hasQuality(["Throbbing or pulsating", "Sharp or stabbing"])) score += 10;
                break;
            case "overuse":
                if (strongKeywords(["repetitive", "repeat", "typing", "mouse", "keyboard", "lift"])) score += 25;
                if (weakKeywords(["work", "all day", "hours", "shift"])) score += 15;
                break;
            case "core-control":
                if (strongKeywords(["giving way", "buckle", "collapse"])) score += 25;
                if (weakKeywords(["weak", "unstable", "wobbly", "tired"])) score += 15;
                break;
            case "knee-tracking":
                if (strongKeywords(["cap", "kneecap", "track", "pop", "stairs", "squat"])) score += 25;
                break;
        }
        return score;
    };

    let scoredIssues = baseIssues.map(issue => {
        let impossible = false;
        if (issue.id === 'knee-tracking' && !areaLower.includes('knee')) impossible = true;
        if (issue.id === 'plantar-fascia' && !areaLower.includes('foot') && !areaLower.includes('ankle')) impossible = true;

        return {
            ...issue,
            rawScore: impossible ? 0 : scoreIssue(issue)
        };
    });

    let rankedIssues = scoredIssues.sort((a, b) => b.rawScore - a.rawScore);
    let topIssues = rankedIssues.slice(0, 3);

    // Auto-promote dangerous flags
    if (severity === "orange") {
        const acuteIdx = topIssues.findIndex(i => i.id === "structural-compromise" || i.id === "radiculopathy" || i.id === "acute-inflammation");
        if (acuteIdx > 0) {
            const acuteIssue = topIssues[acuteIdx];
            topIssues.splice(acuteIdx, 1);
            topIssues.unshift(acuteIssue);
        } else if (acuteIdx === -1) {
            // Force structural compromise into view if orange severity but logic missed it
            const structural = scoredIssues.find(i => i.id === "structural-compromise");
            if (structural) {
                topIssues.unshift(structural);
                topIssues = topIssues.slice(0, 3);
            }
        }
    }

    const top3Sum = topIssues.reduce((acc, i) => acc + i.rawScore, 0);
    return topIssues.map(i => ({
        ...i,
        confidence: top3Sum > 0 ? Math.round((i.rawScore / top3Sum) * 100) : 0
    }));
}

export function makeIssuePlan({ issueId, regionLabels, severity }) {
    const r = regionLabels.join(" ").toLowerCase();
    const isKnee = r.includes("knee");
    const isBack = r.includes("back") || r.includes("torso");
    const isNeck = r.includes("head") || r.includes("neck");
    const isShoulder = r.includes("shoulder") || r.includes("arm");
    const isFoot = r.includes("foot") || r.includes("ankle");

    const getSpecifics = () => {
        if (isKnee) return { drill: "heel slides (lying on back)", strength: "quad sets (tightening thigh muscle)" };
        if (isBack) return { drill: "gentle pelvic tilts", strength: "abdominal bracing" };
        if (isNeck) return { drill: "chin tucks", strength: "isometric neck holds" };
        if (isShoulder) return { drill: "pendulum swings", strength: "scapular squeezes" };
        if (isFoot) return { drill: "ankle alphabet", strength: "towel scrunches" };
        return { drill: "gentle range of motion", strength: "isometric holds" };
    };
    const { drill, strength } = getSpecifics();

    const base = {
        "structural-compromise": [
            "**Priority:** Protect the joint. Avoid any activity that causes sharp pain.",
            "Use 'R.I.C.E' (Rest, Ice, Compression, Elevation) to manage acute symptoms.",
            "If weight-bearing is painful, consider using crutches or a cane temporarily.",
            "Consult a clinician for imaging or specific orthopedic testing."
        ],
        "radiculopathy": [
            "**Do NOT stretch:** Aggressive stretching can irritate an angry nerve.",
            "Try 'nerve flossing' instead: gently moving the limb to glide the nerve without tension.",
            "Avoid positions that reproduce the shooting pain/numbness.",
            "Anti-inflammatory measures (ice/medication) may help reduce chemical irritation on the nerve."
        ],
        "acute-inflammation": [
            "Apply ice for 15-20 minutes, 3-4 times a day.",
            "Avoid heat right now, as it may increase swelling.",
            "Perform very gentle, pain-free movement to prevent stiffness, but do not push into pain.",
            "Elevate the limb above heart level when resting."
        ],
        "plantar-fascia": [
            "Practice 'short foot' exercises to build arch strength.",
            "Calf tightness often pulls on the arch—stretch your calves gently.",
            "Try barefoot walking on grass or sand to stimulate foot muscles.",
            "Roll the arch of your foot on a frozen water bottle for relief."
        ],
        "soft-tissue": [
            "Apply heat for 15 minutes to relax the muscle belly.",
            "Use gentle self-massage or a foam roller on the tight areas (avoiding bone).",
            `Follow up with ${drill} to encourage blood flow.`,
            "Stay hydrated and try to keep moving gently throughout the day."
        ],
        "movement-pattern": [
            "Set a timer to change your posture every 20-30 minutes.",
            "Check your workstation ergonomics (screen height, chair support).",
            "Film yourself performing the painful activity to identify awkward mechanics.",
            "Focus on 'neutral spine' and relaxed shoulders during daily tasks."
        ],
        "stiffness": [
            "Motion is lotion: Stiffness improves with frequent, low-load movement.",
            `Perform ${drill} every morning and evening.`,
            "A hot shower or heat pack before movement can help loosen the joint.",
            "Do not force the joint into a painful range; work at the edge of the restriction."
        ],
        "impact": [
            "Temporarily switch to low-impact cardio (cycling, swimming, elliptical).",
            "Ensure you have supportive footwear.",
            "When returning to activity, increase volume by no more than 10% per week.",
            "Focus on soft, quiet landings during any movement."
        ],
        "overuse": [
            "Relative Rest: Reduce the volume of the aggravating activity by 50%.",
            "Break large tasks into smaller chunks with rest breaks.",
            "Check your equipment (shoes, racket, keyboard) for wear and tear.",
            "Contrast baths (alternating warm and cool water) can help recovery."
        ],
        "core-control": [
            `Start with ${strength} to build deep stability.`,
            "Focus on quality of movement over quantity of reps.",
            "Engage your core gently (like anticipating a poke) before lifting.",
            "Avoid hyperextending (arching) your back during overhead tasks."
        ],
        "knee-tracking": [
            "Strengthen the hips (glutes) to help control the knee.",
            "Practice single-leg balance in front of a mirror, keeping the knee aligned over the 2nd toe.",
            "Avoid letting the knee cave inward (valgus) during squats or stairs."
        ],
    };

    return base[issueId] || []; // Fallback empty array
}
