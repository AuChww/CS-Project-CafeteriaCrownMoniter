"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";

const ProfilePage = () => {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const [userData, setUserData] = useState({
    email: "",
    role: "",
    user_id: "",
    user_image: "",
    username: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userFileImage, setUserFileImage] = useState<File | null>(null);
  const [userImage, setUserImage] = useState<string | null>(null);
  const [previousUserName, setPreviousUserName] = useState("");
  const [previousUserEmail, setPreviousUserEmail] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);

    if (isModalOpen) {
      window.location.reload();
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (!id) return;
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/v1/getUserId/${id}`
        );
        if (!response.ok) throw new Error("Failed to fetch user data");
        const data = await response.json();
        setUserFileImage(null);
        setUserData(data);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to fetch user data");
      }

      try {
        const response = await fetch(
          `http://localhost:8000/api/v1/getUserImage/user${id}.png`
        );
        if (!response.ok) throw new Error("Failed to fetch image URL");

        const data = await response.json();
        setUserImage(data.url);
      } catch (error) {
        console.error("Error fetching image:", error);
      }
    };

    fetchUserData();
  }, [id]);

  const handleEditProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const updatedUserName = userData.username.trim() || previousUserName;
    const updatedUserEmail = userData.email.trim() || previousUserEmail;

    const formData = new FormData();
    formData.append("user_id", userData.user_id);
    formData.append("username", updatedUserName);
    formData.append("email", updatedUserEmail);

    if (userFileImage) {
      formData.append("user_image", userFileImage);
    }

    console.log(updatedUserName);
    console.log(updatedUserEmail);
    console.log(userFileImage);

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/v1/updateUser/${id}`,
        {
          method: "PATCH",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedData = await response.json();
      setUserData(updatedData);

      router.push(`/pages/profile/${id}`);
      toggleModal();
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
      const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
      if (!allowedTypes.includes(file.type)) {
        alert("Invalid file type. Please upload an image.");
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        alert("File size exceeds 2MB.");
        return;
      }
      setUserFileImage(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mt-10 text-center">User Profile</h1>
      {error && <div className="text-red-500 text-center">{error}</div>}
      {loading && (
        <div className="text-blue-500 mb-4 text-center">Loading...</div>
      )}

      <form
        onSubmit={handleEditProfile}
        className="max-w-2xl mx-auto bg-white shadow-lg p-6 rounded-lg"
      >
        <div className="mx-auto">
          {userImage ? (
            <img
              className=" object-cover mx-auto "
              src={userImage}
              alt=" Image"
            />
          ) : (
            <div>Loading image...</div>
          )}
        </div>
        <div className="space-y-4 mt-4">
          {/* Username */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium mb-1"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={userData.username || ""}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

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

          <div className="flex items-center space-x-3">
            <p>Role:</p>

            <p className="w-full text-xl">{userData.role}</p>
          </div>

          <label
            htmlFor="user_image"
            className="block text-sm font-medium mb-1"
          >
            Upload file
          </label>
          <input
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer 
                         bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 
                         dark:border-gray-600 dark:placeholder-gray-400"
            id="bar_image"
            type="file"
            ref={fileInputRef}
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                setUserFileImage(e.target.files[0]);
              }
            }}
          />
        </div>
        <button
          type="submit"
          className="w-full mt-6 bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>

      {isModalOpen && (
        <div
          className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50"
          onClick={toggleModal}
        >
          <div
            className="relative p-10 w-full max-w-md bg-white rounded-lg shadow-sm dark:bg-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 md:p-5 text-center space-y-6">
              <svg
                viewBox="0 0 117 117"
                version="1.1"
                className="w-16 h-16 ml-auto mr-auto"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                fill="#000000"
              >
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  {" "}
                  <title></title> <desc></desc> <defs></defs>{" "}
                  <g
                    fill="none"
                    fillRule="evenodd"
                    id="Page-1"
                    stroke="none"
                    strokeWidth="1"
                  >
                    {" "}
                    <g fillRule="nonzero" id="correct">
                      {" "}
                      <path
                        d="M34.5,55.1 C32.9,53.5 30.3,53.5 28.7,55.1 C27.1,56.7 27.1,59.3 28.7,60.9 L47.6,79.8 C48.4,80.6 49.4,81 50.5,81 C50.6,81 50.6,81 50.7,81 C51.8,80.9 52.9,80.4 53.7,79.5 L101,22.8 C102.4,21.1 102.2,18.5 100.5,17 C98.8,15.6 96.2,15.8 94.7,17.5 L50.2,70.8 L34.5,55.1 Z"
                        fill="#17AB13"
                        id="Shape"
                      ></path>{" "}
                      <path
                        d="M89.1,9.3 C66.1,-5.1 36.6,-1.7 17.4,17.5 C-5.2,40.1 -5.2,77 17.4,99.6 C28.7,110.9 43.6,116.6 58.4,116.6 C73.2,116.6 88.1,110.9 99.4,99.6 C118.7,80.3 122,50.7 107.5,27.7 C106.3,25.8 103.8,25.2 101.9,26.4 C100,27.6 99.4,30.1 100.6,32 C113.1,51.8 110.2,77.2 93.6,93.8 C74.2,113.2 42.5,113.2 23.1,93.8 C3.7,74.4 3.7,42.7 23.1,23.3 C39.7,6.8 65,3.9 84.8,16.2 C86.7,17.4 89.2,16.8 90.4,14.9 C91.6,13 91,10.5 89.1,9.3 Z"
                        fill="#4A4A4A"
                        id="Shape"
                      ></path>{" "}
                    </g>{" "}
                  </g>{" "}
                </g>
              </svg>
              <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                Profile Updated Successfully
              </h3>
              <button
                onClick={toggleModal}
                className="py-2.5 px-5 ms-3 text-sm font-medium text-white focus:outline-none bg-red-600 rounded-lg border border-red-200 hover:bg-red-400 hover:text-white focus:z-10 focus:ring-4 focus:ring-red-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
