import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { get, set, del } from 'idb-keyval';
import type { SessionData, EnvironmentalData, BoomLog } from '../types';

// Extend the session state with Bittern ID management
interface SessionState extends SessionData {
    // Existing actions
    setObserverId: (id: string) => void;
    setLocation: (lat: number, lon: number) => void;
    setSunsetTime: (time: string) => void;
    startSession: () => void;
    addEnvironmentalLog: (log: EnvironmentalData) => void;
    addBoomLog: (log: BoomLog) => void;
    updateBoomLog: (id: string, log: Partial<BoomLog>) => void;
    deleteBoomLog: (id: string) => void;
    endSession: () => void;
    resetSession: () => void;

    // Bittern ID state & actions
    bitternIds: string[];
    nextBitternId: number;
    addBitternId: (id: string) => void;
    incrementBitternId: () => void;
}

const initialState: SessionData = {
    observerId: '',
    sessionDate: new Date().toISOString().split('T')[0],
    stationLat: 0,
    stationLon: 0,
    sessionStartTime: '',
    sunsetTime: '',
    environmentalLogs: [],
    boomLogs: [],
    status: 'SETUP',
};

// Custom storage adapter for idb-keyval
const storage = {
    getItem: async (name: string): Promise<string | null> => {
        return (await get(name)) || null;
    },
    setItem: async (name: string, value: string): Promise<void> => {
        await set(name, value);
    },
    removeItem: async (name: string): Promise<void> => {
        await del(name);
    },
};

export const useSessionStore = create<SessionState>()(
    persist(
        (set) => ({
            ...initialState,
            // Existing actions
            setObserverId: (id) => set({ observerId: id }),
            setLocation: (lat, lon) => set({ stationLat: lat, stationLon: lon }),
            setSunsetTime: (time) => set({ sunsetTime: time }),
            startSession: () =>
                set({
                    status: 'ACTIVE',
                    sessionStartTime: new Date().toLocaleTimeString('en-GB', { hour12: false }),
                }),
            addEnvironmentalLog: (log) =>
                set((state) => ({ environmentalLogs: [...state.environmentalLogs, log] })),
            addBoomLog: (log) => set((state) => ({ boomLogs: [log, ...state.boomLogs] })),
            updateBoomLog: (id, updatedLog) =>
                set((state) => ({
                    boomLogs: state.boomLogs.map((log) => (log.id === id ? { ...log, ...updatedLog } : log)),
                })),
            deleteBoomLog: (id) =>
                set((state) => ({ boomLogs: state.boomLogs.filter((log) => log.id !== id) })),
            endSession: () => set({ status: 'FINISHED' }),
            resetSession: () => set({ ...initialState, sessionDate: new Date().toISOString().split('T')[0] }),

            // Bittern ID state & actions
            bitternIds: [] as string[],
            nextBitternId: 1,
            addBitternId: (id) => set((state) => ({ bitternIds: [...state.bitternIds, id] })),
            incrementBitternId: () => set((state) => ({ nextBitternId: state.nextBitternId + 1 })),
        }),
        {
            name: 'matuku-session-storage',
            storage: createJSONStorage(() => storage),
        }
    )
);
