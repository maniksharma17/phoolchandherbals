"use client";

import React from "react";

export default function ContactUs() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-28 prose">
      <h1>Contact Us</h1>
      <p>
        We’re here to help! Reach out to us with any questions about our products,
        orders, or policies.
      </p>

      <h2>Phoolchand Herbals Pvt Ltd</h2>
      <p>
        <strong>Registered Address:</strong>
        <br />
        50 Kanoon Goyan, Roorkee
        <br />
        Haridwar, Uttarakhand - 247667, India
      </p>

      <p>
        <strong>Email:</strong>{" "}
        <a href="mailto:support@phoolchandherbal.com">
          support@phoolchandherbal.com
        </a>
      </p>

      <p>
        <strong>Phone:</strong>{" "}
        <a href="tel:+919876543210">+91 98378 63349</a>
      </p>

      <p>
        <strong>Business Hours:</strong> Monday – Saturday, 10:00 AM – 6:00 PM
      </p>
    </main>
  );
}
