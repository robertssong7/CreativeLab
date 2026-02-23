import React, { useState } from 'react';
import { Play, Pause, ChevronLeft, ArrowDownCircle, ArrowUpCircle, ShieldCheck, AlertTriangle } from 'lucide-react';
import { getExercise } from '../data/exercises';

export default function ActiveWorkout({ rootExerciseId, onComplete, onExit }) {
    const [currentId, setCurrentId] = useState(rootExerciseId || "squat");
    const [reps, setReps] = useState(0);
    const [isActive, setIsActive] = useState(false);

    const exercise = getExercise(currentId);

    const handleRegress = () => {
        if (exercise.regression) {
            setCurrentId(exercise.regression);
            setReps(0); // Reset for new movement
        }
    };

    const handleProgress = () => {
        if (exercise.progression) {
            setCurrentId(exercise.progression);
            setReps(0);
        }
    };

    return (
        <div className="absolute inset-0 bg-slate-900 z-50 flex flex-col pt-10 px-6 pb-8 text-white animate-fadeIn">

            {/* Top Bar */}
            <div className="flex justify-between items-center mb-8">
                <button onClick={onExit} className="flex items-center text-slate-400 hover:text-white transition-colors">
                    <ChevronLeft className="w-5 h-5 mr-1" /> End Session
                </button>
                <div className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-bold uppercase tracking-wider border border-blue-500/30">
                    Active Recovery
                </div>
            </div>

            {/* Main Display */}
            <div className="flex-1 flex flex-col items-center justify-center relative">

                {/* Rep Counter */}
                <div className="text-center mb-10">
                    <div className="text-[140px] leading-none font-bold tabular-nums text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500 mb-2">
                        {reps}
                    </div>
                    <p className="text-xl font-medium text-slate-400 uppercase tracking-widest">{exercise.name}</p>
                </div>

                {/* Pre/Mid-Exercise Pain Indicators (The Expert PT Logic) */}
                <div className="w-full max-w-sm space-y-3 mb-12">
                    {/* Working Zone */}
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 flex items-start gap-3">
                        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                            <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">Working Pain (Green Light)</p>
                            <p className="text-sm text-emerald-100/70">{exercise.workingZones.join(", ")}</p>
                            <p className="text-xs text-slate-400 mt-2 italic">{exercise.painTarget.split(".")[0]}.</p>
                        </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4 flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                        <div>
                            <p className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-1">Danger Pain (Red Light)</p>
                            <p className="text-sm text-rose-100/70">{exercise.dangerZones.join(", ")}</p>
                            <p className="text-xs text-slate-400 mt-2 italic">{exercise.painTarget.split(".").slice(1).join(".").trim()}</p>
                        </div>
                    </div>
                </div>

                {/* The "Traffic Light" Contextual Modifications Context */}
                <div className="flex items-center gap-4 w-full max-w-sm mt-auto">
                    <button
                        onClick={handleRegress}
                        disabled={!exercise.regression}
                        className={`flex-1 p-3 rounded-xl border flex flex-col items-center gap-1 transition-all ${exercise.regression ? 'bg-slate-800 border-slate-700 hover:bg-rose-500/20 hover:border-rose-500/50 hover:text-rose-400' : 'opacity-30 cursor-not-allowed border-transparent bg-slate-800'}`}
                    >
                        <ArrowDownCircle className="w-5 h-5" />
                        <span className="text-[10px] uppercase font-bold tracking-wider">Too Painful</span>
                        {exercise.regression && <span className="text-xs text-slate-400">{exercise.regression.replace(/-/g, ' ')}</span>}
                    </button>

                    <button
                        onClick={() => {
                            setIsActive(!isActive);
                            if (!isActive) setReps(r => r + 1); // Simple counter demo
                        }}
                        className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center shadow-[0_0_30px_rgba(37,99,235,0.4)] transition-transform active:scale-90"
                    >
                        {isActive ? <Pause className="w-8 h-8 ml-1" /> : <Play className="w-8 h-8 ml-2" />}
                    </button>

                    <button
                        onClick={handleProgress}
                        disabled={!exercise.progression}
                        className={`flex-1 p-3 rounded-xl border flex flex-col items-center gap-1 transition-all ${exercise.progression ? 'bg-slate-800 border-slate-700 hover:bg-emerald-500/20 hover:border-emerald-500/50 hover:text-emerald-400' : 'opacity-30 cursor-not-allowed border-transparent bg-slate-800'}`}
                    >
                        <ArrowUpCircle className="w-5 h-5" />
                        <span className="text-[10px] uppercase font-bold tracking-wider">Too Easy</span>
                        {exercise.progression && <span className="text-xs text-slate-400">{exercise.progression.replace(/-/g, ' ')}</span>}
                    </button>
                </div>
            </div>

            <button
                onClick={onComplete}
                className="mt-8 w-full py-4 rounded-xl bg-white text-slate-900 font-bold text-lg hover:bg-slate-100 transition-colors"
            >
                Complete Set
            </button>
        </div>
    );
}
