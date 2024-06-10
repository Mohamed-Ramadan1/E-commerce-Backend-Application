import { Schema, model } from "mongoose";
import validator from "validator";
interface IUser {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  passwordConfirmation: string;
  role: string;
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
const User = model<IUser>("User", userSchema);

export default User;
