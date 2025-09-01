"use client";
import React from "react";
import Link from "next/link";

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white font-sans">
      {/* Hero Section */}
      <header className="relative bg-gradient-to-r from-gray-700 to-gray-900 text-white">
        <div className="container mx-auto px-6 py-16 flex flex-col md:flex-row items-center justify-between">
          {/* Left Content */}
          <div className="md:w-1/2 text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight drop-shadow-lg text-gray-100">
              Reconnect with What Matters
            </h1>
            <p className="mt-4 text-lg md:text-xl text-gray-300 max-w-lg mx-auto md:mx-0">
              Lost something important? Found an item? Our platform bridges the
              gap and ensures belongings return to their rightful owners.
            </p>

            <div className="flex gap-4 mt-8 justify-center md:justify-start flex-wrap">
              <Link href="/items">
                <button className="px-4 py-2 md:px-6 md:py-3 rounded-xl bg-yellow-400 text-gray-800 font-bold hover:bg-yellow-500 transition text-sm md:text-base shadow-md">
                  Browse Lost Items
                </button>
              </Link>
              <Link href="/report">
                <button className="px-4 py-2 md:px-6 md:py-3 rounded-xl bg-white text-gray-800 font-bold hover:bg-gray-100 transition text-sm md:text-base shadow-md">
                  Report an Item
                </button>
              </Link>
            </div>
          </div>

          {/* Right Image */}
          <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center">
            <img
              src="/1.jpg"
              alt="Lost and Found"
              className="rounded-3xl shadow-2xl w-full max-w-md md:max-w-lg object-cover"
            />
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          <div className="bg-white p-8 rounded-2xl shadow hover:shadow-lg transition">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">Easy Search</h2>
            <p className="text-gray-600">
              Find items quickly with powerful search filters like category,
              date, and location.
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow hover:shadow-lg transition">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3"> Secure Claims</h2>
            <p className="text-gray-600">
              Submit proof of ownership and let our system verify your claim to
              keep items safe.
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow hover:shadow-lg transition">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3"> Trusted Process</h2>
            <p className="text-gray-600">
              We ensure belongings are returned only to verified owners,
              maintaining trust and integrity.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-gradient-to-r from-gray-800 to-gray-900 text-white text-center py-20 px-6">
        <h2 className="text-3xl md:text-4xl font-bold">
          Lost something? Found something?
        </h2>
        <p className="mt-4 max-w-2xl mx-auto text-gray-300">
          Join hundreds of students and staff who have reunited with their
          belongings. Report or claim an item today!
        </p>
        <div className="mt-8 flex justify-center gap-4 flex-wrap">
          <Link href="/register">
            <button className="px-4 py-2 md:px-6 md:py-3 bg-yellow-400 text-gray-800 font-bold rounded-xl hover:bg-yellow-500 transition shadow-md text-sm md:text-base">
              Get Started Now
            </button>
          </Link>
          <Link href="/contact">
            <button className="px-4 py-2 md:px-6 md:py-3 bg-white text-gray-800 font-bold rounded-xl hover:bg-gray-100 transition shadow-md text-sm md:text-base">
              Contact Support
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8 mt-auto">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-center md:text-left">
            © {new Date().getFullYear()} Lost & Found Platform. All rights reserved.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white text-sm">Privacy Policy</a>
            <a href="#" className="hover:text-white text-sm">Terms of Service</a>
            <a href="/contact" className="hover:text-white text-sm">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
