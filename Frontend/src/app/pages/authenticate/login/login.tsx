"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { setCookie } from "nookies";

export function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useAuth();
    const router = useRouter();

    const handleLogin = async (username: string, password: string) => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });
            
            const text = await response.text(); // Get the raw response text
            
            console.log("Response:", text); // Log the raw response text
            
            if (response.ok) {
                const data = JSON.parse(text); // Now parse JSON if response is valid
                localStorage.setItem('token', data.token);
                login(data.token); // Set the user in context

                console.log('Logged in successfully:', data.role);

                // Redirect based on role
                if (data.role === 'admin') {
                    router.push('/pages/recommend/admin'); // Admin route
                } else {
                    router.push('/pages/recommend/'); // User route
                }
            } else {
                console.log('Login failed:', text);
            }
        } catch (error) {
            console.error('Error logging in:', error);
        }
    };
    


    return (
        <div className={`bg-white buttonClick duration-500 `}>
            <div className="flex justify-center h-screen ">
                <div className={`text-gray-800 bg-white transition-opacity hidden bg-cover lg:block lg:w-2/3`}>
                    <div className={`h-full`}>
                        <div className={`h-full transition-opacity duration-200 ease-in-out`}>
                            <div className="flex items-center h-full bg-gray-900 bg-opacity-40">
                                <div className="flex w-full h-full flex-col justify-center px-10 py-16 lg:px- z-10 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 background-animate">
                                    <h2 className={`text-white text-4xl font-bold lg:mt-60 lg:ml-10 `}>KU CROWD</h2>
                                    <div className="max-w-xl lg:ml-10 mt-3 text-gray-300">
                                        Crowd Monitor Web App
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center w-full max-w-md px-6 mx-auto lg:w-2/6">
                    <div className="flex-1">
                        <div className="text-center">
                            <h2 className="text-gray-800 text-4xl font-bold">KU Crowd</h2>
                            <div className="mt-3 text-gray-500">Sign in to access your account</div>
                        </div>

                        <div className="mt-8">
                            <form onSubmit={(e) => {
                                e.preventDefault(); // ป้องกันการโหลดหน้าใหม่เมื่อฟอร์มถูกส่ง
                                handleLogin(username, password); // ส่ง username และ password ไป
                            }}>

                                <div>
                                    <label className="block mb-2 text-sm font-bold text-gray-800">Username</label>
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        placeholder="Your username"
                                        className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md"
                                    />
                                </div>
                                <div className="mt-6">
                                    <label className="block mb-2 text-sm font-bold text-gray-800">Password</label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Your Password"
                                        className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md"
                                    />
                                </div>
                                <div className="mt-6">
                                    <button
                                        type="submit"
                                        className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
                                    >
                                        Sign in
                                    </button>
                                </div>
                            </form>

                            <p
                                onClick={() => router.push("/pages/authenticate/register/")}
                                className="mt-6 text-sm text-center text-gray-400 cursor-pointer"
                            >
                                Don&#x27;t have an account yet?
                                <span className="text-blue-500"> Sign up</span>.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
