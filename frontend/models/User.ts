import {
  model,
  models,
  Schema
} from "mongoose";

// Stores customer and admin account information.
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      default: "",
    },

    avatar: {
      type: String,
      default: "",
    },

    // Determines whether user can access admin features.
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    // Automatically creates createdAt and updatedAt fields.
    timestamps: true,
  },
);

// Reuse existing model if already compiled.
const User = models.User || model("User", userSchema);

export default User;
