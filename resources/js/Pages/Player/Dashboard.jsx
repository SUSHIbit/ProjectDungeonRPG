import React, { useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import UserDropdown from "@/Components/UserDropdown"; // Import the component

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
        <div className="min-h-screen bg-gray-900 text-white">
            <Head title="Player Dashboard" />

            <header className="border-b border-gray-800">
                <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            <Link href="/">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 512 512"
                                    className="h-10 w-10 fill-current text-red-500 mr-3"
                                >
                                    <path d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3z" />
                                </svg>
                            </Link>
                            <h1 className="text-xl font-bold">
                                Player Dashboard
                            </h1>
                        </div>
                        <nav className="flex space-x-4">
                            <Link
                                href={route("player.dashboard")}
                                className="px-3 py-2 text-sm font-medium rounded-md border-b-2 border-red-500 text-white"
                            >
                                Dashboard
                            </Link>
                            <Link
                                href={route("player.start-game")}
                                className="px-3 py-2 text-sm font-medium text-gray-300 hover:text-white"
                            >
                                Play Game
                            </Link>
                            <Link
                                href={route("leaderboard")}
                                className="px-3 py-2 text-sm font-medium text-gray-300 hover:text-white"
                            >
                                Leaderboard
                            </Link>
                        </nav>

                        {/* User dropdown */}
                        <UserDropdown user={auth.user} />
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-extrabold">
                        Welcome, {auth.user.name}!
                    </h2>
                </div>

                <div className="bg-gray-800/50 bg-gradient-to-bl from-gray-700/50 via-transparent ring-1 ring-inset ring-white/5 rounded-lg shadow-2xl shadow-gray-500/20 p-6 mb-6">
                    {characterNameEditing ? (
                        <form onSubmit={handleCharacterNameSubmit}>
                            <InputLabel
                                htmlFor="character_name"
                                value="Character Name"
                                className="text-white"
                            />
                            <TextInput
                                id="character_name"
                                type="text"
                                className="mt-1 block w-full bg-gray-700 border-gray-600 text-white focus:border-red-500 focus:ring-red-500 rounded-md shadow-sm"
                                value={data.character_name}
                                onChange={(e) =>
                                    setData("character_name", e.target.value)
                                }
                                required
                                autoFocus
                            />
                            <InputError
                                message={errors.character_name}
                                className="mt-2"
                            />
                            <div className="flex space-x-2 mt-4">
                                <button
                                    type="submit"
                                    className="inline-flex items-center px-4 py-2 bg-red-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition ease-in-out duration-150"
                                    disabled={processing}
                                >
                                    Save
                                </button>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setCharacterNameEditing(false)
                                    }
                                    className="inline-flex items-center px-4 py-2 bg-gray-700 border border-gray-600 rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition ease-in-out duration-150"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-semibold">
                                    Character Name
                                </h3>
                                <p className="text-2xl mt-1 text-white">
                                    {playerProfile.character_name ||
                                        "Unnamed Hero"}
                                </p>
                            </div>
                            <button
                                onClick={() => setCharacterNameEditing(true)}
                                className="inline-flex items-center px-4 py-2 bg-gray-700 border border-gray-600 rounded-md font-semibold text-xs text-white uppercase tracking-widest shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition ease-in-out duration-150"
                            >
                                Edit Name
                            </button>
                        </div>
                    )}
                </div>

                <div className="bg-gray-800/50 bg-gradient-to-bl from-gray-700/50 via-transparent ring-1 ring-inset ring-white/5 rounded-lg shadow-2xl shadow-gray-500/20 p-6 mb-6">
                    <h3 className="text-lg font-semibold mb-4">
                        Character Stats
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        <div className="bg-gray-700/50 bg-gradient-to-bl from-gray-600/50 via-transparent ring-1 ring-inset ring-white/10 p-4 rounded-lg shadow">
                            <div className="text-sm text-gray-400">Level</div>
                            <div className="text-xl font-bold">
                                {playerProfile.current_level}
                            </div>
                        </div>
                        <div className="bg-gray-700/50 bg-gradient-to-bl from-gray-600/50 via-transparent ring-1 ring-inset ring-white/10 p-4 rounded-lg shadow">
                            <div className="text-sm text-gray-400">Max HP</div>
                            <div className="text-xl font-bold">
                                {playerProfile.max_hp}
                            </div>
                        </div>
                        <div className="bg-gray-700/50 bg-gradient-to-bl from-gray-600/50 via-transparent ring-1 ring-inset ring-white/10 p-4 rounded-lg shadow">
                            <div className="text-sm text-gray-400">
                                Attack Range
                            </div>
                            <div className="text-xl font-bold">
                                {playerProfile.attack_min} -{" "}
                                {playerProfile.attack_max}
                            </div>
                        </div>
                        <div className="bg-gray-700/50 bg-gradient-to-bl from-gray-600/50 via-transparent ring-1 ring-inset ring-white/10 p-4 rounded-lg shadow">
                            <div className="text-sm text-gray-400">Defense</div>
                            <div className="text-xl font-bold">
                                {playerProfile.defense}
                            </div>
                        </div>
                        <div className="bg-gray-700/50 bg-gradient-to-bl from-gray-600/50 via-transparent ring-1 ring-inset ring-white/10 p-4 rounded-lg shadow">
                            <div className="text-sm text-gray-400">
                                Heal Value
                            </div>
                            <div className="text-xl font-bold">
                                {playerProfile.heal}
                            </div>
                        </div>
                        <div className="bg-gray-700/50 bg-gradient-to-bl from-gray-600/50 via-transparent ring-1 ring-inset ring-white/10 p-4 rounded-lg shadow">
                            <div className="text-sm text-gray-400">
                                Highest Level Reached
                            </div>
                            <div className="text-xl font-bold">
                                {playerProfile.highest_level_reached}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-800/50 bg-gradient-to-bl from-gray-700/50 via-transparent ring-1 ring-inset ring-white/5 rounded-lg shadow-2xl shadow-gray-500/20 p-6 mb-6">
                    <h3 className="text-lg font-semibold mb-4">Skills</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {skills.map((skill) => (
                            <div
                                key={skill.id}
                                className="bg-gray-700/50 bg-gradient-to-bl from-gray-600/50 via-transparent ring-1 ring-inset ring-white/10 p-4 rounded-lg shadow"
                            >
                                <div className="font-medium">
                                    {skill.skill_name}
                                </div>
                                <div className="text-sm text-gray-400">
                                    Cooldown: {skill.cooldown_duration}{" "}
                                    {skill.cooldown_duration === 1
                                        ? "turn"
                                        : "turns"}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
                    <Link
                        href={route("player.start-game")}
                        className="inline-flex items-center justify-center px-6 py-3 bg-red-600 border border-transparent rounded-md font-semibold text-sm text-white uppercase tracking-widest hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition ease-in-out duration-150 shadow-lg shadow-red-600/30"
                    >
                        Play Game
                    </Link>
                    <Link
                        href={route("leaderboard")}
                        className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 border border-transparent rounded-md font-semibold text-sm text-white uppercase tracking-widest hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition ease-in-out duration-150 shadow-lg shadow-blue-600/30"
                    >
                        Leaderboard
                    </Link>
                    <Link
                        href={route("logout")}
                        method="post"
                        as="button"
                        className="inline-flex items-center justify-center px-6 py-3 bg-gray-700 border border-gray-600 rounded-md font-semibold text-sm text-white uppercase tracking-widest hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-gray-800 transition ease-in-out duration-150"
                    >
                        Quit
                    </Link>
                </div>
            </main>
        </div>
    );
}
