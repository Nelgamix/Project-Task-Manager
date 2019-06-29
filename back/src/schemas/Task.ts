import mongoose, {Document} from 'mongoose';
import {DateModel, ILink, LinkModel} from './common';
import {IUser, UserRefModel} from './User';
import {IProject, ProjectRefModel} from './Project';

export enum ITaskAssigneeRole {
  Analysis,
  Implementation,
  Review,
}

export interface ITaskAssignee extends Document {
  user: IUser['_id'];
  role: ITaskAssigneeRole;
}

export interface ITaskGoal extends Document {
  name: string;
  done: boolean;
}

export interface ITaskComment extends Document {
  author: IUser['_id'];
  date: Date;
  comment: string;
}

export interface ITaskHistory extends Document {
  action: string;
  description: string;
  payload: any;
  author: IUser['_id'];
  date: Date;
}

export interface ITask extends Document {
  author: IUser['_id'];
  project: IProject['_id'];
  name: string;
  description: string;
  assignees: ITaskAssignee[];
  links: ILink[];
  texts: any;
  metadata: any;
  goals: ITaskGoal[];
  comments: ITaskComment[];
  tags: string[];
  history: ITaskHistory[];
  created: Date;
  updated: Date;
}

export const TaskRefModel = {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Task',
};

const NameModel = {
  type: String,
  required: true,
};

const DescriptionModel = {
  type: String,
  default: '',
};

const AssigneeModel = {
  user: UserRefModel,
  role: {type: String, enum: ITaskAssigneeRole},
};

const GoalModel = {
  name: String,
  done: Boolean,
};

const CommentModel = {
  author: UserRefModel,
  date: DateModel,
  comment: String,
};

const HistoryModel = {
  action: String,
  description: String,
  payload: mongoose.Schema.Types.Mixed,
  author: UserRefModel,
  date: DateModel,
};

const schema = {
  author: UserRefModel,
  project: ProjectRefModel,
  name: NameModel,
  description: DescriptionModel,
  assignees: [AssigneeModel],
  links: [LinkModel],
  texts: mongoose.Schema.Types.Mixed,
  metadata: mongoose.Schema.Types.Mixed,
  goals: [GoalModel],
  comments: [CommentModel],
  tags: [String],
  history: [HistoryModel],
  created: DateModel,
  updated: DateModel,
};

const taskSchema = new mongoose.Schema(schema);

export const Task = mongoose.model<ITask>('Task', taskSchema);
