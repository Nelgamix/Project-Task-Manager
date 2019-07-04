import {prop, Ref, Typegoose} from "typegoose";
import {User} from "./User";
import {Schema} from "mongoose";
import ObjectId = Schema.Types.ObjectId;

export enum ProjectRight {
  Admin,
  User,
}

export class ProjectUser {
  _id?: ObjectId;
  @prop() user?: Ref<User>;
  @prop() right?: ProjectRight;
  @prop() added?: number;
}

export class ProjectLink extends Typegoose {
  _id?: ObjectId;
  @prop() name?: string;
  @prop() description?: string;
  @prop() url?: string;
}

export class ProjectMetadata extends Typegoose {
  _id?: ObjectId;
  @prop() name?: string;
  @prop() description?: string;
  @prop() values?: ProjectMetadataValue[];
}

export class ProjectMetadataValue extends Typegoose {
  _id?: ObjectId;
  @prop() name?: string;
  @prop() value?: number;
}

export class ProjectText extends Typegoose {
  _id?: ObjectId;
  @prop() name?: string;
  @prop() description?: string;
  @prop() skeleton?: string;
}

export class Project extends Typegoose {
  _id?: ObjectId;
  @prop() author?: Ref<User>;
  @prop() name?: string;
  @prop() description?: string;
  @prop() users?: ProjectUser[];
  @prop() links?: ProjectLink[];
  @prop() metadata?: ProjectMetadata[];
  @prop() texts?: ProjectText[];
  @prop() created?: number;
  @prop() updated?: number;
}

export const ProjectModel = new Project().getModelForClass(Project);
