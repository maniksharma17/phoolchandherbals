"use client";

import React from "react";

export default function CancellationRefund() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-28 prose">
      <h1>Cancellation and Refund Policy</h1>
      <p><strong>Effective Date:</strong> {new Date(Date.now()).toUTCString()}</p>

      <h2>Order Cancellation</h2>
      <p>Orders may be cancelled within 24 hours if not shipped.</p>

      <h2>Refund Policy</h2>
      <p>
        Refunds are processed within 7–10 working days to the original payment method.
      </p>

      <h2>Non-Refundable Items</h2>
      <p>
        Opened or used herbal/consumable products are not eligible for return.
      </p>
    </main>
  );
}
