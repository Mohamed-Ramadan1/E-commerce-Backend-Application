import { Schema, model, Model } from "mongoose";
import { IShop } from "./shop.interface";
import validator from "validator";
import crypto from "crypto";

const shopSchema: Schema = new Schema<IShop>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email address"],
    },
    phone: {
      type: String,
      required: true,
      validate: [
        validator.isMobilePhone,
        "Please provide a valid phone number",
      ],
    },
    shopName: {
      type: String,
      unique: true,
      required: true,
    },
    shopDescription: {
      type: String,
    },
    products: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    isActive: {
      type: Boolean,
      default: true,
    },
    categories: [String],
    photo: {
      type: String,
    },
    photoPublicId: {
      type: String,
      select: false,
    },
    banner: {
      type: String,
    },
    bannerId: {
      type: String,
      select: false,
    },
    tempChangedEmail: {
      type: String,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email address"],
    },
    changeEmailVerificationToken: {
      type: String,
      select: false,
    },
    changeEmailVerificationTokenExpiresAt: {
      type: Date,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

shopSchema.methods.createChangeEmailVerificationToken = function (): string {
  const verificationToken = crypto.randomBytes(32).toString("hex");

  this.changeEmailVerificationToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");

  this.changeEmailVerificationTokenExpiresAt = new Date(
    Date.now() + 10 * 60 * 1000
  );

  console.log("Generated Change Email Verification Token:", verificationToken);
  console.log(
    "Hashed Change Email Verification Token:",
    this.changeEmailVerificationToken
  );

  return verificationToken;
};

shopSchema.pre<IShop>(/^find/, function (next) {
  this.populate({
    path: "owner",
    select: "name email phoneNumber active verified",
  });
  this.populate({
    path: "products",
  });
  next();
});

const Shop: Model<IShop> = model<IShop>("Shop", shopSchema);

export default Shop;
