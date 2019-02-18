import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ITask, ITaskUpdate} from '../../api.service';

@Component({
  selector: 'app-edit-task-details',
  templateUrl: './edit-task-details.component.html',
  styleUrls: ['./edit-task-details.component.scss']
})
export class EditTaskDetailsComponent implements OnInit, AfterViewInit {
  @ViewChild('name') nameInput: ElementRef;
  @Input() task: ITask;

  taskUpdate: ITaskUpdate = {
    name: '',
    description: ''
  };

  constructor(public modal: NgbActiveModal) { }

  ngOnInit() {
    this.taskUpdate.name = this.task.name;
    this.taskUpdate.description = this.task.description;
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.nameInput.nativeElement.focus(), 0);
  }

  save() {
    this.modal.close(this.taskUpdate);
  }
}
