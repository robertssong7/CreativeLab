import React, { useRef, useEffect } from 'react';
import helpRegistry from '../data/helpRegistry';

/**
 * Anchored popover that opens near the "i" icon.
 * Only one popover open at a time — coordinated via openPopoverId/setOpenPopoverId in parent.
 */
export default function InfoPopover({ insightId, openPopoverId, setOpenPopoverId, className = "" }) {
    const containerRef = useRef(null);
    const isOpen = openPopoverId === insightId;
    const entry = helpRegistry[insightId];

    useEffect(() => {
        if (!isOpen) return;
        function handleClickOutside(e) {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setOpenPopoverId(null);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, setOpenPopoverId]);

    if (!entry) return null;

    return (
        <div ref={containerRef} className={`relative inline-block ${className}`}>
            <button
                className="text-xs w-6 h-6 flex items-center justify-center rounded-full border border-slate-200 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                onClick={() => setOpenPopoverId(isOpen ? null : insightId)}
                aria-label={`Info about ${entry.title}`}
            >
                i
            </button>
            {isOpen && (
                <div className="absolute right-0 top-8 z-50 w-90 max-w-[90vw] p-4 bg-white rounded-xl shadow-lg border border-slate-200 text-left animate-in fade-in duration-100">
                    <div className="text-sm font-semibold text-slate-800 mb-1.5">{entry.title}</div>
                    <div className="text-[13px] text-slate-500 leading-relaxed whitespace-pre-line">{entry.body}</div>
                    {entry.glossary && (
                        <div className="mt-3 pt-2.5 border-t border-slate-100">
                            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Key terms</div>
                            {entry.glossary.map((g, i) => (
                                <div key={i} className="text-[13px] text-slate-500 mb-1.5 last:mb-0">
                                    <span className="font-semibold text-slate-700">{g.term}:</span> {g.def}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
