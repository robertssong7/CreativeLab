import { useState } from 'react';
import { normalize } from '../utils/helpers';

export function usePantryState(mode) {
    const [pantry, setPantry] = useState({});

    const toggle = (key, item) => {
        const norm = normalize(item);
        setPantry(prev => {
            const prevSet = prev[key] || new Set();
            const nextSet = new Set(prevSet);
            if (nextSet.has(norm)) nextSet.delete(norm);
            else nextSet.add(norm);
            return { ...prev, [key]: nextSet };
        });
    };

    const isSelected = (key, displayedOption) => {
        const norm = normalize(displayedOption);
        return pantry[key]?.has(norm) || false;
    };

    const reset = () => setPantry({});
    return { pantry, toggle, isSelected, reset };
}

export function flattenPantry(pantry) {
    const all = new Set();
    Object.values(pantry).forEach(set => set.forEach(v => all.add(v)));
    return all;
}
