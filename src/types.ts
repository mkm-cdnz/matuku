export type EnvironmentalData = {
    timestamp: string; // HH:MM:SS
    noiseLevel: 'Low' | 'Medium' | 'High';
    windStrength: 'Calm' | 'Light' | 'Moderate' | 'Strong';
    moonVisibility: 'Visible' | 'Not Visible';
    cloudCover: 'Clear (0-25%)' | 'Partially Cloudy (25-75%)' | 'Overcast (75-100%)';
    rainPresence: 'No Rain' | 'Light Drizzle' | 'Rain';
};

export type BoomLog = {
    id: string;
    callTimestamp: string; // HH:MM:SS
    boomCount: number;
    compassBearing: number;
    estDistanceM: number;
    bitternId: string;
};

export type SessionData = {
    observerId: string;
    sessionDate: string;
    stationLat: number;
    stationLon: number;
    sessionStartTime: string;
    sunsetTime: string;
    environmentalLogs: EnvironmentalData[];
    boomLogs: BoomLog[];
    status: 'SETUP' | 'ACTIVE' | 'FINISHED';
};
