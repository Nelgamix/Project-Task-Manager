import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {HttpClientModule} from '@angular/common/http';
import { HomeComponent } from './home/home.component';
import {NgSelectModule} from '@ng-select/ng-select';
import { LoginComponent } from './login/login.component';
import { ProjectComponent } from './project/project.component';
import { TaskComponent } from './task/task.component';
import {FormsModule} from '@angular/forms';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { CreateProjectComponent } from './modal/create-project/create-project.component';
import { CreateTaskComponent } from './modal/create-task/create-task.component';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import { CovalentTextEditorModule } from '@covalent/text-editor';
import { EditProjectListPropertyComponent } from './modal/edit-project-list-property/edit-project-list-property.component';
import { EditProjectDetailsComponent } from './modal/edit-project-details/edit-project-details.component';
import { EditTaskDetailsComponent } from './modal/edit-task-details/edit-task-details.component';
import { EditLinkListComponent } from './modal/edit-link-list/edit-link-list.component';
import {NgxLoadingModule} from 'ngx-loading';
import {ToastrModule} from 'ngx-toastr';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    ProjectComponent,
    TaskComponent,
    CreateProjectComponent,
    CreateTaskComponent,
    EditProjectListPropertyComponent,
    EditProjectDetailsComponent,
    EditTaskDetailsComponent,
    EditLinkListComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgSelectModule,
    NgxJsonViewerModule,
    NgbModule,
    NgxDatatableModule,
    CovalentTextEditorModule.forRoot(),
    NgxLoadingModule.forRoot({}),
    ToastrModule.forRoot(),
  ],
  providers: [],
  entryComponents: [
    CreateProjectComponent,
    CreateTaskComponent,
    EditProjectListPropertyComponent,
    EditLinkListComponent,
    EditProjectDetailsComponent,
    EditTaskDetailsComponent,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
