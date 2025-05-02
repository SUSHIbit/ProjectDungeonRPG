import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import SecondaryButton from "@/Components/SecondaryButton";

export default function Leaderboard({ auth, leaderboard }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Leaderboard
                </h2>
            }
        >
            <Head title="Leaderboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h2 className="text-2xl font-bold mb-6 text-center">
                                Dungeon Heroes
                            </h2>

                            {/* Leaderboard Table */}
                            <div className="overflow-x-auto mb-6">
                                <table className="min-w-full bg-white">
                                    <thead>
                                        <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                                            <th className="py-3 px-6 text-left">
                                                Rank
                                            </th>
                                            <th className="py-3 px-6 text-left">
                                                Character Name
                                            </th>
                                            <th className="py-3 px-6 text-left">
                                                Player
                                            </th>
                                            <th className="py-3 px-6 text-center">
                                                Highest Level
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-gray-600 text-sm">
                                        {leaderboard.length === 0 ? (
                                            <tr>
                                                <td
                                                    colSpan="4"
                                                    className="py-4 px-6 text-center"
                                                >
                                                    No players on the
                                                    leaderboard yet. Be the
                                                    first!
                                                </td>
                                            </tr>
                                        ) : (
                                            leaderboard.map((entry, index) => (
                                                <tr
                                                    key={index}
                                                    className={
                                                        index % 2 === 0
                                                            ? "bg-gray-50"
                                                            : "bg-white"
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
                                                            <span>
                                                                {index + 1}
                                                            </span>
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
                                                        <span className="bg-green-200 text-green-800 py-1 px-3 rounded-full text-xs">
                                                            Level{" "}
                                                            {
                                                                entry.highest_level
                                                            }
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Return Button */}
                            <div className="flex justify-center">
                                <Link
                                    href={route("player.dashboard")}
                                    className="inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                >
                                    Return to Dashboard
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
