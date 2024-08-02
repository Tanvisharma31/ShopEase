// server.js
const express = require('express'); // Import express framework
const mongoose = require('mongoose'); // Import mongoose for MongoDB interactions
const bodyParser = require('body-parser'); // Middleware to parse JSON bodies

// Initialize express app
const app = express();
const port = process.env.PORT || 5000; // Set port, default to 5000 if not specified

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/shopease', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB'); // Log success message
});
mongoose.connection.on('error', (err) => {
  console.error(`Failed to connect to MongoDB: ${err}`); // Log error message
});

// Define PromoCode schema
const PromoCodeSchema = new mongoose.Schema({
  code: String,
  type: { type: String, enum: ['percentage', 'fixed'] }, // Type of discount
  value: Number, // Discount value
  expiryDate: Date, // Expiry date of promo code
  usageCount: { type: Number, default: 0 }, // Number of times used
  maxUsage: Number, // Maximum usage limit
});

const PromoCode = mongoose.model('PromoCode', PromoCodeSchema);

// Define Referral schema
const ReferralSchema = new mongoose.Schema({
  referrerUserId: mongoose.Schema.Types.ObjectId,
  referredUserId: mongoose.Schema.Types.ObjectId,
  referralCode: String,
  status: { type: String, enum: ['pending', 'used'], default: 'pending' }, // Referral status
  dateCreated: { type: Date, default: Date.now }, // Date created
});

const Referral = mongoose.model('Referral', ReferralSchema);

// Endpoint to create a promo code
app.post('/api/promocodes', async (req, res) => {
  try {
    const promoCode = new PromoCode(req.body);
    await promoCode.save(); // Save promo code to database
    res.status(201).json({ success: true, promoCodeId: promoCode._id });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Endpoint to fetch all promo codes
app.get('/api/promocodes', async (req, res) => {
  try {
    const promoCodes = await PromoCode.find(); // Retrieve all promo codes
    res.json(promoCodes);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Endpoint to apply a promo code
app.post('/api/promocodes/apply', async (req, res) => {
  const { userId, promoCode } = req.body;
  try {
    const code = await PromoCode.findOne({ code: promoCode });
    if (!code) return res.status(404).json({ success: false, message: 'Promo code not found' });
    if (code.expiryDate < new Date()) return res.status(400).json({ success: false, message: 'Promo code expired' });
    if (code.usageCount >= code.maxUsage) return res.status(400).json({ success: false, message: 'Promo code usage limit reached' });

    code.usageCount += 1; // Increment usage count
    await code.save();
    res.json({ success: true, message: 'Promo code applied successfully', discountApplied: { type: code.type, value: code.value } });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Endpoint to create a referral
app.post('/api/referrals', async (req, res) => {
  const { referrerUserId, referralCode } = req.body;
  try {
    const referral = new Referral({ referrerUserId, referralCode });
    await referral.save(); // Save referral to database
    res.status(201).json({ success: true, referralId: referral._id });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Endpoint to fetch referral status
app.get('/api/referrals/:referralId', async (req, res) => {
  const { referralId } = req.params;
  try {
    const referral = await Referral.findById(referralId);
    if (!referral) return res.status(404).json({ success: false, message: 'Referral not found' });
    res.json(referral);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Endpoint to redeem a referral
app.post('/api/referrals/redeem', async (req, res) => {
  const { referralCode, userId } = req.body;
  try {
    const referral = await Referral.findOne({ referralCode, status: 'pending' });
    if (!referral) return res.status(404).json({ success: false, message: 'Referral not found or already used' });

    referral.referredUserId = userId;
    referral.status = 'used';
    await referral.save(); // Update referral status to used

    res.json({ success: true, message: 'Referral redeemed successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
