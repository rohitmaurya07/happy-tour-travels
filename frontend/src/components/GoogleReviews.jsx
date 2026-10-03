import { useEffect } from "react";

export default function GoogleReviews() {
  useEffect(() => {
    const scriptId = "elfsight-platform-script";

    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://elfsightcdn.com/platform.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <section className="bg-gray-50  px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Section Heading */}
        <div className="text-center mb-12">
          <span className="inline-block text-sm font-semibold tracking-widest uppercase text-blue-600 mb-3">
            Testimonials
          </span>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            What Our Customers Say
          </h2>

          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
            Don't just take our word for it. See what our customers
            have to say about their experience with us.
          </p>

          {/* Rating */}
          <div className="flex items-center justify-center gap-2 mt-6">
            <div className="flex text-yellow-400 text-2xl">
              ★★★★★
            </div>
            <span className="text-gray-700 font-semibold">
              Google Reviews
            </span>
          </div>
        </div>



        {/* Reviews Widget */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-8 overflow-hidden">
          <div
            className="elfsight-app-80ce6747-2e5b-494e-a405-88d6566c5064"
            data-elfsight-app-lazy
          ></div>
     
        </div>


      </div>
    </section>
  );
}