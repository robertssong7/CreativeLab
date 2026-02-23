import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ArrowDown, ArrowUp, ShieldCheck, ShieldAlert } from 'lucide-react';

export default function ExerciseCard({ exercise }) {
    const [expanded, setExpanded] = useState(false);
    const [activeVariant, setActiveVariant] = useState('standard'); // 'regression' | 'standard' | 'progression'

    const current = activeVariant === 'regression' ? exercise.regression
        : activeVariant === 'progression' ? exercise.progression
            : exercise;

    const currentName = activeVariant === 'standard' ? exercise.name : current.name;
    const currentSets = activeVariant === 'standard' ? exercise.sets : current.sets;
    const currentCue = activeVariant === 'standard' ? exercise.cue : current.cue;

    return (
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden transition-all hover:shadow-md">
            {/* Header */}
            <button
                onClick={() => setExpanded(e => !e)}
                className="flex w-full items-center justify-between p-4 text-left"
            >
                <div>
                    <h4 className="font-bold text-slate-900 flex items-center gap-2">
                        {currentName}
                        {activeVariant === 'regression' && <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold uppercase text-amber-700">Easier</span>}
                        {activeVariant === 'progression' && <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold uppercase text-emerald-700">Harder</span>}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">{currentSets}</p>
                </div>
                {expanded ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
            </button>

            {expanded && (
                <div className="border-t border-slate-100 p-4 space-y-4 animate-fadeIn">
                    {/* Cue */}
                    <div className="text-sm text-slate-700 leading-relaxed bg-slate-50 rounded-lg p-3">
                        <span className="font-bold text-slate-500 text-xs uppercase tracking-wider">How to do it: </span>
                        <span>{currentCue}</span>
                    </div>

                    {/* Pain Indicators (always from the base exercise) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Working Pain (Green) */}
                        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3">
                            <div className="flex items-center gap-2 mb-1.5">
                                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Expected Sensation</span>
                            </div>
                            <p className="text-xs font-medium text-emerald-800 mb-0.5">Where: {exercise.workingPain.zone}</p>
                            <p className="text-xs text-emerald-700 leading-relaxed">{exercise.workingPain.description}</p>
                        </div>

                        {/* Danger Pain (Red) */}
                        <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                            <div className="flex items-center gap-2 mb-1.5">
                                <ShieldAlert className="h-4 w-4 text-red-500" />
                                <span className="text-xs font-bold uppercase tracking-wider text-red-700">Stop If You Feel</span>
                            </div>
                            <p className="text-xs font-medium text-red-800 mb-0.5">Where: {exercise.dangerPain.zone}</p>
                            <p className="text-xs text-red-700 leading-relaxed">{exercise.dangerPain.description}</p>
                        </div>
                    </div>

                    {/* Traffic Light Controls */}
                    <div className="flex items-center gap-2 pt-1">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mr-1">Adjust:</span>
                        <button
                            onClick={() => setActiveVariant('regression')}
                            className={`flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${activeVariant === 'regression' ? 'border-amber-400 bg-amber-50 text-amber-700 shadow-sm' : 'border-slate-200 text-slate-500 hover:border-amber-300 hover:text-amber-600'}`}
                        >
                            <ArrowDown className="h-3 w-3" /> Make Easier
                        </button>
                        <button
                            onClick={() => setActiveVariant('standard')}
                            className={`flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${activeVariant === 'standard' ? 'border-blue-400 bg-blue-50 text-blue-700 shadow-sm' : 'border-slate-200 text-slate-500 hover:border-blue-300 hover:text-blue-600'}`}
                        >
                            Standard
                        </button>
                        <button
                            onClick={() => setActiveVariant('progression')}
                            className={`flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${activeVariant === 'progression' ? 'border-emerald-400 bg-emerald-50 text-emerald-700 shadow-sm' : 'border-slate-200 text-slate-500 hover:border-emerald-300 hover:text-emerald-600'}`}
                        >
                            <ArrowUp className="h-3 w-3" /> Make Harder
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
