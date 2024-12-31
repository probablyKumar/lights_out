import React, { useState, useEffect, useRef } from 'react';
import Light from './lightHandler';
import './gameHandler.css';

const GameHandler = ({ numberOfLights = 25, devMode = false }) => {
    const [lightsOn, setLightsOn] = useState([]);
    const [beingHovered, setBeingHovered] = useState([]);
    const [hasWon, setHasWon] = useState(false);
    const [errorClick, setErrorClick] = useState(null);
    const [scaleAdjusted, setScaleAdjusted] = useState(false);
    const [difficulty, setDifficulty] = useState(null);
    const [isAnimating, setIsAnimating] = useState(false); // Track animation state
    const [buttonTitles, setButtonTitles] = useState({
        easy: 'Easy',
        regular: 'Regular',
        hard: 'Hard'
    }); // State to manage button titles
    const gameContainerRef = useRef(null);

    // Track the timeout ID for the mouse hover
    const hoverTimeoutRef = useRef(null);

    // Automatically enable devMode lights if it's set to true
    useEffect(() => {
        if (devMode) {
            const allLightsOn = Array.from({ length: numberOfLights }, (_, i) => i + 1); // All lights turned on
            setLightsOn(allLightsOn);
            setHasWon(true);
        }
    }, [devMode, numberOfLights]);

    useEffect(() => {
        if (!devMode && lightsOn.length === numberOfLights) {
            setHasWon(true);
        }
    }, [lightsOn, numberOfLights, devMode]);

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
        if (difficulty === 'easy') {
            const adjacentLights = getAdjacentLights(lightId);
            lightToggle([lightId, ...adjacentLights]);
        } else if (difficulty === 'regular') {
            if (!lightsOn.includes(lightId)) {
                const adjacentLights = getAdjacentLights(lightId);
                lightToggle([lightId, ...adjacentLights]);
            } else {
                setErrorClick(lightId);
                setTimeout(() => setErrorClick(null), 1000);
            }
        } else if (difficulty === 'hard') {
            if (!lightsOn.includes(lightId)) {
                const adjacentLights = getAdjacentLights(lightId);
                lightToggle([lightId, ...adjacentLights]);
            } else {
                setErrorClick(lightId);
                setTimeout(() => setErrorClick(null), 1000);
            }
        }
    };

    const handleHoverStart = (lightId) => {
        const adjacentLights = getAdjacentLights(lightId);
        setBeingHovered(adjacentLights);
    };

    const handleHoverEnd = () => {
        setBeingHovered([]);
        // Clear any existing timeout if mouse leaves early
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
            hoverTimeoutRef.current = null;
        }
    };

    const startGame = (selectedDifficulty) => {
        setDifficulty(selectedDifficulty);
        setLightsOn([]);
        setHasWon(false);
        setIsAnimating(true); // Animation started

        setTimeout(() => {
            setIsAnimating(false); // Reset animation state after animation duration
        }, 400); // Adjust duration based on the animation time

        if (selectedDifficulty === 'hard') {
            const preLitLights = Array.from({ length: Math.ceil(numberOfLights / 5) }, () =>
                Math.floor(Math.random() * numberOfLights) + 1
            );
            setLightsOn(preLitLights);
        }
    };

    const handleMouseEnter = (difficulty) => {
        // Only execute if the mouse has been hovering for more than 700ms
        hoverTimeoutRef.current = setTimeout(() => {
            const newTitles = { ...buttonTitles };
            if (difficulty === 'easy') {
                newTitles.easy = 'Easy Mode with no lights lock in!';
            } else if (difficulty === 'regular') {
                newTitles.regular = 'A balanced mode with lights locked in!';
            } else if (difficulty === 'hard') {
                newTitles.hard = 'Hardest Mode with already lit Lights';
            }
            setButtonTitles(newTitles);
        }, 700); // 700ms delay
    };

    const handleMouseLeave = (difficulty) => {
        // Clear the hover timeout if the mouse leaves early
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
            hoverTimeoutRef.current = null;
        }

        const newTitles = { ...buttonTitles };
        if (difficulty === 'easy') {
            newTitles.easy = 'Easy';
        } else if (difficulty === 'regular') {
            newTitles.regular = 'Regular';
        } else if (difficulty === 'hard') {
            newTitles.hard = 'Hard';
        }
        setButtonTitles(newTitles);
    };

    return (
        <div className="game-Body">
            {!difficulty ? (
                <div className="difficulty-Selector">

                    <h2 className="game-Title">
                        LIGHTS<span className="game-Title-Two">OUT</span>
                    </h2>
                    <button
                        onClick={() => startGame('easy')}
                        onMouseEnter={() => handleMouseEnter('easy')}
                        onMouseLeave={() => handleMouseLeave('easy')}
                        className={`difficulty-Button ${isAnimating ? 'no-pointer-events' : ''}`}
                    >
                        {buttonTitles.easy}
                    </button>
                    <p className="difficulty-Description">Easy Mode with no lights lock in!</p>
                    <button
                        onClick={() => startGame('regular')}
                        onMouseEnter={() => handleMouseEnter('regular')}
                        onMouseLeave={() => handleMouseLeave('regular')}
                        className={`difficulty-Button ${isAnimating ? 'no-pointer-events' : ''}`}
                    >
                        {buttonTitles.regular}
                    </button>
                    <p className="difficulty-Description">A balanced mode with lights locked in!</p>
                    <button
                        onClick={() => startGame('hard')}
                        onMouseEnter={() => handleMouseEnter('hard')}
                        onMouseLeave={() => handleMouseLeave('hard')}
                        className={`difficulty-Button ${isAnimating ? 'no-pointer-events' : ''}`}
                    >
                        {buttonTitles.hard}
                    </button>
                    <p className="difficulty-Description">Hardest Mode with already lit Lights</p>
                </div>
            ) : (
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
            )}
        </div>
    );
};

export default GameHandler;
