import {prop, Typegoose} from "typegoose";
import bcrypt from 'bcryptjs';
import {Schema} from "mongoose";
import ObjectId = Schema.Types.ObjectId;

export enum UserRole {
  Admin,
  User,
}

export class User extends Typegoose {
  _id?: ObjectId;
  @prop() name?: string;
  @prop() displayName?: string;
  @prop() email?: string;
  @prop() image?: string;
  @prop() password?: string;
  @prop() role?: UserRole;
  @prop() created?: number;
  @prop() updated?: number;
  @prop() lastLogin?: number;

  static getPasswordHash(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  validatePassword(password: string): Promise<boolean> {
    return this.password ? bcrypt.compare(password, this.password) : Promise.resolve(false);
  }
}

export const UserModel = new User().getModelForClass(User);
