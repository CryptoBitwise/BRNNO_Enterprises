import Link from "next/link";

const vehicleTypes = [
    {
        id: 1,
        name: "Cars & Trucks",
        description: "Sedans, SUVs, pickup trucks",
        icon: "🚗",
        href: "/search?type=car",
    },
    {
        id: 2,
        name: "Trucks",
        description: "Pickup trucks and commercial vehicles",
        icon: "🚛",
        href: "/search?type=truck",
    },
    {
        id: 3,
        name: "Boats & Yachts",
        description: "Marine detailing services",
        icon: "⛵",
        href: "/search?type=boat",
    },
    {
        id: 4,
        name: "Motorcycles",
        description: "Bikes and scooters",
        icon: "🏍️",
        href: "/search?type=motorcycle",
    },
];

export default function VehicleTypes() {
    return (
        <section className="py-16 px-6 md:px-12 lg:px-24 bg-gray-50">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                    What Can We Detail?
                </h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {vehicleTypes.map((vehicle) => (
                        <Link
                            key={vehicle.id}
                            href={vehicle.href}
                            className="bg-white rounded-lg shadow hover:shadow-lg transition p-6 text-center group min-h-[120px] flex flex-col justify-center"
                        >
                            <div className="text-4xl mb-4">{vehicle.icon}</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 leading-tight">
                                {vehicle.name}
                            </h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                {vehicle.description}
                            </p>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
} 