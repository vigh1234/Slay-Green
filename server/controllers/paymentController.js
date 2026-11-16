const { getStripe } = require("../utils/stripeClient");

// Controller to create payment intent
const createPaymentIntent = async (req, res) => {
  try {
    const { amount, currency } = req.body || {}; // e.g., { amount: 1000, currency: "inr" }

    // Basic input validation (amount is in the smallest currency unit).
    if (!Number.isInteger(amount) || amount <= 0 || amount > 99999999) {
      return res.status(400).json({ error: "A valid integer amount is required" });
    }
    if (typeof currency !== "string" || !/^[a-zA-Z]{3}$/.test(currency)) {
      return res.status(400).json({ error: "A valid 3-letter currency code is required" });
    }

    // Create a Payment Intent
    const paymentIntent = await getStripe().paymentIntents.create({
      amount, // amount in smallest currency unit (e.g. paise)
      currency,
      // automatic_payment_methods lets Stripe's web Elements (PaymentElement /
      // PaymentRequestButtonElement, used by the web client) offer card, Google
      // Pay, and other methods enabled on the Stripe account, instead of being
      // limited to the single method listed under payment_method_types.
      automatic_payment_methods: { enabled: true },
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Payment Intent Error:", error);
    res.status(error.status || 500).json({ error: error.message });
  }
};

// Controller to send Publishable Key
const getStripePublishableKey = async (req, res) => {
  try {
    res.json({ publishableKey: process.env.STRIPE_PUBLISHABLE_KEY });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createPaymentIntent, getStripePublishableKey};
