const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  userId: { type: String },
  userName: { type: String },
  firstName: { type: String },
  lastName: { type: String },
  middleName: { type: String },
  userEmail: { type: String },
  password: { type: String },
  passwordSalt: { type: String },
  contact: { type: String },
  userAddress: { type: String },
  nic: { type: String },
  passportId: { type: String },
  roles: [{ type: mongoose.Schema.Types.ObjectId, ref: "Role", required: false },],
  profilePic: { type: String },
  createdBy: { type: String },
  createdOn: { type: Date },
  modifiedBy: { type: String },
  modifiedOn: { type: Date },
  isActive: { type: Boolean },
  clientTenentId: { type: String },
  countryCode: { type: String }
});

const User = mongoose.model("User", userSchema);
module.exports = User;
