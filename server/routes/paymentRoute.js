const express = require('express')
const router = express.Router();
const {createPaymentIntent, getStripePublishableKey} = require("../controllers/paymentController")

router.get("/stripe-key", getStripePublishableKey);
router.post("/create-payment-intent", createPaymentIntent);

module.exports = router;