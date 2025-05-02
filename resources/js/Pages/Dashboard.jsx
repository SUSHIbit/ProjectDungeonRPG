import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import InputError from "@/Components/InputError";

export default function Dashboard({ auth, playerProfile, skills }) {
    const [characterNameEditing, setCharacterNameEditing] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        character_name: playerProfile.character_name || "",
    });

    const handleCharacterNameSubmit = (e) => {
        e.preventDefault();

        post(route("player.update-profile"), {
            onSuccess: () => {
                setCharacterNameEditing(false);
            },
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Player Dashboard
                </h2>
            }
        >
            <Head title="Player Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h2 className="text-2xl font-bold mb-6 text-center">
                                Welcome, {auth.user.name}!
                            </h2>

                            {/* Character Name */}
                            <div className="mb-6 bg-gray-50 p-4 rounded-md">
                                {characterNameEditing ? (
                                    <form onSubmit={handleCharacterNameSubmit}>
                                        <InputLabel
                                            htmlFor="character_name"
                                            value="Character Name"
                                        />
                                        <TextInput
                                            id="character_name"
                                            type="text"
                                            className="mt-1 block w-full"
                                            value={data.character_name}
                                            onChange={(e) =>
                                                setData(
                                                    "character_name",
                                                    e.target.value
                                                )
                                            }
                                            required
                                            autoFocus
                                        />
                                        <InputError
                                            message={errors.character_name}
                                            className="mt-2"
                                        />
                                        <div className="flex space-x-2 mt-2">
                                            <PrimaryButton
                                                processing={processing}
                                            >
                                                Save
                                            </PrimaryButton>
                                            <SecondaryButton
                                                onClick={() =>
                                                    setCharacterNameEditing(
                                                        false
                                                    )
                                                }
                                            >
                                                Cancel
                                            </SecondaryButton>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h3 className="text-lg font-semibold">
                                                Character Name
                                            </h3>
                                            <p className="text-xl mt-1">
                                                {playerProfile.character_name ||
                                                    "Unnamed Hero"}
                                            </p>
                                        </div>
                                        <SecondaryButton
                                            onClick={() =>
                                                setCharacterNameEditing(true)
                                            }
                                        >
                                            Edit Name
                                        </SecondaryButton>
                                    </div>
                                )}
                            </div>

                            {/* Player Stats */}
                            <div className="mb-6 bg-gray-50 p-4 rounded-md">
                                <h3 className="text-lg font-semibold mb-2">
                                    Character Stats
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    <div className="bg-white p-3 rounded shadow">
                                        <div className="text-sm text-gray-600">
                                            Level
                                        </div>
                                        <div className="text-xl font-bold">
                                            {playerProfile.current_level}
                                        </div>
                                    </div>
                                    <div className="bg-white p-3 rounded shadow">
                                        <div className="text-sm text-gray-600">
                                            Max HP
                                        </div>
                                        <div className="text-xl font-bold">
                                            {playerProfile.max_hp}
                                        </div>
                                    </div>
                                    <div className="bg-white p-3 rounded shadow">
                                        <div className="text-sm text-gray-600">
                                            Attack Range
                                        </div>
                                        <div className="text-xl font-bold">
                                            {playerProfile.attack_min} -{" "}
                                            {playerProfile.attack_max}
                                        </div>
                                    </div>
                                    <div className="bg-white p-3 rounded shadow">
                                        <div className="text-sm text-gray-600">
                                            Defense
                                        </div>
                                        <div className="text-xl font-bold">
                                            {playerProfile.defense}
                                        </div>
                                    </div>
                                    <div className="bg-white p-3 rounded shadow">
                                        <div className="text-sm text-gray-600">
                                            Heal Value
                                        </div>
                                        <div className="text-xl font-bold">
                                            {playerProfile.heal}
                                        </div>
                                    </div>
                                    <div className="bg-white p-3 rounded shadow">
                                        <div className="text-sm text-gray-600">
                                            Highest Level Reached
                                        </div>
                                        <div className="text-xl font-bold">
                                            {
                                                playerProfile.highest_level_reached
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Skills */}
                            <div className="mb-6 bg-gray-50 p-4 rounded-md">
                                <h3 className="text-lg font-semibold mb-2">
                                    Skills
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {skills.map((skill) => (
                                        <div
                                            key={skill.id}
                                            className="bg-white p-3 rounded shadow"
                                        >
                                            <div className="font-medium">
                                                {skill.skill_name}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                Cooldown:{" "}
                                                {skill.cooldown_duration}{" "}
                                                {skill.cooldown_duration === 1
                                                    ? "turn"
                                                    : "turns"}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                                <Link
                                    href={route("player.start-game")}
                                    className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700 focus:bg-green-700 active:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition ease-in-out duration-150 justify-center"
                                >
                                    Play Game
                                </Link>
                                <Link
                                    href={route("leaderboard")}
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150 justify-center"
                                >
                                    Leaderboard
                                </Link>
                                <Link
                                    href={route("logout")}
                                    method="post"
                                    as="button"
                                    className="inline-flex items-center px-4 py-2 bg-red-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-700 focus:bg-red-700 active:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition ease-in-out duration-150 justify-center"
                                >
                                    Quit
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
