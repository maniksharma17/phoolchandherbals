"use client";

import React from "react";

export default function TermsAndConditions() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-28 prose">
      <h1>Terms and Conditions</h1>
      <p><strong>Effective Date:</strong> {new Date(Date.now()).toUTCString()}</p>

      <h2>Use of the Website</h2>
      <p>
        By accessing or using our website, you agree to comply with these terms. 
        You must be at least 18 years old to make a purchase.
      </p>

      <h2>Products & Pricing</h2>
      <p>
        All products are subject to availability. Prices may change without prior notice.
      </p>

      <h2>Payment</h2>
      <p>
        Payments are processed securely through trusted partners like Razorpay.
      </p>

      <h2>Intellectual Property</h2>
      <p>
        All content, logos, and designs are the property of Phoolchand Herbals Pvt Ltd.
      </p>

      <h2>Limitation of Liability</h2>
      <p>
        We are not liable for indirect or incidental damages arising from the use of this website.
      </p>

      <h2>Governing Law</h2>
      <p>
        These terms are governed by the laws of India.
      </p>
    </main>
  );
}
