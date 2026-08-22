const Razorpay = require("razorpay");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { amount } = req.body;
  if (!amount || amount <= 0) {
    return res.status(400).json({ error: "Invalid amount" });
  }

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  // ---- Sanity check: catch missing/misconfigured env vars immediately ----
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    console.error("Missing Razorpay env vars. RAZORPAY_KEY_ID set:", !!process.env.RAZORPAY_KEY_ID, "RAZORPAY_KEY_SECRET set:", !!process.env.RAZORPAY_KEY_SECRET);
    return res.status(500).json({ error: "Razorpay keys are not configured on the server. Check your Vercel Environment Variables." });
  }

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
      keyId: process.env.RAZORPAY_KEY_ID, // safe to send back — the Key ID is meant to be public
    });
  } catch (err) {
    console.error("Razorpay order creation failed:", err);
    // Include Razorpay's actual error message so the real cause shows up on the frontend too.
    const detail = err?.error?.description || err?.message || "Unknown error";
    res.status(500).json({ error: "Could not create order: " + detail });
  }
};