import React, { useMemo, useState } from 'react';
import type { BoomLog } from '../types';
import { Compass, Ruler, Hash, Bird, PlusCircle, X, Check } from 'lucide-react';
import { CompassDial, getDirectionLabel } from './CompassDial';
import { useSessionStore } from '../store/sessionStore';
import {
    Dialog,
    Button,
    Typography,
    Box,
    Slider,
    Chip,
    IconButton,
    Paper
} from '@mui/material';

interface BoomLogFormProps {
    initialData?: Partial<BoomLog>;
    onSubmit: (data: Partial<BoomLog>) => void;
    onCancel: () => void;
}

const DISTANCE_STOPS = [0, 10, 25, 50, 100, 200, 500, 1000, 1500];

export const BoomLogForm: React.FC<BoomLogFormProps> = ({ initialData, onSubmit, onCancel }) => {
    const {
        bitternIds,
        nextBitternId,
        lastSelectedBitternId,
        selectBitternId,
    } = useSessionStore();

    // Default to sticky ID if available, otherwise new ID logic
    const defaultBitternId = initialData?.bitternId || lastSelectedBitternId || (bitternIds.length > 0 ? bitternIds[bitternIds.length - 1] : `B${Math.max(1, nextBitternId)}`);

    const [boomCount, setBoomCount] = useState(initialData?.boomCount || 1);
    const [compassBearing, setCompassBearing] = useState(initialData?.compassBearing || 0);
    const [estDistanceM, setEstDistanceM] = useState(initialData?.estDistanceM || 100);
    const [bitternId, setBitternId] = useState(defaultBitternId);

    const handleSelectBittern = (id: string) => {
        setBitternId(id);
        if (id.trim()) {
            selectBitternId(id.trim());
        }
    };

    const availableBitterns = useMemo(() => {
        const merged = new Set([...bitternIds, bitternId].filter(Boolean));
        return Array.from(merged).sort((a, b) => {
            const aNum = parseInt(a.replace(/\D/g, ''), 10) || 0;
            const bNum = parseInt(b.replace(/\D/g, ''), 10) || 0;
            return aNum - bNum;
        });
    }, [bitternId, bitternIds]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            boomCount,
            compassBearing,
            estDistanceM,
            bitternId
        });
    };

    // Find the closest index for the current distance
    const currentDistanceIndex = DISTANCE_STOPS.reduce((prev, curr, index) => {
        return Math.abs(curr - estDistanceM) < Math.abs(DISTANCE_STOPS[prev] - estDistanceM) ? index : prev;
    }, 0);

    const handleDistanceChange = (_: Event, newValue: number | number[]) => {
        const index = newValue as number;
        setEstDistanceM(DISTANCE_STOPS[index]);
    };

    const createNewBird = () => {
        const highest = bitternIds.reduce((max, id) => {
            const match = id.match(/B(\d+)/i);
            return Math.max(max, match ? parseInt(match[1], 10) : 0);
        }, 0);
        const nextId = `B${Math.max(highest + 1, nextBitternId)}`;
        handleSelectBittern(nextId);
    };

    return (
        <Dialog
            open={true}
            onClose={onCancel}
            fullScreen
            PaperProps={{ sx: { bgcolor: 'background.default' } }}
        >
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', height: '100%', p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h5" fontWeight="bold" color="primary">Log Boom</Typography>
                    <IconButton onClick={onCancel} edge="end" color="inherit">
                        <X />
                    </IconButton>
                </Box>

                <Box sx={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 4, pb: 4 }}>

                    {/* Boom Count */}
                    <Paper variant="outlined" sx={{ p: 2, bgcolor: 'background.paper' }}>
                        <Typography variant="subtitle2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <Hash size={16} /> BOOM COUNT
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2 }}>
                            <Button
                                variant="outlined"
                                sx={{ borderRadius: '50%', minWidth: 64, height: 64, fontSize: '1.5rem' }}
                                onClick={() => setBoomCount(Math.max(1, boomCount - 1))}
                            >
                                -
                            </Button>
                            <Typography variant="h2" fontWeight="bold">{boomCount}</Typography>
                            <Button
                                variant="outlined"
                                sx={{ borderRadius: '50%', minWidth: 64, height: 64, fontSize: '1.5rem' }}
                                onClick={() => setBoomCount(boomCount + 1)}
                            >
                                +
                            </Button>
                        </Box>
                    </Paper>

                    {/* Compass */}
                    <Paper variant="outlined" sx={{ p: 2, bgcolor: 'background.paper' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="subtitle2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Compass size={16} /> BEARING
                            </Typography>
                            <Typography variant="h6" color="primary" fontWeight="bold">
                                {compassBearing}° <Typography component="span" variant="body2" color="text.secondary">({getDirectionLabel(compassBearing)})</Typography>
                            </Typography>
                        </Box>

                        {/* Touch Action None Wrapper */}
                        <Box sx={{ touchAction: 'none', display: 'flex', justifyContent: 'center', py: 2 }}>
                            <CompassDial value={compassBearing} onChange={setCompassBearing} />
                        </Box>
                    </Paper>

                    {/* Distance */}
                    <Paper variant="outlined" sx={{ p: 2, bgcolor: 'background.paper' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                            <Typography variant="subtitle2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Ruler size={16} /> DISTANCE
                            </Typography>
                            <Typography variant="h6" color="primary" fontWeight="bold">
                                {estDistanceM >= 1500 ? '>1000' : estDistanceM}m
                            </Typography>
                        </Box>
                        <Box sx={{ px: 2 }}>
                            <Slider
                                value={currentDistanceIndex}
                                min={0}
                                max={DISTANCE_STOPS.length - 1}
                                step={1}
                                marks={DISTANCE_STOPS.map((val, idx) => ({
                                    value: idx,
                                    label: idx % 2 === 0 ? (val >= 1500 ? '>1km' : `${val}m`) : '' // Show every other label to avoid crowding
                                }))}
                                onChange={handleDistanceChange}
                                valueLabelFormat={(idx) => {
                                    const val = DISTANCE_STOPS[idx];
                                    return val >= 1500 ? '>1000m' : `${val}m`;
                                }}
                                valueLabelDisplay="auto"
                            />
                        </Box>
                    </Paper>

                    {/* Bittern ID */}
                    <Paper variant="outlined" sx={{ p: 2, bgcolor: 'background.paper' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="subtitle2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Bird size={16} /> BITTERN ID
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {availableBitterns.map((id) => (
                                <Chip
                                    key={id}
                                    label={id}
                                    onClick={() => handleSelectBittern(id)}
                                    color={bitternId === id ? "primary" : "default"}
                                    variant={bitternId === id ? "filled" : "outlined"}
                                    sx={{ minWidth: 60 }}
                                />
                            ))}
                            <Chip
                                icon={<PlusCircle size={16} />}
                                label="New Bird"
                                onClick={createNewBird}
                                color="secondary"
                                variant="outlined"
                                sx={{ borderStyle: 'dashed' }}
                            />
                        </Box>
                    </Paper>
                </Box>

                <Box sx={{ pt: 2, display: 'flex', gap: 2 }}>
                    <Button
                        fullWidth
                        variant="outlined"
                        color="inherit"
                        size="large"
                        onClick={onCancel}
                        sx={{ height: 56 }}
                    >
                        Cancel
                    </Button>
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        size="large"
                        type="submit"
                        startIcon={<Check />}
                        sx={{ height: 56, fontSize: '1.1rem' }}
                    >
                        Save Log
                    </Button>
                </Box>
            </Box>
        </Dialog>
    );
};
