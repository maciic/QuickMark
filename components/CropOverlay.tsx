import React, { useRef, useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, PanResponder, Dimensions } from 'react-native';

// Get screen dimensions (used for clamping coordinates)
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

// Define the structure for corner coordinates
interface Corner {
    x: number;
    y: number;
}

// Define the structure for the state holding all corners
// Export it so EditingScreen can use it for state typing
export interface Corners {
    topLeft: Corner;
    topRight: Corner;
    bottomLeft: Corner;
    bottomRight: Corner;
}

// Props for the overlay frame component
interface CropOverlayFrameProps {
    initialCorners?: Corners; // Optional: Set starting position/size
    onLayoutChange?: (corners: Corners) => void; // Optional: Callback for when corners change
    borderColor?: string;
    borderWidth?: number;
    backgroundColor?: string;
    cornerColor?: string;
    cornerSize?: number;
    cornerBorderRadius?: number;
    cornerBorderColor?: string;
    cornerBorderWidth?: number;
}

// Default starting position/size if not provided via props
const defaultInitialCorners: Corners = {
    topLeft: { x: 50, y: 100 },
    topRight: { x: 300, y: 100 },
    bottomLeft: { x: 50, y: 400 },
    bottomRight: { x: 300, y: 400 },
};

// This component ONLY renders the overlay frame and handles interactions
export default function CropOverlayFrameOnly({
    initialCorners = defaultInitialCorners,
    onLayoutChange,
    borderColor = 'rgba(255, 255, 255, 0.7)',
    borderWidth = 2,
    cornerColor = 'rgba(255, 255, 255, 0.8)',
    cornerSize = 24,
    cornerBorderRadius = 12,
    cornerBorderColor = 'rgba(0, 0, 0, 0.5)',
    cornerBorderWidth = 1,
}: CropOverlayFrameProps) { // Renamed props interface

    const [corners, setCorners] = useState<Corners>(initialCorners);

    // Ref to store the latest corners state
    const cornersRef = useRef<Corners>(corners);
    useEffect(() => {
        cornersRef.current = corners;
        // Call the callback whenever state changes
        if (onLayoutChange) {
            onLayoutChange(corners);
        }
    }, [corners, onLayoutChange]); // Depend on corners and the callback itself

    // Refs for drag starting points
    const dragStartCoords = useRef<{ [key in keyof Corners]?: Corner }>({});
    const dragStartAllCorners = useRef<Corners | null>(null);

    // --- PanResponder Creation Logic (Stable Callbacks) ---
    // (Same logic as your provided code, just ensure it updates state correctly)

    // --- PanResponder for Resizing Corners ---
    const createResizePanResponder = useCallback((cornerKey: keyof Corners) => {
        return PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderGrant: (_, gestureState) => {
                const currentCornerPos = cornersRef.current[cornerKey];
                dragStartCoords.current[cornerKey] = { x: currentCornerPos.x, y: currentCornerPos.y };
                dragStartAllCorners.current = null;
            },
            onPanResponderMove: (_, gestureState) => {
                const startX = dragStartCoords.current[cornerKey]?.x ?? 0;
                const startY = dragStartCoords.current[cornerKey]?.y ?? 0;
                let newX = startX + gestureState.dx;
                let newY = startY + gestureState.dy;
                newX = Math.max(0, Math.min(windowWidth, newX));
                newY = Math.max(0, Math.min(windowHeight, newY));

                setCorners(prevCorners => {
                    const updated = { ...prevCorners };
                    updated[cornerKey] = { x: newX, y: newY };
                    // Update adjacent corners (same logic as before)
                    if (cornerKey === 'topLeft') { updated.bottomLeft.x = newX; updated.topRight.y = newY; }
                    else if (cornerKey === 'topRight') { updated.bottomRight.x = newX; updated.topLeft.y = newY; }
                    else if (cornerKey === 'bottomLeft') { updated.topLeft.x = newX; updated.bottomRight.y = newY; }
                    else if (cornerKey === 'bottomRight') { updated.topRight.x = newX; updated.bottomLeft.y = newY; }
                    return updated;
                });
            },
            onPanResponderRelease: () => { dragStartCoords.current[cornerKey] = undefined; },
            onPanResponderTerminate: () => { dragStartCoords.current[cornerKey] = undefined; }
        });
    }, []); // Stable

    // --- PanResponder for Moving the Entire Overlay ---
    const createMovePanResponder = useCallback(() => {
        return PanResponder.create({
            onStartShouldSetPanResponder: (evt, gestureState) => !Object.values(dragStartCoords.current).some(Boolean),
            onPanResponderGrant: (_, gestureState) => { dragStartAllCorners.current = { ...cornersRef.current }; },
            onPanResponderMove: (_, gestureState) => {
                if (!dragStartAllCorners.current) return;
                const { dx, dy } = gestureState;
                const start = dragStartAllCorners.current;
                const newTopLeft = { x: start.topLeft.x + dx, y: start.topLeft.y + dy };
                const newTopRight = { x: start.topRight.x + dx, y: start.topRight.y + dy };
                const newBottomLeft = { x: start.bottomLeft.x + dx, y: start.bottomLeft.y + dy };
                const newBottomRight = { x: start.bottomRight.x + dx, y: start.bottomRight.y + dy };
                // TODO: Add boundary checks if needed
                setCorners({ topLeft: newTopLeft, topRight: newTopRight, bottomLeft: newBottomLeft, bottomRight: newBottomRight });
            },
            onPanResponderRelease: () => { dragStartAllCorners.current = null; },
            onPanResponderTerminate: () => { dragStartAllCorners.current = null; }
        });
    }, []); // Stable

    // --- Create and store PanResponders ---
    const cornerPanResponders = useRef({
        topLeft: createResizePanResponder('topLeft'),
        topRight: createResizePanResponder('topRight'),
        bottomLeft: createResizePanResponder('bottomLeft'),
        bottomRight: createResizePanResponder('bottomRight'),
    }).current;
    const moveResponder = useRef(createMovePanResponder()).current;

    // --- Render ONLY the frame and handles ---
    return (
        // Use a Fragment or a simple View container if needed,
        // but the core elements are positioned absolutely anyway.
        <>
            {/* Overlay Rectangle View */}
            <View
                style={[
                    styles.overlay, // Use local styles
                    {
                        left: corners.topLeft.x,
                        top: corners.topLeft.y,
                        width: Math.abs(corners.topRight.x - corners.topLeft.x),
                        height: Math.abs(corners.bottomLeft.y - corners.topLeft.y),
                        borderColor: borderColor,
                        borderWidth: borderWidth,
                    },
                ]}
                {...moveResponder.panHandlers} // Attach move handlers
            />

            {/* Corner Handle Views */}
            {(['topLeft', 'topRight', 'bottomLeft', 'bottomRight'] as const).map(key => (
                <View
                    key={key}
                    style={[
                        styles.corner, // Use local styles
                        {
                            left: corners[key].x - cornerSize / 2, // Center handle
                            top: corners[key].y - cornerSize / 2,  // Center handle
                            width: cornerSize,
                            height: cornerSize,
                            backgroundColor: cornerColor,
                            borderRadius: cornerBorderRadius,
                            borderColor: cornerBorderColor,
                            borderWidth: cornerBorderWidth,
                        },
                    ]}
                    {...cornerPanResponders[key].panHandlers} // Attach resize handlers
                />
            ))}
        </>
    );
}

// Define styles locally within this component
const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        // Styles like borderColor, borderWidth, backgroundColor are applied dynamically via props
    },
    corner: {
        position: 'absolute',
        // Styles like width, height, backgroundColor, borderRadius etc. are applied dynamically via props
    },
});
