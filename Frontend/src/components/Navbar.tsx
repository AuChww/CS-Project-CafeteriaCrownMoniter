"use client"
import { useState, useEffect } from "react";
import Link from "next/link";
import { IoLogOut } from "react-icons/io5";
import { IoLogIn } from "react-icons/io5";
import { FaChevronCircleDown } from "react-icons/fa";
import "/assets/css/main.css";

const Navbar = () => {
    const [username, setUsername] = useState('');
    const [role, setRole] = useState('');
    
    // Decode JWT token and extract the username and role
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = decodeJWT(token);
                setUsername(decoded.username);
                setRole(decoded.role);
            } catch (error) {
                console.error("Error decoding token:", error);
            }
        }
    }, []);
    
    // Decode JWT function
    const decodeJWT = (token: string) => {
        try {
            const parts = token.split(".");
            if (parts.length !== 3) {
                throw new Error("Invalid token structure");
            }
            const payloadBase64 = parts[1];
            const payloadJson = atob(payloadBase64.replace(/-/g, "+").replace(/_/g, "/"));
            const correctedPayloadJson = payloadJson.replace(/'/g, '"');
            return JSON.parse(correctedPayloadJson);
        } catch (error) {
            console.error("Invalid token format or content:", error);
            return null;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        console.log('Logged out');
        // Optionally, you can redirect to the login page after logging out
        window.location.href = "/pages/authenticate/login";
    };

    return (
        <nav className="fixed w-full top-0 bg-gradient-to-r
            from-[#AEF359]
            via-emerald-300
            to-[#03A96B]
            background-animate text-white p-3 z-50">
            <div className="container mx-auto flex justify-between">
                {/* Logo or title */}
                <div className="text-2xl font-bold">
                    <Link href="/">
                        <div className="text-[#03A96B]">KU CROWD</div>
                    </Link>
                </div>

                {/* Navigation links */}
                <div className="space-x-4 flex mr-4 mt-0.5">
                    {/* If Admin role, show the Admin link */}
                    {role === "admin" && (
                        <Link href="/pages/admin/">
                            <div className="text-white mt-0.5 mx-4">Admin</div>
                        </Link>
                    )}
                    {/* Show the username and dropdown */}
                    <div className="flex items-center">
                        <div className="mt-0.5 mr-2 text-white">{username}</div>
                        <div className="hover:scale-125 text-white duration-500">
                            <FaChevronCircleDown className="h-5 w-5 mt-1" />
                        </div>
                    </div>
                    {/* Login/Logout Icons */}
                    {!username ? (
                        <Link href="/pages/authenticate/login">
                            <div className="hover:scale-125 text-white duration-500">
                                <IoLogIn className="h-7 w-7" />
                            </div>
                        </Link>
                    ) : (
                        <Link href="/" onClick={logout}>
                            <div className="hover:scale-125 text-white duration-500">
                                <IoLogOut className="h-7 w-7" />
                            </div>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
