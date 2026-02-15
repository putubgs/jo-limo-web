// import BookingForm from "./BookingForm";
import ReservationForm from "./ReservationForm";

export default function HeroSection() {
  return (
    <div className="hero-bg min-h-screen flex items-center pt-24 pb-12">
      <div className="container mx-auto px-6 flex flex-col lg:flex-row items-center justify-between gap-12">
        {/* Left Content */}
        <div className="lg:w-1/2 text-white">
          <h1 className="text-4xl lg:text-6xl font-serif font-bold mb-6 !leading-tight">
            Stress-Free Airport Transfers &{" "}
            <span className="text-[#c5a059]">Premium Chauffeur Services.</span>
          </h1>
          <p className="text-lg text-gray-300 mb-8 max-w-lg leading-relaxed">
            Experience the same 5-star fleet as top hotels. Book direct with
            Amman&apos;s local experts for fair and transparent rates.
          </p>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-200">
            <div className="flex items-center gap-3">
              <i className="fas fa-plane-arrival text-[#c5a059] text-xl"></i>
              <span>Flight Tracking Included</span>
            </div>
            <div className="flex items-center gap-3">
              <i className="fas fa-clock text-[#c5a059] text-xl"></i>
              <span>Free 60 Mins Wait Time</span>
            </div>
            <div className="flex items-center gap-3">
              <i className="fas fa-car text-[#c5a059] text-xl"></i>
              <span>Guaranteed Car Model</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col md:flex-row gap-4 text-center md:text-left">
            {/* <a
              href="#bookingForm"
              className="bg-[#c5a059] text-[#111111] px-6 py-3 rounded font-bold hover:bg-white transition"
            >
              Check Rates & Book
            </a> */}
            <a
              href="https://wa.me/962791698125"
              className="border border-white px-6 py-3 rounded font-bold hover:bg-white hover:text-black transition"
            >
              Chat with Concierge
            </a>
          </div>
        </div>

        {/* Booking Form */}
        <div id="bookingForm">
          <ReservationForm />
        </div>
      </div>
    </div>
  );
}
