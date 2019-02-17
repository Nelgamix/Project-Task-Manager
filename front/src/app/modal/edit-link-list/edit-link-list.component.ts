import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ILink} from '../../api.service';

@Component({
  selector: 'app-edit-link-list',
  templateUrl: './edit-link-list.component.html',
  styleUrls: ['./edit-link-list.component.scss']
})
export class EditLinkListComponent implements OnInit {
  @Input() links: ILink[] = [];

  constructor(public modal: NgbActiveModal) { }

  ngOnInit() {
  }

  addLink(): void {
    this.links.push({name: '', description: '', url: ''});
  }

  removeLink(index: number): void {
    this.links.splice(index, 1);
  }

  save(): void {
    this.modal.close(this.links);
  }
}
