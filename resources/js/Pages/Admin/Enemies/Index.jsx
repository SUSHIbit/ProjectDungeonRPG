import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import PrimaryButton from "@/Components/PrimaryButton";
import DangerButton from "@/Components/DangerButton";
import SecondaryButton from "@/Components/SecondaryButton";

export default function EnemyIndex({ auth, enemies }) {
    // Convert enemies object (grouped by level) to an array for mapping
    const enemyGroups = Object.keys(enemies).map((levelGroup) => ({
        levelGroup: levelGroup,
        enemies: enemies[levelGroup],
    }));

    // Handle delete confirmation
    const handleDelete = (enemyId) => {
        if (confirm("Are you sure you want to delete this enemy?")) {
            router.delete(route("admin.enemies.destroy", enemyId));
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Manage Enemies
                </h2>
            }
        >
            <Head title="Manage Enemies" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold">
                                    Enemy Database
                                </h2>
                                <Link href={route("admin.enemies.create")}>
                                    <PrimaryButton>Add New Enemy</PrimaryButton>
                                </Link>
                            </div>

                            {enemyGroups.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="mb-4">
                                        No enemies found in the database.
                                    </p>
                                    <Link href={route("admin.enemies.create")}>
                                        <PrimaryButton>
                                            Create Your First Enemy
                                        </PrimaryButton>
                                    </Link>
                                </div>
                            ) : (
                                enemyGroups.map((group) => (
                                    <div
                                        key={group.levelGroup}
                                        className="mb-8"
                                    >
                                        <h3 className="text-xl font-semibold mb-4 bg-gray-100 p-2 rounded">
                                            Level Group {group.levelGroup}{" "}
                                            (Levels{" "}
                                            {(group.levelGroup - 1) * 10 + 1}-
                                            {group.levelGroup * 10})
                                        </h3>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                            {group.enemies.map((enemy) => (
                                                <div
                                                    key={enemy.id}
                                                    className="border rounded overflow-hidden shadow-sm bg-white"
                                                >
                                                    <div className="h-40 bg-gray-50 flex items-center justify-center overflow-hidden">
                                                        <img
                                                            src={`/storage/${enemy.image_path}`}
                                                            alt={enemy.name}
                                                            className="object-contain h-full w-auto"
                                                        />
                                                    </div>
                                                    <div className="p-4">
                                                        <h4 className="font-bold mb-2">
                                                            {enemy.name}
                                                        </h4>
                                                        <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                                                            <div>
                                                                <span className="text-gray-600">
                                                                    HP:
                                                                </span>{" "}
                                                                {enemy.hp}
                                                            </div>
                                                            <div>
                                                                <span className="text-gray-600">
                                                                    DEF:
                                                                </span>{" "}
                                                                {enemy.defense}
                                                            </div>
                                                            <div>
                                                                <span className="text-gray-600">
                                                                    ATK:
                                                                </span>{" "}
                                                                {
                                                                    enemy.attack_min
                                                                }
                                                                -
                                                                {
                                                                    enemy.attack_max
                                                                }
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
                                                                <SecondaryButton className="w-full">
                                                                    Edit
                                                                </SecondaryButton>
                                                            </Link>
                                                            <DangerButton
                                                                className="flex-1"
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        enemy.id
                                                                    )
                                                                }
                                                            >
                                                                Delete
                                                            </DangerButton>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
