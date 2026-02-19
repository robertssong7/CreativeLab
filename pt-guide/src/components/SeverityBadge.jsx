import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle } from 'lucide-react';

export default function SeverityBadge({ severity }) {
    if (severity === 'orange') {
        return (
            <div className="flex items-center gap-2 rounded-full bg-orange-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-orange-700">
                <AlertTriangle className="h-3 w-3" /> Clinical Attention
            </div>
        );
    }
    if (severity === 'yellow') {
        return (
            <div className="flex items-center gap-2 rounded-full bg-yellow-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-yellow-700">
                <AlertCircle className="h-3 w-3" /> Monitor
            </div>
        );
    }
    return (
        <div className="flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-green-700">
            <CheckCircle className="h-3 w-3" /> Self-Care
        </div>
    );
}
