"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

const ProfilePage = () => {
    const params = useParams();
    const router = useRouter();
    const { id } = params;

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [userData, setUserData] = useState({
        email: "",
        role: "",
        user_id: "",
        user_image: "",
        username: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchUserData = async () => {
            if (!id) return;
            try {
                const response = await fetch(`http://127.0.0.1:8000/api/v1/getUserId/${id}`);
                if (!response.ok) throw new Error("Failed to fetch user data");
                const data = await response.json();
                setUserData(data);
            } catch (err) {
                console.error("Error fetching user data:", err);
                setError("Failed to fetch user data");
            }
        };

        fetchUserData();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const formData = new FormData();
            formData.append("email", userData.email);
            formData.append("role", userData.role);
            formData.append("username", userData.username);
            if (imageFile) {
                formData.append("user_image", imageFile);
            }

            const response = await fetch(`http://127.0.0.1:8000/api/v1/updateUser/${id}`, {
                method: "PUT",
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const updatedData = await response.json();
            setUserData(updatedData);
            alert("User updated successfully");
            router.push(`/pages/profile/${id}`);
        } catch (err: any) {
            console.error("Error updating user data:", err);
            setError(err.message || "Failed to update user data");
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/gif"];
            if (!allowedTypes.includes(file.type)) {
                alert("Invalid file type. Please upload an image.");
                return;
            }
            if (file.size > 2 * 1024 * 1024) {
                alert("File size exceeds 2MB.");
                return;
            }
            setImageFile(file);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserData((prevData) => ({ ...prevData, [name]: value }));
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 text-center">User Profile</h1>
            {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
            {loading && <p className="text-blue-500 mb-4 text-center">Loading...</p>}

            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white shadow-lg p-6 rounded-lg">
                <div className="mb-4 text-center">
                    <img
                        src={userData.user_image ? `/image/users/${userData.user_image}` : "/image/users/default.png"}
                        alt="Profile"
                        className="w-32 h-32 mx-auto rounded-full object-cover"
                    />
                </div>
                <div className="space-y-4">
                    {/* Username */}
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium mb-1">
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={userData.username || ""}  // Ensure value is a valid string
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={userData.email || ""}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>

                    {/* Role */}
                    <div>
                        <label htmlFor="role" className="block text-sm font-medium mb-1">
                            Role
                        </label>
                        <input
                            type="text"
                            id="role"
                            name="role"
                            value={userData.role || ""}
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>

                    {/* Upload Image */}
                    <div>
                        <label htmlFor="user_image" className="block text-sm font-medium mb-1">
                            Upload Profile Picture
                        </label>
                        <input
                            type="file"
                            id="user_image"
                            onChange={handleFileChange}
                            className="w-full border rounded px-3 py-2"
                            accept="image/*"
                        />
                    </div>
                </div>
                <button
                    type="submit"
                    className="w-full mt-6 bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                    disabled={loading}
                >
                    {loading ? "Updating..." : "Update Profile"}
                </button>
            </form>
        </div>
    );
};

export default ProfilePage;
