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
  created: Date;
  updated: Date;
  lastLogin: Date;
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

userSchema.statics.getPasswordHash = function(password: string, cb: (hash: string | undefined) => void) {
  bcrypt.hash(password, 10)
      .then((hash: string) => {
        cb(hash);
      })
      .catch(() => {
        cb(undefined);
      });
};

export const User = mongoose.model<IUser>('User', userSchema);
