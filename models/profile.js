const { Schema, model } = require("mongoose");

const profileSchema = Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      required: [true, "Need a UserID"],
    },
    phone: String,
    address1: String,
    address2: String,
    city: String,
    state: String,
    postcode: Number,
  },
  { timestamps: true }
);

module.exports.Profile = model("Profile", profileSchema);
