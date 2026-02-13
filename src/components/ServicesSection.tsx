const services = [
  {
    icon: "fas fa-plane",
    title: "Airport Transfer",
    description: "Stress-free pickups at QAIA with flight tracking.",
  },
  {
    icon: "fas fa-route",
    title: "City-to-City",
    description: "Flat rates to Petra, Dead Sea, Aqaba, and more.",
  },
  {
    icon: "fas fa-clock",
    title: "Hourly Hire",
    description: "Your car, your schedule. Perfect for meetings.",
  },
  {
    icon: "fas fa-user-tie",
    title: "Event Chauffeur",
    description: "Logistics for weddings and corporate delegations.",
  },
];

export default function ServicesSection() {
  return (
    <section id="services" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <h2
          className="text-3xl font-serif font-bold text-center mb-12"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Our Services
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className="p-6 border border-gray-200 rounded hover:border-brand-gold transition"
            >
              <i
                className={`${service.icon} text-3xl text-brand-gold mb-4`}
              ></i>
              <h3 className="font-bold mb-2">{service.title}</h3>
              <p className="text-sm text-gray-600">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
