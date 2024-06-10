import { Schema, model } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
interface IUser {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  photo?: string;
  photoPublicId?: string;
  passwordConfirmation: string | undefined;
  role: string;
  isModified: (path: string) => boolean;
}
const userSchema = new Schema(
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
    phoneNumber: {
      type: String,
      validate: {
        validator: function (this: IUser) {
          return validator.isMobilePhone(this.phoneNumber);
        },
        message: "Invalid phone number",
      },
    },
    photo: {
      type: String,
    },
    photoPublicId: {
      type: String,
    },
    password: {
      type: String,
      required: true,
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
  },
  {
    timestamps: true,
  }
);

userSchema.pre<IUser>("save", function (next) {
  if (!this.isModified("password")) return next();
  this.password = bcrypt.hashSync(this.password, 12);
  this.passwordConfirmation = undefined;
  next();
});

const User = model<IUser>("User", userSchema);

export default User;
