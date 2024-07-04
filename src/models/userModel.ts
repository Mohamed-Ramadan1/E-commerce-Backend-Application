import { Model, Schema, model } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import { IUser } from "./user.interface";
import crypto from "crypto";

const userSchema: Schema<IUser> = new Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, "Invalid email"],
    },
    address: {
      type: String,
    },
    shippingAddress: {
      type: String,
    },
    phoneNumber: {
      type: String,

      validate: {
        validator: function (this: IUser) {
          return validator.isMobilePhone(this.phoneNumber);
        },
        message: "Invalid phone number",
      },
    },
    shoppingCart: {
      type: Schema.Types.ObjectId,
      ref: "ShoppingCart",
    },
    giftCard: {
      type: Number,
      default: 0,
    },
    photo: {
      type: String,
      default:
        "https://res.cloudinary.com/deqgzvkxp/image/upload/v1718812055/defaultProileImg_j1ilwv.png",
    },
    photoPublicId: {
      type: String,
    },
    password: {
      type: String,
      required: true,
      select: false,
      minlength: 8,
    },
    passwordConfirmation: {
      type: String,
      required: true,
      validate: {
        validator: function (this: IUser) {
          return this.password === this.passwordConfirmation;
        },
        message: "Password and password confirmation do not match",
      },
    },
    role: {
      type: String,
      enum: ["user", "admin", "trader"],
      default: "user",
    },
    purchaseHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
      type: Boolean,
      default: true,
    },
    emailVerificationToken: {
      type: String,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    myShop: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.index({ email: 1 });

userSchema.pre<IUser>("save", function (next) {
  if (!this.isModified("password")) return next();
  this.password = bcrypt.hashSync(this.password, 12);
  this.passwordConfirmation = undefined;
  next();
});

/**
 * Compares a candidate password with the stored hashed password.
 *
 * @param candidatePassword - The password provided by the user.
 * @returns A promise that resolves to a boolean indicating whether the candidate password matches the stored hashed password.
 *
 * @remarks
 * This method uses bcrypt.compare to compare the candidate password with the stored hashed password.
 * It is an asynchronous method and should be awaited when used.
 *
 * @example
 * ```typescript
 * const user = await User.findOne({ email: 'user@example.com' });
 * const isMatch = await user.comparePassword('candidatePassword');
 * console.log(isMatch); // Output: true or false
 * ```
 */
userSchema.methods.comparePassword = async function (
  candidatePassword: string,
  userPassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.createEmailVerificationToken = function () {
  const token: string = crypto.randomBytes(32).toString("hex");
  this.emailVerificationToken = token;
  this.emailVerificationExpires = Date.now() + 3600000; // 1 hour
  return token;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 3600000; // 1 hour

  console.log("Generated Reset Token:", resetToken);
  console.log("Hashed Reset Token:", this.passwordResetToken);
  return resetToken;
};

const User: Model<IUser> = model<IUser>("User", userSchema);

export default User;
