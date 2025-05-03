import React, { useEffect, useState } from "react";
import { Head, router } from "@inertiajs/react";
import axios from "axios";

export default function Game({
    auth,
    playerProfile,
    skills,
    initialLevel,
    inGame,
}) {
    const [currentLevel, setCurrentLevel] = useState(initialLevel);
    const [enemy, setEnemy] = useState(null);
    const [playerHP, setPlayerHP] = useState(playerProfile.max_hp);
    const [enemyHP, setEnemyHP] = useState(0);
    const [gameLog, setGameLog] = useState([]);
    const [loading, setLoading] = useState(true);
    const [skillCooldowns, setSkillCooldowns] = useState(
        skills.map((skill) => ({
            id: skill.id,
            remaining: 0,
        }))
    );
    const [playerTurn, setPlayerTurn] = useState(true);
    const [levelUp, setLevelUp] = useState(false);
    const [statToUpgrade, setStatToUpgrade] = useState("");
    const [gameOver, setGameOver] = useState(false);

    // Fetch enemy data based on current level
    useEffect(() => {
        if (!inGame) return;

        const fetchEnemy = async () => {
            setLoading(true);
            try {
                const response = await axios.get(
                    route("game.enemy", { level: currentLevel })
                );
                setEnemy(response.data);
                setEnemyHP(response.data.hp);
                addToLog(
                    `Level ${currentLevel}: You encounter a ${response.data.name}!`
                );
                setLoading(false);
            } catch (error) {
                console.error("Error fetching enemy:", error);
                addToLog("Error fetching enemy data. Please try again.");
                setLoading(false);
            }
        };

        fetchEnemy();
    }, [currentLevel, inGame]);

    // Helper function to add messages to the game log
    const addToLog = (message) => {
        setGameLog((prevLog) => [...prevLog, message]);
    };

    // Helper function to get a random value between min and max
    const getRandomValue = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    // Handle enemy turn
    const enemyTurn = () => {
        if (enemy && !gameOver) {
            // Calculate damage
            const rawDamage = getRandomValue(
                enemy.attack_min,
                enemy.attack_max
            );
            const damageReduction = Math.min(
                playerProfile.defense,
                rawDamage * 0.5
            ); // Defense reduces damage up to 50%
            const finalDamage = Math.max(
                1,
                Math.floor(rawDamage - damageReduction)
            );

            // Apply damage to player
            const newPlayerHP = Math.max(0, playerHP - finalDamage);
            setPlayerHP(newPlayerHP);

            // Log the action
            addToLog(`${enemy.name} attacks for ${finalDamage} damage.`);

            // Check if player is defeated
            if (newPlayerHP <= 0) {
                handlePlayerDefeat();
                return;
            }

            // Reduce skill cooldowns
            reduceSkillCooldowns();

            // Set player turn
            setPlayerTurn(true);
        }
    };

    // Reduce all skill cooldowns by 1
    const reduceSkillCooldowns = () => {
        setSkillCooldowns((prevCooldowns) =>
            prevCooldowns.map((cooldown) => ({
                ...cooldown,
                remaining: Math.max(0, cooldown.remaining - 1),
            }))
        );
    };

    // Handle player skill use
    const useSkill = (skill) => {
        if (!playerTurn || loading || gameOver) return;

        // Find the cooldown for this skill
        const skillCooldown = skillCooldowns.find((cd) => cd.id === skill.id);

        // Check if the skill is on cooldown
        if (skillCooldown && skillCooldown.remaining > 0) {
            addToLog(
                `${skill.skill_name} is on cooldown for ${skillCooldown.remaining} more turns.`
            );
            return;
        }

        // Set the skill on cooldown
        setSkillCooldowns((prevCooldowns) =>
            prevCooldowns.map((cooldown) =>
                cooldown.id === skill.id
                    ? { ...cooldown, remaining: skill.cooldown_duration }
                    : cooldown
            )
        );

        // Handle different skill types
        switch (skill.skill_name) {
            case "Basic Attack":
                handleBasicAttack();
                break;
            case "Power Strike":
                handlePowerStrike();
                break;
            case "Heal":
                handleHeal();
                break;
            case "Shield Bash":
                handleShieldBash();
                break;
            case "Fireball":
                handleFireball();
                break;
            default:
                handleBasicAttack();
        }

        // Set enemy turn after player's action (with a small delay)
        setPlayerTurn(false);
        setTimeout(() => {
            enemyTurn();
        }, 1000);
    };

    // Handle basic attack
    const handleBasicAttack = () => {
        const rawDamage = getRandomValue(
            playerProfile.attack_min,
            playerProfile.attack_max
        );
        const damageReduction = Math.min(enemy.defense, rawDamage * 0.5);
        const finalDamage = Math.max(
            1,
            Math.floor(rawDamage - damageReduction)
        );

        const newEnemyHP = Math.max(0, enemyHP - finalDamage);
        setEnemyHP(newEnemyHP);

        addToLog(`You attack the ${enemy.name} for ${finalDamage} damage.`);

        if (newEnemyHP <= 0) {
            handleEnemyDefeat();
        }
    };

    // Handle power strike (stronger attack)
    const handlePowerStrike = () => {
        const rawDamage =
            getRandomValue(playerProfile.attack_min, playerProfile.attack_max) *
            1.5;
        const damageReduction = Math.min(enemy.defense, rawDamage * 0.5);
        const finalDamage = Math.max(
            1,
            Math.floor(rawDamage - damageReduction)
        );

        const newEnemyHP = Math.max(0, enemyHP - finalDamage);
        setEnemyHP(newEnemyHP);

        addToLog(
            `You use Power Strike on the ${enemy.name} for ${finalDamage} damage!`
        );

        if (newEnemyHP <= 0) {
            handleEnemyDefeat();
        }
    };

    // Handle heal skill
    const handleHeal = () => {
        const healAmount = playerProfile.heal;
        const newPlayerHP = Math.min(
            playerProfile.max_hp,
            playerHP + healAmount
        );
        setPlayerHP(newPlayerHP);

        addToLog(`You heal yourself for ${healAmount} HP.`);
    };

    // Handle shield bash
    const handleShieldBash = () => {
        const rawDamage = playerProfile.defense * 1.2;
        const damageReduction = Math.min(enemy.defense, rawDamage * 0.3);
        const finalDamage = Math.max(
            1,
            Math.floor(rawDamage - damageReduction)
        );

        const newEnemyHP = Math.max(0, enemyHP - finalDamage);
        setEnemyHP(newEnemyHP);

        addToLog(
            `You bash the ${enemy.name} with your shield for ${finalDamage} damage!`
        );

        if (newEnemyHP <= 0) {
            handleEnemyDefeat();
        }
    };

    // Handle fireball
    const handleFireball = () => {
        const rawDamage = getRandomValue(
            playerProfile.attack_min * 1.5,
            playerProfile.attack_max * 2
        );
        const damageReduction = Math.min(enemy.defense, rawDamage * 0.3); // Fireball ignores some defense
        const finalDamage = Math.max(
            1,
            Math.floor(rawDamage - damageReduction)
        );

        const newEnemyHP = Math.max(0, enemyHP - finalDamage);
        setEnemyHP(newEnemyHP);

        addToLog(
            `You cast Fireball at the ${enemy.name} for ${finalDamage} damage!`
        );

        if (newEnemyHP <= 0) {
            handleEnemyDefeat();
        }
    };

    // Handle enemy defeat
    const handleEnemyDefeat = async () => {
        addToLog(`You defeated the ${enemy.name}!`);

        try {
            // Notify the server of level completion
            await axios.post(route("player.complete-level"), {
                level: currentLevel,
                success: true,
            });

            // Level up every 5 levels
            if ((currentLevel + 1) % 5 === 0) {
                setLevelUp(true);
            } else {
                // Move to next level
                setCurrentLevel((prevLevel) => prevLevel + 1);
            }
        } catch (error) {
            console.error("Error updating level:", error);
        }
    };

    // Handle player defeat
    const handlePlayerDefeat = async () => {
        addToLog(`You were defeated by the ${enemy.name}!`);
        setGameOver(true);

        try {
            // Notify the server of player defeat
            await axios.post(route("player.complete-level"), {
                level: currentLevel,
                success: false,
            });
        } catch (error) {
            console.error("Error updating level:", error);
        }
    };

    // Handle stat upgrade
    const handleStatUpgrade = async (stat) => {
        try {
            const response = await axios.post(route("player.upgrade-stats"), {
                stat: stat,
            });

            // Update player profile with new stats
            const updatedProfile = response.data.playerProfile;

            addToLog(`You upgraded your ${stat.replace("_", " ")}!`);
            setLevelUp(false);

            // Apply upgrades to current game
            if (stat === "max_hp") {
                setPlayerHP((prevHP) => prevHP + 20);
            }

            // Move to next level
            setCurrentLevel((prevLevel) => prevLevel + 1);
        } catch (error) {
            console.error("Error upgrading stats:", error);
        }
    };

    // Handle exit game
    const handleExitGame = () => {
        router.post(route("player.exit-game"));
    };

    // Scroll the game log to the bottom when new messages are added
    useEffect(() => {
        const gameLogElement = document.getElementById("game-log");
        if (gameLogElement) {
            gameLogElement.scrollTop = gameLogElement.scrollHeight;
        }
    }, [gameLog]);

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <Head title={`Dungeon RPG - Level ${currentLevel}`} />

            <header className="border-b border-gray-800">
                <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 512 512"
                                className="h-10 w-10 fill-current text-red-500 mr-3"
                            >
                                <path d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3z" />
                            </svg>
                            <h1 className="text-xl font-bold">
                                Dungeon RPG - Level {currentLevel}
                            </h1>
                        </div>
                        <nav className="flex space-x-4">
                            <a
                                href={route("player.dashboard")}
                                className="px-3 py-2 text-sm font-medium text-gray-300 hover:text-white"
                            >
                                Dashboard
                            </a>
                            <a
                                href="#"
                                className="px-3 py-2 text-sm font-medium rounded-md border-b-2 border-red-500 text-white"
                            >
                                Play Game
                            </a>
                            <a
                                href={route("leaderboard")}
                                className="px-3 py-2 text-sm font-medium text-gray-300 hover:text-white"
                            >
                                Leaderboard
                            </a>
                        </nav>
                        <div className="flex items-center">
                            <span className="mr-2 text-sm text-gray-400">
                                Test User
                            </span>
                            <button className="text-gray-400 hover:text-white">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="w-5 h-5"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {/* Level Up Modal */}
                {levelUp && (
                    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                        <div className="bg-gray-800/90 bg-gradient-to-bl from-gray-700/90 via-transparent ring-1 ring-inset ring-white/10 rounded-lg shadow-2xl p-6 max-w-md w-full">
                            <h3 className="text-2xl font-bold mb-4 text-center">
                                Level Up!
                            </h3>
                            <p className="mb-6 text-center text-gray-300">
                                You've reached level {currentLevel + 1}! Choose
                                one stat to upgrade:
                            </p>

                            <div className="space-y-3">
                                <button
                                    onClick={() => handleStatUpgrade("max_hp")}
                                    className="w-full text-left p-3 bg-gray-700/50 hover:bg-gray-700 rounded-md flex justify-between items-center transition"
                                >
                                    <span>Max HP</span>
                                    <span className="text-green-400">+20</span>
                                </button>
                                <button
                                    onClick={() =>
                                        handleStatUpgrade("attack_min")
                                    }
                                    className="w-full text-left p-3 bg-gray-700/50 hover:bg-gray-700 rounded-md flex justify-between items-center transition"
                                >
                                    <span>Attack Minimum</span>
                                    <span className="text-green-400">+3</span>
                                </button>
                                <button
                                    onClick={() =>
                                        handleStatUpgrade("attack_max")
                                    }
                                    className="w-full text-left p-3 bg-gray-700/50 hover:bg-gray-700 rounded-md flex justify-between items-center transition"
                                >
                                    <span>Attack Maximum</span>
                                    <span className="text-green-400">+5</span>
                                </button>
                                <button
                                    onClick={() => handleStatUpgrade("defense")}
                                    className="w-full text-left p-3 bg-gray-700/50 hover:bg-gray-700 rounded-md flex justify-between items-center transition"
                                >
                                    <span>Defense</span>
                                    <span className="text-green-400">+2</span>
                                </button>
                                <button
                                    onClick={() => handleStatUpgrade("heal")}
                                    className="w-full text-left p-3 bg-gray-700/50 hover:bg-gray-700 rounded-md flex justify-between items-center transition"
                                >
                                    <span>Heal Value</span>
                                    <span className="text-green-400">+5</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Game Over Modal */}
                {gameOver && (
                    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                        <div className="bg-gray-800/90 bg-gradient-to-bl from-gray-700/90 via-transparent ring-1 ring-inset ring-white/10 rounded-lg shadow-2xl p-6 max-w-md w-full">
                            <h3 className="text-2xl font-bold mb-4 text-center text-red-500">
                                Game Over
                            </h3>
                            <p className="mb-4 text-center">
                                You were defeated at level {currentLevel}.
                            </p>
                            <p className="mb-6 text-center text-gray-300">
                                Your highest level reached:{" "}
                                {Math.max(
                                    currentLevel,
                                    playerProfile.highest_level_reached
                                )}
                            </p>

                            <div className="flex justify-center">
                                <button
                                    onClick={handleExitGame}
                                    className="px-6 py-3 bg-red-600 rounded-md font-semibold text-sm text-white uppercase tracking-widest hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition shadow-lg shadow-red-600/30"
                                >
                                    Return to Dashboard
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="bg-gray-800/50 bg-gradient-to-bl from-gray-700/50 via-transparent ring-1 ring-inset ring-white/5 rounded-lg shadow-2xl p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - Player */}
                        <div className="bg-gray-700/30 rounded-lg p-4">
                            <h3 className="text-xl font-bold mb-4">
                                {playerProfile.character_name || "Player"}
                            </h3>

                            {/* Health Bar */}
                            <div className="mb-6">
                                <div className="flex justify-between text-sm mb-1">
                                    <span>HP</span>
                                    <span>
                                        {playerHP} / {playerProfile.max_hp}
                                    </span>
                                </div>
                                <div className="w-full bg-gray-600 rounded-full h-4 overflow-hidden">
                                    <div
                                        className="bg-green-600 h-4 transition-all duration-300 ease-out"
                                        style={{
                                            width: `${
                                                (playerHP /
                                                    playerProfile.max_hp) *
                                                100
                                            }%`,
                                        }}
                                    ></div>
                                </div>
                            </div>

                            {/* Player Stats */}
                            <div className="grid grid-cols-2 gap-3 mb-6">
                                <div className="bg-gray-800/70 p-3 rounded-lg">
                                    <div className="text-sm text-gray-400">
                                        Attack
                                    </div>
                                    <div>
                                        {playerProfile.attack_min} -{" "}
                                        {playerProfile.attack_max}
                                    </div>
                                </div>
                                <div className="bg-gray-800/70 p-3 rounded-lg">
                                    <div className="text-sm text-gray-400">
                                        Defense
                                    </div>
                                    <div>{playerProfile.defense}</div>
                                </div>
                            </div>

                            {/* Skills */}
                            <h4 className="font-medium mb-3">Skills</h4>
                            <div className="space-y-2">
                                {skills.map((skill) => {
                                    const cooldown = skillCooldowns.find(
                                        (cd) => cd.id === skill.id
                                    );
                                    const isOnCooldown =
                                        cooldown && cooldown.remaining > 0;

                                    return (
                                        <button
                                            key={skill.id}
                                            onClick={() => useSkill(skill)}
                                            disabled={
                                                isOnCooldown ||
                                                !playerTurn ||
                                                loading ||
                                                gameOver
                                            }
                                            className={`w-full text-left p-3 rounded-md flex justify-between items-center ${
                                                isOnCooldown
                                                    ? "bg-gray-700/50 text-gray-500 cursor-not-allowed"
                                                    : playerTurn
                                                    ? "bg-blue-900/30 hover:bg-blue-900/50 cursor-pointer"
                                                    : "bg-gray-700/30 cursor-not-allowed"
                                            }`}
                                        >
                                            <span>{skill.skill_name}</span>
                                            {isOnCooldown && (
                                                <span className="text-sm bg-gray-800 px-2 py-1 rounded-full">
                                                    {cooldown.remaining}
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Middle Column - Enemy & Battle */}
                        <div className="lg:col-span-2 flex flex-col">
                            {/* Enemy Info */}
                            {loading ? (
                                <div className="flex items-center justify-center h-48 bg-gray-700/30 rounded-lg mb-4">
                                    <div className="w-12 h-12 border-t-2 border-b-2 border-red-500 rounded-full animate-spin"></div>
                                </div>
                            ) : enemy ? (
                                <div className="bg-gray-700/30 rounded-lg p-4 mb-4">
                                    <div className="flex justify-between items-center mb-3">
                                        <h3 className="text-xl font-bold">
                                            {enemy.name}{" "}
                                            <span className="text-sm font-normal text-gray-400">
                                                (Level {enemy.level})
                                            </span>
                                        </h3>
                                        <div className="text-sm">
                                            <span className="text-gray-400 mr-2">
                                                ATK
                                            </span>
                                            <span>
                                                {enemy.attack_min}-
                                                {enemy.attack_max}
                                            </span>
                                            <span className="text-gray-400 mx-2">
                                                DEF
                                            </span>
                                            <span>{enemy.defense}</span>
                                        </div>
                                    </div>

                                    {/* Enemy Health Bar */}
                                    <div className="mb-4">
                                        <div className="flex justify-between text-sm mb-1">
                                            <span>HP</span>
                                            <span>
                                                {enemyHP} / {enemy.hp}
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-600 rounded-full h-4 overflow-hidden">
                                            <div
                                                className="bg-red-600 h-4 transition-all duration-300 ease-out"
                                                style={{
                                                    width: `${
                                                        (enemyHP / enemy.hp) *
                                                        100
                                                    }%`,
                                                }}
                                            ></div>
                                        </div>
                                    </div>

                                    {/* Enemy Image */}
                                    <div className="flex justify-center my-6">
                                        <div className="h-40 w-40 bg-gray-800/70 rounded-lg flex items-center justify-center overflow-hidden">
                                            <img
                                                src={`/storage/${enemy.image_path}`}
                                                alt={enemy.name}
                                                className="h-auto max-h-full max-w-full object-contain"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-gray-700/30 rounded-lg p-4 mb-4 text-center">
                                    <p>No enemy found. Please try again.</p>
                                </div>
                            )}

                            {/* Battle Log */}
                            <div className="bg-gray-700/30 rounded-lg p-4 flex-grow">
                                <h3 className="text-lg font-bold mb-3">
                                    Battle Log
                                </h3>
                                <div
                                    id="game-log"
                                    className="bg-gray-800/70 border border-gray-700 rounded-lg p-4 h-64 overflow-y-auto text-sm font-mono"
                                >
                                    {gameLog.map((log, index) => (
                                        <p
                                            key={index}
                                            className={`mb-1 ${
                                                log.includes("You")
                                                    ? "text-cyan-400"
                                                    : log.includes("defeated")
                                                    ? "text-green-400"
                                                    : log.includes(
                                                          "defeated by"
                                                      )
                                                    ? "text-red-400"
                                                    : "text-gray-300"
                                            }`}
                                        >
                                            {log}
                                        </p>
                                    ))}
                                </div>
                            </div>

                            {/* Game Controls */}
                            <div className="flex justify-between items-center mt-4">
                                <div className="flex items-center space-x-3">
                                    <span className="text-sm px-3 py-1 bg-gray-800 rounded-md">
                                        Level: {currentLevel}
                                    </span>
                                    <span
                                        className={`text-sm px-3 py-1 rounded-md ${
                                            playerTurn
                                                ? "bg-green-900/50 text-green-300"
                                                : "bg-red-900/50 text-red-300"
                                        }`}
                                    >
                                        {playerTurn
                                            ? "Your turn"
                                            : "Enemy turn"}
                                    </span>
                                </div>
                                <button
                                    onClick={handleExitGame}
                                    className="px-4 py-2 bg-red-600 rounded-md text-sm font-medium hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition"
                                >
                                    Exit Game
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
