import {prop, Ref, Typegoose} from "typegoose";
import {User} from "./User";
import {Project} from "./Project";
import {Schema} from "mongoose";
import ObjectId = Schema.Types.ObjectId;

export enum TaskAssigneeRole {
  Analysis,
  Implementation,
  Review,
}

export class TaskAssignee extends Typegoose {
  _id?: ObjectId;
  @prop() user?: Ref<User>;
  @prop() role?: TaskAssigneeRole;
}

export class TaskComment extends Typegoose {
  _id?: ObjectId;
  @prop() author?: Ref<User>;
  @prop() date?: number;
  @prop() comment?: string;
}

export class TaskGoal extends Typegoose {
  _id?: ObjectId;
  @prop() name?: string;
  @prop() done?: boolean;
}

export class TaskLink extends Typegoose {
  _id?: ObjectId;
  @prop() name?: string;
  @prop() description?: string;
  @prop() url?: string;
}

export class TaskHistory extends Typegoose {
  _id?: ObjectId;
  @prop() action?: string;
  @prop() description?: string;
  @prop() author?: Ref<User>;
  @prop() date?: number;
  // @prop() payload?: string;
}

export class Task extends Typegoose {
  _id?: ObjectId;
  @prop() author?: Ref<User>;
  @prop() project?: Ref<Project>;
  @prop() name?: string;
  @prop() description?: string;
  @prop() assignees?: TaskAssignee[];
  @prop() links?: TaskLink[];
  @prop() texts?: any;
  @prop() metadata?: any;
  @prop() goals?: TaskGoal[];
  @prop() comments?: TaskComment[];
  @prop() tags?: string[];
  @prop() history?: TaskHistory[];
  @prop() created?: number;
  @prop() updated?: number;
}

export const TaskModel = new Task().getModelForClass(Task);
