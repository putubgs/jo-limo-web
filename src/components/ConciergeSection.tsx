import Image from "next/image";

const services = [
  {
    icon: "fas fa-clipboard-check",
    title: "Lifestyle Management",
    description: "Handling confidential documents or shopping errands.",
  },
  {
    icon: "fas fa-ticket-alt",
    title: "Event Support",
    description: "Standing in line for tickets or managing guest logistics.",
  },
  {
    icon: "fas fa-map-marked",
    title: "Local Expertise",
    description: "Authentic recommendations for dining and hidden gems.",
  },
];

export default function ConciergeSection() {
  return (
    <section className="py-20 bg-[#111111] text-white">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <h2
              className="text-3xl font-serif font-bold mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Your Personal Concierge <br />
              in Amman
            </h2>
            <p className="text-gray-400 mb-8">
              We are more than just drivers. As your local partner, we assist
              with:
            </p>
            <ul className="space-y-6">
              {services.map((service, index) => (
                <li key={index} className="flex items-start">
                  <i
                    className={`${service.icon} text-[#c5a059] mt-1 mr-4`}
                  ></i>
                  <div>
                    <h4 className="font-bold">{service.title}</h4>
                    <p className="text-sm text-gray-500">
                      {service.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="w-full md:w-1/2 h-full aspect-video bg-gray-800 rounded flex items-center justify-center border border-gray-700 relative overflow-hidden">
            <Image
              src="/images/opening-door-2.webp"
              alt="Concierge Service"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
