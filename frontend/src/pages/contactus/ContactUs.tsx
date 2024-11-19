import React, { useState } from "react";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaLocationArrow,
  FaLinkedin,
  FaTwitter,
  FaFacebook,
} from "react-icons/fa";

const ContactUs = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    // Here you could implement actual form submission logic, e.g., via API
    console.log("Form Submitted:", form);
  };

  return (
    <div className="bg-gray-50 ">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="bg-teal-600 w-full h-20 m-2 rounded-md">
            <p>Welcome</p>
        </div>
        <div className="text-center">
          <h2 className="text-3xl font-semibold text-teal-600 mb-4">
            Contact Us
          </h2>
          <p className="text-lg text-gray-600">
            We're here to help. Feel free to reach out to us with any questions
            or inquiries.
          </p>
        </div>

        <div className="mt-10 flex flex-col lg:flex-row gap-10">
          {/* Contact Form Section */}
          <div className="lg:w-2/3 bg-white p-8 rounded-lg shadow-md">
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Your Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  value={form.name}
                  onChange={handleInputChange}
                  className="mt-2 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div className="mb-6">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  value={form.email}
                  onChange={handleInputChange}
                  className="mt-2 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div className="mb-6">
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-700"
                >
                  Subject (Optional)
                </label>
                <input
                  type="text"
                  name="subject"
                  id="subject"
                  value={form.subject}
                  onChange={handleInputChange}
                  className="mt-2 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div className="mb-6">
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700"
                >
                  Your Message
                </label>
                <textarea
                  name="message"
                  id="message"
                  rows={5}
                  required
                  value={form.message}
                  onChange={handleInputChange}
                  className="mt-2 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-teal-600 text-white py-3 rounded-md hover:bg-teal-700 focus:outline-none"
              >
                {isSubmitted ? "Message Sent" : "Send Message"}
              </button>
            </form>
          </div>

          {/* Contact Info Section */}
          <div className="lg:w-1/3 space-y-8">
            <div>
              <h3 className="text-xl font-semibold text-teal-600">
                Get in Touch
              </h3>
              <p className="text-gray-600">
                Whether you have a question about our services or just want to
                say hello, we’d love to hear from you.
              </p>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <div className="flex items-center text-gray-700">
                <FaPhoneAlt className="mr-3 text-teal-600" />
                <span className="text-sm">+123 456 7890</span>
              </div>
              <div className="flex items-center text-gray-700">
                <FaEnvelope className="mr-3 text-teal-600" />
                <span className="text-sm">contact@website.com</span>
              </div>
              <div className="flex items-center text-gray-700">
                <FaLocationArrow className="mr-3 text-teal-600" />
                <span className="text-sm">123 Main St, City, Country</span>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="space-x-4">
              <a
                href="#"
                target="_blank"
                className="text-teal-600 hover:text-teal-700"
              >
                <FaLinkedin size={24} />
              </a>
              <a
                href="#"
                target="_blank"
                className="text-teal-600 hover:text-teal-700"
              >
                <FaTwitter size={24} />
              </a>
              <a
                href="#"
                target="_blank"
                className="text-teal-600 hover:text-teal-700"
              >
                <FaFacebook size={24} />
              </a>
            </div>
          </div>
        </div>

        {/* Optional Location Map */}
        <div className="mt-10">
          <h3 className="text-xl font-semibold text-teal-600 mb-4">
            Our Location
          </h3>
          <div className="aspect-w-16 aspect-h-9">
            <iframe
              title="Nyeri Location Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13441.323567794365!2d36.9552!3d-0.4234!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x183f82d31fd60edb%3A0x22eac4c29519f418!2sNyeri%2C%20Kenya!5e0!3m2!1sen!2sus!4v1693580325034!5m2!1sen!2sus"
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen="true"
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
