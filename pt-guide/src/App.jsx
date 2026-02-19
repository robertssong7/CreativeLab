import React, { useState, useRef } from 'react';
import { Activity, ShieldAlert, Stethoscope, ChevronRight, AlertTriangle, AlertCircle, RefreshCcw } from 'lucide-react';
import BodySilhouette from './components/BodySilhouette';
import StepHeader from './components/StepHeader';
import SeverityBadge from './components/SeverityBadge';
import { PAIN_QUALITIES, DURATION_OPTIONS, getRegionLabels, getRegionsForSide } from './data/config';
import { computeSeverity, makePlan, makeIssues, makeIssuePlan } from './utils/triage';

export default function App() {
  const [step, setStep] = useState(1);

  // State
  const [side, setSide] = useState('front');
  const [selectedRegions, setSelectedRegions] = useState(new Set());
  const [markers, setMarkers] = useState([]);
  const [intensity, setIntensity] = useState(5);
  const [duration, setDuration] = useState(DURATION_OPTIONS[0]);
  const [qualities, setQualities] = useState(new Set());
  const [notes, setNotes] = useState("");

  const areaRef = useRef(null);

  const totalSteps = 4;

  // Derived Calculations
  const severity = computeSeverity({ intensity, duration, qualities: Array.from(qualities), notes });
  const regionLabels = getRegionLabels('front', Array.from(selectedRegions)).concat(getRegionLabels('back', Array.from(selectedRegions))); // Simplified region gathering
  const plan = makePlan({ severity, regionLabels });
  const issues = makeIssues({ severity, regionLabels, notes, qualities: Array.from(qualities), duration, intensity });

  const activeRegion = Array.from(selectedRegions)[0]; // Focus on the first selected region for zoom

  const handleNext = () => setStep(s => Math.min(s + 1, totalSteps));
  const handleBack = () => setStep(s => Math.max(s - 1, 1));

  const toggleRegion = (id) => {
    const next = new Set(selectedRegions);
    // Enforce single selection style logic if users want "specific" focus for zoom,
    // although we allow multi-select, zoom targets the first one.
    // Ideally we clear markers if we change regions significantly?
    if (next.has(id)) next.delete(id);
    else {
      // Optional: clear others if we want single-select? 
      // User requested "granular... specific part selection".
      // Let's keep multi-select but just ensure zoom works.
      next.add(id);
    }
    setSelectedRegions(next);
    if (!next.has(activeRegion)) setMarkers([]); // Clear markers if active region removed
  };

  const handleRegionSelect = (id) => {
    // Revert to single selection behavior for better UX with Zoom/Pinpoint feature
    // or just add to set.
    // Let's force single selection for the main interaction to match the original "Pinpoint" flow perfectly.
    const next = new Set();
    next.add(id);
    setSelectedRegions(next);
    setMarkers([]);
  };

  const handleAreaClick = (e) => {
    if (!areaRef.current) return;
    const rect = areaRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMarkers(prev => [...prev, { x, y }]);
  };

  const toggleQuality = (q) => {
    const next = new Set(qualities);
    if (next.has(q)) next.delete(q);
    else next.add(q);
    setQualities(next);
  };

  function getZoomStyle(regionId) {
    if (!regionId) return "scale-100 origin-center";
    if (regionId.includes("head")) return "scale-[2.8] origin-[50%_5%]";
    if (regionId.includes("shoulder")) return "scale-[2.5] origin-[50%_20%]";
    if (regionId.includes("arm")) return "scale-[2.0] origin-[50%_35%]";
    if (regionId.includes("hand")) return "scale-[2.5] origin-[20%_45%]";
    if (regionId.includes("torso")) return "scale-[2.2] origin-[50%_30%]";
    if (regionId.includes("hip")) return "scale-[2.4] origin-[50%_48%]";
    if (regionId.includes("upper-leg")) return "scale-[2.4] origin-[50%_65%]";
    if (regionId.includes("lower-leg")) return "scale-[2.8] origin-[50%_105%]";
    return "scale-150 origin-center";
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      <div className="mx-auto max-w-4xl px-6 py-12 md:py-20">
        {/* Header Logo */}
        <div className="mb-12 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-200">
            <Activity className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">PT Guide</h1>
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Digital Clinician</p>
          </div>
        </div>

        {/* Main Card */}
        <div className="relative overflow-hidden rounded-3xl bg-white shadow-xl shadow-slate-200/50 ring-1 ring-slate-100">
          <div className="p-8 md:p-10">

            {/* STEP 1: Location */}
            {step === 1 && (
              <div className="animate-fadeIn">
                <StepHeader
                  step={1} totalSteps={totalSteps}
                  title="Where does it hurt?"
                  subtitle="Select a region, then tap the specific spot to mark pain."
                />

                <div className="grid md:grid-cols-2 gap-12 mt-8">
                  {/* Left Col: Region Select */}
                  <div>
                    <h3 className="text-sm font-semibold text-slate-700 mb-4 text-center uppercase tracking-wide">1. Select Region</h3>
                    <div className="flex flex-col items-center">
                      <div className="relative mb-6">
                        <div className="w-48 h-80 bg-slate-50 rounded-3xl flex flex-col items-center justify-center border border-slate-200 shadow-inner">
                          <div className="w-32 h-64 flex items-center justify-center relative">
                            <BodySilhouette side={side} selected={selectedRegions} />
                          </div>
                        </div>
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1 bg-white rounded-full shadow-md border border-slate-200 p-1">
                          <button onClick={() => setSide("front")} className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all ${side === "front" ? "bg-slate-800 text-white shadow-sm" : "text-slate-500 hover:text-slate-800"}`}>Front</button>
                          <button onClick={() => setSide("back")} className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all ${side === "back" ? "bg-slate-800 text-white shadow-sm" : "text-slate-500 hover:text-slate-800"}`}>Back</button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 w-full max-w-xs">
                        {getRegionsForSide(side).map(r => (
                          <button
                            key={r.id}
                            onClick={() => handleRegionSelect(r.id)}
                            className={`text-xs py-2.5 px-3 rounded-lg border text-left transition-all ${selectedRegions.has(r.id) ? "border-blue-600 bg-blue-50 text-blue-800 font-bold shadow-sm ring-1 ring-blue-200" : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"}`}
                          >
                            {r.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Col: Pinpoint */}
                  <div className="flex flex-col border-t md:border-t-0 md:border-l border-slate-100 pt-8 md:pt-0 md:pl-12 min-h-[400px]">
                    <h3 className="text-sm font-semibold text-slate-700 mb-4 text-center uppercase tracking-wide">2. Pinpoint Spot</h3>

                    {!activeRegion ? (
                      <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-slate-50 rounded-3xl border border-dashed border-slate-300 w-full">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-3">
                          <AlertCircle className="w-6 h-6 text-slate-300" />
                        </div>
                        <p className="text-sm text-slate-500">Select a region on the left to activate the zoomed view.</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center w-full animate-zoomIn">
                        <div className="relative group">
                          <div className="absolute -inset-4 bg-blue-100/50 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition duration-500"></div>
                          <div
                            ref={areaRef}
                            onClick={handleAreaClick}
                            className="relative w-56 h-80 rounded-3xl bg-white border-2 border-blue-100 shadow-xl cursor-crosshair overflow-hidden"
                          >
                            <div className="absolute inset-0 flex items-center justify-center opacity-80 pointer-events-none">
                              <div className={`w-full h-full transform transition-transform duration-500 ease-in-out flex items-center justify-center ${getZoomStyle(activeRegion)}`}>
                                <BodySilhouette side={side} selected={selectedRegions} />
                              </div>
                            </div>
                            {markers.map((m, idx) => (
                              <div key={idx} className="absolute w-4 h-4 -ml-2 -mt-2 rounded-full bg-rose-500 shadow-md ring-2 ring-white animate-bounce-short" style={{ left: `${m.x}%`, top: `${m.y}%` }} />
                            ))}
                            <div className="absolute bottom-3 left-0 right-0 text-center pointer-events-none">
                              <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-slate-500 border shadow-sm">Tap to mark pain</span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-8 flex flex-col items-center w-full gap-4">
                          <div className="text-center">
                            <p className="text-sm font-bold text-slate-900">{getRegionLabels(side, [activeRegion])[0]}</p>
                            <p className="text-xs text-slate-500 mt-1">{markers.length > 0 ? "Pain point marked" : "Tap diagram to mark exact spot"}</p>
                          </div>

                          <button
                            onClick={() => setMarkers([])}
                            disabled={markers.length === 0}
                            className={`text-xs font-medium underline ${markers.length === 0 ? "text-slate-300 cursor-not-allowed" : "text-slate-500 hover:text-slate-800"}`}
                          >
                            Clear markers
                          </button>

                          <button
                            disabled={markers.length === 0}
                            onClick={handleNext}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-8 py-3 font-bold text-white shadow-lg shadow-slate-200 transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-800"
                          >
                            Continue <ChevronRight className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Details */}
            {step === 2 && (
              <div className="animate-fadeIn">
                <StepHeader
                  step={2} totalSteps={totalSteps}
                  title="Pain Profile"
                  subtitle="Help us understand the nature of your symptoms."
                  onBack={handleBack}
                />

                <div className="space-y-8">
                  {/* Intensity */}
                  <div>
                    <div className="mb-4 flex items-center justify-between">
                      <label className="text-sm font-bold uppercase tracking-wide text-slate-500">Intensity (0-10)</label>
                      <span className={`text-lg font-bold ${intensity >= 7 ? 'text-red-500' : 'text-slate-700'}`}>{intensity}</span>
                    </div>
                    <input
                      type="range" min="0" max="10"
                      value={intensity} onChange={e => setIntensity(parseInt(e.target.value))}
                      className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-100 accent-blue-600"
                    />
                    <div className="mt-2 flex justify-between text-xs font-medium text-slate-400">
                      <span>No Pain</span>
                      <span>Moderate</span>
                      <span>Severe</span>
                    </div>
                  </div>

                  {/* Duration */}
                  <div>
                    <label className="mb-3 block text-sm font-bold uppercase tracking-wide text-slate-500">Duration</label>
                    <div className="grid grid-cols-2 gap-3">
                      {DURATION_OPTIONS.map(opt => (
                        <button
                          key={opt}
                          onClick={() => setDuration(opt)}
                          className={`rounded-xl border px-4 py-3 text-sm font-medium transition-all ${duration === opt ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm' : 'border-slate-200 hover:border-slate-300 text-slate-600'}`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Qualities */}
                  <div>
                    <label className="mb-3 block text-sm font-bold uppercase tracking-wide text-slate-500">Qualities</label>
                    <div className="flex flex-wrap gap-2">
                      {PAIN_QUALITIES.map(q => (
                        <button
                          key={q}
                          onClick={() => toggleQuality(q)}
                          className={`rounded-full border px-4 py-2 text-xs font-bold transition-all ${qualities.has(q) ? 'border-blue-600 bg-blue-600 text-white shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300 text-slate-600'}`}
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-10 flex justify-end">
                  <button onClick={handleNext} className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-md shadow-blue-200 transition-transform active:scale-95">
                    Next Step <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Notes */}
            {step === 3 && (
              <div className="animate-fadeIn">
                <StepHeader
                  step={3} totalSteps={totalSteps}
                  title="Specific Context"
                  subtitle="Add any Red Flag keywords (e.g., 'night pain', 'numbness', 'fall')."
                  onBack={handleBack}
                />

                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="E.g., It hurts when I walk down stairs. I felt a pop. It wakes me up at night..."
                  className="h-40 w-full rounded-2xl border-0 bg-slate-50 p-4 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-600 resize-none font-medium"
                />

                <div className="mt-8 flex justify-end">
                  <button onClick={handleNext} className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-md shadow-blue-200 transition-transform active:scale-95">
                    Analyze <Stethoscope className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: Results */}
            {step === 4 && (
              <div className="animate-fadeIn -m-8 md:-m-10">
                {/* Header Results */}
                <div className={`px-8 pt-10 pb-16 md:px-10 ${severity === 'orange' ? 'bg-orange-50' : severity === 'yellow' ? 'bg-yellow-50' : 'bg-green-50'}`}>
                  <div className="mb-6">
                    <SeverityBadge severity={severity} />
                  </div>
                  <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">{plan.title}</h2>
                  <p className="text-slate-600 leading-relaxed max-w-lg">{plan.steps[0]}</p>
                </div>

                {/* Content Results */}
                <div className="px-8 pb-10 -mt-8 md:px-10 relative">
                  {/* Action Plan Card */}
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-8">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4">Immediate Steps</h3>
                    <ul className="space-y-3">
                      {plan.steps.slice(1).map((s, i) => (
                        <li key={i} className="flex gap-3 text-slate-700 text-sm leading-relaxed">
                          <div className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${severity === 'orange' ? 'bg-orange-500' : 'bg-blue-500'}`} />
                          <span dangerouslySetInnerHTML={{ __html: s.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Issues Analysis */}
                  {issues.length > 0 && (
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4">Analysis</h3>
                      <div className="space-y-4">
                        {issues.map((issue) => (
                          <div key={issue.id} className="rounded-xl border border-slate-200 bg-slate-50/50 p-5 transition-all hover:bg-white hover:shadow-md">
                            <div className="mb-2 flex items-center justify-between">
                              <h4 className="font-bold text-slate-900">{issue.title}</h4>
                              <span className="rounded bg-slate-200 px-2 py-1 text-[10px] font-bold text-slate-600">{issue.confidence}% Match</span>
                            </div>
                            <p className="mb-4 text-sm text-slate-600">{issue.description}</p>

                            {/* Specific Remedy */}
                            {makeIssuePlan({ issueId: issue.id, regionLabels, severity }).length > 0 && (
                              <div className="rounded-lg bg-blue-50 p-3 text-xs text-blue-900">
                                <span className="font-bold">Try this:</span> {issue.remedyShort}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-12 flex justify-center">
                    <button onClick={() => setStep(1)} className="text-sm font-semibold text-slate-400 hover:text-blue-600 transition-colors">
                      Start Over
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
