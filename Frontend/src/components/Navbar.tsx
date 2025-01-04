import Link from "next/link";
import { IoLogOut } from "react-icons/io5";
import { IoLogIn } from "react-icons/io5";
import { FaChevronCircleDown } from "react-icons/fa";
import "/assets/css/main.css";

const Navbar = () => {
    return (
        <nav className="absolute w-full top-0 sticky bg-gradient-to-r
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
                    <Link href="/pages/authenticate/login">
                        <div className="flex">
                            <div className="mt-0.5 mr-2">
                                6410450800 Chanawut
                            </div>
                            <div className="hover:scale-125 text-white duration-500">
                                <FaChevronCircleDown className="h-5 w-5 mt-1" />
                            </div>
                        </div>
                    </Link>
                    <Link href="/pages/authenticate/login">
                        <div className="hover:scale-125 text-white duration-500">
                            <IoLogIn className="h-7 w-7" />
                        </div>
                    </Link>
                    <Link href="/">
                        <div className="hover:scale-125 text-white duration-500">
                            <IoLogOut className="h-7 w-7" />
                        </div>
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
