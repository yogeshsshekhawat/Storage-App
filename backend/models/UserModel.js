import { model, Schema } from "mongoose";
import bcrypt from "bcrypt";

const Userschema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
    unverifiedExpiresAt: {
      type: Date,
      default: function () {
        if (!this.isVerified) {
          return new Date(Date.now() + 24 * 60 * 60 * 1000);
        }
        return undefined;
      },
      expires: 0,
    },
    profilepic: {
      type: String,
      default:
        "https://img.freepik.com/premium-vector/free-vector-user-icon-simple-line_901408-588.jpg?w=2000",
    },
  },
  {
    timestamps: true,
  },
);

Userschema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const hashedpassword = await bcrypt.hash(this.password, 10);
  this.password = hashedpassword;
});

const User = model("User", Userschema);

export default User;
