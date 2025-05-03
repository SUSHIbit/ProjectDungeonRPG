import React from "react";
import { Head, Link, router } from "@inertiajs/react";

export default function EnemyIndex({ auth, enemies }) {
    const enemyGroups = Object.keys(enemies).map((levelGroup) => ({
        levelGroup: levelGroup,
        enemies: enemies[levelGroup],
    }));

    const handleDelete = (enemyId) => {
        if (confirm("Are you sure you want to delete this enemy?")) {
            router.delete(route("admin.enemies.destroy", enemyId));
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <Head title="Manage Enemies" />

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
                                Admin Dashboard
                            </h1>
                        </div>
                        <nav className="flex space-x-4">
                            <Link
                                href={route("admin.enemies.index")}
                                className="px-3 py-2 text-sm font-medium rounded-md border-b-2 border-red-500 text-white"
                            >
                                Manage Enemies
                            </Link>
                        </nav>
                        <div className="flex items-center">
                            <span className="mr-2 text-sm text-gray-400">
                                {auth.user.name}
                            </span>
                            <Link
                                href={route("logout")}
                                method="post"
                                as="button"
                                className="text-gray-400 hover:text-white"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-5 h-5"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                                    />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-extrabold">Enemy Database</h2>
                    <Link href={route("admin.enemies.create")}>
                        <button className="inline-flex items-center justify-center px-6 py-3 bg-red-600 border border-transparent rounded-md font-semibold text-sm text-white uppercase tracking-widest hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition ease-in-out duration-150 shadow-lg shadow-red-600/30">
                            Add New Enemy
                        </button>
                    </Link>
                </div>

                {enemyGroups.length === 0 ? (
                    <div className="bg-gray-800/50 bg-gradient-to-bl from-gray-700/50 via-transparent ring-1 ring-inset ring-white/5 rounded-lg shadow-2xl shadow-gray-500/20 p-12 text-center">
                        <p className="mb-4 text-xl">
                            No enemies found in the database.
                        </p>
                        <Link href={route("admin.enemies.create")}>
                            <button className="inline-flex items-center justify-center px-6 py-3 bg-red-600 border border-transparent rounded-md font-semibold text-sm text-white uppercase tracking-widest hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition ease-in-out duration-150 shadow-lg shadow-red-600/30">
                                Create Your First Enemy
                            </button>
                        </Link>
                    </div>
                ) : (
                    enemyGroups.map((group) => (
                        <div key={group.levelGroup} className="mb-10">
                            <h3 className="text-2xl font-bold mb-4 py-2 pl-4 bg-gray-800/70 rounded-lg border-l-4 border-red-500">
                                Level Group {group.levelGroup} (Levels{" "}
                                {(group.levelGroup - 1) * 10 + 1}-
                                {group.levelGroup * 10})
                            </h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {group.enemies.map((enemy) => (
                                    <div
                                        key={enemy.id}
                                        className="bg-gray-800/50 bg-gradient-to-bl from-gray-700/50 via-transparent ring-1 ring-inset ring-white/5 rounded-lg shadow-2xl shadow-gray-500/20 overflow-hidden"
                                    >
                                        <div className="h-40 bg-gray-700/30 flex items-center justify-center p-4">
                                            <img
                                                src={`/storage/${enemy.image_path}`}
                                                alt={enemy.name}
                                                className="object-contain h-full max-w-full"
                                            />
                                        </div>
                                        <div className="p-4">
                                            <h4 className="font-bold text-xl mb-2">
                                                {enemy.name}
                                            </h4>
                                            <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                                                <div className="bg-gray-700/50 p-2 rounded-md">
                                                    <span className="text-gray-400">
                                                        HP:
                                                    </span>{" "}
                                                    {enemy.hp}
                                                </div>
                                                <div className="bg-gray-700/50 p-2 rounded-md">
                                                    <span className="text-gray-400">
                                                        DEF:
                                                    </span>{" "}
                                                    {enemy.defense}
                                                </div>
                                                <div className="bg-gray-700/50 p-2 rounded-md col-span-2">
                                                    <span className="text-gray-400">
                                                        ATK:
                                                    </span>{" "}
                                                    {enemy.attack_min}-
                                                    {enemy.attack_max}
                                                </div>
                                            </div>
                                            <div className="flex space-x-2">
                                                <Link
                                                    href={route(
                                                        "admin.enemies.edit",
                                                        enemy.id
                                                    )}
                                                    className="flex-1"
                                                >
                                                    <button className="w-full py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-sm font-medium transition duration-150 ease-in-out">
                                                        Edit
                                                    </button>
                                                </Link>
                                                <button
                                                    onClick={() =>
                                                        handleDelete(enemy.id)
                                                    }
                                                    className="flex-1 py-2 bg-red-600 hover:bg-red-500 rounded-md text-sm font-medium transition duration-150 ease-in-out"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </main>
        </div>
    );
}
