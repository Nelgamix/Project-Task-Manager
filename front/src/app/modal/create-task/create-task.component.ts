import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ApiService, IProject, ITaskCreate} from '../../api.service';

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.scss']
})
export class CreateTaskComponent implements OnInit, AfterViewInit {
  @ViewChild('name') nameInput: ElementRef;
  @Input() project: IProject;
  @Input() userId: string;

  loading = false;
  error: string;

  form: ITaskCreate = {
    userId: '',
    projectId: '',
    name: '',
    description: '',
    state: '',
    priority: '',
    type: '',
    estimatedTime: '',
    difficulty: '',
    category: ''
  };

  constructor(public modal: NgbActiveModal, private api: ApiService) { }

  ngOnInit() {
    this.form.userId = this.userId;
    this.form.projectId = this.project._id;
    this.form.state = this.project.states[0].id;
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.nameInput.nativeElement.focus(), 0);
  }

  create(): void {
    this.loading = true;
    this.api.createTask(this.form).subscribe(task => {
      this.loading = false;
      if (task) {
        this.modal.close(task);
      } else {
        this.error = 'Could not create task. Please try again.';
      }
    }, err => {
      this.loading = false;
      this.error = 'Could not create task. Please try again.';
    });
  }
}
