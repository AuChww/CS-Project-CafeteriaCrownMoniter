"use client"
import { useState, useEffect } from "react";
import Link from "next/link";
import { IoLogOut } from "react-icons/io5";
import { IoLogIn } from "react-icons/io5";
import { FaChevronCircleDown } from "react-icons/fa";
import { useRouter } from "next/navigation";
import "/assets/css/main.css";
import { FaFireAlt } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";

const Navbar = () => {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [role, setRole] = useState('');
    const [userImage, setUserImage] = useState('');
    const [userId, setUserId] = useState("");
    const { userStatus } = useAuth();

    // Fetch user info based on token or user_id
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = decodeJWT(token);
                setUsername(decoded.username);
                setRole(decoded.role);

                // Fetch user details from the API using user_id
                const fetchUserData = async () => {
                    const userId = decoded.user_id;  // Assuming user_id is available in the token
                    const response = await fetch(`http://127.0.0.1:8000/api/v1/getUserId/${userId}`);
                    const data = await response.json();
                    setUserId(userId);
                    setUsername(data.username);
                    setRole(data.role);
                    setUserImage(data.user_image); // Set user image
                };

                fetchUserData();
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
        router.refresh();
        window.location.href = "/pages/authenticate/login";
    };

    return (
        <nav className="fixed w-full top-0 bg-gradient-to-r from-[#AEF359] via-emerald-300 to-[#03A96B] background-animate text-white p-3 z-50">
            <div className="container mx-auto flex justify-between">
                {/* Logo or title */}
                <div className="text-2xl font-bold">
                    <Link href="/">
                        <div className="text-[#03A96B]">KU CROWD</div>
                    </Link>
                </div>

                <div className="space-x-4 flex mr-4 mt-0.5">
                    {/* If Admin role, show the Admin link */}
                    {role === "admin" && (
                        <div className="flex">
                            <Link href="/pages/admin/reportCheck">
                                <div className="text-white mt-0.5 mx-4">Report</div>
                            </Link>
                            <Link href="/pages/admin/">
                                <div className="text-white mt-0.5 mx-4">Dashboard</div>
                            </Link>
                        </div>
                    )}

                    {/* Show the username and dropdown */}
                    {username ? (
                        <div className="relative flex mr-2 items-center" onClick={() => router.push(`/pages/profile/${userId}`)}>
                            <div className="mr-3 text-white">{username}</div>
                            <img
                                src={"/image/users/default.png"}
                                alt="User"
                                className="h-7 w-7 rounded-full"
                            />
                            {/* Hover text for User Profile */}
                            <div className="absolute w-20 right-0 hidden group-hover:block bg-green-300 text-center text-sm text-white p-2 mt-4 rounded-md">
                                Edit Profile
                            </div>
                        </div>
                    ) : (
                        <Link href="/pages/authenticate/login">
                            <div className=" flex bg-gradient-to-r
                                                      from-orange-400
                                                      via-yellow-300
                                                      to-orange-300  text-white text-xs py-1 px-2 rounded-full">
                                <div>
                                    Please sign in your account to get permission
                                </div>
                                <div>
                                    <FaFireAlt className="w-4 h-4 ml-1" />
                                </div>
                            </div>

                        </Link>
                    )
                    }

                    {/* Login/Logout Icons */}
                    {!username ? (
                        <Link href="/pages/authenticate/login">
                            <div className="group hover:scale-125 text-white duration-500">
                                <IoLogIn className="h-7 w-7" />
                                {/* Hover text for Login */}
                                <div className="absolute  w-20 right-0 hidden group-hover:block bg-green-300 text-center text-sm text-white p-2 mt-4 rounded-md">
                                    Log In
                                </div>
                            </div>
                        </Link>
                    ) : (
                        <Link href="/" onClick={logout}>
                            <div className="group hover:scale-125 text-white duration-500">
                                <IoLogOut className="h-7 w-7" />
                                {/* Hover text for Logout */}
                                <div className="absolute w-20 right-0 hidden group-hover:block bg-green-300 text-center text-sm text-white p-2 mt-4 rounded-md">
                                    Log Out
                                </div>
                            </div>
                        </Link>
                    )}
                </div>

            </div>
        </nav>
    );
};

export default Navbar;
