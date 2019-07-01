const bcrypt = require('bcryptjs');

import mongoose, {Document} from 'mongoose';
import {DateModel} from './common';

enum UserRole {
  Admin,
  User,
}

export interface IUser extends Document {
  name: string;
  displayName: string;
  email: string;
  image: string;
  role: UserRole;
  created: number;
  updated: number;
  lastLogin: number;
  password: string;
}

export const UserRefModel = {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User'
};

const NameModel = {
  type: String,
  required: true,
  unique: true,
};

const DisplayNameModel = {
  type: String,
};

const EmailModel = {
  type: String,
};

const ImageModel = {
  type: String,
};

const RoleModel = {
  type: String,
  enum: UserRole,
};

const schema = {
  name: NameModel,
  displayName: DisplayNameModel,
  email: EmailModel,
  image: ImageModel,
  role: RoleModel,
  created: DateModel,
  updated: DateModel,
  lastLogin: DateModel,
  password: String,
};

const userSchema = new mongoose.Schema(schema);

userSchema.methods.validatePassword = function(password: string, cb: (validated: boolean) => void) {
  bcrypt.compare(password, this.password)
      .then((res: boolean) => {
        cb(res);
      })
      .catch(() => {
        cb(false);
      });
};

export function getPasswordHash(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export const User = mongoose.model<IUser>('User', userSchema);