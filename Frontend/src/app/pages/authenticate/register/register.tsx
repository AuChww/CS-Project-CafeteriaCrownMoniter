"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function Register() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState("");

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
    
        if (id === "username") {
            setFormData((prev) => ({
                ...prev,
                [id]: value,
            }));
            const usernamePattern = /^b\d{10}$/;
            if (!usernamePattern.test(value) && value !== "") {
                setError("Username must start with 'b' and be followed by 10 digits.");
            } else {
                setError("");
            }
        } else {
            setFormData((prev) => ({
                ...prev,
                [id]: value,
            }));
        }
    };
    

    const handleRegister = async () => {
        const { username, email, password, confirmPassword } = formData;

        if (!username || !email || !password || !confirmPassword) {
            setError("All fields are required.");
            return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            const response = await fetch("http://127.0.0.1:8000/api/v1/addUser", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    email,
                    password,
                    role: "user",
                    user_image: `${username}.png`,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to register. Please try again.");
            }

            const data = await response.json();
            console.log("Registration successful:", data);

            router.push("/pages/authenticate/login/");
        } catch (err) {
            if (err instanceof Error) {
                console.error(err.message);
            } else {
                console.error("An unknown error occurred.");
            }
        }
    };

    return (
        <div className="bg-white buttonClick duration-500">
            <div className="flex justify-center h-screen">
                <div className="hidden bg-cover lg:block lg:w-1/3">
                    <div className="flex items-center h-full bg-gray-900 bg-opacity-40">
                        <div className="flex w-full h-full flex-col justify-center px-10 py-16 lg:px- z-10 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 background-animate">
                            <h2 className="text-white text-4xl font-bold">KU CROWD</h2>
                            <div className="max-w-xl mt-3 text-gray-300">Crowd Monitor Web App</div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center w-full max-w-lg px-6 mx-auto lg:w-4/6">
                    <div>
                        <h2 className="text-gray-800 text-4xl font-bold text-center mb-6">Create a KU Account</h2>

                        {error && <div className="text-red-500 mb-4 text-sm">{error}</div>}

                        <div className="mb-4">
                            <div className="flex">
                                <label className="text-gray-800 block font-bold text-sm">Username</label>
                                <label className="text-gray-500 text-sm ml-4">(b64xxxxxxxx)</label>
                            </div>
                            <input
                                id="username"
                                value={formData.username}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow focus:outline-none"
                                type="text"
                                placeholder="Enter your username"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="text-gray-800 block font-bold text-sm">Email</label>
                            <input
                                id="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow focus:outline-none"
                                type="email"
                                placeholder="Enter your email"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="text-gray-800 block font-bold text-sm">Password</label>
                            <input
                                id="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow focus:outline-none"
                                type="password"
                                placeholder="Enter your password"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="text-gray-800 block font-bold text-sm">Confirm Password</label>
                            <input
                                id="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow focus:outline-none"
                                type="password"
                                placeholder="Confirm your password"
                            />
                        </div>

                        <div className="text-center">
                            <button
                                onClick={handleRegister}
                                className="w-full px-4 py-2 tracking-wide text-white bg-gradient-to-r from-green-400 to-blue-500 hover:from-pink-500 hover:to-yellow-500 rounded-md focus:outline-none">
                                Register Account
                            </button>
                        </div>

                        <div className="text-center mt-6">
                            <a
                                onClick={() => router.push("/pages/authenticate/login/")}
                                className="text-blue-500 cursor-pointer hover:text-blue-800">
                                Already have an account? Login!
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
