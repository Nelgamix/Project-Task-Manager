import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {IProject, IProjectUpdate} from '../../api.service';

@Component({
  selector: 'app-edit-project-details',
  templateUrl: './edit-project-details.component.html',
  styleUrls: ['./edit-project-details.component.scss']
})
export class EditProjectDetailsComponent implements OnInit, AfterViewInit {
  @ViewChild('name', {static: true}) nameInput: ElementRef;
  @Input() project: IProject;

  projectUpdate: IProjectUpdate = {
    name: '',
    description: ''
  };

  constructor(public modal: NgbActiveModal) { }

  ngOnInit() {
    this.projectUpdate = {
      name: this.project.name,
      description: this.project.description,
    };
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.nameInput.nativeElement.focus(), 0);
  }

  save(): void {
    this.modal.close(this.projectUpdate);
  }
}
