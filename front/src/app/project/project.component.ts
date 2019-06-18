import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {
  ApiService,
  IProjectCategory,
  IProjectDifficulty,
  IProjectEstimatedTime,
  IProjectLinked, IProjectPriority,
  IProjectState,
  IProjectType
} from '../api.service';
import {AuthService} from '../auth.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CreateTaskComponent} from '../modal/create-task/create-task.component';
import {EditProjectListPropertyComponent} from '../modal/edit-project-list-property/edit-project-list-property.component';
import {EditLinkListComponent} from '../modal/edit-link-list/edit-link-list.component';
import {EditProjectDetailsComponent} from '../modal/edit-project-details/edit-project-details.component';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {
  @ViewChild('tableDate', {static: false}) tableDate: TemplateRef<any>;
  @ViewChild('tableState', {static: false}) tableState: TemplateRef<any>;
  @ViewChild('tableCategory', {static: false}) tableCategory: TemplateRef<any>;
  @ViewChild('tablePriority', {static: false}) tablePriority: TemplateRef<any>;
  @ViewChild('tableEstimatedTime', {static: false}) tableEstimatedTime: TemplateRef<any>;
  @ViewChild('tableDifficulty', {static: false}) tableDifficulty: TemplateRef<any>;
  @ViewChild('tableType', {static: false}) tableType: TemplateRef<any>;

  loading = false;
  error: string;
  filter = {
    state: undefined,
    name: '',
    priority: undefined,
    type: undefined,
    estimatedTime: undefined,
    difficulty: undefined,
    category: undefined,
  };

  projectId: string;
  project: IProjectLinked;

  tasksRows = [];
  tasksRowsFiltered = [];
  tasksColumns: any[] = [
    {name: 'Name', flexGrow: 1},
  ];

  constructor(private router: Router,
              private route: ActivatedRoute,
              private api: ApiService,
              private auth: AuthService,
              private modalService: NgbModal) { }

  ngOnInit() {
    this.tasksColumns.unshift({name: 'State', flexGrow: 1, cellTemplate: this.tableState});
    this.tasksColumns.push({name: 'Priority', flexGrow: 1, cellTemplate: this.tablePriority});
    this.tasksColumns.push({name: 'Type', flexGrow: 1, cellTemplate: this.tableType});
    this.tasksColumns.push({name: 'Estimated Time', flexGrow: 1, cellTemplate: this.tableEstimatedTime});
    this.tasksColumns.push({name: 'Difficulty', flexGrow: 1, cellTemplate: this.tableDifficulty});
    this.tasksColumns.push({name: 'Category', flexGrow: 1, cellTemplate: this.tableCategory});

    this.route.params.subscribe(params => {
      this.projectId = params.id;
      this.loadProject(this.projectId);
    });
  }

  updateFilter() {
    this.tasksRowsFiltered = this.tasksRows.filter(item => {
      return (
        (!this.filter.name || item.name.toLowerCase().includes(this.filter.name.toLowerCase()))
        && (!this.filter.state || item.state === this.filter.state)
        && (!this.filter.priority || item.priority === this.filter.priority)
        && (!this.filter.type || item.type === this.filter.type)
        && (!this.filter.estimatedTime || item.estimatedTime === this.filter.estimatedTime)
        && (!this.filter.difficulty || item.difficulty === this.filter.difficulty)
        && (!this.filter.category || item.category === this.filter.category)
      );
    });
  }

  filterByName(name: string): void {
    this.filter.name = name;
    this.updateFilter();
  }

  filterByState(state: IProjectState): void {
    this.filter.state = state ? state.id : undefined;
    this.updateFilter();
  }

  filterByPriority(priority: IProjectPriority): void {
    this.filter.priority = priority ? priority.id : undefined;
    this.updateFilter();
  }

  filterByType(type: IProjectType): void {
    this.filter.type = type ? type.id : undefined;
    this.updateFilter();
  }

  filterByEstimatedTime(estimatedTime: IProjectEstimatedTime): void {
    this.filter.estimatedTime = estimatedTime ? estimatedTime.id : undefined;
    this.updateFilter();
  }

  filterByDifficulty(difficulty: IProjectDifficulty): void {
    this.filter.difficulty = difficulty ? difficulty.id : undefined;
    this.updateFilter();
  }

  filterByCategory(category: IProjectCategory): void {
    this.filter.category = category ? category.id : undefined;
    this.updateFilter();
  }

  createTask(): void {
    const ref = this.modalService.open(CreateTaskComponent);
    ref.componentInstance.project = this.project;
    ref.componentInstance.userId = this.auth.user._id;
    ref.result.then(res => {
      if (res) {
        this.project.tasks.push(res);
        this.constructTable();
      }
    }, () => 0);
  }

  editProperty(prop: string): void {
    const ref = this.modalService.open(EditProjectListPropertyComponent);
    ref.componentInstance.name = prop;
    ref.componentInstance.properties = JSON.parse(JSON.stringify(this.project[prop]));
    ref.result.then(res => {
      if (res) {
        const o = {};
        o[prop] = res;
        this.setLoading(true);
        this.api.updateProject(this.project._id, o).subscribe(newProject => {
          this.setLoading(false);
          if (newProject) {
            this.project[prop] = res;
          }
        });
      }
    }, () => 0);
  }

  editLinks(): void {
    const ref = this.modalService.open(EditLinkListComponent);
    ref.componentInstance.links = JSON.parse(JSON.stringify(this.project.links));
    ref.result.then(res => {
      if (res) {
        this.setLoading(true);
        this.api.updateProject(this.project._id, {links: res}).subscribe(project => {
          this.setLoading(false);
          if (project) {
            this.project.links = res;
          }
        });
      }
    }, () => 0);
  }

  editProjectDetails(): void {
    const ref = this.modalService.open(EditProjectDetailsComponent);
    ref.componentInstance.project = this.project;
    ref.result.then(res => {
      if (res) {
        this.setLoading(true);
        this.api.updateProject(this.project._id, res).subscribe(project => {
          this.setLoading(false);
          if (project) {
            for (const k of Object.keys(res)) {
              this.project[k] = res[k];
            }
          }
        });
      }
    }, () => 0);
  }

  loadProject(id: string): void {
    this.setLoading(true);
    this.api.getProject(id).subscribe(project => {
      if (project) {
        this.setLoading(false);
        this.project = project;
        this.constructTable();
      } else {
        this.setLoading(false, 'Could not get project. Please refresh.');
      }
    }, () => {
      this.setLoading(false, 'Could not get project. Please refresh.');
    });
  }

  deleteProject(): void {
    if (confirm('Are you sure you want to delete project?')) {
      this.setLoading(true);
      this.api.deleteProject(this.project._id).subscribe(() => {
        this.setLoading(false);
        this.router.navigate(['/home']);
      });
    }
  }

  goToHome(): void {
    this.router.navigate(['/home']);
  }

  constructTable(): void {
    this.tasksRows = [];
    for (const t of this.project.tasks) {
      this.tasksRows.push(t);
    }
    this.tasksRowsFiltered = this.tasksRows;
  }

  activate(event): void {
    if (event.type === 'click') {
      this.router.navigate(['/task', event.row._id]);
    }
  }

  getStateName(stateId: string): string {
    const v = this.project.states.find(s => s.id === stateId);
    return v ? v.name : '';
  }

  getStateDifficulty(difficultyId: string): string {
    const v = this.project.difficulties.find(s => s.id === difficultyId);
    return v ? v.name : '';
  }

  getStateEstimatedTime(estimatedTimeId: string): string {
    const v = this.project.estimatedTimes.find(s => s.id === estimatedTimeId);
    return v ? v.name : '';
  }

  getStateCategory(categoryId: string): string {
    const v = this.project.categories.find(s => s.id === categoryId);
    return v ? v.name : '';
  }

  getStatePriority(priorityId: string): string {
    const v = this.project.priorities.find(s => s.id === priorityId);
    return v ? v.name : '';
  }

  getStateType(typeId: string): string {
    const v = this.project.types.find(s => s.id === typeId);
    return v ? v.name : '';
  }

  private setLoading(isLoading: boolean, error?: string): void {
    this.loading = isLoading;
    this.error = error;
  }
}
