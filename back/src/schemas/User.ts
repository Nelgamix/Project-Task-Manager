import {instanceMethod, prop, staticMethod, Typegoose, InstanceType} from "typegoose";
import bcrypt from 'bcryptjs';

export enum UserRole {
  Admin,
  User,
}

export class User extends Typegoose {
  @prop() name?: string;
  @prop() displayName?: string;
  @prop() email?: string;
  @prop() image?: string;
  @prop() password?: string;
  @prop() role?: UserRole;
  @prop({default: Date.now}) created?: number;
  @prop({default: Date.now}) updated?: number;
  @prop({default: Date.now}) lastLogin?: number;

  @staticMethod
  static getPasswordHash(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  @instanceMethod
  validatePassword(this: InstanceType<User>, password: string): Promise<boolean> {
    return this.password ? bcrypt.compare(password, this.password) : Promise.resolve(false);
  }
}

export const UserModel = new User().getModelForClass(User);
