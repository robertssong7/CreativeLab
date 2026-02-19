import React from 'react';
import { ArrowLeft } from 'lucide-react';

export default function StepHeader({ step, totalSteps, title, subtitle, onBack }) {
    return (
        <div className="mb-4">
            <div className="mb-4 flex items-center justify-between">
                {onBack ? (
                    <button onClick={onBack} className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-medium text-slate-600 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900 border border-slate-200/50">
                        <ArrowLeft className="h-4 w-4" /> Back
                    </button>
                ) : (
                    <div />
                )}
                <div className="text-xs font-bold uppercase tracking-widest text-slate-400">
                    Step {step} of {totalSteps}
                </div>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">{title}</h2>
            {subtitle && <p className="mt-1 text-slate-500">{subtitle}</p>}
        </div>
    );
}
