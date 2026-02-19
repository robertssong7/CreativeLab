import React, { useState, useEffect, useMemo } from 'react';
import { Martini, Leaf } from 'lucide-react';
import { COCKTAIL_CATEGORIES, MOCKTAIL_CATEGORIES } from './data/recipes';
import { generateDrinks } from './utils/flavorEngine';
import { normalize } from './utils/helpers';
import { usePantryState, flattenPantry } from './hooks/usePantry';

import CategoryCard from './components/CategoryCard';
import GenerateCard from './components/GenerateCard';
import Sidebar from './components/Sidebar';

export default function App() {
  const [mode, setMode] = useState("cocktail");
  const { pantry, toggle, isSelected, reset } = usePantryState(mode);
  const [step, setStep] = useState(0);
  const [results, setResults] = useState([]);

  const CONFIG = mode === "cocktail" ? COCKTAIL_CATEGORIES : MOCKTAIL_CATEGORIES;
  const [optionsMap, setOptionsMap] = useState({});

  // Theme colors logic mapping
  const theme = useMemo(() => {
    if (mode === 'mocktail') {
      return {
        bg: 'bg-mocktail-50',
        text: 'text-mocktail-text',
        accent: 'bg-mocktail-accent hover:bg-mocktail-accent-hover',
        accentText: 'text-mocktail-accent',
        card: 'bg-mocktail-card',
        cardBorder: 'border-black/5',
        progress: 'bg-mocktail-accent',
        sidebar: 'bg-white/50 border-black/5',
        toggleBg: 'bg-gray-200',
        toggleBtnActive: 'text-mocktail-text',
        toggleBtnInactive: 'text-gray-400 hover:text-gray-600',
        slider: 'bg-mocktail-accent'
      };
    } else {
      return {
        bg: 'bg-cocktail-950',
        text: 'text-cocktail-text',
        accent: 'bg-cocktail-accent hover:bg-cocktail-accent-hover text-cocktail-950',
        accentText: 'text-cocktail-accent',
        card: 'bg-cocktail-900',
        cardBorder: 'border-cocktail-800',
        progress: 'bg-cocktail-accent',
        sidebar: 'bg-cocktail-900/50 border-cocktail-800',
        toggleBg: 'bg-cocktail-900',
        toggleBtnActive: 'text-cocktail-text',
        toggleBtnInactive: 'text-cocktail-muted hover:text-cocktail-text',
        slider: 'bg-cocktail-accent'
      };
    }
  }, [mode]);

  useEffect(() => {
    const newMap = {};
    CONFIG.forEach(c => {
      const defaultOpts = new Set(c.options);
      if (pantry[c.key]) pantry[c.key].forEach(itm => defaultOpts.add(itm));
      newMap[c.key] = Array.from(defaultOpts);
    });
    setOptionsMap(newMap);
    setStep(0);
    setResults([]);
  }, [mode]);

  const handleAddOther = (key, raw) => {
    if (!raw.trim()) return;
    const norm = normalize(raw);
    setOptionsMap(prev => ({
      ...prev,
      [key]: [...(prev[key] || []), norm]
    }));
    toggle(key, raw);
  };

  const progress = ((step + 1) / (CONFIG.length + 1)) * 100;
  const present = useMemo(() => flattenPantry(pantry), [pantry]);

  const handleGenerate = (prompt, filters) => {
    const existingNames = new Set(results.map(r => r.name));
    // Use the new Flavor Engine!
    const drinks = generateDrinks(mode, present, 6, prompt, filters, existingNames);
    setResults(drinks);
    setStep(CONFIG.length);
  };

  return (
    <div className={`min-h-screen transition-colors duration-700 ${theme.bg} ${theme.text}`}>
      <div className="mx-auto max-w-5xl px-4 py-8">
        {/* Header */}
        <header className="flex flex-col items-center justify-center gap-6 pb-8 md:flex-row md:justify-between">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight serif italic">Drink-ology</h1>
            <p className="mt-1 text-sm opacity-60">The science of the perfect sip.</p>
          </div>
          <div className={`relative flex items-center rounded-full p-1 shadow-inner transition-colors duration-700 ${theme.toggleBg}`}>
            <button onClick={() => setMode('cocktail')} className={`relative z-10 flex w-32 items-center justify-center gap-2 rounded-full py-2 text-sm font-medium transition-all duration-300 ${mode === 'cocktail' ? 'text-cocktail-950' : theme.toggleBtnInactive}`}>
              <Martini className="h-4 w-4" /> Cocktail
            </button>
            <button onClick={() => setMode('mocktail')} className={`relative z-10 flex w-32 items-center justify-center gap-2 rounded-full py-2 text-sm font-medium transition-all duration-300 ${mode === 'mocktail' ? 'text-white' : theme.toggleBtnInactive}`}>
              <Leaf className="h-4 w-4" /> Mocktail
            </button>
            <div className={`absolute top-1 bottom-1 w-32 rounded-full shadow-md transition-transform duration-500 ${theme.slider} ${mode === 'mocktail' ? 'translate-x-32' : 'translate-x-0'}`} />
          </div>
        </header>

        {/* Progress */}
        <div className={`h-1.5 w-full overflow-hidden rounded-full ${mode === 'mocktail' ? 'bg-black/5' : 'bg-white/10'}`}>
          <div className={`h-full transition-all duration-500 ease-out ${theme.progress}`} style={{ width: `${progress}%` }} />
        </div>

        <main className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-12 fade-in">
          <section className="md:col-span-8">
            {step < CONFIG.length ? (
              <CategoryCard
                cat={CONFIG[step]}
                stepIndex={step}
                totalSteps={CONFIG.length}
                options={optionsMap[CONFIG[step].key] || []}
                isSelected={(opt) => isSelected(CONFIG[step].key, opt)}
                onToggle={(opt) => toggle(CONFIG[step].key, opt)}
                onAddOther={(raw) => handleAddOther(CONFIG[step].key, raw)}
                onNext={() => setStep(s => Math.min(s + 1, CONFIG.length))}
                onPrev={step > 0 ? () => setStep(s => s - 1) : null}
                mode={mode}
                theme={theme}
              />
            ) : (
              <GenerateCard
                onGenerate={handleGenerate}
                results={results}
                onReset={() => { setStep(0); setResults([]); }}
                mode={mode}
                theme={theme}
              />
            )}
          </section>

          <Sidebar
            mode={mode}
            pantry={pantry}
            config={CONFIG}
            currentStep={step}
            onJumpTo={setStep}
            onGenerate={() => handleGenerate("", { classic: true, creative: true })}
            theme={theme}
          />
        </main>
      </div>
    </div>
  );
}
