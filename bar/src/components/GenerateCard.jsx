import React, { useState, useEffect } from 'react';
import { Sparkles, Lightbulb, AlertTriangle, ChevronDown } from 'lucide-react';

export default function GenerateCard({ onGenerate, results, onReset, mode, theme }) {
    const [prompt, setPrompt] = useState("");
    const [filters, setFilters] = useState({ classic: true, creative: true });
    const [expandedId, setExpandedId] = useState(null);

    useEffect(() => {
        // Initial generation on mount
        if (results.length === 0) {
            onGenerate("", { classic: true, creative: true });
        }
    }, []);

    const handleRegen = () => {
        setExpandedId(null);
        onGenerate(prompt, filters);
    };

    const toggleExpand = (id) => setExpandedId(curr => curr === id ? null : id);

    // Text colors for details
    const detailText = mode === 'mocktail' ? 'text-mocktail-text' : 'text-cocktail-text';
    const detailBg = mode === 'mocktail' ? 'bg-mocktail-50' : 'bg-cocktail-950/40';
    const inputBg = mode === 'mocktail' ? 'bg-white' : 'bg-cocktail-950/50 border-cocktail-700 text-cocktail-text';
    const itemHover = mode === 'mocktail' ? 'hover:border-mocktail-accent/50' : 'hover:border-cocktail-accent/50';

    return (
        <div className={`fade-in rounded-3xl border p-6 shadow-xl md:p-10 ${theme.card} ${theme.cardBorder}`}>
            <div className="mb-6 text-center">
                <Sparkles className={`mx-auto mb-4 h-8 w-8 ${theme.accentText}`} />
                <h2 className="serif text-3xl mb-2">Your Menu</h2>
                <p className="text-sm opacity-60">Curated based on your inventory & expert pairings.</p>
            </div>

            {/* House Tip */}
            <div className={`mb-6 flex gap-3 rounded-lg border p-4 text-sm ${mode === 'mocktail' ? 'border-mocktail-accent/20 bg-mocktail-50 text-mocktail-text' : 'border-cocktail-700 bg-cocktail-800/30 text-cocktail-text'}`}>
                <Lightbulb className="h-5 w-5 shrink-0 opacity-80" />
                <p><span className="font-bold">House Rule:</span> Always chill your glassware before serving. A cold glass keeps the drink alive longer.</p>
            </div>

            {/* Drink List */}
            <div className="mb-8 space-y-3">
                {results.length > 0 ? results.map((r, i) => {
                    const isMissing = r.missing && r.missing.length > 0;
                    return (
                        <div key={r.id} className={`overflow-hidden rounded-xl border transition-all duration-300 ${expandedId === r.id ? 'shadow-md border-current' : 'border-transparent hover:border-current'} ${itemHover}`}>
                            <button
                                onClick={() => toggleExpand(r.id)}
                                className={`flex w-full items-center justify-between p-4 text-left ${mode === 'mocktail' ? 'bg-white' : 'bg-cocktail-800/50'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${mode === 'mocktail' ? 'bg-mocktail-100 text-mocktail-accent' : 'bg-cocktail-950 text-cocktail-accent'}`}>{i + 1}</div>
                                    <div>
                                        <div className="font-serif font-medium text-lg flex items-center gap-2">
                                            {r.name}
                                            {isMissing && <span className="rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-red-700">Missing 1</span>}
                                        </div>
                                        <div className="flex gap-2 text-[10px] uppercase tracking-wider opacity-60">
                                            {r.tags && r.tags.map(t => <span key={t}>{t}</span>)}
                                        </div>
                                    </div>
                                </div>
                                <ChevronDown className={`h-4 w-4 transition-transform ${expandedId === r.id ? 'rotate-180' : ''}`} />
                            </button>

                            {expandedId === r.id && (
                                <div className={`p-6 border-t animate-fadeIn ${detailBg} ${mode === 'mocktail' ? 'border-mocktail-100' : 'border-cocktail-700'}`}>
                                    {isMissing && (
                                        <div className="mb-4 flex items-center gap-2 text-xs text-red-500 font-medium">
                                            <AlertTriangle className="h-4 w-4" />
                                            <span>Missing: {r.missing.join(", ")}</span>
                                        </div>
                                    )}

                                    {/* Vertical Spec Layout */}
                                    <div className="mb-6 space-y-4">
                                        <div>
                                            <h4 className="mb-2 text-xs font-bold uppercase tracking-widest opacity-50">Ingredients</h4>
                                            <ul className={`list-disc pl-4 text-sm leading-relaxed ${detailText}`}>
                                                {r.spec.split('.').map(s => s.trim()).filter(Boolean).map((line, idx) => (
                                                    <li key={idx} className="pl-1">{line}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    {r.tip && (
                                        <div className={`flex gap-3 rounded-lg border p-3 text-sm ${mode === 'mocktail' ? 'border-mocktail-accent/20 bg-white text-mocktail-text' : 'border-cocktail-accent/30 bg-cocktail-900 text-cocktail-text'}`}>
                                            <Lightbulb className={`h-5 w-5 shrink-0 opacity-80 ${theme.accentText}`} />
                                            <p><span className="font-bold">Pro Tip:</span> {r.tip}</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                }) : (
                    <div className="py-8 text-center opacity-50 text-sm">No drinks match. Try adding more ingredients!</div>
                )}
            </div>

            {/* Controls & Regeneration */}
            <div className={`space-y-4 rounded-2xl p-6 ${mode === 'mocktail' ? 'bg-mocktail-50' : 'bg-cocktail-900/50 border border-cocktail-800'}`}>
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest opacity-50">Custom Request (Chef's Brain)</label>
                    <input
                        value={prompt}
                        onChange={e => setPrompt(e.target.value)}
                        placeholder="E.g., 'spicy', 'refreshing', 'something complex'..."
                        className={`w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-current ${inputBg}`}
                    />
                </div>

                <div className="flex flex-wrap gap-2 text-xs">
                    <label className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 ${inputBg}`}>
                        <input type="checkbox" checked={filters.classic} onChange={e => setFilters(p => ({ ...p, classic: e.target.checked }))} /> Classics
                    </label>
                    <label className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 ${inputBg}`}>
                        <input type="checkbox" checked={filters.creative} onChange={e => setFilters(p => ({ ...p, creative: e.target.checked }))} /> Expert Creative
                    </label>
                </div>

                <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                    <button onClick={handleRegen} className={`flex-1 rounded-xl border border-current px-4 py-3 text-sm font-medium hover:opacity-80`}>Regenerate Menu</button>
                    <button onClick={onReset} className="rounded-xl border border-red-500/30 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-500/10">Reset Pantry</button>
                </div>
            </div>
        </div>
    );
}
