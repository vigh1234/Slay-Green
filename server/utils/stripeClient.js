const Stripe = require("stripe");

let client = null;

// Lazily create the Stripe client so the server can boot (and every non-payment
// feature keep working) when STRIPE_SECRET_KEY isn't configured. Only the
// payment endpoints fail, with a clear error, until the key is provided.
const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    const err = new Error("Stripe is not configured on the server");
    err.status = 503;
    throw err;
  }
  if (!client) client = new Stripe(process.env.STRIPE_SECRET_KEY);
  return client;
};

module.exports = { getStripe };
