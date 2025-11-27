import React, { useMemo, useState } from 'react';
import type { BoomLog } from '../types';
import { Compass, Ruler, Hash, Bird, PlusCircle } from 'lucide-react';
import { CompassDial, getDirectionLabel } from './CompassDial';
import { useSessionStore } from '../store/sessionStore';

interface BoomLogFormProps {
    initialData?: Partial<BoomLog>;
    onSubmit: (data: Partial<BoomLog>) => void;
    onCancel: () => void;
}

export const BoomLogForm: React.FC<BoomLogFormProps> = ({ initialData, onSubmit, onCancel }) => {
    const {
        bitternIds,
        nextBitternId,
        lastSelectedBitternId,
        selectBitternId,
        boomLogs,
    } = useSessionStore();

    const defaultBitternId = initialData?.bitternId || lastSelectedBitternId || bitternIds[bitternIds.length - 1] || `B${Math.max(1, nextBitternId)}`;
    const [boomCount, setBoomCount] = useState(initialData?.boomCount || 1);
    const [compassBearing, setCompassBearing] = useState(initialData?.compassBearing || 0);
    const [estDistanceM, setEstDistanceM] = useState(initialData?.estDistanceM || 100);
    const [bitternId, setBitternId] = useState(defaultBitternId);

    const handleSelectBittern = (id: string) => {
        setBitternId(id);
        if (id.trim()) {
            selectBitternId(id.trim());
        }
    };

    const availableBitterns = useMemo(() => {
        const merged = new Set([...bitternIds, bitternId].filter(Boolean));
        return Array.from(merged).sort((a, b) => {
            const aNum = parseInt(a.replace(/\D/g, ''), 10) || 0;
            const bNum = parseInt(b.replace(/\D/g, ''), 10) || 0;
            return aNum - bNum;
        });
    }, [bitternId, bitternIds]);

    const bitternDirections = useMemo(() => {
        const latestForId: Record<string, number> = {};
        boomLogs.forEach((log) => {
            if (log.bitternId && latestForId[log.bitternId] === undefined) {
                latestForId[log.bitternId] = log.compassBearing;
            }
        });
        return latestForId;
    }, [boomLogs]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            boomCount,
            compassBearing,
            estDistanceM,
            bitternId
        });
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
            <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-700 rounded-xl p-6 w-full max-w-2xl space-y-6">
                <h2 className="text-xl font-bold text-white mb-4">Log Boom Details</h2>

                {/* Boom Count */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-slate-300 font-medium">
                        <div className="flex items-center gap-2">
                            <Hash size={18} /> <span>Boom Count</span>
                        </div>
                        <span className="text-xs text-slate-500">Tap or hold for haptic-like feedback</span>
                    </div>
                    <div className="flex items-center gap-4 justify-between">
                        <button
                            type="button"
                            onClick={() => setBoomCount(Math.max(1, boomCount - 1))}
                            className="w-16 h-16 rounded-full bg-slate-800 border border-slate-600 text-3xl text-white flex items-center justify-center active:bg-slate-700 active:translate-y-0.5 active:scale-95 shadow-lg shadow-black/30"
                        >
                            -
                        </button>
                        <span className="text-4xl font-bold text-white w-16 text-center">{boomCount}</span>
                        <button
                            type="button"
                            onClick={() => setBoomCount(boomCount + 1)}
                            className="w-16 h-16 rounded-full bg-slate-800 border border-slate-600 text-3xl text-white flex items-center justify-center active:bg-slate-700 active:translate-y-0.5 active:scale-95 shadow-lg shadow-black/30"
                        >
                            +
                        </button>
                    </div>
                </div>

                {/* Bearing */}
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-slate-300 font-medium">
                        <Compass size={18} /> Bearing (Degrees)
                    </label>
                    <div className="grid lg:grid-cols-2 gap-4">
                        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3">
                            <CompassDial value={compassBearing} onChange={setCompassBearing} />
                        </div>
                        <div className="flex flex-col justify-between gap-4">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-slate-300">
                                    <span className="font-medium">Selected</span>
                                    <span className="text-sm text-indigo-200 font-semibold">{getDirectionLabel(compassBearing)}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="number"
                                        min={0}
                                        max={360}
                                        step={10}
                                        value={compassBearing}
                                        onChange={(e) => setCompassBearing(Math.min(360, Math.max(0, Number(e.target.value))))}
                                        className="w-28 bg-slate-800 border border-slate-700 rounded p-2 text-white text-center"
                                    />
                                    <span className="text-slate-400">degrees</span>
                                </div>
                            </div>
                            <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-3 text-sm text-slate-300">
                                <p className="font-semibold text-slate-200 mb-1">Compass dial tips</p>
                                <ul className="list-disc list-inside space-y-1 text-slate-400">
                                    <li>Drag the red handle or tap the dial to snap to 10° increments.</li>
                                    <li>Arrow keys nudge by 10° when focused.</li>
                                    <li>Cardinal/intercardinal labels update for nearby values.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Distance */}
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-slate-300 font-medium">
                        <Ruler size={18} /> Est. Distance (m)
                    </label>
                    <input
                        type="number"
                        value={estDistanceM}
                        onChange={(e) => setEstDistanceM(Number(e.target.value))}
                        className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                        step="10"
                    />
                </div>

                {/* Bittern ID */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between text-slate-300 font-medium">
                        <div className="flex items-center gap-2">
                            <Bird size={18} /> Bittern ID
                        </div>
                        <button
                            type="button"
                            onClick={() => {
                                const highest = bitternIds.reduce((max, id) => {
                                    const match = id.match(/B(\d+)/i);
                                    return Math.max(max, match ? parseInt(match[1], 10) : 0);
                                }, 0);
                                const nextId = `B${Math.max(highest + 1, nextBitternId)}`;
                                handleSelectBittern(nextId);
                            }}
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 text-emerald-200 border border-slate-700 hover:bg-slate-700"
                        >
                            <PlusCircle size={16} /> New bird
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {availableBitterns.map((id) => {
                            const direction = bitternDirections[id];
                            return (
                                <button
                                    key={id}
                                    type="button"
                                    onClick={() => handleSelectBittern(id)}
                                    className={`px-3 py-2 rounded-full border text-sm flex items-center gap-2 transition ${
                                        bitternId === id
                                            ? 'bg-emerald-600/20 text-emerald-200 border-emerald-500'
                                            : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
                                    }`}
                                >
                                    <span className="font-semibold">{id}</span>
                                    <span className="text-xs text-slate-400">({direction ? getDirectionLabel(direction) : '—'})</span>
                                </button>
                            );
                        })}
                    </div>
                    <input
                        type="text"
                        value={bitternId}
                        onChange={(e) => handleSelectBittern(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                        placeholder="e.g. B1"
                    />
                </div>

                <div className="flex gap-3 pt-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 py-3 px-4 rounded-lg border border-slate-600 text-slate-300 font-medium hover:bg-slate-800"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="flex-1 py-3 px-4 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-700"
                    >
                        Save Log
                    </button>
                </div>
            </form>
        </div>
    );
};
