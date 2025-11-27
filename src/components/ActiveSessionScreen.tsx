import React, { useState, useEffect } from 'react';
import { useSessionStore } from '../store/sessionStore';
import { BoomLogForm } from './BoomLogForm';
import type { BoomLog } from '../types';
import { Clock, Mic, Trash2, Edit2 } from 'lucide-react';
import { generateCsv } from '../utils/csvExport';

export const ActiveSessionScreen: React.FC = () => {
    const {
        boomLogs,
        addBoomLog,
        updateBoomLog,
        deleteBoomLog,
        endSession,
        sessionStartTime,
        sessionDate,
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

    const handleLogBoom = () => {
        const now = new Date();
        const timestamp = now.toLocaleTimeString('en-GB', { hour12: false });
        const newLog: BoomLog = {
            id: crypto.randomUUID(),
            callTimestamp: timestamp,
            boomCount: 1,
            compassBearing: 0,
            estDistanceM: 100,
            bitternId: ''
        };
        addBoomLog(newLog);
        setEditingLogId(newLog.id);
    };

    const handleSaveLog = (data: Partial<BoomLog>) => {
        if (editingLogId) {
            updateBoomLog(editingLogId, data);
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
                className="w-full aspect-square rounded-full bg-emerald-600 hover:bg-emerald-500 active:scale-95 transition-all flex flex-col items-center justify-center shadow-lg shadow-emerald-900/50 mb-8"
            >
                <Mic size={64} className="text-white mb-2" />
                <span className="text-2xl font-bold text-white">LOG BOOM</span>
                <span className="text-emerald-200 text-sm">Tap immediately</span>
            </button>

            <div className="flex-1 overflow-y-auto space-y-3">
                <h3 className="text-slate-400 font-medium border-b border-slate-800 pb-2">Recent Logs</h3>
                {boomLogs.length === 0 && (
                    <div className="text-center text-slate-600 py-8">No booms logged yet</div>
                )}
                {boomLogs.map((log) => (
                    <div key={log.id} className="bg-slate-800 p-3 rounded-lg flex justify-between items-center border border-slate-700">
                        <div>
                            <div className="text-xl font-bold text-white">{log.callTimestamp}</div>
                            <div className="text-slate-400 text-sm">
                                {log.boomCount} booms • {log.compassBearing}° • {log.estDistanceM}m
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setEditingLogId(log.id)}
                                className="p-2 text-slate-400 hover:text-white bg-slate-700 rounded"
                            >
                                <Edit2 size={18} />
                            </button>
                            <button
                                onClick={() => {
                                    if (confirm('Delete this log?')) deleteBoomLog(log.id);
                                }}
                                className="p-2 text-red-400 hover:text-red-300 bg-slate-700 rounded"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}
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
