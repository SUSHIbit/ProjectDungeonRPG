import React, { useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";

export default function CreateEnemy({ auth }) {
    const [imagePreview, setImagePreview] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        level_group: "",
        hp: "",
        attack_min: "",
        attack_max: "",
        defense: "",
        image: null,
    });

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setData("image", file);

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setImagePreview(null);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("admin.enemies.store"), {
            forceFormData: true,
        });
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <Head title="Create Enemy" />

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
                                className="px-3 py-2 text-sm font-medium rounded-md text-gray-300 hover:text-white"
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

            <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-extrabold mb-8">
                    Create New Enemy
                </h2>

                <div className="bg-gray-800/50 bg-gradient-to-bl from-gray-700/50 via-transparent ring-1 ring-inset ring-white/5 rounded-lg shadow-2xl shadow-gray-500/20 p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium text-gray-300 mb-1"
                            >
                                Enemy Name
                            </label>
                            <input
                                id="name"
                                type="text"
                                className="mt-1 block w-full rounded-md bg-gray-700/50 border-gray-600 placeholder-gray-400 text-white focus:border-red-500 focus:ring-red-500"
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                                required
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="level_group"
                                className="block text-sm font-medium text-gray-300 mb-1"
                            >
                                Level Group (1-5)
                            </label>
                            <input
                                id="level_group"
                                type="number"
                                min="1"
                                max="5"
                                className="mt-1 block w-full rounded-md bg-gray-700/50 border-gray-600 placeholder-gray-400 text-white focus:border-red-500 focus:ring-red-500"
                                value={data.level_group}
                                onChange={(e) =>
                                    setData("level_group", e.target.value)
                                }
                                required
                            />
                            <p className="mt-1 text-sm text-gray-400">
                                Group 1: Levels 1-10, Group 2: Levels 11-20,
                                etc.
                            </p>
                            {errors.level_group && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.level_group}
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label
                                    htmlFor="hp"
                                    className="block text-sm font-medium text-gray-300 mb-1"
                                >
                                    HP
                                </label>
                                <input
                                    id="hp"
                                    type="number"
                                    min="1"
                                    className="mt-1 block w-full rounded-md bg-gray-700/50 border-gray-600 placeholder-gray-400 text-white focus:border-red-500 focus:ring-red-500"
                                    value={data.hp}
                                    onChange={(e) =>
                                        setData("hp", e.target.value)
                                    }
                                    required
                                />
                                {errors.hp && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.hp}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="defense"
                                    className="block text-sm font-medium text-gray-300 mb-1"
                                >
                                    Defense
                                </label>
                                <input
                                    id="defense"
                                    type="number"
                                    min="0"
                                    className="mt-1 block w-full rounded-md bg-gray-700/50 border-gray-600 placeholder-gray-400 text-white focus:border-red-500 focus:ring-red-500"
                                    value={data.defense}
                                    onChange={(e) =>
                                        setData("defense", e.target.value)
                                    }
                                    required
                                />
                                {errors.defense && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.defense}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label
                                    htmlFor="attack_min"
                                    className="block text-sm font-medium text-gray-300 mb-1"
                                >
                                    Minimum Attack
                                </label>
                                <input
                                    id="attack_min"
                                    type="number"
                                    min="1"
                                    className="mt-1 block w-full rounded-md bg-gray-700/50 border-gray-600 placeholder-gray-400 text-white focus:border-red-500 focus:ring-red-500"
                                    value={data.attack_min}
                                    onChange={(e) =>
                                        setData("attack_min", e.target.value)
                                    }
                                    required
                                />
                                {errors.attack_min && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.attack_min}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="attack_max"
                                    className="block text-sm font-medium text-gray-300 mb-1"
                                >
                                    Maximum Attack
                                </label>
                                <input
                                    id="attack_max"
                                    type="number"
                                    min="1"
                                    className="mt-1 block w-full rounded-md bg-gray-700/50 border-gray-600 placeholder-gray-400 text-white focus:border-red-500 focus:ring-red-500"
                                    value={data.attack_max}
                                    onChange={(e) =>
                                        setData("attack_max", e.target.value)
                                    }
                                    required
                                />
                                {errors.attack_max && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.attack_max}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="image"
                                className="block text-sm font-medium text-gray-300 mb-1"
                            >
                                Enemy Image
                            </label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md">
                                <div className="space-y-1 text-center">
                                    {imagePreview ? (
                                        <div className="mt-2 flex justify-center">
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                className="h-40 object-contain"
                                            />
                                        </div>
                                    ) : (
                                        <svg
                                            className="mx-auto h-12 w-12 text-gray-400"
                                            stroke="currentColor"
                                            fill="none"
                                            viewBox="0 0 48 48"
                                            aria-hidden="true"
                                        >
                                            <path
                                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                                strokeWidth={2}
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    )}
                                    <div className="flex text-sm text-gray-400 justify-center">
                                        <label
                                            htmlFor="image"
                                            className="relative cursor-pointer bg-gray-700 px-3 py-2 rounded-md font-medium text-white hover:bg-gray-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-red-500"
                                        >
                                            <span>Upload an image</span>
                                            <input
                                                id="image"
                                                name="image"
                                                type="file"
                                                accept="image/*"
                                                className="sr-only"
                                                onChange={handleImageChange}
                                                required
                                            />
                                        </label>
                                    </div>
                                    <p className="text-xs text-gray-400">
                                        PNG, JPG, GIF up to 2MB
                                    </p>
                                </div>
                            </div>
                            {errors.image && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.image}
                                </p>
                            )}
                        </div>

                        <div className="flex justify-end space-x-3 mt-8">
                            <Link
                                href={route("admin.enemies.index")}
                                className="inline-flex items-center px-4 py-2 bg-gray-700 border border-gray-600 rounded-md font-semibold text-xs text-white uppercase tracking-widest shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center px-4 py-2 bg-red-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition shadow-lg shadow-red-600/30"
                            >
                                Create Enemy
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}
