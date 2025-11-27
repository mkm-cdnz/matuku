import type { SessionData } from '../types';

export const generateCsv = (session: SessionData): string => {
    const headers = [
        'Observer_ID',
        'Session_Date',
        'Station_Lat',
        'Station_Lon',
        'Session_Start_Time',
        'Sunset_Time',
        'Env_Timestamp',
        'Noise_Level',
        'Wind_Strength',
        'Moon_Visibility',
        'Cloud_Cover',
        'Rain_Presence',
        'Call_Timestamp',
        'Boom_Count',
        'Compass_Bearing',
        'Est_Distance_M',
        'Bittern_ID'
    ].join(',');

    const rows: string[] = [];

    // We need to flatten the data. 
    // The requirements imply a single CSV.
    // Usually this means repeating session data for every row.
    // And maybe mixing env logs and boom logs?
    // Or maybe just listing boom logs with session data attached?
    // The schema in 5.1, 5.2, 5.3 suggests 3 different schemas.
    // But FR-3.3 says "single, structured CSV file".
    // A common way is to have one row per event (Env update OR Boom).
    // Or just one row per Boom, with the *current* env data?
    // Let's look at the schema again.
    // It defines 3 tables.
    // If it must be a SINGLE file, it's likely a flat table where columns are combined.

    // Let's assume a flat structure where we list all booms.
    // What about env updates?
    // Maybe we just export the booms, and the env data is just the *initial* one?
    // Or we create rows for env updates too?
    // The schema lists "Env_Timestamp" in 5.2.
    // Let's create a row for every Boom Log.
    // And maybe we can include the *latest* env data for that boom?
    // Or just dump everything.

    // Given the "MVP" nature and "single file", I will create a row for each BOOM LOG.
    // I will attach the Session Data to each row.
    // I will also attach the *Initial* Env Data to each row (or the one active at that time).
    // For simplicity, I'll just take the first Env Log (Setup) and attach it.
    // If there are multiple env logs, maybe I should list them separately?
    // But the columns are fixed.

    // Let's try to make a row for each BOOM, and fill the Env columns with the latest Env log at that time.
    // If there are no booms, we should at least export one row with session/env data?

    // Actually, let's just dump all Booms.
    // And maybe add rows for Env Logs if they are distinct events?
    // But the columns would be sparse.

    // Let's stick to: One row per Boom Log.
    // Columns: Session Cols + Env Cols + Boom Cols.

    // const initialEnv = session.environmentalLogs[0] || {};

    session.boomLogs.forEach(boom => {
        // Find applicable env log (closest before boom)
        // For MVP just use the first one or the last one before boom.
        const env = session.environmentalLogs.reduce((prev, curr) => {
            return curr.timestamp <= boom.callTimestamp ? curr : prev;
        }, session.environmentalLogs[0]);

        const row = [
            session.observerId,
            session.sessionDate,
            session.stationLat,
            session.stationLon,
            session.sessionStartTime,
            session.sunsetTime,
            env.timestamp || '',
            env.noiseLevel || '',
            env.windStrength || '',
            env.moonVisibility || '',
            env.cloudCover || '',
            env.rainPresence || '',
            boom.callTimestamp,
            boom.boomCount,
            boom.compassBearing,
            boom.estDistanceM,
            boom.bitternId
        ].map(val => `"${val}"`).join(','); // Quote values to be safe

        rows.push(row);
    });

    return [headers, ...rows].join('\n');
};
