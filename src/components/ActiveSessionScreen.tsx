import React, { useState, useEffect } from 'react';
import { useSessionStore } from '../store/sessionStore';
import { BoomLogForm } from './BoomLogForm';
import type { BoomLog } from '../types';
import { Clock, Mic } from 'lucide-react';
import { generateCsv } from '../utils/csvExport';
import {
    Box,
    Typography,
    Button,
    Fab,
    Card,
    CardContent,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions
} from '@mui/material';

export const ActiveSessionScreen: React.FC = () => {
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
    const [showEndDialog, setShowEndDialog] = useState(false);

    useEffect(() => {
        const start = new Date(`${sessionDate}T${sessionStartTime || '00:00:00'}`);
        const startMs = isNaN(start.getTime()) ? Date.now() : start.getTime();
        const calculateElapsed = () => Math.max(0, Math.floor((Date.now() - startMs) / 1000));
        setElapsedTime(calculateElapsed());
        const interval = setInterval(() => setElapsedTime(calculateElapsed()), 1000);
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

        // Sticky logic: try to find the last log to copy bearing/distance from
        const lastLog = boomLogs[0]; // boomLogs is usually sorted newest first? Check store.
        // Assuming boomLogs[0] is the latest. 

        const newLog: BoomLog = {
            id: crypto.randomUUID(),
            callTimestamp: timestamp,
            boomCount: 1,
            compassBearing: lastLog ? lastLog.compassBearing : 0,
            estDistanceM: lastLog ? lastLog.estDistanceM : 100,
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
        <Box sx={{ p: 2, maxWidth: 'sm', mx: 'auto', display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'primary.main' }}>
                    <Clock size={20} />
                    <Typography variant="h5" component="span" sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
                        {formatTime(elapsedTime)}
                    </Typography>
                </Box>
                <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => setShowEndDialog(true)}
                >
                    End Session
                </Button>
            </Box>

            {/* Main Action Area */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                <Fab
                    color="primary"
                    aria-label="log boom"
                    onClick={handleLogBoom}
                    sx={{ width: 120, height: 120, '& .MuiSvgIcon-root': { fontSize: 48 } }}
                >
                    <Mic size={48} />
                </Fab>
                <Typography variant="h6" color="text.secondary">
                    Tap to Log Boom
                </Typography>
            </Box>

            {/* Latest Entry Preview */}
            <Box sx={{ mt: 'auto', mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                    Latest Entry
                </Typography>
                {boomLogs.length === 0 ? (
                    <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                        No booms logged yet.
                    </Typography>
                ) : (
                    <Card variant="outlined" sx={{ bgcolor: 'background.paper' }}>
                        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 }, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box>
                                <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                                    {boomLogs[0].callTimestamp}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {boomLogs[0].boomCount} booms • {boomLogs[0].compassBearing}° • {boomLogs[0].estDistanceM}m
                                </Typography>
                                <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                                    {boomLogs[0].bitternId}
                                </Typography>
                            </Box>
                            <Button
                                variant="outlined"
                                size="small"
                                onClick={() => setEditingLogId(boomLogs[0].id)}
                            >
                                Edit
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </Box>

            {/* End Session Dialog */}
            <Dialog
                open={showEndDialog}
                onClose={() => setShowEndDialog(false)}
            >
                <DialogTitle>End Session?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        This will export your data to a CSV file and clear the current session.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowEndDialog(false)}>Cancel</Button>
                    <Button onClick={handleExport} color="primary" variant="contained" autoFocus>
                        Download & End
                    </Button>
                </DialogActions>
            </Dialog>

            {editingLogId && (
                <BoomLogForm
                    initialData={boomLogs.find(l => l.id === editingLogId)}
                    onSubmit={handleSaveLog}
                    onCancel={() => setEditingLogId(null)}
                />
            )}
        </Box>
    );
};
