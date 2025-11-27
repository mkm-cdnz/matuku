import React, { useEffect, useState } from 'react';
import { useSessionStore } from '../store/sessionStore';
import SunCalc from 'suncalc';
import type { EnvironmentalData } from '../types';
import { MapPin, Sun } from 'lucide-react';

export const SetupScreen: React.FC = () => {
    const {
        observerId, setObserverId,
        setLocation,
        setSunsetTime, startSession, addEnvironmentalLog
    } = useSessionStore();

    const [envData, setEnvData] = useState<Omit<EnvironmentalData, 'timestamp'>>({
        noiseLevel: 'Low',
        windStrength: 'Calm',
        moonVisibility: 'Not Visible',
        cloudCover: 'Clear (0-25%)',
        rainPresence: 'No Rain'
    });

    const [locationStatus, setLocationStatus] = useState<string>('Waiting for GPS...');

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setLocation(latitude, longitude);
                    setLocationStatus(`Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)}`);

                    const times = SunCalc.getTimes(new Date(), latitude, longitude);
                    const sunset = times.sunset.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
                    setSunsetTime(sunset);
                },
                (error) => {
                    setLocationStatus(`GPS Error: ${error.message}`);
                }
            );
        } else {
            setLocationStatus('Geolocation not supported');
        }
    }, [setLocation, setSunsetTime]);

    const handleStart = () => {
        if (!observerId) {
            alert('Please enter Observer ID');
            return;
        }

        addEnvironmentalLog({
            ...envData,
            timestamp: new Date().toLocaleTimeString('en-GB', { hour12: false })
        });
        startSession();
    };

    return (
        <div className="p-4 space-y-6 max-w-md mx-auto">
            <h1 className="text-2xl font-bold text-emerald-400">Session Setup</h1>

            <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">Observer ID</label>
                <input
                    type="text"
                    value={observerId}
                    onChange={(e) => setObserverId(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                    placeholder="Enter your name"
                />
            </div>

            <div className="bg-slate-800 p-4 rounded-lg space-y-2">
                <div className="flex items-center gap-2 text-slate-300">
                    <MapPin size={18} />
                    <span>{locationStatus}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                    <Sun size={18} />
                    <span>Sunset: {useSessionStore.getState().sunsetTime || '--:--'}</span>
                </div>
                {(locationStatus.startsWith('GPS Error') || locationStatus === 'Geolocation not supported') && (
                    <p className="text-sm text-amber-300">
                        GPS did not lock on, but you can still start logging and update coordinates in the CSV later if needed.
                    </p>
                )}
            </div>

            <div className="space-y-4">
                <h2 className="text-xl font-semibold text-slate-200">Environmental Conditions</h2>

                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Noise Level</label>
                    <select
                        value={envData.noiseLevel}
                        onChange={(e) => setEnvData({ ...envData, noiseLevel: e.target.value as any })}
                        className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                    >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium (Faraway calls may be missed)</option>
                        <option value="High">High</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Wind Strength</label>
                    <select
                        value={envData.windStrength}
                        onChange={(e) => setEnvData({ ...envData, windStrength: e.target.value as any })}
                        className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                    >
                        <option value="Calm">Calm</option>
                        <option value="Light">Light</option>
                        <option value="Moderate">Moderate</option>
                        <option value="Strong">Strong</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Moon Visibility</label>
                    <select
                        value={envData.moonVisibility}
                        onChange={(e) => setEnvData({ ...envData, moonVisibility: e.target.value as any })}
                        className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                    >
                        <option value="Visible">Visible</option>
                        <option value="Not Visible">Not Visible</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Cloud Cover</label>
                    <select
                        value={envData.cloudCover}
                        onChange={(e) => setEnvData({ ...envData, cloudCover: e.target.value as any })}
                        className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                    >
                        <option value="Clear (0-25%)">Clear (0-25%)</option>
                        <option value="Partially Cloudy (25-75%)">Partially Cloudy (25-75%)</option>
                        <option value="Overcast (75-100%)">Overcast (75-100%)</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Rain Presence</label>
                    <select
                        value={envData.rainPresence}
                        onChange={(e) => setEnvData({ ...envData, rainPresence: e.target.value as any })}
                        className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                    >
                        <option value="No Rain">No Rain</option>
                        <option value="Light Drizzle">Light Drizzle</option>
                        <option value="Rain">Rain</option>
                    </select>
                </div>
            </div>

            <button
                onClick={handleStart}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
            >
                Start Session
            </button>
        </div>
    );
};
