import {AfterViewInit, Component, ElementRef, Input, ViewChild} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ApiService, IProjectCreate} from '../../api.service';

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.scss']
})
export class CreateProjectComponent implements AfterViewInit {
  @ViewChild('name', {static: true}) nameInput: ElementRef;
  @Input() userId: string;

  loading = false;
  error;

  form: IProjectCreate = {
    name: '',
    description: '',
    userId: ''
  };

  constructor(public modal: NgbActiveModal, private api: ApiService) { }

  ngAfterViewInit() {
    setTimeout(() => this.nameInput.nativeElement.focus(), 0);
  }

  create(): void {
    this.form.userId = this.userId;
    this.loading = true;
    this.api.createProject(this.form).subscribe(project => {
      this.loading = false;
      if (project) {
        this.modal.close(project);
      } else {
        this.error = 'Could not create project. Please try again.';
      }
    }, () => {
      this.loading = false;
      this.error = 'Could not create project. Please try again.';
    });
  }
}
