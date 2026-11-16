const express = require('express')
const router = express.Router()
const { ESGAnalysis, createMarketPlacePaymentIntent } = require('../controllers/marketPlaceController')

router.post('/esg-analyze', ESGAnalysis)
router.post('/marketplace-payment-intent', createMarketPlacePaymentIntent)

module.exports = router