import React, { useState, useEffect } from 'react';
import { Sparkles, Lightbulb, AlertTriangle, ChevronDown, Users, Droplets, ArrowRight, RefreshCw } from 'lucide-react';
import { FLAVOR_TAGS } from '../data/recipes';
import { getSubstitutions, calculateBatch } from '../utils/flavorEngine';

export default function GenerateCard({ onGenerate, results, onReset, mode, theme, flavorFilter, setFlavorFilter }) {
    const [prompt, setPrompt] = useState("");
    const [filters, setFilters] = useState({ classic: true, creative: true });
    const [expandedId, setExpandedId] = useState(null);
    const [batchServings, setBatchServings] = useState({});  // { [drinkId]: servings }

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

    const toggleFlavor = (tagId) => {
        setFlavorFilter(prev => {
            if (prev.includes(tagId)) return prev.filter(t => t !== tagId);
            return [...prev, tagId];
        });
    };

    const getServings = (id) => batchServings[id] || 1;
    const setServings = (id, val) => setBatchServings(prev => ({ ...prev, [id]: val }));

    const detailBg = mode === 'mocktail' ? 'bg-mocktail-50' : 'bg-cocktail-950/40';
    const inputBg = mode === 'mocktail' ? 'bg-white' : 'bg-cocktail-950/50 border-cocktail-700 text-cocktail-text';
    const itemHover = mode === 'mocktail' ? 'hover:border-mocktail-accent/50' : 'hover:border-cocktail-accent/50';
    const chipActive = mode === 'mocktail' ? 'border-mocktail-accent bg-mocktail-50 text-mocktail-accent font-semibold' : 'border-cocktail-accent bg-cocktail-950 text-cocktail-accent font-semibold';
    const chipInactive = mode === 'mocktail' ? 'border-black/10 bg-white hover:bg-mocktail-50 text-gray-500' : 'border-cocktail-800 bg-cocktail-900/50 hover:bg-cocktail-800 text-cocktail-muted';

    return (
        <div className={`fade-in rounded-3xl border p-6 shadow-xl md:p-10 ${theme.card} ${theme.cardBorder}`}>
            <div className="mb-6 text-center">
                <Sparkles className={`mx-auto mb-4 h-8 w-8 ${theme.accentText}`} />
                <h2 className="serif text-3xl mb-2">Your Menu</h2>
                <p className="text-sm opacity-60">Curated based on your inventory & expert pairings.</p>
            </div>

            {/* Flavor Matrix */}
            <div className="mb-6">
                <h4 className="mb-3 text-xs font-bold uppercase tracking-widest opacity-50">Flavor Matrix — What are you in the mood for?</h4>
                <div className="flex flex-wrap gap-2">
                    {FLAVOR_TAGS.map(tag => (
                        <button
                            key={tag.id}
                            onClick={() => toggleFlavor(tag.id)}
                            className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-all duration-200 ${flavorFilter.includes(tag.id) ? chipActive : chipInactive}`}
                        >
                            <span>{tag.emoji}</span>
                            <span>{tag.label}</span>
                        </button>
                    ))}
                </div>
                {flavorFilter.length > 0 && (
                    <button onClick={() => setFlavorFilter([])} className="mt-2 text-[10px] uppercase tracking-wider opacity-50 hover:opacity-100 underline">
                        Clear Filters
                    </button>
                )}
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
                    const subs = isMissing ? getSubstitutions(r.missing) : [];
                    const servings = getServings(r.id);
                    const batch = servings > 1 ? calculateBatch(r.spec, servings, r.batchDilution || 0.2) : null;

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
                                            {r.tags && r.tags.map(t => <span key={t}>{t}</span>)}
                                        </div>
                                    </div>
                                </div>
                                <ChevronDown className={`h-4 w-4 transition-transform ${expandedId === r.id ? 'rotate-180' : ''}`} />
                            </button>

                            {expandedId === r.id && (
                                <div className={`p-6 border-t animate-fadeIn ${detailBg} ${mode === 'mocktail' ? 'border-mocktail-100' : 'border-cocktail-700'}`}>
                                    {/* Missing + Substitutions */}
                                    {isMissing && (
                                        <div className="mb-4">
                                            <div className="flex items-center gap-2 text-xs text-red-500 font-medium mb-2">
                                                <AlertTriangle className="h-4 w-4" />
                                                <span>Missing: {r.missing.join(", ")}</span>
                                            </div>
                                            {subs.length > 0 && (
                                                <div className={`ml-2 space-y-2 rounded-lg border p-3 text-xs ${mode === 'mocktail' ? 'border-mocktail-accent/20 bg-white' : 'border-cocktail-700 bg-cocktail-900/50'}`}>
                                                    <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider opacity-60 mb-1">
                                                        <RefreshCw className="h-3 w-3" /> Smart Substitutions
                                                    </div>
                                                    {subs.map(sub => (
                                                        <div key={sub.ingredient} className="space-y-1">
                                                            <div className="font-medium">Instead of <span className={theme.accentText}>{sub.ingredient}</span> <span className="opacity-40">({sub.reason})</span>:</div>
                                                            {sub.alternatives.map((alt, j) => (
                                                                <div key={j} className="ml-3 flex items-start gap-1.5">
                                                                    <ArrowRight className="h-3 w-3 mt-0.5 shrink-0 opacity-40" />
                                                                    <span><strong>{alt.name}</strong> — {alt.note}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Spec */}
                                    <div className="mb-6 space-y-4">
                                        <div>
                                            <h4 className="mb-2 text-xs font-bold uppercase tracking-widest opacity-50">
                                                {servings > 1 ? `Recipe × ${servings} servings` : 'Ingredients'}
                                            </h4>
                                            <ul className={`list-disc pl-4 text-sm leading-relaxed`}>
                                                {(batch ? batch.scaledSpec : r.spec.split('.').map(s => s.trim()).filter(Boolean)).map((line, idx) => (
                                                    <li key={idx} className="pl-1">{line}</li>
                                                ))}
                                                {batch && batch.waterOz > 0 && (
                                                    <li className="pl-1 flex items-center gap-1.5">
                                                        <Droplets className="h-3.5 w-3.5 inline opacity-60" />
                                                        <strong>{batch.waterOz} oz water</strong> <span className="opacity-50">(dilution — replaces shaking/stirring)</span>
                                                    </li>
                                                )}
                                            </ul>
                                        </div>
                                    </div>

                                    {/* Batch Calculator */}
                                    <div className={`mb-4 flex items-center gap-3 rounded-lg border p-3 text-sm ${mode === 'mocktail' ? 'border-black/5 bg-white' : 'border-cocktail-700 bg-cocktail-900/50'}`}>
                                        <Users className={`h-5 w-5 shrink-0 ${theme.accentText}`} />
                                        <div className="flex-1">
                                            <div className="text-xs font-bold uppercase tracking-wider opacity-50 mb-1">Batch Calculator</div>
                                            <div className="flex items-center gap-2">
                                                {[1, 4, 8, 12].map(n => (
                                                    <button
                                                        key={n}
                                                        onClick={() => setServings(r.id, n)}
                                                        className={`rounded-lg border px-3 py-1 text-xs font-medium transition-all ${servings === n ? chipActive : chipInactive}`}
                                                    >
                                                        {n === 1 ? 'Single' : `× ${n}`}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    {batch && batch.waterOz > 0 && (
                                        <div className={`mb-4 flex gap-2 rounded-lg border p-3 text-xs ${mode === 'mocktail' ? 'border-blue-200 bg-blue-50 text-blue-800' : 'border-blue-900 bg-blue-950/40 text-blue-300'}`}>
                                            <Droplets className="h-4 w-4 shrink-0" />
                                            <p><strong>Dilution note:</strong> Add {batch.waterOz} oz of water to your pitcher. This replaces the water that would have melted from ice during individual shaking/stirring. Chill in fridge for 1 hr before serving.</p>
                                        </div>
                                    )}

                                    {/* Pro Tip */}
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
                    <div className="py-8 text-center opacity-50 text-sm">No drinks match. Try adding more ingredients or adjusting your flavor filters!</div>
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
