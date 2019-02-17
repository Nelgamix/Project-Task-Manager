import {Component, Input} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-edit-project-list-property',
  templateUrl: './edit-project-list-property.component.html',
  styleUrls: ['./edit-project-list-property.component.scss']
})
export class EditProjectListPropertyComponent {
  @Input() name = 'list properties';
  @Input() properties: {id: string, name: string}[] = [];

  constructor(public modal: NgbActiveModal) { }

  addProperty(): void {
    this.properties.push({id: '', name: ''});
  }

  removeProperty(index: number): void {
    this.properties.splice(index, 1);
  }

  save(): void {
    this.modal.close(this.properties);
  }
}
