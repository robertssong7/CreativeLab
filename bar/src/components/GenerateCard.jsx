import React, { useState, useEffect } from 'react';
import { Sparkles, Lightbulb, AlertTriangle, ChevronDown, Droplets, Users } from 'lucide-react';

export default function GenerateCard({ onGenerate, results, onReset, mode, theme }) {
    const [prompt, setPrompt] = useState("");
    const [filters, setFilters] = useState({ classic: true, creative: true, flavor: "All" });
    const [expandedId, setExpandedId] = useState(null);
    const [batchSize, setBatchSize] = useState({}); // { [drinkId]: numberOfPeople }

    useEffect(() => {
        if (results.length === 0) {
            onGenerate("", { classic: true, creative: true });
        }
    }, []);

    const handleRegen = () => {
        setExpandedId(null);
        onGenerate(prompt, filters);
    };

    const toggleExpand = (id) => setExpandedId(curr => curr === id ? null : id);

    const updateBatch = (id, people) => {
        setBatchSize(prev => ({ ...prev, [id]: people }));
    };

    // Filter results locally by flavor if "All" is not selected
    const displayResults = filters.flavor === "All"
        ? results
        : results.filter(r => r.flavor === filters.flavor || !r.flavor);

    // Dynamic classes based on theme
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

            {/* Global Flavor Matrix Filter */}
            <div className={`mb-6 p-4 rounded-2xl border ${mode === 'mocktail' ? 'bg-white border-black/5' : 'bg-cocktail-900 border-cocktail-800'}`}>
                <label className="text-xs font-bold uppercase tracking-widest opacity-50 block mb-3">Flavor Matrix Navigation</label>
                <div className="flex flex-wrap gap-2">
                    {["All", "Sour", "Bitter", "Sweet-Tart", "Spirit-Forward", "Rich", "Herbaceous", "Spicy", "Citrus"].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilters(prev => ({ ...prev, flavor: f }))}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${filters.flavor === f ? theme.accent : inputBg}`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="mb-8 space-y-3">
                {displayResults.length > 0 ? displayResults.map((r, i) => {
                    const isMissing = r.missing && r.missing.length > 0;
                    const people = batchSize[r.id] || 1;
                    const isBatched = people > 1;

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
                                            {isMissing && <span className="rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-red-700">Missing {r.missing.length}</span>}
                                        </div>
                                        <div className="flex gap-2 text-[10px] uppercase tracking-wider opacity-60">
                                            {r.flavor && <span className={`text-${theme.accentText} font-bold border-r pr-2 border-inherit`}>{r.flavor}</span>}
                                            {r.tags && r.tags.map(t => <span key={t}>{t}</span>)}
                                        </div>
                                    </div>
                                </div>
                                <ChevronDown className={`h-4 w-4 transition-transform ${expandedId === r.id ? 'rotate-180' : ''}`} />
                            </button>

                            {expandedId === r.id && (
                                <div className={`p-6 border-t animate-fadeIn ${detailBg} ${mode === 'mocktail' ? 'border-mocktail-100' : 'border-cocktail-700'}`}>

                                    {/* Pantry Substitution Engine */}
                                    {isMissing && (
                                        <div className="mb-6 rounded-lg p-4 bg-orange-50 border border-orange-200">
                                            <div className="flex items-start gap-2 mb-2 text-orange-800">
                                                <AlertTriangle className="h-5 w-5 shrink-0" />
                                                <h4 className="font-semibold text-sm">Pantry Substitution Engine</h4>
                                            </div>
                                            <ul className="pl-7 text-sm space-y-1 text-orange-900">
                                                {r.missing.map(m => (
                                                    <li key={m}>
                                                        <span className="font-medium decoration-orange-300 underline underline-offset-2">{m}</span> missing.
                                                        {r.substitution?.[m] ? (
                                                            <span> Sub with: <b>{r.substitution[m]}</b></span>
                                                        ) : (
                                                            <span> Try leaving it out or ask the bartender logic below!</span>
                                                        )}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Batching Calculator */}
                                    <div className={`mb-6 flex flex-col md:flex-row gap-4 items-center justify-between p-4 rounded-xl border ${mode === 'mocktail' ? 'bg-white border-black/5' : 'bg-cocktail-900/50 border-cocktail-800'}`}>
                                        <div className="flex items-center gap-2">
                                            <Users className="h-5 w-5 opacity-50" />
                                            <span className="text-sm font-semibold">Scale Recipe:</span>
                                        </div>
                                        <div className="flex gap-2">
                                            {[1, 2, 4, 8].map(num => (
                                                <button
                                                    key={num}
                                                    onClick={() => updateBatch(r.id, num)}
                                                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold border transition-colors ${people === num ? theme.accent : inputBg}`}
                                                >
                                                    {num}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Calculated Spec Display */}
                                    <div className="mb-6 space-y-4">
                                        <div>
                                            <h4 className="mb-2 text-xs font-bold uppercase tracking-widest opacity-50">
                                                {isBatched ? `Batched Measurements (Serves ${people})` : 'Single Serving'}
                                            </h4>

                                            {isBatched && r.batchDilution > 0 && (
                                                <div className="mb-3 flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-3 py-2 rounded-md border border-blue-100">
                                                    <Droplets className="h-4 w-4 shrink-0" />
                                                    <span><b>Crucial Dilution Rule:</b> Add {(r.batchDilution * 100).toFixed(0)}% water when measuring large batches since you omit shaking/stirring with ice.</span>
                                                </div>
                                            )}

                                            <ul className={`list-disc pl-4 text-sm leading-relaxed ${detailText}`}>
                                                {r.spec.split('.').map(s => s.trim()).filter(Boolean).map((line, idx) => {
                                                    // Ultra simple regex to multiply oz values
                                                    const batchedLine = isBatched ? line.replace(/([\d.]+)\s*(oz|parts?)/gi, (match, val, unit) => {
                                                        return `${(parseFloat(val) * people).toFixed(1)} ${unit}`;
                                                    }) : line;

                                                    return <li key={idx} className="pl-1 py-0.5">{batchedLine}</li>;
                                                })}
                                            </ul>
                                        </div>
                                    </div>

                                    {/* Expert Tip */}
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
                    <div className="py-8 text-center opacity-50 text-sm">No drinks match this flavor profile. Try another!</div>
                )}
            </div>

            {/* AI Control Center */}
            <div className={`space-y-4 rounded-2xl p-6 ${mode === 'mocktail' ? 'bg-mocktail-50' : 'bg-cocktail-900/50 border border-cocktail-800'}`}>
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest opacity-50">Custom Request (Chef's Brain)</label>
                    <input
                        value={prompt}
                        onChange={e => setPrompt(e.target.value)}
                        placeholder="E.g., 'spicy', 'refreshing'..."
                        className={`w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-current ${inputBg}`}
                    />
                </div>
                <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                    <button onClick={handleRegen} className={`flex-1 rounded-xl border border-current px-4 py-3 text-sm font-medium hover:opacity-80`}>Regenerate Search</button>
                    <button onClick={onReset} className="rounded-xl border border-red-500/30 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-500/10">Reset</button>
                </div>
            </div>
        </div>
    );
}
