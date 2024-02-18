const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  fullname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  image: {
    type: String,
    default: null,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  bio: {
    type: String,
    default: "",
  },
  phoneNumber: {
    type: String,
    unique: true,
    sparse: true,
  },
  age: {
    type: Number,
    required: true,
  },
  avatar: {
    type: String,
    default: null,
  },
  characterName: {
    type: String,
    default: null,
  },
  points: {
    type: Number,
    default: 0,
  },
  badges: [
    {
      name: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      image: {
        type: String,
        default: null,
      },
    },
  ],
  failedLoginAttempts: {
    type: Number,
    default: 0,
  },
  accountLocked: {
    type: Boolean,
    default: false,
  },
  lastFailedLoginAttempt: {
    type: Date,
    default: null,
  },
  resetPasswordToken: {
    type: String,
    default: null,
  },
  resetPasswordExpires: {
    type: Date,
    default: null,
  },
  passwordHistory: [
    {
      type: String,
      required: true,
    },
  ],
  userType: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
    required: true,
  },
});

// set toJSON method to not return hashed password
userSchema.set("toJSON", {
  transform: (document, returnedDocument) => {
    returnedDocument.id = document._id.toString();
    delete returnedDocument._id;
    // delete returnedDocument.password;
    delete returnedDocument.__v;
  },
});

module.exports = mongoose.model("User", userSchema);
