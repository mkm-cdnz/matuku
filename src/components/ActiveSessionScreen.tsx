import React, { useState, useEffect } from 'react';
import { useSessionStore } from '../store/sessionStore';
import { BoomLogForm } from './BoomLogForm';
import type { BoomLog } from '../types';
import { Clock, Mic } from 'lucide-react';
import { generateCsv } from '../utils/csvExport';

type ActiveSessionScreenProps = {
    onShowRecent?: () => void;
};

export const ActiveSessionScreen: React.FC<ActiveSessionScreenProps> = ({ onShowRecent }) => {
    const {
        boomLogs,
        addBoomLog,
        updateBoomLog,
        endSession,
        sessionStartTime,
        sessionDate,
        bitternIds,
        nextBitternId,
        lastSelectedBitternId,
        selectBitternId,
    } = useSessionStore();

    const [elapsedTime, setElapsedTime] = useState(0);
    const [editingLogId, setEditingLogId] = useState<string | null>(null);

    useEffect(() => {
        const start = new Date(`${sessionDate}T${sessionStartTime || '00:00:00'}`);
        const startMs = isNaN(start.getTime()) ? Date.now() : start.getTime();

        const calculateElapsed = () => Math.max(0, Math.floor((Date.now() - startMs) / 1000));

        setElapsedTime(calculateElapsed());

        const interval = setInterval(() => {
            setElapsedTime(calculateElapsed());
        }, 1000);
        return () => clearInterval(interval);
    }, [sessionDate, sessionStartTime]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const resolveDefaultBitternId = () => {
        if (lastSelectedBitternId) return lastSelectedBitternId;
        if (bitternIds.length > 0) return bitternIds[bitternIds.length - 1];
        return `B${Math.max(1, nextBitternId)}`;
    };

    const handleLogBoom = () => {
        const now = new Date();
        const timestamp = now.toLocaleTimeString('en-GB', { hour12: false });
        const defaultBitternId = resolveDefaultBitternId();
        selectBitternId(defaultBitternId);
        const newLog: BoomLog = {
            id: crypto.randomUUID(),
            callTimestamp: timestamp,
            boomCount: 1,
            compassBearing: 0,
            estDistanceM: 100,
            bitternId: defaultBitternId,
        };
        addBoomLog(newLog);
        setEditingLogId(newLog.id);
    };

    const handleSaveLog = (data: Partial<BoomLog>) => {
        if (editingLogId) {
            updateBoomLog(editingLogId, data);
            if (data.bitternId) {
                selectBitternId(data.bitternId);
            }
            setEditingLogId(null);
        }
    };

    const handleExport = () => {
        const csv = generateCsv(useSessionStore.getState());
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `matuku_session_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        endSession();
    };

    return (
        <div className="p-4 flex flex-col h-screen max-w-md mx-auto">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2 text-emerald-400">
                    <Clock size={20} />
                    <span className="text-xl font-mono font-bold">{formatTime(elapsedTime)}</span>
                </div>
                <button
                    onClick={handleExport}
                    className="bg-slate-800 text-slate-300 px-3 py-1 rounded border border-slate-700 text-sm"
                >
                    End & Export
                </button>
            </div>

            <button
                onClick={handleLogBoom}
                className="w-full aspect-square rounded-full bg-emerald-600 hover:bg-emerald-500 active:scale-95 transition-all flex flex-col items-center justify-center shadow-lg shadow-emerald-900/50 mb-6"
            >
                <Mic size={64} className="text-white mb-2" />
                <span className="text-2xl font-bold text-white">LOG BOOM</span>
                <span className="text-emerald-200 text-sm">Tap immediately</span>
            </button>

            <div className="flex-1 flex flex-col gap-4">
                <div className="bg-slate-900/60 rounded-xl border border-slate-800 p-4 text-center shadow-inner">
                    <p className="text-slate-200 text-lg font-semibold">Recent Logs</p>
                    <p className="text-slate-500 text-sm mt-1">Open the Recent Logs tab to review, edit, or delete entries.</p>
                    <button
                        onClick={onShowRecent}
                        className="mt-3 inline-flex items-center justify-center px-4 py-2 rounded-lg bg-slate-800 text-emerald-200 border border-slate-700 hover:bg-slate-700 transition"
                    >
                        Go to Recent Logs
                    </button>
                </div>

                <div className="bg-slate-900/60 rounded-xl border border-slate-800 p-4">
                    <h4 className="text-slate-300 font-semibold mb-2">Latest entry</h4>
                    {boomLogs.length === 0 ? (
                        <p className="text-slate-600 text-sm">No booms logged yet.</p>
                    ) : (
                        <div className="flex items-center justify-between text-slate-200 bg-slate-800 rounded-lg p-3">
                            <div>
                                <div className="text-lg font-bold text-white">{boomLogs[0].callTimestamp}</div>
                                <div className="text-slate-400 text-sm">
                                    {boomLogs[0].boomCount} booms • {boomLogs[0].compassBearing}° • {boomLogs[0].estDistanceM}m
                                </div>
                            </div>
                            <button
                                onClick={() => setEditingLogId(boomLogs[0].id)}
                                className="px-3 py-2 rounded-lg bg-slate-700 text-slate-100 hover:bg-slate-600"
                            >
                                Edit
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {editingLogId && (
                <BoomLogForm
                    initialData={boomLogs.find(l => l.id === editingLogId)}
                    onSubmit={handleSaveLog}
                    onCancel={() => setEditingLogId(null)}
                />
            )}
        </div>
    );
};
