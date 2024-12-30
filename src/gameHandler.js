import React, { useState, useEffect, useRef } from 'react';
import Light from './lightHandler';
import './gameHandler.css';

const GameHandler = ({ numberOfLights = 25 }) => {
    const [lightsOn, setLightsOn] = useState([]);
    const [beingHovered, setBeingHovered] = useState([]);
    const [hasWon, setHasWon] = useState(false);
    const [errorClick, setErrorClick] = useState(null);
    const [scaleAdjusted, setScaleAdjusted] = useState(false);
    const gameContainerRef = useRef(null);

    useEffect(() => {
        const adjustZoomForScale = () => {
            const devicePixelRatio = window.devicePixelRatio;
            if (devicePixelRatio > 1) {
                const zoomLevel = 1 / devicePixelRatio;
                if (gameContainerRef.current) {
                    gameContainerRef.current.style.zoom = zoomLevel;
                }
                setScaleAdjusted(true);
            }
        };

        adjustZoomForScale();
    }, []);

    useEffect(() => {
        if (lightsOn.length === numberOfLights) {  // Check if all lights are on
            setHasWon(true);
        }
    }, [lightsOn, numberOfLights]);

    const lightToggle = (lightIds) => {
        setLightsOn((prevLights) => {
            const updatedLights = new Set(prevLights);

            lightIds.forEach((id) => {
                if (updatedLights.has(id)) {
                    updatedLights.delete(id);
                } else {
                    updatedLights.add(id);
                }
            });

            return Array.from(updatedLights);
        });
    };

    const getAdjacentLights = (lightId) => {
        const gridSize = Math.sqrt(numberOfLights);
        const row = Math.floor((lightId - 1) / gridSize);

        const adjacentOffsets = [-1, 1, -gridSize, gridSize];

        return adjacentOffsets
            .map((offset) => {
                const adjacentId = lightId + offset;

                if (adjacentId < 1 || adjacentId > numberOfLights) return null;

                const adjacentRow = Math.floor((adjacentId - 1) / gridSize);

                if (Math.abs(offset) === 1 && adjacentRow !== row) return null;

                return adjacentId;
            })
            .filter((id) => id !== null);
    };

    const handleLightClick = (lightId) => {
        if (!lightsOn.includes(lightId)) {
            const adjacentLights = getAdjacentLights(lightId);
            lightToggle([lightId, ...adjacentLights]);
        } else {
            setErrorClick(lightId);
            setTimeout(() => setErrorClick(null), 1000);
        }
    };

    const handleHoverStart = (lightId) => {
        const adjacentLights = getAdjacentLights(lightId);
        setBeingHovered(adjacentLights);
    };

    const handleHoverEnd = () => {
        setBeingHovered([]);
    };

    return (
        <div className="game-Body">
            <div className="game-Container" ref={gameContainerRef}>
                {!hasWon ? (
                    <>
                        <h1 className="game-Title">
                            LIGHTS<span className="game-Title-Two">OUT</span>
                        </h1>
                        <Light
                            returnClickedEvent={handleLightClick}
                            clearHover={handleHoverEnd}
                            returnHoveredEvent={handleHoverStart}
                            lightsOn={lightsOn}
                            beingHovered={beingHovered}
                            errorClick={errorClick}
                        />
                        {scaleAdjusted && (
                            <p className="scale-Notification">
                            </p>
                        )}
                    </>
                ) : (
                    <h1 className="game-Won">YOU WON!</h1>
                )}
            </div>
        </div>
    );
};

export default GameHandler;
