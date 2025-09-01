import React from "react";
import Link from "next/link";

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Section */}
      <header className="flex flex-col md:flex-row items-center justify-between text-center md:text-left py-12 px-6 bg-gradient-to-r from-blue-50 to-blue-100">
        <div className="md:w-1/2">
          <h1 className="text-3xl md:text-5xl font-bold leading-tight text-[#1e40af] hover:text-gray-800">
            Welcome to Our Lost and Found
          </h1>
          <p className="mt-4 max-w-xl text-sm md:text-base text-gray-600 font-medium">
            Reuniting people with their belongings. Report lost items, claim
            found ones, and connect securely through our platform.
          </p>

          {/* Buttons */}
          <div className="flex gap-3 mt-6 flex-wrap justify-center md:justify-start">
            <Link href="/items">
              <button className="px-4 py-2 md:px-6 md:py-3 rounded-lg font-bold bg-blue-600 text-white hover:bg-blue-700 transition text-sm md:text-base">
                Browse Lost Items
              </button>
            </Link>
            <Link href="/register">
              <button className="px-4 py-2 md:px-6 md:py-3 rounded-lg font-bold bg-gray-800 text-white hover:bg-gray-700 transition text-sm md:text-base">
                Get Started Now!
              </button>
            </Link>
          </div>
        </div>

        {/* Hero Image */}
        <div className="md:w-1/2 mt-8 md:mt-0 flex justify-center">
          <img
            src="1.jpg"
            alt="Lost and Found Illustration"
            className="rounded-2xl shadow-lg max-h-80 md:max-h-96 object-cover"
          />
        </div>
      </header>

      {/* Features Section */}
      <section className="flex flex-col md:flex-row items-center justify-around py-12 px-6 gap-8">
        <div className="text-center max-w-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-2"> Easy Search</h2>
          <p className="text-gray-600">
            Quickly search for lost or found items using categories, dates, and
            locations.
          </p>
        </div>
        <div className="text-center max-w-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-2"> Claim Requests</h2>
          <p className="text-gray-600">
            Submit claim requests with proof of ownership for verification by
            admins.
          </p>
        </div>
        <div className="text-center max-w-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Secure Process</h2>
          <p className="text-gray-600">
            Our system ensures that items are returned only to verified owners,
            maintaining integrity.
          </p>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center bg-blue-50 py-12 px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-[#1e40af]">
          Lost something? Found something?
        </h2>
        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
          Don’t let your valuables stay unclaimed. Report your lost item or
          submit details of a found item to help reunite belongings with their
          rightful owners.
        </p>
        <Link href="/report">
          <button className="mt-6 px-4 py-2 md:px-8 md:py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition text-sm md:text-base">
            Report an Item
          </button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8 mt-auto">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-center md:text-left">
            © {new Date().getFullYear()} Lost & Found Platform. All rights
            reserved.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white text-sm">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white text-sm">
              Terms of Service
            </a>
            <a href="/contact" className="hover:text-white text-sm">
              Contact Us
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
