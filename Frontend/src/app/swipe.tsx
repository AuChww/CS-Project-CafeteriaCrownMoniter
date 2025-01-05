import { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MdOutlineRestaurant } from "react-icons/md";
import { FaWarehouse } from "react-icons/fa";
import { BiSolidLike } from "react-icons/bi";


const Swipe = () => {
    const router = useRouter();

    useEffect(() => {
        // Automatically trigger the "Next" button every 3 seconds
        const interval = setInterval(() => {
            const nextButton = document.querySelector("[data-carousel-next]") as HTMLElement;
            if (nextButton) {
                nextButton.click();
            }
        }, 3000);

        // Cleanup interval when the component is unmounted
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full h-80 flex">
            <div className="w-1/3 h-full flex">
                <div className="w-2/3">
                    <div onClick={() => router.push("/pages/recommend/bar/topBar")} className="h-full  hover:scale-110 duration-300 hover:text-green-500 hover:bg-green-300 text-white bg-green-500 rounded-lg flex items-center justify-center flex-col">
                        <div className="flex mt-2">
                            <BiSolidLike className="w-12 h-12" />
                            <MdOutlineRestaurant className="w-12 h-12" />
                        </div>
                        <div className="text-2xl mb-2 font-bold">
                            Top
                        </div>
                        <span>Bar & Restaurant 2025</span>
                    </div>
                </div>
                <div className="w-1/3 h-full">
                    <div onClick={() => router.push("/pages/recommend/bar/allBar/")} className="h-1/2 mx-1 hover:scale-110 duration-300 hover:text-green-500 hover:bg-green-300 text-white bg-green-500 rounded-lg flex items-center justify-center flex-col">
                        <div>
                            <FaWarehouse className="w-8 h-8" />
                        </div>
                        <span>All Bar</span>
                    </div>

                    <div onClick={() => router.push("/pages/recommend/restaurant/")} className="h-1/2 mx-1 my-1 hover:scale-110 duration-300 hover:text-green-500 hover:bg-green-300 text-white bg-green-500 rounded-lg flex items-center justify-center flex-col text-center">
                        <div>
                            <MdOutlineRestaurant className="w-8 h-8" />
                        </div>
                        <span>All Restaurant</span>
                    </div>

                </div>
            </div>
            <div className="w-1/3">

            </div>
            <div
                id="default-carousel"
                className="relative pt-3 pb-3 px-3 w-1/3 bg-green-500 rounded-xl"
                data-carousel="slide"
            >
                {/* Carousel Wrapper */}
                <div
                    className="relative h-full overflow-hidden rounded-xl"
                    onClick={() => router.push("/pages/recommend")}
                >
                    {/* Slide 1 */}
                    <div
                        className="absolute inset-0 transition-transform transform duration-700 ease-in-out"
                        data-carousel-item
                    >
                        <Image
                            src="/image/main1.jpg"
                            className="absolute block w-full h-full object-cover"
                            alt="Carousel 1"
                            width={800}
                            height={420}
                        />
                    </div>
                    {/* Slide 2 */}
                    <div
                        className="absolute inset-0 transition-transform transform duration-700 ease-in-out"
                        data-carousel-item
                    >
                        <Image
                            src="/image/main2.jpg"
                            className="absolute block w-full h-full object-cover"
                            alt="Carousel 2"
                            width={800}
                            height={420}
                        />
                    </div>
                    {/* Slide 3 */}
                    <div
                        className="absolute inset-0 transition-transform transform duration-700 ease-in-out"
                        data-carousel-item
                    >
                        <Image
                            src="/image/main3.jpg"
                            className="absolute block w-full h-full object-cover"
                            alt="Carousel 3"
                            width={800}
                            height={420}
                        />
                    </div>
                </div>

                {/* Indicators */}
                <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex space-x-3">
                    <button
                        type="button"
                        className="w-3 h-3 rounded-full bg-white opacity-50 hover:opacity-100"
                        aria-label="Slide 1"
                        data-carousel-slide-to="0"
                    ></button>
                    <button
                        type="button"
                        className="w-3 h-3 rounded-full bg-white opacity-50 hover:opacity-100"
                        aria-label="Slide 2"
                        data-carousel-slide-to="1"
                    ></button>
                    <button
                        type="button"
                        className="w-3 h-3 rounded-full bg-white opacity-50 hover:opacity-100"
                        aria-label="Slide 3"
                        data-carousel-slide-to="2"
                    ></button>
                </div>

                {/* Navigation Buttons */}
                <button
                    type="button"
                    className="absolute top-0 left-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
                    data-carousel-prev
                >
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 hover:bg-white/50">
                        <svg
                            className="w-4 h-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 6 10"
                            aria-hidden="true"
                        >
                            <path stroke="currentColor" d="M5 1L1 5l4 4" />
                        </svg>
                        <span className="sr-only">Previous</span>
                    </span>
                </button>
                <button
                    type="button"
                    className="absolute top-0 right-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
                    data-carousel-next
                >
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 hover:bg-white/50">
                        <svg
                            className="w-4 h-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 6 10"
                            aria-hidden="true"
                        >
                            <path stroke="currentColor" d="M1 9l4-4-4-4" />
                        </svg>
                        <span className="sr-only">Next</span>
                    </span>
                </button>
            </div>
        </div>
    );
};

export default Swipe;
