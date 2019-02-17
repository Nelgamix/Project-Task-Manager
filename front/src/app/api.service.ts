import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

export interface ILink {
  name: string;
  description: string;
  url: string;
}

export interface IUser {
  _id: string;
  name: string;
  displayName: string;
  email: string;
  role: string;
  created: string;
  lastLogin: string;
}

export interface IUserLinked extends IUser {
  projects: IProject[];
}

export interface IUserCreate {
  name: string;
  displayName: string;
  email: string;
  password: string;
}

export interface IUserUpdate {
  displayName?: string;
  email?: string;
}

export interface IProjectDifficulty {
  id: string;
  name: string;
}

export interface IProjectPriority {
  id: string;
  name: string;
}

export interface IProjectEstimatedTime {
  id: string;
  name: string;
}

export interface IProjectType {
  id: string;
  name: string;
}

export interface IProjectState {
  id: string;
  name: string;
}

export interface IProjectCategory {
  id: string;
  name: string;
}

export interface IProject {
  _id: string;
  userId: string;
  name: string;
  description: string;
  links: ILink[];
  difficulties: IProjectDifficulty[];
  estimatedTimes: IProjectEstimatedTime[];
  priorities: IProjectPriority[];
  types: IProjectType[];
  states: IProjectState[];
  categories: IProjectCategory[];
  created: string;
  lastUpdated: string;
}

export interface IProjectLinked extends IProject {
  user: IUser;
  tasks: ITask[];
}

export interface IProjectCreate {
  userId: string;
  name: string;
  description?: string;
  links?: ILink[];
  difficulties?: IProjectDifficulty[];
  estimatedTimes?: IProjectEstimatedTime[];
  priorities?: IProjectPriority[];
  types?: IProjectType[];
  states?: IProjectState[];
  categories?: IProjectCategory[];
}

export interface IProjectUpdate {
  name?: string;
  description?: string;
  links?: ILink[];
  difficulties?: IProjectDifficulty[];
  estimatedTimes?: IProjectEstimatedTime[];
  priorities?: IProjectPriority[];
  types?: IProjectType[];
  states?: IProjectState[];
  categories?: IProjectCategory[];
}

export interface ITask {
  _id: string;
  userId: string;
  projectId: string;
  name: string;
  description: string;
  difficulty: string;
  category: string;
  type: string;
  links: ILink[];
  priority: string;
  estimatedTime: string;
  todo: string;
  log: string;
  state: string;
  tags: string[];
  created: string;
  lastUpdated: string;
}

export interface ITaskLinked extends ITask {
  project: IProject;
  user: IUser;
}

export interface ITaskCreate {
  userId: string;
  projectId: string;
  name: string;
  description?: string;
  difficulty?: string;
  priority?: string;
  category?: string;
  type?: string;
  links?: ILink[];
  estimatedTime?: string;
  todo?: string;
  log?: string;
  state?: string;
  tags?: string[];
}

export interface ITaskUpdate {
  name?: string;
  description?: string;
  difficulty?: string;
  priority?: string;
  category?: string;
  type?: string;
  links?: ILink[];
  estimatedTime?: string;
  todo?: string;
  log?: string;
  state?: string;
  tags?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private prefix = 'api';

  constructor(private http: HttpClient) { }

  // ************************************************************
  // ********** USER
  // ************************************************************
  loginUser(name: string, password: string): Observable<any> {
    return this.post(`user/login`, {name, password});
  }

  logoutUser(): Observable<any> {
    return this.post(`user/logout`);
  }

  meUser(): Observable<IUser> {
    return this.get(`user/me`);
  }

  createUser(create: IUserCreate): Observable<IUser> {
    return this.post(`user`, create);
  }

  getUser(name: string): Observable<IUserLinked> {
    return this.get(`user/${name}`);
  }

  updateUser(name: string, update: IUserUpdate): Observable<IUser> {
    return this.put(`user/${name}`, update);
  }

  deleteUser(name: string): Observable<IUser> {
    return this.delete(`user/${name}`);
  }

  // ************************************************************
  // ********** PROJECT
  // ************************************************************
  createProject(create: IProjectCreate): Observable<IProject> {
    return this.post(`project`, create);
  }

  getProject(id: string): Observable<IProjectLinked> {
    return this.get(`project/${id}`);
  }

  updateProject(id: string, update: IProjectUpdate): Observable<IProject> {
    return this.put(`project/${id}`, update);
  }

  deleteProject(id: string): Observable<IProject> {
    return this.delete(`project/${id}`);
  }

  // ************************************************************
  // ********** TASK
  // ************************************************************
  createTask(create: ITaskCreate): Observable<ITask> {
    return this.post('task', create);
  }

  getTask(id: string): Observable<ITaskLinked> {
    return this.get(`task/${id}`);
  }

  updateTask(id: string, update: ITaskUpdate): Observable<ITask> {
    return this.put(`task/${id}`, update);
  }

  deleteTask(id: string): Observable<ITask> {
    return this.delete(`task/${id}`);
  }

  // ************************************************************
  // ********** PRIVATE METHODS
  // ************************************************************
  private get(url: string): Observable<any> {
    return this.http.get(`${this.prefix}/${url}`);
  }

  private post(url: string, body: any = {}): Observable<any> {
    return this.http.post(`${this.prefix}/${url}`, body);
  }

  private put(url: string, body: any = {}): Observable<any> {
    return this.http.put(`${this.prefix}/${url}`, body);
  }

  private delete(url: string): Observable<any> {
    return this.http.delete(`${this.prefix}/${url}`);
  }
}
