import React, { useMemo, useState } from 'react';
import { useSessionStore } from '../store/sessionStore';
import { BoomLogForm } from './BoomLogForm';
import { getDirectionLabel } from './CompassDial';
import { Edit2, Trash2 } from 'lucide-react';
import type { BoomLog } from '../types';

export const RecentLogsView: React.FC = () => {
    const { boomLogs, deleteBoomLog, updateBoomLog, selectBitternId } = useSessionStore();
    const [editingId, setEditingId] = useState<string | null>(null);

    const handleSave = (data: Partial<BoomLog>) => {
        if (editingId) {
            updateBoomLog(editingId, data);
            if (data.bitternId) {
                selectBitternId(data.bitternId);
            }
            setEditingId(null);
        }
    };

    const rows = useMemo(() => boomLogs, [boomLogs]);

    return (
        <div className="p-4 space-y-3 max-w-3xl mx-auto">
            <div className="flex items-baseline justify-between">
                <h2 className="text-xl font-semibold text-emerald-400">Recent Logs</h2>
                <p className="text-slate-500 text-sm">Tap an item to edit or delete.</p>
            </div>

            {rows.length === 0 && (
                <div className="text-center text-slate-500 py-8 bg-slate-900/60 rounded-xl border border-slate-800">
                    No booms logged yet.
                </div>
            )}

            <div className="space-y-3">
                {rows.map((log) => (
                    <div key={log.id} className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 shadow-lg shadow-black/10">
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <div className="text-lg font-bold text-white">{log.callTimestamp}</div>
                                <div className="text-slate-400 text-sm">Bittern: {log.bitternId || '—'} | Bearing: {log.compassBearing}° ({getDirectionLabel(log.compassBearing)})</div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setEditingId(log.id)}
                                    className="px-3 py-2 rounded-lg bg-slate-800 text-slate-100 hover:bg-slate-700 flex items-center gap-1"
                                >
                                    <Edit2 size={16} />
                                    Edit
                                </button>
                                <button
                                    onClick={() => {
                                        if (confirm('Delete this log?')) deleteBoomLog(log.id);
                                    }}
                                    className="px-3 py-2 rounded-lg bg-red-500/10 text-red-300 border border-red-700/60 hover:bg-red-500/20 flex items-center gap-1"
                                >
                                    <Trash2 size={16} />
                                    Delete
                                </button>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-3 mt-3 text-sm text-slate-200">
                            <div className="bg-slate-800/70 rounded-lg p-2 border border-slate-700">
                                <div className="text-xs text-slate-400">Booms</div>
                                <div className="text-lg font-semibold text-white">{log.boomCount}</div>
                            </div>
                            <div className="bg-slate-800/70 rounded-lg p-2 border border-slate-700">
                                <div className="text-xs text-slate-400">Bearing</div>
                                <div className="text-lg font-semibold text-white">{log.compassBearing}°</div>
                            </div>
                            <div className="bg-slate-800/70 rounded-lg p-2 border border-slate-700">
                                <div className="text-xs text-slate-400">Est. Distance</div>
                                <div className="text-lg font-semibold text-white">{log.estDistanceM} m</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {editingId && (
                <BoomLogForm
                    initialData={rows.find((item) => item.id === editingId)}
                    onSubmit={handleSave}
                    onCancel={() => setEditingId(null)}
                />
            )}
        </div>
    );
};

