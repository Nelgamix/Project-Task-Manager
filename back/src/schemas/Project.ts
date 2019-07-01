import mongoose, {Document} from 'mongoose';
import {DateModel, ILink, LinkModel} from './common';
import {IUser, UserRefModel} from './User';

export enum ProjectRight {
  Admin,
  User,
}

export interface IProjectUser extends Document {
  user: IUser['_id'];
  right: ProjectRight;
  added: Date;
}

export interface IProjectMetadataValue extends Document {
  name: string;
  value: string;
}

export interface IProjectMetadata extends Document {
  name: string;
  description: string;
  values: IProjectMetadataValue[];
}

export interface IProjectText extends Document {
  name: string;
  description: string;
  skeleton: string;
}

export interface IProject extends Document {
  author: IUser['_id'];
  name: string;
  description: string;
  users: IProjectUser[];
  links: ILink[];
  metadata: IProjectMetadata[];
  texts: IProjectText[];
  created: number;
  updated: number;
}

export const ProjectRefModel = {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Project'
};

const NameModel = {
  type: String,
  required: true,
};

const DescriptionModel = {
  type: String,
  default: '',
};

const UserModel = {
  user: UserRefModel,
  right: {type: String, enum: ProjectRight},
  added: DateModel,
};

const MetadataModel = {
  name: String,
  description: String,
  values: [{
    name: String,
    value: Number,
  }],
};

const TextModel = {
  name: String,
  description: String,
  skeleton: String,
};

const schema = {
  author: UserRefModel,
  name: NameModel,
  description: DescriptionModel,
  users: [UserModel],
  links: [LinkModel],
  metadata: [MetadataModel],
  texts: [TextModel],
  created: DateModel,
  updated: DateModel,
};

const projectSchema = new mongoose.Schema(schema);

export const Project = mongoose.model<IProject>('Project', projectSchema);
