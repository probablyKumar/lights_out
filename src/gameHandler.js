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

    // Adjust zoom for screen scaling
    useEffect(() => {
        const adjustZoomForScale = () => {
            const devicePixelRatio = window.devicePixelRatio; // Get the current scale factor
            if (devicePixelRatio > 1) {
                const zoomLevel = 1 / devicePixelRatio; // Calculate zoom adjustment
                if (gameContainerRef.current) {
                    gameContainerRef.current.style.zoom = zoomLevel;
                }
                setScaleAdjusted(true);
            }
        };

        adjustZoomForScale();
    }, []); // Runs only on component mount

    // Check if the game is won
    useEffect(() => {
        if (lightsOn.length >= numberOfLights - 1) {
            setHasWon(true);
        }
    }, [lightsOn, numberOfLights]);

    // Toggle lights based on selected light
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

    // Calculate adjacent lights for a given light
    const getAdjacentLights = (lightId) => {
        const gridSize = Math.sqrt(numberOfLights); // Assuming a square grid
        const row = Math.floor((lightId - 1) / gridSize); // Calculate the row of the current light

        const adjacentOffsets = [-1, 1, -gridSize, gridSize];

        return adjacentOffsets
            .map((offset) => {
                const adjacentId = lightId + offset;

                // Check if the adjacent light is valid
                if (adjacentId < 1 || adjacentId > numberOfLights) return null; // Out of bounds

                const adjacentRow = Math.floor((adjacentId - 1) / gridSize);

                // Ensure horizontal adjacency does not wrap between rows
                if (Math.abs(offset) === 1 && adjacentRow !== row) return null;

                return adjacentId;
            })
            .filter((id) => id !== null); // Filter out invalid lights
    };


    // Handle light click
    const handleLightClick = (lightId) => {
        if (!lightsOn.includes(lightId)) {
            const adjacentLights = getAdjacentLights(lightId);
            lightToggle([lightId, ...adjacentLights]);
        } else {
            // Handle invalid click (already on)
            setErrorClick(lightId);
            setTimeout(() => setErrorClick(null), 1000);
        }
    };

    // Handle hover start
    const handleHoverStart = (lightId) => {
        const adjacentLights = getAdjacentLights(lightId);
        setBeingHovered(adjacentLights);
    };

    // Handle hover end
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
