const Razorpay = require("razorpay");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { amount } = req.body;
  if (!amount || amount <= 0) {
    return res.status(400).json({ error: "Invalid amount" });
  }

  const keyId = (process.env.RAZORPAY_KEY_ID || "").trim();
  const keySecret = (process.env.RAZORPAY_KEY_SECRET || "").trim();

  if (!keyId || !keySecret) {
    console.error("Missing Razorpay env vars. RAZORPAY_KEY_ID set:", !!keyId, "RAZORPAY_KEY_SECRET set:", !!keySecret);
    return res.status(500).json({ error: "Razorpay keys are not configured on the server. Check your Vercel Environment Variables." });
  }

  console.log("Using Razorpay key_id:", keyId.slice(0, 12) + "..." + keyId.slice(-4), "| length:", keyId.length, "| secret length:", keySecret.length);

  const razorpay = new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });

  try {
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    });

    res.status(200).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: keyId,
    });
  } catch (err) {
    console.error("Razorpay order creation failed:", err);
    const detail = err?.error?.description || err?.message || "Unknown error";
    res.status(500).json({ error: "Could not create order: " + detail });
  }
};
