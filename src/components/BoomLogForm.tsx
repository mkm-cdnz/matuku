import React, { useState } from 'react';
import type { BoomLog } from '../types';
import { Compass, Ruler, Hash, Bird } from 'lucide-react';

interface BoomLogFormProps {
    initialData?: Partial<BoomLog>;
    onSubmit: (data: Partial<BoomLog>) => void;
    onCancel: () => void;
}

export const BoomLogForm: React.FC<BoomLogFormProps> = ({ initialData, onSubmit, onCancel }) => {
    const [boomCount, setBoomCount] = useState(initialData?.boomCount || 1);
    const [compassBearing, setCompassBearing] = useState(initialData?.compassBearing || 0);
    const [estDistanceM, setEstDistanceM] = useState(initialData?.estDistanceM || 100);
    const [bitternId, setBitternId] = useState(initialData?.bitternId || '');

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
            <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-700 rounded-xl p-6 w-full max-w-md space-y-6">
                <h2 className="text-xl font-bold text-white mb-4">Log Boom Details</h2>

                {/* Boom Count */}
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-slate-300 font-medium">
                        <Hash size={18} /> Boom Count
                    </label>
                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            onClick={() => setBoomCount(Math.max(1, boomCount - 1))}
                            className="w-12 h-12 rounded-full bg-slate-800 border border-slate-600 text-2xl text-white flex items-center justify-center active:bg-slate-700"
                        >
                            -
                        </button>
                        <span className="text-3xl font-bold text-white w-12 text-center">{boomCount}</span>
                        <button
                            type="button"
                            onClick={() => setBoomCount(boomCount + 1)}
                            className="w-12 h-12 rounded-full bg-slate-800 border border-slate-600 text-2xl text-white flex items-center justify-center active:bg-slate-700"
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
                    <div className="flex items-center gap-4">
                        <input
                            type="range"
                            min="0"
                            max="360"
                            value={compassBearing}
                            onChange={(e) => setCompassBearing(Number(e.target.value))}
                            className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                        />
                        <input
                            type="number"
                            value={compassBearing}
                            onChange={(e) => setCompassBearing(Number(e.target.value))}
                            className="w-20 bg-slate-800 border border-slate-700 rounded p-2 text-white text-center"
                        />
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
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-slate-300 font-medium">
                        <Bird size={18} /> Bittern ID (Optional)
                    </label>
                    <input
                        type="text"
                        value={bitternId}
                        onChange={(e) => setBitternId(e.target.value)}
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
