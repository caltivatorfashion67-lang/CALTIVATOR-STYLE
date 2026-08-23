const Razorpay = require("razorpay");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { amount } = req.body;
  if (!amount || amount <= 0) {
    return res.status(400).json({ error: "Invalid amount" });
  }

  // ============================================================
  // TEMPORARY DEBUG STEP — keys hardcoded directly here instead of
  // reading from Vercel Environment Variables, just to isolate
  // whether the problem is the env vars or the keys themselves.
  // TODO: remove this hardcoding and switch back to process.env
  // once the real cause is confirmed.
  // ============================================================
  const keyId = "rzp_test_TRByC8jTnTgqTB";
  const keySecret = "***********************";

  console.log("Using Razorpay key_id:", keyId.slice(0, 12) + "..." + keyId.slice(-4), "| length:", keyId.length, "| secret length:", keySecret.length);

  const razorpay = new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });

  try {
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Razorpay expects paise, not rupees
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    });

    res.status(200).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: keyId, // safe to send back — the Key ID is meant to be public
    });
  } catch (err) {
    console.error("Razorpay order creation failed:", err);
    // Include Razorpay's actual error message so the real cause shows up on the frontend too.
    const detail = err?.error?.description || err?.message || "Unknown error";
    res.status(500).json({ error: "Could not create order: " + detail });
  }
};