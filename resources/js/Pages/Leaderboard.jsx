import React from "react";
import { Head, Link } from "@inertiajs/react";

export default function Leaderboard({ auth, leaderboard }) {
    return (
        <div className="min-h-screen bg-dots-darker bg-center bg-gray-100 dark:bg-dots-lighter dark:bg-gray-900 selection:bg-red-500 selection:text-white">
            <Head title="Leaderboard" />

            <div className="pt-6 sm:pt-0 flex flex-col items-center">
                <div className="py-8">
                    <Link href="/">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 512 512"
                            className="h-20 w-auto fill-current text-red-500"
                        >
                            <path d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3z" />
                        </svg>
                    </Link>
                </div>

                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 w-full">
                    <h2 className="text-4xl font-extrabold tracking-tight text-center text-gray-900 dark:text-white mb-8">
                        Dungeon Heroes
                    </h2>

                    <div className="scale-100 p-6 bg-white dark:bg-gray-800/50 dark:bg-gradient-to-bl from-gray-700/50 via-transparent dark:ring-1 dark:ring-inset dark:ring-white/5 rounded-lg shadow-2xl shadow-gray-500/20 dark:shadow-none overflow-hidden">
                        {/* Leaderboard Table */}
                        <div className="overflow-x-auto mb-6">
                            <table className="min-w-full">
                                <thead>
                                    <tr className="dark:bg-gray-700/70 text-gray-600 dark:text-gray-300 uppercase text-sm leading-normal">
                                        <th className="py-3 px-6 text-left rounded-tl-lg">
                                            Rank
                                        </th>
                                        <th className="py-3 px-6 text-left">
                                            Character Name
                                        </th>
                                        <th className="py-3 px-6 text-left">
                                            Player
                                        </th>
                                        <th className="py-3 px-6 text-center rounded-tr-lg">
                                            Highest Level
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="text-gray-600 dark:text-gray-400 text-sm">
                                    {leaderboard.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan="4"
                                                className="py-4 px-6 text-center dark:bg-gray-700/30"
                                            >
                                                No players on the leaderboard
                                                yet. Be the first!
                                            </td>
                                        </tr>
                                    ) : (
                                        leaderboard.map((entry, index) => (
                                            <tr
                                                key={index}
                                                className={
                                                    index % 2 === 0
                                                        ? "dark:bg-gray-700/30"
                                                        : "dark:bg-gray-700/10"
                                                }
                                            >
                                                <td className="py-3 px-6 text-left">
                                                    {index === 0 && (
                                                        <span className="text-yellow-500 font-bold">
                                                            🏆 1
                                                        </span>
                                                    )}
                                                    {index === 1 && (
                                                        <span className="text-gray-400 font-bold">
                                                            🥈 2
                                                        </span>
                                                    )}
                                                    {index === 2 && (
                                                        <span className="text-amber-600 font-bold">
                                                            🥉 3
                                                        </span>
                                                    )}
                                                    {index > 2 && (
                                                        <span>{index + 1}</span>
                                                    )}
                                                </td>
                                                <td className="py-3 px-6 text-left font-medium">
                                                    {entry.character_name ||
                                                        "Unnamed Hero"}
                                                </td>
                                                <td className="py-3 px-6 text-left">
                                                    {entry.user_name}
                                                </td>
                                                <td className="py-3 px-6 text-center">
                                                    <span className="bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-200 py-1 px-3 rounded-full text-xs">
                                                        Level{" "}
                                                        {entry.highest_level}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Return Button */}
                    <div className="flex justify-center mt-8 mb-12">
                        <Link
                            href={route("player.dashboard")}
                            className="inline-flex items-center px-4 py-2 bg-red-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-700 focus:bg-red-700 active:bg-red-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition ease-in-out duration-150"
                        >
                            Return to Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
