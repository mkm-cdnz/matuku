import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type CompassDialProps = {
    value: number;
    onChange: (value: number) => void;
    size?: number;
    showDirectionText?: boolean;
};

const DIRECTIONS = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];

const snapAngle = (angle: number, step: number) => {
    const snapped = Math.round(angle / step) * step;
    return (snapped + 360) % 360;
};

const pointerToHeading = (x: number, y: number) => {
    // Translate screen coordinates (y grows downward) into a compass heading where
    // north is 0° and angles grow clockwise, matching the dial's orientation.
    return ((Math.atan2(x, -y) * 180) / Math.PI + 360) % 360;
};

export const getDirectionLabel = (angle: number) => {
    const sectorSize = 360 / DIRECTIONS.length; // 22.5°
    const normalizedAngle = ((angle % 360) + 360) % 360;
    const index = Math.floor((normalizedAngle + sectorSize / 2) / sectorSize) % DIRECTIONS.length;
    return DIRECTIONS[index];
};

export const CompassDial: React.FC<CompassDialProps> = ({ value, onChange, size = 260, showDirectionText = true }) => {
    const [isDragging, setIsDragging] = useState(false);
    const dialRef = useRef<SVGSVGElement | null>(null);

    const radius = size / 2;

    const handlePointerMove = useCallback(
        (event: PointerEvent | React.PointerEvent) => {
            if (!dialRef.current) return;
            const rect = dialRef.current.getBoundingClientRect();
            
            // Calculate coordinates relative to the center of the dial
            const x = event.clientX - rect.left - rect.width / 2;
            const y = event.clientY - rect.top - rect.height / 2;

            // 1. Calculate standard Cartesian angle (0 deg = East, CCW)
            const angleInRad = Math.atan2(y, x);
            let degrees = (angleInRad * 180) / Math.PI;

            // 2. Correct for Compass Bearings (0 deg = North, Clockwise)
            // Shift by 90 degrees and reverse rotation
            degrees = 90 - degrees;

            // 3. Normalize to 0-360 range
            const normalizedAngle = (degrees + 360) % 360; 

            // 4. Snap and update
            const snapped = snapAngle(normalizedAngle, 10);
            onChange(snapped);
        },
        [onChange]
    );

    const handlePointerDown = (event: React.PointerEvent) => {
        event.preventDefault();
        const rect = dialRef.current?.getBoundingClientRect();
        if (rect) {
            const x = event.clientX - rect.left - rect.width / 2;
            const y = event.clientY - rect.top - rect.height / 2;
            const handleX = handlePosition.x - radius;
            const handleY = handlePosition.y - radius;
            const distanceToHandle = Math.hypot(x - handleX, y - handleY);
            const shouldDrag = distanceToHandle < 36;
            
            // We still want to update the value immediately on click/down
            handlePointerMove(event); 
            
            if (shouldDrag) {
                setIsDragging(true);
                window.addEventListener('pointermove', handlePointerMove as any);
            }
        }
        window.addEventListener('pointerup', handlePointerUp as any, { once: true });
    };

    const handlePointerUp = useCallback(() => {
        setIsDragging(false);
        window.removeEventListener('pointermove', handlePointerMove as any);
    }, [handlePointerMove]);

    useEffect(() => () => window.removeEventListener('pointermove', handlePointerMove as any), [handlePointerMove]);

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
            event.preventDefault();
            onChange(snapAngle((value - 10 + 360) % 360, 10));
        }
        if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
            event.preventDefault();
            onChange(snapAngle((value + 10) % 360, 10));
        }
    };

    const ticks = useMemo(() => {
        const entries: { angle: number; length: number; label?: string }[] = [];
        for (let angle = 0; angle < 360; angle += 10) {
            const isMajor = angle % 30 === 0;
            entries.push({ angle, length: isMajor ? 18 : 10, label: isMajor ? angle.toString() : undefined });
        }
        return entries;
    }, []);

    const handlePosition = useMemo(() => {
        // This is correct: (value - 90) shifts 0deg to the top (North) for SVG's coordinate system
        const radians = ((value - 90) * Math.PI) / 180; 
        const handleRadius = radius - 28;
        return {
            x: radius + handleRadius * Math.cos(radians),
            y: radius + handleRadius * Math.sin(radians),
        };
    }, [radius, value]);

    const directionLabel = useMemo(() => getDirectionLabel(value), [value]);

    return (
        <div className="w-full flex flex-col items-center">
            <svg
                ref={dialRef}
                width={size}
                height={size}
                viewBox={`0 0 ${size} ${size}`}
                className={`select-none touch-none ${isDragging ? 'cursor-grabbing' : 'cursor-pointer'}`}
                onPointerDown={handlePointerDown}
                onKeyDown={handleKeyDown}
                role="slider"
                aria-valuemin={0}
                aria-valuemax={360}
                aria-valuenow={value}
                tabIndex={0}
            >
                <defs>
                    <linearGradient id="dialGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#0f172a" />
                        <stop offset="100%" stopColor="#020617" />
                    </linearGradient>
                </defs>
                <circle cx={radius} cy={radius} r={radius - 4} fill="url(#dialGradient)" stroke="#0ea5e9" strokeWidth="2" />
                <circle cx={radius} cy={radius} r={radius - 16} fill="none" stroke="#334155" strokeWidth="1.5" />

                {ticks.map(({ angle, length, label }) => {
                    const radians = ((angle - 90) * Math.PI) / 180;
                    const outer = radius - 12;
                    const inner = outer - length;
                    const x1 = radius + outer * Math.cos(radians);
                    const y1 = radius + outer * Math.sin(radians);
                    const x2 = radius + inner * Math.cos(radians);
                    const y2 = radius + inner * Math.sin(radians);
                    const labelRadius = inner - 8;
                    const lx = radius + labelRadius * Math.cos(radians);
                    const ly = radius + labelRadius * Math.sin(radians) + 4;
                    return (
                        <g key={angle}>
                            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={label ? '#e2e8f0' : '#475569'} strokeWidth={label ? 2 : 1.2} />
                            {label && (
                                <text x={lx} y={ly} textAnchor="middle" fontSize="12" fill="#cbd5f5">
                                    {label}
                                </text>
                            )}
                        </g>
                    );
                })}

                <line
                    x1={radius}
                    y1={radius}
                    x2={handlePosition.x}
                    y2={handlePosition.y}
                    stroke="#f87171"
                    strokeWidth={3}
                    strokeLinecap="round"
                />

                <circle cx={handlePosition.x} cy={handlePosition.y} r={14} fill="#ef4444" stroke="#fca5a5" strokeWidth={3} />

                <circle cx={radius} cy={radius} r={62} fill="#0b1222" stroke="#1e293b" strokeWidth={2} />
                <text x={radius} y={radius - 4} textAnchor="middle" fontSize="26" fill="#fca5a5" fontWeight="bold">
                    {value.toFixed(0)}°
                </text>
                {showDirectionText && (
                    <text x={radius} y={radius + 22} textAnchor="middle" fontSize="16" fill="#a5b4fc" letterSpacing="1">
                        {directionLabel}
                    </text>
                )}
            </svg>
        </div>
    );
};
