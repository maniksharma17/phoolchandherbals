"use client";

import React from "react";

export default function ShippingExchange() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-28 prose">
      <h1>Shipping and Exchange Policy</h1>
      <p><strong>Effective Date:</strong> {new Date(Date.now()).toUTCString()}</p>

      <h2>Shipping</h2>
      <p>
        Orders are shipped within 2–5 business days. Delivery usually takes 5–10 business days within India.
      </p>

      <h2>Charges</h2>
      <p>Standard shipping charges apply and are shown at checkout.</p>

      <h2>Exchange</h2>
      <p>
        Damaged or incorrect products may be exchanged within 7 days of delivery.
      </p>

      <h2>Process</h2>
      <p>
        Contact support with your order details and proof of issue to initiate a return or exchange.
      </p>
    </main>
  );
}
