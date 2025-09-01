"use client";
import React from "react";
import { useForm, ValidationError } from "@formspree/react";

const ContactUs = () => {
  const [state, handleSubmit] = useForm("mzzvqkjk"); // replace with your Formspree ID

  if (state.succeeded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
          <h1 className="text-2xl font-bold text-gray-800">✅ Message Sent!</h1>
          <p className="text-gray-600 mt-3">
            Thank you for reaching out to us. We’ll get back to you soon.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      {/* Header */}
      <header className="bg-gray-800 text-white py-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold">Contact Us</h1>
        <p className="mt-3 text-gray-300 max-w-2xl mx-auto px-4">
          Have questions, suggestions, or need help? Reach out to us anytime —
          we’re here to assist you.
        </p>
      </header>

      {/* Main Section */}
      <main className="flex-1 container mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Send us a Message
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-800 focus:outline-none"
              />
              <ValidationError field="name" prefix="Name" errors={state.errors} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-800 focus:outline-none"
              />
              <ValidationError field="email" prefix="Email" errors={state.errors} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                placeholder="+254 700 123 456"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-800 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea
                rows="4"
                name="message"
                placeholder="Write your message here..."
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-800 focus:outline-none"
              ></textarea>
              <ValidationError
                field="message"
                prefix="Message"
                errors={state.errors}
              />
            </div>

            <button
              type="submit"
              disabled={state.submitting}
              className="w-full px-6 py-3 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-700 transition disabled:opacity-50"
            >
              {state.submitting ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col justify-center space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">Get in Touch</h2>
          <p className="text-gray-600">
            You can also reach us directly through our official contact details
            below. Our support team will respond as soon as possible.
          </p>
          <div className="space-y-4">
            <p className="text-gray-700">
              <strong>Email:</strong> support@lostfound.com
            </p>
            <p className="text-gray-700">
              <strong>Phone:</strong> +254 700 123 456
            </p>
            <p className="text-gray-700">
              <strong>Address:</strong> University Campus, Nairobi, Kenya
            </p>
          </div>
          <div className="mt-6">
            <iframe
              className="w-full h-64 rounded-xl shadow"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.789536857881!2d36.821946!3d-1.292066!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f10d7c9f2d9b3%3A0x12b9f5a8c8b89b79!2sNairobi!5e0!3m2!1sen!2ske!4v1700000000000"
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 text-center py-6 mt-auto">
        <p>© {new Date().getFullYear()} Lost & Found Platform. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default ContactUs;
