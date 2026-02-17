export default function Footer() {
  return (
    <footer className="bg-black text-gray-400 py-12 text-center border-t border-gray-900">
      <div className="container mx-auto px-6">
        <h2
          className="text-white text-2xl font-serif font-bold mb-4"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Ready for a Better Ride?
        </h2>
        <p className="mb-8">
          Book your premium transfer in Amman today. No hidden fees. Just 5-star
          service.
        </p>
        <div className="flex flex-col md:flex-row justify-center gap-4 mb-10">
          <a
            href="#bookingForm"
            className="bg-[#c5a059] text-black px-6 py-3 rounded font-bold"
          >
            Book Online
          </a>
          <a
            href="https://api.whatsapp.com/send/?phone=962791698125&text=Hello+Jo+Limo%2C+I+would+like+to+ask+for+more+information+regarding+your+services.&type=phone_number&app_absent=0"
            className="border border-gray-600 px-6 py-3 rounded font-bold hover:bg-gray-800"
          >
            Chat with Concierge
          </a>
        </div>
        <p className="text-xs">
          &copy; 2026 Jo Limo. Registered in Jordan (No. 200155494)
        </p>
      </div>
    </footer>
  );
}
