"use client";

import React from "react";

export default function PrivacyPolicy() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-28 prose">
      <h1>Privacy Policy</h1>
      <p><strong>Effective Date:</strong> {new Date(Date.now()).toUTCString()}</p>

      <h2>Information We Collect</h2>
      <ul>
        <li>Personal details (name, email, phone, address)</li>
        <li>Payment details (processed securely by gateways)</li>
        <li>Browsing data via cookies</li>
      </ul>

      <h2>How We Use Your Information</h2>
      <p>
        We use your data to process orders, send updates, and improve services.
      </p>

      <h2>Sharing of Information</h2>
      <p>
        We do not sell your data. Limited data is shared only with logistics and payment partners.
      </p>

      <h2>Data Security</h2>
      <p>
        SSL encryption and restricted access protect your data.
      </p>

      <h2>Your Rights</h2>
      <p>
        You may request deletion of your data by emailing{" "}
        <a href="mailto:support@phoolchandherbal.com">
          support@phoolchandherbal.com
        </a>.
      </p>
    </main>
  );
}
