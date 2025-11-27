import React from 'react';
import { useSessionStore } from '../store/sessionStore';

export const HistoryView: React.FC = () => {
    const {
        boomLogs,
        environmentalLogs,
        observerId,
        sessionDate,
        stationLat,
        stationLon,
        sunsetTime,
    } = useSessionStore();

    return (
        <div className="p-4 space-y-4 max-w-md mx-auto">
            <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 space-y-1">
                <h2 className="text-lg font-semibold text-emerald-400">Session Overview</h2>
                <p className="text-slate-200">Observer: {observerId || 'Not set'}</p>
                <p className="text-slate-200">Date: {sessionDate}</p>
                <p className="text-slate-200">Location: {stationLat.toFixed(4)}, {stationLon.toFixed(4)}</p>
                <p className="text-slate-200">Sunset: {sunsetTime || '--:--'}</p>
            </div>

            <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                <h3 className="text-md font-semibold text-slate-100 mb-2">Environmental Logs</h3>
                {environmentalLogs.length === 0 && (
                    <p className="text-slate-500 text-sm">No environmental logs recorded yet.</p>
                )}
                <ul className="space-y-2">
                    {environmentalLogs.map((env) => (
                        <li key={env.timestamp} className="bg-slate-900/50 p-3 rounded border border-slate-700 text-sm text-slate-200">
                            <div className="font-semibold text-white">{env.timestamp}</div>
                            <div className="grid grid-cols-2 gap-1 text-slate-300 mt-1">
                                <span>Noise: {env.noiseLevel}</span>
                                <span>Wind: {env.windStrength}</span>
                                <span>Moon: {env.moonVisibility}</span>
                                <span>Cloud: {env.cloudCover}</span>
                                <span>Rain: {env.rainPresence}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                <h3 className="text-md font-semibold text-slate-100 mb-2">Boom Logs</h3>
                {boomLogs.length === 0 && (
                    <p className="text-slate-500 text-sm">No boom logs recorded yet.</p>
                )}
                <ul className="space-y-2">
                    {boomLogs.map((boom) => (
                        <li key={boom.id} className="bg-slate-900/50 p-3 rounded border border-slate-700 text-sm text-slate-200">
                            <div className="flex justify-between items-center">
                                <span className="font-semibold text-white">{boom.callTimestamp}</span>
                                <span className="text-xs text-slate-400">Bittern ID: {boom.bitternId || 'n/a'}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-1 mt-1 text-slate-300">
                                <span>{boom.boomCount} booms</span>
                                <span>{boom.compassBearing}°</span>
                                <span>{boom.estDistanceM} m</span>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};
