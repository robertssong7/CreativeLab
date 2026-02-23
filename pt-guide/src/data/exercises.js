// Exercise Database with Contextual Modifications (Regressions/Progressions)
// and Working vs Danger Pain Indicators

export const EXERCISES_DB = {
    // === KNEE ===
    "knee": [
        {
            id: "knee-squat",
            name: "Bodyweight Squat",
            sets: "3 × 10",
            cue: "Feet shoulder-width, push hips back, keep chest up.",
            workingPain: { zone: "Front of thighs (quadriceps)", description: "A burning or fatiguing sensation in the front of the thighs is expected — that's your muscles working." },
            dangerPain: { zone: "Sharp pain inside or behind the knee cap", description: "If you feel a sharp, catching, or locking sensation in the knee joint itself, STOP immediately." },
            regression: { name: "Wall Sit (Partial Range)", sets: "3 × 20 sec holds", cue: "Lean back against a wall, slide down to a comfortable angle. Hold. Don't go deeper than feels safe." },
            progression: { name: "Goblet Squat", sets: "3 × 8", cue: "Hold a weight at your chest. Adds load to the same pattern." },
        },
        {
            id: "knee-straightleg",
            name: "Straight Leg Raise",
            sets: "3 × 12 per leg",
            cue: "Lie on back, one knee bent, lift the straight leg to the height of the bent knee.",
            workingPain: { zone: "Top of the thigh / hip flexor", description: "Mild fatigue or tightness in the front of the hip and thigh is completely normal." },
            dangerPain: { zone: "Sharp pain in the low back or groin", description: "If you feel sharp lower back pain or a pinching in the groin, stop and try the regression." },
            regression: { name: "Quad Sets (Isometric)", sets: "3 × 10 (hold 5 sec)", cue: "Sit with leg straight. Tighten the thigh muscle, pressing the back of the knee down. Hold 5 seconds." },
            progression: { name: "Ankle-Weighted SLR", sets: "3 × 10 per leg", cue: "Add a light ankle weight (1–3 lbs) to increase resistance." },
        },
        {
            id: "knee-bridge",
            name: "Glute Bridge",
            sets: "3 × 12",
            cue: "Lie on back, knees bent, squeeze glutes and lift hips to ceiling.",
            workingPain: { zone: "Glutes and hamstrings", description: "A deep burn in the buttocks and back of the thighs is exactly what you want." },
            dangerPain: { zone: "Low back cramping or sharp knee pain", description: "If your lower back cramps or you feel sharp knee pain, lower the range of motion significantly." },
            regression: { name: "Partial Bridge (Small Range)", sets: "3 × 15", cue: "Lift hips only a few inches off the ground. Focus on squeezing glutes, not arching the back." },
            progression: { name: "Single-Leg Glute Bridge", sets: "3 × 8 per leg", cue: "Extend one leg straight, bridge up on the other. Much harder!" },
        },
    ],

    // === BACK / TORSO ===
    "back": [
        {
            id: "back-pelvic-tilt",
            name: "Pelvic Tilts",
            sets: "3 × 15",
            cue: "Lie on back, knees bent. Gently flatten your low back into the floor, then release.",
            workingPain: { zone: "Deep abdominal muscles", description: "A gentle sensation of your core 'waking up' is expected — it means you're engaging correctly." },
            dangerPain: { zone: "Sharp pain radiating into the legs", description: "If pain shoots down your leg, STOP. This could be nerve-related and needs clinical assessment." },
            regression: { name: "Diaphragmatic Breathing", sets: "3 × 10 breaths", cue: "Simply lie on your back, hands on belly, and breathe deeply into your belly. This activates deep stabilizers." },
            progression: { name: "Dead Bug", sets: "3 × 8 per side", cue: "Arms up, knees at 90°. Extend opposite arm/leg slowly while keeping your back flat on the floor." },
        },
        {
            id: "back-cat-cow",
            name: "Cat-Cow Stretch",
            sets: "3 × 10 (slow)",
            cue: "On hands and knees, alternate between arching (cow) and rounding (cat) your spine.",
            workingPain: { zone: "Gentle stretch through the spine", description: "A mild stretching feeling throughout the back is normal and therapeutic." },
            dangerPain: { zone: "Sharp pinching at one specific vertebra", description: "If one spot 'catches' or pinches sharply, reduce the range of motion to avoid that angle." },
            regression: { name: "Seated Spinal Flexion/Extension", sets: "3 × 10", cue: "Sit on a chair. Gently round forward, then arch upright. Less load on the wrists." },
            progression: { name: "Bird-Dog", sets: "3 × 8 per side", cue: "From hands and knees, extend opposite arm and leg simultaneously. Hold 3 seconds." },
        },
        {
            id: "back-child-pose",
            name: "Child's Pose",
            sets: "3 × 30 sec holds",
            cue: "On knees, sit hips back toward heels, arms extended forward on the floor.",
            workingPain: { zone: "Low back and hips", description: "A deep, comfortable stretch in the low back and hips is exactly what this provides." },
            dangerPain: { zone: "Sharp pain in the knees or hips", description: "If kneeling causes knee pain, place a pillow under your knees or try the regression." },
            regression: { name: "Supine Knee-to-Chest", sets: "3 × 30 sec per leg", cue: "Lie on your back, pull one knee gently toward your chest. Same stretch, zero knee pressure." },
            progression: { name: "Thread the Needle", sets: "3 × 8 per side", cue: "From child's pose, thread one arm under the other to add a thoracic rotation stretch." },
        },
    ],

    // === NECK / HEAD ===
    "neck": [
        {
            id: "neck-chin-tuck",
            name: "Chin Tucks",
            sets: "3 × 10 (hold 5 sec)",
            cue: "Sit tall, pull your chin straight back (making a 'double chin') without tilting your head.",
            workingPain: { zone: "Deep front neck muscles and base of skull", description: "A mild stretch at the back of the neck and fatigue in the front of the throat is expected." },
            dangerPain: { zone: "Dizziness, sharp headache, or arm tingling", description: "If you feel dizzy, get a sharp headache, or tingling in your arms — STOP immediately. This needs medical evaluation." },
            regression: { name: "Supine Chin Tuck", sets: "3 × 10 (hold 5 sec)", cue: "Lie on your back without a pillow. Press the back of your head gently into the floor. Easier than upright." },
            progression: { name: "Chin Tuck + Resistance", sets: "3 × 8 (hold 5 sec)", cue: "Place a finger on your chin and push back against your own resistance." },
        },
        {
            id: "neck-trap-stretch",
            name: "Upper Trap Stretch",
            sets: "3 × 30 sec per side",
            cue: "Tilt your ear toward your shoulder. Use the same-side hand to gently guide, but don't pull.",
            workingPain: { zone: "Side of the neck and top of the shoulder", description: "A moderate, pleasant stretch along the side of the neck is expected." },
            dangerPain: { zone: "Sharp pain shooting into the arm or hand", description: "Radiating arm pain could mean nerve involvement — ease off immediately and try the regression." },
            regression: { name: "Gentle Head Turns", sets: "3 × 10 per side", cue: "Simply turn your head slowly left and right to end range. Don't force it—just explore." },
            progression: { name: "Levator Scapulae Stretch", sets: "3 × 30 sec per side", cue: "Tilt head AND rotate slightly downward (nose toward armpit). Stretches a deeper muscle." },
        },
    ],

    // === SHOULDER / ARM ===
    "shoulder": [
        {
            id: "shoulder-pendulum",
            name: "Pendulum Swings",
            sets: "3 × 30 sec circles each direction",
            cue: "Lean forward, let the sore arm hang. Gently swing it in small circles using body momentum—not arm muscles.",
            workingPain: { zone: "Gentle movement through the shoulder joint", description: "You should feel the shoulder loosening without muscular effort — like a pendulum clock." },
            dangerPain: { zone: "Sudden sharp catch or deep joint pain", description: "A sharp 'catch' or deep grinding sensation in the joint could indicate a labral or rotator cuff issue." },
            regression: { name: "Assisted Arm Slide", sets: "3 × 10", cue: "Place hand on a table, gently slide forward and back. The table supports the arm's weight." },
            progression: { name: "Light Shoulder Flexion", sets: "3 × 10", cue: "Hold a very light weight (1 lb) or water bottle, and raise arm forward to shoulder height." },
        },
        {
            id: "shoulder-wall-angel",
            name: "Wall Angels",
            sets: "3 × 10 (slow)",
            cue: "Stand with back flat against wall, arms in 'goalpost'. Slide arms up and down, keeping contact with the wall.",
            workingPain: { zone: "Shoulder blades and upper back", description: "Fatigue between the shoulder blades means your postural muscles are activating properly." },
            dangerPain: { zone: "Sharp front-of-shoulder or pinching pain", description: "Impingement-type pinching at the top of the movement means you're going too high. Lower the range." },
            regression: { name: "Scapular Squeezes", sets: "3 × 12 (hold 3 sec)", cue: "Sit or stand tall. Squeeze your shoulder blades together and hold. No overhead movement required." },
            progression: { name: "Band Pull-Aparts", sets: "3 × 12", cue: "Hold a resistance band at shoulder width, pull it apart by squeezing shoulder blades." },
        },
    ],

    // === HIP ===
    "hip": [
        {
            id: "hip-clamshell",
            name: "Clamshells",
            sets: "3 × 15 per side",
            cue: "Side-lying, knees bent 90°, feet together. Open the top knee like a clamshell without rolling your pelvis.",
            workingPain: { zone: "Side of the hip (gluteus medius)", description: "A deep burn on the outer hip means your glute med is firing — this is the most important hip stabilizer." },
            dangerPain: { zone: "Sharp groin pain or clicking in the hip joint", description: "If you feel a sharp pinch deep in the front of the hip or a painful click, stop and try the regression." },
            regression: { name: "Isometric Clamshell", sets: "3 × 10 (hold 10 sec)", cue: "Start the opening movement but hold it at 30% open. No full range needed." },
            progression: { name: "Banded Clamshells", sets: "3 × 12 per side", cue: "Wrap a resistance band just above your knees for more challenge." },
        },
        {
            id: "hip-flexor-stretch",
            name: "Half-Kneeling Hip Flexor Stretch",
            sets: "3 × 30 sec per side",
            cue: "Kneel on one knee, other foot forward. Gently push hips forward. Squeeze the back-side glute.",
            workingPain: { zone: "Front of the hip on the kneeling side", description: "A deep, pulling stretch at the front of the hip is the target — tight hip flexors are extremely common." },
            dangerPain: { zone: "Sharp pain at the front of the hip joint or lower back", description: "A sharp pinch deep in the hip socket could be impingement — don't push through it." },
            regression: { name: "Supine Hip Flexor Stretch", sets: "3 × 30 sec per side", cue: "Lie on the edge of a bed, let one leg hang off while hugging the other knee. Gravity does the work." },
            progression: { name: "Couch Stretch", sets: "3 × 30 sec per side", cue: "Rear foot elevated on a couch/wall behind you. Intense quad and hip flexor stretch." },
        },
    ],

    // === FOOT / ANKLE ===
    "foot": [
        {
            id: "foot-calf-raise",
            name: "Heel Raises",
            sets: "3 × 15",
            cue: "Stand near a wall for balance. Rise up on your toes, hold 2 seconds, lower slowly.",
            workingPain: { zone: "Calf muscles (back of lower leg)", description: "A burn in the calves is expected and desired — strong calves protect the ankle and arch." },
            dangerPain: { zone: "Sharp Achilles tendon pain or heel pain", description: "A sharp pain at the Achilles or heel bone means the tendon may be irritated — reduce range of motion." },
            regression: { name: "Seated Heel Raises", sets: "3 × 20", cue: "Sit in a chair, raise heels off the floor. Less body weight, same muscle activation pattern." },
            progression: { name: "Single-Leg Heel Raise", sets: "3 × 10 per leg", cue: "One foot only. Hold a wall. Control the lowering phase especially." },
        },
        {
            id: "foot-towel-scrunch",
            name: "Towel Scrunches",
            sets: "3 × 15",
            cue: "Place a towel on the floor. Use your toes to scrunch it toward you.",
            workingPain: { zone: "Arch of the foot and toe flexors", description: "Cramping-like fatigue in the arch is normal when these muscles are weak — it gets easier quickly." },
            dangerPain: { zone: "Sharp pain in the heel or under the arch", description: "If this recreates your heel/arch pain, the plantar fascia is too irritated — try the regression instead." },
            regression: { name: "Toe Spreads", sets: "3 × 10 (hold 5 sec)", cue: "Simply try to spread all 5 toes apart. Builds foot intrinsic muscles with zero load." },
            progression: { name: "Marble Pick-Ups", sets: "3 × 10 per foot", cue: "Pick up small objects (marbles, pens) with your toes. Greater dexterity challenge." },
        },
    ],

    // === GENERAL (fallback) ===
    "general": [
        {
            id: "gen-breathing",
            name: "360° Breathing",
            sets: "3 × 10 breaths",
            cue: "Sit or lie down. Breathe deeply into your belly AND sides. Exhale fully through pursed lips.",
            workingPain: { zone: "Ribcage expansion, mild core engagement", description: "A sensation of the belly and ribs expanding is the goal — this resets your nervous system." },
            dangerPain: { zone: "Chest pain, dizziness, or lightheadedness", description: "If breathing itself causes chest pain or dizziness, stop and seek medical advice." },
            regression: { name: "Relaxed Belly Breathing", sets: "3 × 10 breaths", cue: "Just breathe into your belly with hands resting on it. No effort needed." },
            progression: { name: "Box Breathing (4-4-4-4)", sets: "3 × 5 cycles", cue: "Inhale 4 sec, hold 4 sec, exhale 4 sec, hold 4 sec. Builds respiratory control and calm." },
        },
        {
            id: "gen-walk",
            name: "Gentle Walking Program",
            sets: "10–15 minutes",
            cue: "Walk at a comfortable pace on flat ground. Focus on smooth, rhythmic strides.",
            workingPain: { zone: "General mild discomfort that eases as you move", description: "If your pain decreases after the first 2–3 minutes of walking, that's a great sign — motion is medicine." },
            dangerPain: { zone: "Pain that gets progressively worse with every step", description: "If pain INCREASES the more you walk (worsening pattern), stop and rest — your tissue isn't ready for this load yet." },
            regression: { name: "Seated Marching", sets: "3 × 1 min", cue: "Sit in a chair and march your legs up and down. Keeps the movement pattern without body weight." },
            progression: { name: "Incline Walking", sets: "10–15 min on slight hill", cue: "Add a slight incline (treadmill 3–5%) to increase glute and calf engagement." },
        },
    ],
};

/**
 * Get exercises appropriate for the user's pain regions.
 * Returns an array of exercise objects from the DB.
 */
export function getExercisesForRegions(regionLabels) {
    const regionText = regionLabels.join(" ").toLowerCase();
    const exercises = [];

    if (regionText.includes("knee") || regionText.includes("thigh")) {
        exercises.push(...EXERCISES_DB.knee);
    }
    if (regionText.includes("back") || regionText.includes("torso") || regionText.includes("abs") || regionText.includes("chest")) {
        exercises.push(...EXERCISES_DB.back);
    }
    if (regionText.includes("head") || regionText.includes("neck")) {
        exercises.push(...EXERCISES_DB.neck);
    }
    if (regionText.includes("shoulder") || regionText.includes("arm") || regionText.includes("elbow") || regionText.includes("blade")) {
        exercises.push(...EXERCISES_DB.shoulder);
    }
    if (regionText.includes("hip") || regionText.includes("glute") || regionText.includes("pelvis")) {
        exercises.push(...EXERCISES_DB.hip);
    }
    if (regionText.includes("foot") || regionText.includes("ankle") || regionText.includes("shin") || regionText.includes("calf")) {
        exercises.push(...EXERCISES_DB.foot);
    }

    // Always include general exercises
    exercises.push(...EXERCISES_DB.general);

    return exercises;
}
