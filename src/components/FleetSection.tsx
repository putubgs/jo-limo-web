import Image from "next/image";

const fleetData = [
  {
    name: "Executive Class",
    model: "Mercedes-Benz E-Class",
    description: "Redefining business transfers with comfort and class.",
    image: "/images/executive-img.webp",
    passengers: 3,
    luggage: 2,
    price: "12 JOD",
    isVip: false,
  },
  {
    name: "Luxury Class",
    model: "Mercedes-Benz S-Class",
    description: "The ultimate first-class experience. Unmatched privacy.",
    image: "/images/luxury-img.webp",
    passengers: 3,
    luggage: 2,
    price: "28 JOD",
    isVip: true,
  },
  {
    name: "SUV Class",
    model: "Cadillac Escalade",
    description: "Spacious cabin and generous luggage capacity.",
    image: "/images/img-lp-2.webp",
    passengers: 4,
    luggage: 4,
    price: "26 JOD",
    isVip: false,
  },
  {
    name: "MPV Class",
    model: "Mercedes-Benz V-Class",
    description: "Comfortably fits up to 7 passengers with luggage.",
    image: "/images/mpv-img.webp",
    passengers: 7,
    luggage: 6,
    price: "36 JOD",
    isVip: false,
  },
];

export default function FleetSection() {
  return (
    <section id="fleet" className="py-20 bg-[#f5f5f5]">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between md:items-end mb-12">
          <div>
            <h2
              className="text-3xl font-serif font-bold text-[#111111] mb-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Our Fleet
            </h2>
            <p className="text-gray-600">
              Choose the class that fits your journey.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {fleetData.map((vehicle, index) => (
            <div
              key={index}
              className={`bg-white rounded overflow-hidden shadow-sm hover:shadow-xl transition group ${
                vehicle.isVip ? "border border-[#c5a059]/30" : ""
              }`}
            >
              <div className="h-48 overflow-hidden bg-gray-200 relative">
                {vehicle.isVip && (
                  <div className="absolute top-0 right-0 bg-[#c5a059] text-white text-xs font-bold px-2 py-1 z-10">
                    VIP
                  </div>
                )}
                <Image
                  src={vehicle.image}
                  alt={vehicle.name}
                  fill
                  className="object-cover group-hover:scale-105 transition duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold">{vehicle.name}</h3>
                <p className="text-xs text-gray-500 mb-2">{vehicle.model}</p>
                <p className="text-xs text-gray-400 mb-4 line-clamp-2">
                  {vehicle.description}
                </p>

                <div className="flex justify-between text-xs text-gray-600 mb-4">
                  <span>
                    <i className="fas fa-user"></i> {vehicle.passengers}
                  </span>
                  <span>
                    <i className="fas fa-suitcase"></i> {vehicle.luggage}
                  </span>
                </div>
                <div className="border-t pt-3">
                  <p className="text-xs text-gray-400">Starting from</p>
                  <p className="text-xl font-serif font-bold text-[#c5a059]">
                    {vehicle.price}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
