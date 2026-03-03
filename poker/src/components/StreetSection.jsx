import React from 'react';

/**
 * Generic two-column street container.
 * Left panel: 33% (card picker), Right panel: 67% (insights).
 * Stacks below 768px.
 * Optional actionRow renders beneath both columns.
 */
export default function StreetSection({ leftPanel, rightPanel, actionRow, bgClass = "bg-white", borderClass = "border-slate-200" }) {
    return (
        <div className={`p-4 rounded-2xl shadow-sm border ${bgClass} ${borderClass} mt-4`}>
            <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-4">
                <div>{leftPanel}</div>
                <div>{rightPanel}</div>
            </div>
            {actionRow && <div className="mt-3">{actionRow}</div>}
        </div>
    );
}
