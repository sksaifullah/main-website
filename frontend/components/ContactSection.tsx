"use client";

import React, { useState } from "react";
import Image from "next/image";
import { showToast } from "./Toast";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8000";

interface FaqItem {
  question: string;
  answer: string;
}

const faqData: FaqItem[] = [
  {
    question: "Do you provide free doorstep pickup?",
    answer: "Yes, we provide free doorstep pickup from your home or office address across India at your preferred time.",
  },
  {
    question: "How long does standard delivery take?",
    answer: "Our express courier delivery takes approximately 3 to 5 working days depending on the destination country and customs clearance.",
  },
  {
    question: "What documents are required for medicine shipping?",
    answer: "We require a valid doctor's prescription, the patient's passport copy, and the purchase invoice for the medicines.",
  },
  {
    question: "How can I track my shipment?",
    answer: "You can track your shipment live using the waybill number in the dedicated Shipment Tracking section of our website.",
  },
];

export const ContactSection: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      showToast("Please fill in all required fields.", "error");
      return;
    }

    try {
      await fetch(`${API_BASE}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
        }),
      });
    } catch (err) {
      console.warn("Contact fallback:", err);
    }

    showToast("Thank you! Your message has been sent to our customer care team.", "success");
    setFormData({ name: "", email: "", phone: "", message: "" });
  };

  return (
    <section id="contact" className="section-padding bg-texture-grid border-y border-slate-100 dark:border-slate-800">
      <div className="container-custom">
        {/* FAQ Accordion Block */}
        <div id="faq" className="mb-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="badge-primary mb-3">FAQ</span>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqData.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 cursor-pointer"
                onClick={() => toggleFaq(idx)}
              >
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-slate-800 dark:text-white text-sm">{faq.question}</h4>
                  <i
                    className={`fa-solid fa-chevron-down text-slate-400 transition-transform ${
                      openFaq === idx ? "rotate-180" : ""
                    }`}
                  ></i>
                </div>
                {openFaq === idx && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 animate-fade-in">
                    {faq.answer}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-800 p-8 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
            <span className="badge-primary mb-3">Contact Support</span>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-6">Send Us a Message</h2>

            <form id="contact-form" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Your Name</label>
                  <input
                    type="text"
                    id="contact-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="form-input"
                    placeholder="e.g. Rajesh Kumar"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    id="contact-email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="form-input"
                    placeholder="name@example.com"
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  id="contact-phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="form-input"
                  placeholder="+91 98765 43210"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Message Details</label>
                <textarea
                  id="contact-message"
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="form-textarea"
                  placeholder="How can our courier specialists help you?"
                  required
                ></textarea>
              </div>
              <button type="submit" className="btn-primary w-full justify-center text-sm py-4 cursor-pointer">
                <i className="fa-paper-plane fa-solid"></i> Send Inquiry Message
              </button>
            </form>
          </div>

          {/* Contact Info & Office Photo Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 text-white">
              <Image
                id="contact-office-img"
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80"
                alt="Sky Worldwide Corporate Office"
                width={800}
                height={300}
                unoptimized
                className="w-full h-44 object-cover"
              />
              <div className="bg-gradient-to-br from-[#005DC3] to-[#00398A] p-8">
                <h3 className="text-xl font-bold mb-2">Sky Worldwide Head Office</h3>
                <p id="contact-address-display" className="text-xs text-blue-100 leading-relaxed mb-6">
                  Sky Worldwide Cargo Hub, Near International Airport Cargo Terminal, Sahar, Mumbai 400099, India.
                </p>

                <div className="space-y-4 text-sm mb-6">
                  <div className="flex items-center gap-3">
                    <i className="fa-solid fa-phone text-lg text-blue-200"></i>
                    <span id="contact-phone-display">+91 98200 12345</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <i className="fa-solid fa-envelope text-lg text-blue-200"></i>
                    <span id="contact-email-display">support@skyworldwide.com</span>
                  </div>
                  <div className="flex items-center gap-3 font-semibold">
                    <i className="fa-brands fa-whatsapp text-lg text-emerald-400 font-bold"></i>
                    <span>
                      WhatsApp: <span id="contact-whatsapp-display">+91 98200 12345</span>
                    </span>
                  </div>
                </div>

                {/* WhatsApp CTA Button */}
                <a
                  href="https://wa.me/919820012345"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary bg-emerald-600 hover:bg-emerald-700 text-white w-full justify-center"
                >
                  <i className="fa-brands fa-whatsapp text-lg"></i> Chat on WhatsApp
                </a>
              </div>
            </div>

            {/* Location Map */}
            <div className="rounded-2xl overflow-hidden shadow-md border border-slate-200 dark:border-slate-800">
              <iframe
                id="contact-map-iframe"
                className="w-full h-56 border-0"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3769.886737525381!2d72.86877131538604!3d19.09066605650228!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c9a96e620577%3A0xe510f0e08f511fa!2sChhatrapati%20Shivaji%20Maharaj%20International%20Airport%20Mumbai!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-2">
                <i className="fa-solid fa-clock text-[#005DC3] mr-2"></i> Operating Hours
              </h4>
              <p id="contact-hours-display" className="text-xs text-slate-600 dark:text-slate-400">
                Monday – Saturday: 9:00 AM – 9:00 PM | Sunday: 10:00 AM – 6:00 PM
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
