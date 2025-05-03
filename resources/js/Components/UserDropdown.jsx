import React, { useState, useRef, useEffect } from "react";
import { Link } from "@inertiajs/react";

export default function UserDropdown({ user }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Handle click outside to close dropdown
    useEffect(() => {
        function handleClickOutside(event) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Toggle dropdown
    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* User button with down arrow */}
            <button
                onClick={toggleDropdown}
                className="flex items-center text-white hover:text-gray-300 focus:outline-none transition duration-150 ease-in-out"
            >
                <span className="mr-1">{user.name}</span>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className={`w-5 h-5 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                    }`}
                >
                    <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                    />
                </svg>
            </button>

            {/* Dropdown menu */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-gray-800 ring-1 ring-black ring-opacity-5 z-50">
                    <Link
                        href={route("profile.edit")}
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                    >
                        Profile
                    </Link>
                    <Link
                        href={route("logout")}
                        method="post"
                        as="button"
                        className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                    >
                        Logout
                    </Link>
                </div>
            )}
        </div>
    );
}
