import TopBar from "./topBar"
import TopRestaurant from "./topRestaurant"

export default function Home() {
    return (
        <div className="container p-4 mx-auto bg-gray-100 w-full h-screen overflow-y-auto" >
            <div className="lg:mt-16 md:mt-20 mt-24">
                <div className="text-center gap-2 bg-green-500 p-2 rounded-lg">
                    <div className="bg-gradient-to-r from-[#AEF359] via-emerald-300 to-[#03A96B] background-animate text-white p-8">
                        <div className="text-5xl font-bold">
                            Top Bar & Restaurant 2025
                        </div>
                        <div className="mt-2">
                            placement from review and rating
                        </div>
                    </div>
                </div>
            </div>
            <TopBar />
            <TopRestaurant />
        </div>
    )
}