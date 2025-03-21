"use client";
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
  const { user, setUser } = useAuth();
  const [userImage, setUserImage] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.userId) return;

    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/v1/getUserId/${user.userId}`
        );
        const data = await response.json();
        setUserImage(data.user_image);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }

      try {
        const response = await fetch(
          `http://localhost:8000/api/v1/getUserImage/user${user.userId}.png`
        );
        if (!response.ok) throw new Error("Failed to fetch image URL");

        const data = await response.json();
        setUserImage(data.url);
      } catch (error) {
        console.error("Error fetching image:", error);
      }
    };

    fetchUserData();

    console.log(user?.userId, user?.username, user?.role);
  }, [user]);
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    console.log("Logged out");
    router.push("/pages/authenticate/login");
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
          {user?.role === "admin" && (
            <div className="flex">
              <Link href="/pages/admin/reportCheck">
                <div className="text-white mt-0.5 mx-4">Report</div>
              </Link>
              <Link href="/pages/admin/">
                <div className="text-white mt-0.5 mx-4">Dashboard</div>
              </Link>
            </div>
          )}

          {user?.username ? (
            <div
              className="relative flex mr-2 items-center cursor-pointer "
              onClick={() => router.push(`/pages/profile/${user.userId}`)}
            >
              <div className="mr-3 text-white">{user.username}</div>
              {/* <img
                src={"/image/users/default.png"}
                alt="User"
                className="h-7 w-7 rounded-full"
              /> */}

              {userImage ? (
                <img
                  className="h-7 w-7 rounded-full "
                  src={userImage}
                  alt="userImage"
                />
              ) : (
                <div>Loading image...</div>
              )}

              <div className="absolute w-20 right-0 hidden group-hover:block bg-green-300 text-center text-sm text-white p-2 mt-4 rounded-md">
                Edit Profile
              </div>
            </div>
          ) : (
            <Link href="/pages/authenticate/login">
              <div
                className=" flex bg-gradient-to-r hover:scale-110 duration-500
                                                      from-orange-400
                                                      via-yellow-300
                                                      to-orange-300  text-white text-xs py-1 px-2 rounded-full "
              >
                <div>Please sign in your account to get permission</div>
                <div>
                  <FaFireAlt className="w-4 h-4 ml-1" />
                </div>
              </div>
            </Link>
          )}

          {!user?.username ? (
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
              <button
                onClick={logout}
                className="group hover:scale-125 text-white duration-500"
              >
                <IoLogOut className="h-7 w-7" />
                <div className="absolute w-20 right-0 hidden group-hover:block bg-green-300 text-center text-sm text-white p-2 mt-4 rounded-md">
                  Log Out
                </div>
              </button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
