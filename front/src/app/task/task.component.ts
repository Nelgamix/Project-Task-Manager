import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {
  ApiService,
  IProjectCategory, IProjectDifficulty,
  IProjectEstimatedTime,
  IProjectPriority,
  IProjectState,
  IProjectType,
  ITaskLinked
} from '../api.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {TdTextEditorComponent} from '@covalent/text-editor';
import {EditLinkListComponent} from '../modal/edit-link-list/edit-link-list.component';
import {EditTaskDetailsComponent} from '../modal/edit-task-details/edit-task-details.component';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {
  @ViewChild('textEditorTodo') textEditorTodo: TdTextEditorComponent;
  @ViewChild('textEditorLog') textEditorLog: TdTextEditorComponent;

  loading = false;
  error: string;

  taskId: string;
  task: ITaskLinked;

  constructor(private router: Router, private route: ActivatedRoute, private api: ApiService, private modalService: NgbModal) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.taskId = params.id;
      this.loadTask(this.taskId);
    });
  }

  loadTask(taskId: string): void {
    this.setLoading(true);
    this.api.getTask(taskId).subscribe(task => {
      if (task) {
        this.setLoading(false);
        this.task = task;
        this.setView();
      } else {
        this.setLoading(false, 'Could not get task. Please refresh.');
      }
    }, () => {
      this.setLoading(false, 'Could not get task. Please refresh.');
    });
  }

  changeState(event: IProjectState): void {
    this.changeProp('state', event.id);
  }

  changePriority(event: IProjectPriority): void {
    this.changeProp('priority', event.id);
  }

  changeDifficulty(event: IProjectDifficulty): void {
    this.changeProp('difficulty', event.id);
  }

  changeEstimatedTime(event: IProjectEstimatedTime): void {
    this.changeProp('estimatedTime', event.id);
  }

  changeType(event: IProjectType): void {
    this.changeProp('type', event.id);
  }

  changeCategory(event: IProjectCategory): void {
    this.changeProp('category', event.id);
  }

  changeTodo(): void {
    const val = this.textEditorTodo.value;
    this.setLoading(true);
    this.api.updateTask(this.taskId, {todo: val}).subscribe(task => {
      if (task) {
        this.setLoading(false);
      } else {
        this.setLoading(false, 'Could not change todo.');
      }
      this.textEditorTodo.togglePreview();
    });
  }

  changeLog(): void {
    const val = this.textEditorLog.value;
    this.setLoading(true);
    this.api.updateTask(this.taskId, {log: val}).subscribe(task => {
      if (task) {
        this.setLoading(false);
      } else {
        this.setLoading(false, 'Could not change log.');
      }
      this.textEditorLog.togglePreview();
    });
  }

  deleteTask(): void {
    if (confirm('Are you sure you want to delete this task?')) {
      const projectId = this.task.projectId;
      this.setLoading(true);
      this.api.deleteTask(this.task._id).subscribe(() => {
        this.setLoading(false);
        this.router.navigate(['/project', projectId]);
      });
    }
  }

  editLinks(): void {
    const ref = this.modalService.open(EditLinkListComponent);
    ref.componentInstance.links = JSON.parse(JSON.stringify(this.task.links));
    ref.result.then(res => {
      if (res) {
        this.setLoading(true);
        this.api.updateTask(this.task._id, {links: res}).subscribe(task => {
          this.setLoading(false);
          if (task) {
            this.task.links = res;
          }
        });
      }
    }, () => 0);
  }

  editTaskDetails(): void {
    const ref = this.modalService.open(EditTaskDetailsComponent);
    ref.componentInstance.task = this.task;
    ref.result.then(res => {
      if (res) {
        this.setLoading(true);
        this.api.updateTask(this.task._id, res).subscribe(task => {
          this.setLoading(false);
          if (task) {
            for (const k of Object.keys(res)) {
              this.task[k] = res[k];
            }
          }
        });
      }
    }, () => 0);
  }

  goToProject(): void {
    this.router.navigate(['/project', this.task.projectId]);
  }

  private setView(): void {
    setTimeout(() => {
      this.textEditorTodo.togglePreview();
      this.textEditorLog.togglePreview();
    });
  }

  private changeProp(propName: string, propValue: string): void {
    const objUpd = {};
    objUpd[propName] = propValue;
    this.setLoading(true);
    this.api.updateTask(this.taskId, objUpd).subscribe(task => {
      if (task && task[propName] === propValue) {
        this.setLoading(false);
      } else {
        this.setLoading(false, `Could not change ${propName} to ${propValue}`);
      }
    });
  }

  private setLoading(isLoading: boolean, error?: string): void {
    this.loading = isLoading;
    this.error = error;
  }
}
