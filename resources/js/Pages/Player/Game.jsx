// resources/js/Pages/Player/Game.jsx
import React, { useEffect, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import axios from "axios";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import DangerButton from "@/Components/DangerButton";

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
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Dungeon RPG - Level {currentLevel}
                </h2>
            }
        >
            <Head title={`Level ${currentLevel}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {/* Level Stat Upgrade Dialog */}
                            {levelUp && (
                                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                                        <h3 className="text-xl font-bold mb-4">
                                            Level Up!
                                        </h3>
                                        <p className="mb-4">
                                            You've reached level{" "}
                                            {currentLevel + 1}! Choose one stat
                                            to upgrade:
                                        </p>

                                        <div className="space-y-2">
                                            <button
                                                onClick={() =>
                                                    handleStatUpgrade("max_hp")
                                                }
                                                className="w-full text-left p-2 hover:bg-gray-100 rounded flex justify-between"
                                            >
                                                <span>Max HP</span>
                                                <span>+20</span>
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleStatUpgrade(
                                                        "attack_min"
                                                    )
                                                }
                                                className="w-full text-left p-2 hover:bg-gray-100 rounded flex justify-between"
                                            >
                                                <span>Attack Minimum</span>
                                                <span>+3</span>
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleStatUpgrade(
                                                        "attack_max"
                                                    )
                                                }
                                                className="w-full text-left p-2 hover:bg-gray-100 rounded flex justify-between"
                                            >
                                                <span>Attack Maximum</span>
                                                <span>+5</span>
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleStatUpgrade("defense")
                                                }
                                                className="w-full text-left p-2 hover:bg-gray-100 rounded flex justify-between"
                                            >
                                                <span>Defense</span>
                                                <span>+2</span>
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleStatUpgrade("heal")
                                                }
                                                className="w-full text-left p-2 hover:bg-gray-100 rounded flex justify-between"
                                            >
                                                <span>Heal Value</span>
                                                <span>+5</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Game Over Dialog */}
                            {gameOver && (
                                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                                        <h3 className="text-xl font-bold mb-4">
                                            Game Over
                                        </h3>
                                        <p className="mb-4">
                                            You were defeated at level{" "}
                                            {currentLevel}.
                                        </p>
                                        <p className="mb-6">
                                            Your highest level reached:{" "}
                                            {Math.max(
                                                currentLevel,
                                                playerProfile.highest_level_reached
                                            )}
                                        </p>

                                        <div className="flex justify-end">
                                            <PrimaryButton
                                                onClick={handleExitGame}
                                            >
                                                Return to Dashboard
                                            </PrimaryButton>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Main Game Area */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Left Column - Player Info */}
                                <div className="bg-gray-50 p-4 rounded-md">
                                    <h3 className="text-lg font-semibold mb-2">
                                        {playerProfile.character_name ||
                                            "Player"}
                                    </h3>

                                    {/* Health Bar */}
                                    <div className="mb-4">
                                        <div className="flex justify-between text-sm mb-1">
                                            <span>HP</span>
                                            <span>
                                                {playerHP} /{" "}
                                                {playerProfile.max_hp}
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-300 rounded-full h-4">
                                            <div
                                                className="bg-green-600 h-4 rounded-full"
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
                                    <div className="space-y-2 mb-4">
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="bg-white p-2 rounded shadow text-sm">
                                                <span className="text-gray-600">
                                                    Attack
                                                </span>
                                                <div>
                                                    {playerProfile.attack_min} -{" "}
                                                    {playerProfile.attack_max}
                                                </div>
                                            </div>
                                            <div className="bg-white p-2 rounded shadow text-sm">
                                                <span className="text-gray-600">
                                                    Defense
                                                </span>
                                                <div>
                                                    {playerProfile.defense}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Player Skills */}
                                    <h4 className="font-medium mb-2">Skills</h4>
                                    <div className="space-y-2">
                                        {skills.map((skill) => {
                                            const cooldown =
                                                skillCooldowns.find(
                                                    (cd) => cd.id === skill.id
                                                );
                                            const isOnCooldown =
                                                cooldown &&
                                                cooldown.remaining > 0;

                                            return (
                                                <button
                                                    key={skill.id}
                                                    onClick={() =>
                                                        useSkill(skill)
                                                    }
                                                    disabled={
                                                        isOnCooldown ||
                                                        !playerTurn ||
                                                        loading ||
                                                        gameOver
                                                    }
                                                    className={`w-full text-left p-2 rounded flex justify-between items-center ${
                                                        isOnCooldown
                                                            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                                            : playerTurn
                                                            ? "bg-blue-100 hover:bg-blue-200"
                                                            : "bg-gray-100"
                                                    }`}
                                                >
                                                    <span>
                                                        {skill.skill_name}
                                                    </span>
                                                    {isOnCooldown && (
                                                        <span className="text-sm bg-gray-300 px-2 py-1 rounded-full">
                                                            {cooldown.remaining}
                                                        </span>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Middle Column - Battle Area */}
                                <div className="md:col-span-2">
                                    {/* Enemy Info */}
                                    {loading ? (
                                        <div className="flex items-center justify-center h-48">
                                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                                        </div>
                                    ) : enemy ? (
                                        <div className="bg-gray-50 p-4 rounded-md mb-4">
                                            <div className="flex justify-between items-center mb-2">
                                                <h3 className="text-lg font-semibold">
                                                    {enemy.name} (Level{" "}
                                                    {enemy.level})
                                                </h3>
                                                <div className="text-sm">
                                                    <span className="text-gray-600 mr-2">
                                                        ATK
                                                    </span>
                                                    {enemy.attack_min}-
                                                    {enemy.attack_max}
                                                    <span className="text-gray-600 mx-2">
                                                        DEF
                                                    </span>
                                                    {enemy.defense}
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
                                                <div className="w-full bg-gray-300 rounded-full h-4">
                                                    <div
                                                        className="bg-red-600 h-4 rounded-full"
                                                        style={{
                                                            width: `${
                                                                (enemyHP /
                                                                    enemy.hp) *
                                                                100
                                                            }%`,
                                                        }}
                                                    ></div>
                                                </div>
                                            </div>

                                            {/* Enemy Image */}
                                            <div className="flex justify-center my-4">
                                                <img
                                                    src={`/storage/${enemy.image_path}`}
                                                    alt={enemy.name}
                                                    className="h-40 object-contain"
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="bg-gray-50 p-4 rounded-md text-center">
                                            <p>
                                                No enemy found. Please try
                                                again.
                                            </p>
                                        </div>
                                    )}

                                    {/* Game Log */}
                                    <div className="bg-gray-50 p-4 rounded-md">
                                        <h3 className="text-lg font-semibold mb-2">
                                            Battle Log
                                        </h3>
                                        <div
                                            id="game-log"
                                            className="bg-white border border-gray-200 rounded p-3 h-64 overflow-y-auto text-sm"
                                        >
                                            {gameLog.map((log, index) => (
                                                <p key={index} className="mb-1">
                                                    {log}
                                                </p>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Game Controls */}
                                    <div className="mt-4 flex justify-between">
                                        <div>
                                            <span className="mr-2 text-sm">
                                                Level: {currentLevel}
                                            </span>
                                            <span className="text-sm">
                                                {playerTurn
                                                    ? "Your turn"
                                                    : "Enemy turn"}
                                            </span>
                                        </div>
                                        <DangerButton onClick={handleExitGame}>
                                            Exit Game
                                        </DangerButton>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
