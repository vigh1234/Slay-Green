const mongoose = require("mongoose");

// Messages submitted through the website's Contact form.
const contactMessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 254 },
    subject: { type: String, trim: true, maxlength: 120, default: "" },
    message: { type: String, required: true, trim: true, maxlength: 4000 },
    // Set when the sender was signed in, so replies can be matched to an account.
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    status: { type: String, enum: ["new", "read", "replied"], default: "new" },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.ContactMessage || mongoose.model("ContactMessage", contactMessageSchema);
