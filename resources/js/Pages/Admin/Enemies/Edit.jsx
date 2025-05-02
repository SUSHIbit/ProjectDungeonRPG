import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";

export default function EditEnemy({ auth, enemy }) {
    const [imagePreview, setImagePreview] = useState(null);

    const { data, setData, post, processing, errors } = useForm({
        name: enemy.name || "",
        level_group: enemy.level_group || "",
        hp: enemy.hp || "",
        attack_min: enemy.attack_min || "",
        attack_max: enemy.attack_max || "",
        defense: enemy.defense || "",
        image: null,
        _method: "PUT",
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
        post(route("admin.enemies.update", enemy.id), {
            forceFormData: true, // Use FormData for file upload
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Edit Enemy
                </h2>
            }
        >
            <Head title="Edit Enemy" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <form
                                onSubmit={handleSubmit}
                                className="max-w-xl mx-auto"
                            >
                                <div className="mb-6">
                                    <InputLabel
                                        htmlFor="name"
                                        value="Enemy Name"
                                    />
                                    <TextInput
                                        id="name"
                                        type="text"
                                        className="mt-1 block w-full"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData("name", e.target.value)
                                        }
                                        required
                                    />
                                    <InputError
                                        message={errors.name}
                                        className="mt-2"
                                    />
                                </div>

                                <div className="mb-6">
                                    <InputLabel
                                        htmlFor="level_group"
                                        value="Level Group (1-5)"
                                    />
                                    <TextInput
                                        id="level_group"
                                        type="number"
                                        min="1"
                                        max="5"
                                        className="mt-1 block w-full"
                                        value={data.level_group}
                                        onChange={(e) =>
                                            setData(
                                                "level_group",
                                                e.target.value
                                            )
                                        }
                                        required
                                    />
                                    <div className="mt-1 text-sm text-gray-600">
                                        Group 1: Levels 1-10, Group 2: Levels
                                        11-20, etc.
                                    </div>
                                    <InputError
                                        message={errors.level_group}
                                        className="mt-2"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <InputLabel htmlFor="hp" value="HP" />
                                        <TextInput
                                            id="hp"
                                            type="number"
                                            min="1"
                                            className="mt-1 block w-full"
                                            value={data.hp}
                                            onChange={(e) =>
                                                setData("hp", e.target.value)
                                            }
                                            required
                                        />
                                        <InputError
                                            message={errors.hp}
                                            className="mt-2"
                                        />
                                    </div>

                                    <div>
                                        <InputLabel
                                            htmlFor="defense"
                                            value="Defense"
                                        />
                                        <TextInput
                                            id="defense"
                                            type="number"
                                            min="0"
                                            className="mt-1 block w-full"
                                            value={data.defense}
                                            onChange={(e) =>
                                                setData(
                                                    "defense",
                                                    e.target.value
                                                )
                                            }
                                            required
                                        />
                                        <InputError
                                            message={errors.defense}
                                            className="mt-2"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <InputLabel
                                            htmlFor="attack_min"
                                            value="Minimum Attack"
                                        />
                                        <TextInput
                                            id="attack_min"
                                            type="number"
                                            min="1"
                                            className="mt-1 block w-full"
                                            value={data.attack_min}
                                            onChange={(e) =>
                                                setData(
                                                    "attack_min",
                                                    e.target.value
                                                )
                                            }
                                            required
                                        />
                                        <InputError
                                            message={errors.attack_min}
                                            className="mt-2"
                                        />
                                    </div>

                                    <div>
                                        <InputLabel
                                            htmlFor="attack_max"
                                            value="Maximum Attack"
                                        />
                                        <TextInput
                                            id="attack_max"
                                            type="number"
                                            min="1"
                                            className="mt-1 block w-full"
                                            value={data.attack_max}
                                            onChange={(e) =>
                                                setData(
                                                    "attack_max",
                                                    e.target.value
                                                )
                                            }
                                            required
                                        />
                                        <InputError
                                            message={errors.attack_max}
                                            className="mt-2"
                                        />
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <InputLabel
                                        htmlFor="image"
                                        value="Enemy Image (Optional)"
                                    />

                                    <div className="mt-2 mb-4">
                                        <p className="text-sm text-gray-600 mb-2">
                                            Current Image:
                                        </p>
                                        <div className="h-40 w-40 bg-gray-100 flex items-center justify-center overflow-hidden border rounded">
                                            <img
                                                src={`/storage/${enemy.image_path}`}
                                                alt={enemy.name}
                                                className="object-contain h-full w-auto"
                                            />
                                        </div>
                                    </div>

                                    <input
                                        id="image"
                                        type="file"
                                        accept="image/*"
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        onChange={handleImageChange}
                                    />
                                    <div className="mt-1 text-sm text-gray-600">
                                        Leave empty to keep the current image.
                                    </div>
                                    <InputError
                                        message={errors.image}
                                        className="mt-2"
                                    />

                                    {imagePreview && (
                                        <div className="mt-4">
                                            <p className="text-sm text-gray-600 mb-2">
                                                New Image Preview:
                                            </p>
                                            <div className="h-40 w-40 bg-gray-100 flex items-center justify-center overflow-hidden border rounded">
                                                <img
                                                    src={imagePreview}
                                                    alt="Preview"
                                                    className="object-contain h-full w-auto"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center justify-end space-x-3">
                                    <Link href={route("admin.enemies.index")}>
                                        <SecondaryButton type="button">
                                            Cancel
                                        </SecondaryButton>
                                    </Link>
                                    <PrimaryButton processing={processing}>
                                        Update Enemy
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
