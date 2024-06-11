import { Document } from "mongoose";
export interface IUser extends Document {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  photo?: string;
  photoPublicId?: string;
  passwordConfirmation: string | undefined;
  role: string;
  isModified: (path: string) => boolean;
  comparePassword(candidatePassword: string): Promise<boolean>;
}
