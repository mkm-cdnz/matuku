import React, { useEffect, useState } from 'react';
import { useSessionStore } from '../store/sessionStore';
import SunCalc from 'suncalc';
import type { EnvironmentalData } from '../types';
import { MapPin, Sun } from 'lucide-react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    ToggleButton,
    ToggleButtonGroup,
    Stack,
    Alert
} from '@mui/material';

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
    const [error, setError] = useState<string | null>(null);

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
        if (!observerId.trim()) {
            setError('Please enter your Observer ID');
            return;
        }

        addEnvironmentalLog({
            ...envData,
            timestamp: new Date().toLocaleTimeString('en-GB', { hour12: false })
        });
        startSession();
    };

    const handleEnvChange = (field: keyof typeof envData) => (
        _: React.MouseEvent<HTMLElement>,
        newValue: string | null
    ) => {
        if (newValue !== null) {
            setEnvData(prev => ({ ...prev, [field]: newValue }));
        }
    };

    return (
        <Box sx={{ p: 3, maxWidth: 'sm', mx: 'auto', pb: 10 }}>
            <Typography variant="h4" fontWeight="bold" color="primary" sx={{ mb: 4 }}>
                Session Setup
            </Typography>

            <Stack spacing={4}>
                {/* Observer ID */}
                <TextField
                    label="Observer ID"
                    variant="outlined"
                    fullWidth
                    value={observerId}
                    onChange={(e) => {
                        setObserverId(e.target.value);
                        setError(null);
                    }}
                    error={!!error}
                    helperText={error}
                    placeholder="Enter your name"
                />

                {/* Location Status */}
                <Paper variant="outlined" sx={{ p: 2, bgcolor: 'background.paper' }}>
                    <Stack spacing={1}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                            <MapPin size={18} />
                            <Typography variant="body2">{locationStatus}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                            <Sun size={18} />
                            <Typography variant="body2">Sunset: {useSessionStore.getState().sunsetTime || '--:--'}</Typography>
                        </Box>
                        {(locationStatus.startsWith('GPS Error') || locationStatus === 'Geolocation not supported') && (
                            <Alert severity="warning" sx={{ mt: 1 }}>
                                GPS issue detected. You can still log data.
                            </Alert>
                        )}
                    </Stack>
                </Paper>

                {/* Environmental Conditions */}
                <Box>
                    <Typography variant="h6" sx={{ mb: 2 }}>Environmental Conditions</Typography>
                    <Stack spacing={3}>

                        <Box>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>Noise Level</Typography>
                            <ToggleButtonGroup
                                value={envData.noiseLevel}
                                exclusive
                                onChange={handleEnvChange('noiseLevel')}
                                fullWidth
                                size="small"
                                color="primary"
                            >
                                <ToggleButton value="Low">Low</ToggleButton>
                                <ToggleButton value="Medium">Medium</ToggleButton>
                                <ToggleButton value="High">High</ToggleButton>
                            </ToggleButtonGroup>
                        </Box>

                        <Box>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>Wind Strength</Typography>
                            <ToggleButtonGroup
                                value={envData.windStrength}
                                exclusive
                                onChange={handleEnvChange('windStrength')}
                                fullWidth
                                size="small"
                                color="primary"
                                sx={{ display: 'flex', flexWrap: 'wrap' }}
                            >
                                <ToggleButton value="Calm" sx={{ flex: 1 }}>Calm</ToggleButton>
                                <ToggleButton value="Light" sx={{ flex: 1 }}>Light</ToggleButton>
                                <ToggleButton value="Moderate" sx={{ flex: 1 }}>Mod</ToggleButton>
                                <ToggleButton value="Strong" sx={{ flex: 1 }}>Strong</ToggleButton>
                            </ToggleButtonGroup>
                        </Box>

                        <Box>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>Moon Visibility</Typography>
                            <ToggleButtonGroup
                                value={envData.moonVisibility}
                                exclusive
                                onChange={handleEnvChange('moonVisibility')}
                                fullWidth
                                size="small"
                                color="primary"
                            >
                                <ToggleButton value="Visible">Visible</ToggleButton>
                                <ToggleButton value="Not Visible">Not Visible</ToggleButton>
                            </ToggleButtonGroup>
                        </Box>

                        <Box>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>Cloud Cover</Typography>
                            <ToggleButtonGroup
                                value={envData.cloudCover}
                                exclusive
                                onChange={handleEnvChange('cloudCover')}
                                fullWidth
                                size="small"
                                color="primary"
                                orientation="vertical"
                            >
                                <ToggleButton value="Clear (0-25%)">Clear (0-25%)</ToggleButton>
                                <ToggleButton value="Partially Cloudy (25-75%)">Partially Cloudy (25-75%)</ToggleButton>
                                <ToggleButton value="Overcast (75-100%)">Overcast (75-100%)</ToggleButton>
                            </ToggleButtonGroup>
                        </Box>

                        <Box>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>Rain Presence</Typography>
                            <ToggleButtonGroup
                                value={envData.rainPresence}
                                exclusive
                                onChange={handleEnvChange('rainPresence')}
                                fullWidth
                                size="small"
                                color="primary"
                            >
                                <ToggleButton value="No Rain">None</ToggleButton>
                                <ToggleButton value="Light Drizzle">Drizzle</ToggleButton>
                                <ToggleButton value="Rain">Rain</ToggleButton>
                            </ToggleButtonGroup>
                        </Box>

                    </Stack>
                </Box>

                <Button
                    variant="contained"
                    size="large"
                    onClick={handleStart}
                    fullWidth
                    sx={{ height: 56, fontSize: '1.1rem' }}
                >
                    Start Session
                </Button>
            </Stack>
        </Box>
    );
};
