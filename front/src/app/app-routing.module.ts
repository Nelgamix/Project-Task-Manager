import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from './home/home.component';
import {TaskComponent} from './task/task.component';
import {ProjectComponent} from './project/project.component';
import {LoginComponent} from './login/login.component';
import {UserGuard} from './user.guard';

const routes: Routes = [
  {path: 'login',       component: LoginComponent},
  {path: 'home',        canActivate: [UserGuard], component: HomeComponent},
  {path: 'project/:id', canActivate: [UserGuard], component: ProjectComponent},
  {path: 'task/:id',    canActivate: [UserGuard], component: TaskComponent},
  {path: '',            redirectTo: '/home', pathMatch: 'full'},
  {path: '**',          redirectTo: '/home'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
