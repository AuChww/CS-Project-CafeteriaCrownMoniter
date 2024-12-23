import { useEffect } from 'react';
import Image from "next/image";
import { useRouter } from "next/navigation";

const Swipe = () => {
    const router = useRouter()

    useEffect(() => {
        // Automatically trigger the "Next" button every 3 seconds
        const interval = setInterval(() => {
            const nextButton = document.querySelector('[data-carousel-next]') as HTMLElement;
            if (nextButton) {
                nextButton.click();
            }
        }, 3000); // Change to 3000ms (3 seconds)

        // Cleanup interval when the component is unmounted
        return () => clearInterval(interval);
    }, []);

    return (
        <div id="default-carousel" className="relative pt-3 px-3 w-full bg-green-500 rounded-xl" data-carousel="slide" >
            <div className="relative h-80 overflow-hidden rounded-xl " onClick={() => router.push('/pages/recommend')}>
                <div className="duration-700 ease-in-out" data-carousel-item>
                    <Image
                        src="/image/main1.jpg"
                        className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
                        alt="Carousel 1"
                        width={800}
                        height={420}
                    />
                </div>
                <div className="duration-700 ease-in-out" data-carousel-item>
                    <Image
                        src="/image/main2.jpg"
                        className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
                        alt="Carousel 2"
                        width={800}
                        height={420}
                    />
                </div>
                <div className="duration-700 ease-in-out" data-carousel-item>
                    <Image
                        src="/image/main3.jpg"
                        className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
                        alt="Carousel 3"
                        width={800}
                        height={420}
                    />
                </div>
            </div>
            <div className="z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3 rtl:space-x-reverse">
                <button type="button" className="w-3 h-3 rounded-full" aria-current="true" aria-label="Slide 1" data-carousel-slide-to="0"></button>
                <button type="button" className="w-3 h-3 rounded-full" aria-current="false" aria-label="Slide 2" data-carousel-slide-to="1"></button>
                <button type="button" className="w-3 h-3 rounded-full" aria-current="false" aria-label="Slide 3" data-carousel-slide-to="2"></button>
            </div>
            <button
                type="button"
                className="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
                data-carousel-prev
            >
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30  group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
                    <svg className="w-4 h-4 text-white rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                        <path stroke="currentColor" d="M5 1 1 5l4 4" />
                    </svg>
                    <span className="sr-only">Previous</span>
                </span>
            </button>
            <button
                type="button"
                className="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
                data-carousel-next
            >
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
                    <svg className="w-4 h-4 text-white rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                        <path stroke="currentColor" d="m1 9 4-4-4-4" />
                    </svg>
                    <span className="sr-only">Next</span>
                </span>
            </button>
        </div>
    );
};

export default Swipe;
