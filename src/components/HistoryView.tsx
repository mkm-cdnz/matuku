import React, { useState } from 'react';
import { useSessionStore } from '../store/sessionStore';
import { BoomLogForm } from './BoomLogForm';
import type { BoomLog } from '../types';
import {
    Box,
    Typography,
    Card,
    CardContent,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Chip,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button
} from '@mui/material';
import { Edit2, Trash2, MapPin, Sun, Calendar, User } from 'lucide-react';

export const HistoryView: React.FC = () => {
    const {
        boomLogs,
        environmentalLogs,
        observerId,
        sessionDate,
        stationLat,
        stationLon,
        sunsetTime,
        deleteBoomLog,
        updateBoomLog,
        selectBitternId
    } = useSessionStore();

    const [editingLogId, setEditingLogId] = useState<string | null>(null);
    const [deletingLogId, setDeletingLogId] = useState<string | null>(null);

    const handleSaveLog = (data: Partial<BoomLog>) => {
        if (editingLogId) {
            updateBoomLog(editingLogId, data);
            if (data.bitternId) {
                selectBitternId(data.bitternId);
            }
            setEditingLogId(null);
        }
    };

    const confirmDelete = () => {
        if (deletingLogId) {
            deleteBoomLog(deletingLogId);
            setDeletingLogId(null);
        }
    };

    return (
        <Box sx={{ p: 2, maxWidth: 'sm', mx: 'auto', pb: 10 }}>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
                Session History
            </Typography>

            {/* Session Overview Card */}
            <Card variant="outlined" sx={{ mb: 3, bgcolor: 'background.paper' }}>
                <CardContent sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <User size={16} className="text-slate-400" />
                        <Typography variant="body2">{observerId || 'Unknown'}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Calendar size={16} className="text-slate-400" />
                        <Typography variant="body2">{sessionDate}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <MapPin size={16} className="text-slate-400" />
                        <Typography variant="body2">{stationLat.toFixed(4)}, {stationLon.toFixed(4)}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Sun size={16} className="text-slate-400" />
                        <Typography variant="body2">Sunset: {sunsetTime || '--:--'}</Typography>
                    </Box>
                </CardContent>
            </Card>

            {/* Boom Logs Section */}
            <Typography variant="h6" sx={{ mb: 1, color: 'text.secondary' }}>
                Boom Logs ({boomLogs.length})
            </Typography>

            {boomLogs.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', mb: 3 }}>
                    No booms logged yet.
                </Typography>
            ) : (
                <List sx={{ bgcolor: 'background.paper', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                    {boomLogs.map((log, index) => (
                        <React.Fragment key={log.id}>
                            {index > 0 && <Divider component="li" />}
                            <ListItem
                                secondaryAction={
                                    <Box>
                                        <IconButton edge="end" aria-label="edit" onClick={() => setEditingLogId(log.id)} sx={{ mr: 1 }}>
                                            <Edit2 size={18} />
                                        </IconButton>
                                        <IconButton edge="end" aria-label="delete" onClick={() => setDeletingLogId(log.id)} color="error">
                                            <Trash2 size={18} />
                                        </IconButton>
                                    </Box>
                                }
                            >
                                <ListItemText
                                    primary={
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Typography variant="subtitle1" fontWeight="bold">
                                                {log.callTimestamp}
                                            </Typography>
                                            <Chip
                                                label={log.bitternId}
                                                size="small"
                                                color="primary"
                                                variant="outlined"
                                                sx={{ height: 20, fontSize: '0.7rem' }}
                                            />
                                        </Box>
                                    }
                                    secondary={
                                        <Typography variant="body2" color="text.secondary">
                                            {log.boomCount} booms • {log.compassBearing}° • {log.estDistanceM}m
                                        </Typography>
                                    }
                                />
                            </ListItem>
                        </React.Fragment>
                    ))}
                </List>
            )}

            {/* Environmental Logs Section */}
            <Typography variant="h6" sx={{ mt: 3, mb: 1, color: 'text.secondary' }}>
                Environmental Logs
            </Typography>
            <List sx={{ bgcolor: 'background.paper', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                {environmentalLogs.map((env, index) => (
                    <React.Fragment key={env.timestamp}>
                        {index > 0 && <Divider component="li" />}
                        <ListItem>
                            <ListItemText
                                primary={
                                    <Typography variant="subtitle2" color="primary.main">
                                        {env.timestamp}
                                    </Typography>
                                }
                                secondary={
                                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0.5, mt: 0.5 }}>
                                        <Typography variant="caption">Noise: {env.noiseLevel}</Typography>
                                        <Typography variant="caption">Wind: {env.windStrength}</Typography>
                                        <Typography variant="caption">Moon: {env.moonVisibility}</Typography>
                                        <Typography variant="caption">Cloud: {env.cloudCover}</Typography>
                                        <Typography variant="caption">Rain: {env.rainPresence}</Typography>
                                    </Box>
                                }
                            />
                        </ListItem>
                    </React.Fragment>
                ))}
            </List>

            {/* Edit Dialog */}
            {editingLogId && (
                <BoomLogForm
                    initialData={boomLogs.find(l => l.id === editingLogId)}
                    onSubmit={handleSaveLog}
                    onCancel={() => setEditingLogId(null)}
                />
            )}

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={!!deletingLogId}
                onClose={() => setDeletingLogId(null)}
            >
                <DialogTitle>Delete Log?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this boom log? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeletingLogId(null)}>Cancel</Button>
                    <Button onClick={confirmDelete} color="error" autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};
