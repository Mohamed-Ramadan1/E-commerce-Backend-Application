import { Document } from "mongoose";
export interface IUser extends Document {
  name: string;
  email: string;
  phoneNumber: string;
  photo?: string;
  photoPublicId?: string;
  password: string;
  passwordConfirmation: string | undefined;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  role: string;
  address?: string;
  active: boolean;
  verified: boolean;
  emailToken: string;
  isModified: (path: string) => boolean;
  comparePassword(candidatePassword: string): Promise<boolean>;
}
