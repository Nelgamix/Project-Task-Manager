import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ApiService, IUserLinked} from '../api.service';
import {AuthService} from '../auth.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CreateProjectComponent} from '../modal/create-project/create-project.component';
import {Router} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @ViewChild('tableLastUpdated', {static: false}) tableLastUpdated: TemplateRef<any>;

  filter = '';
  loading = false;
  error: string;

  user: IUserLinked;

  projectsRows = [];
  projectsRowsFiltered = [];
  projectsColumns: any[] = [
    {name: 'Name', flexGrow: 1},
    {name: 'Description', flexGrow: 3},
  ];

  constructor(private api: ApiService, private auth: AuthService, private modalService: NgbModal, private router: Router) { }

  ngOnInit() {
    this.projectsColumns.push({name: 'Last Updated', cellTemplate: this.tableLastUpdated, flexGrow: 1});

    this.setLoading(true);
    this.api.getUser(this.auth.user.name).subscribe(user => {
      this.setLoading(false);
      this.user = user;
      this.constructTable();
    }, () => {
      this.setLoading(false, 'Could not load user. Please retry.');
    });
  }

  activate(event): void {
    if (event.type === 'click') {
      this.router.navigate(['/project', event.row._id]);
    }
  }

  createProject(): void {
    const ref = this.modalService.open(CreateProjectComponent);
    ref.componentInstance.userId = this.auth.user._id;
    ref.result.then(res => {
      if (res) {
        this.user.projects.push(res);
        this.constructTable();
      }
    }, () => 0);
  }

  updateFilter(event) {
    this.filter = event;
    const val = event.toLowerCase();
    if (!val) {
      this.projectsRowsFiltered = this.projectsRows;
      return;
    }

    this.projectsRowsFiltered = this.projectsRows.filter(d => d.name.toLowerCase().indexOf(val) !== -1);
  }

  private constructTable(): void {
    this.projectsRows = [];
    for (const p of this.user.projects) {
      this.projectsRows.push(p);
    }
    this.projectsRowsFiltered = this.projectsRows;
  }

  private setLoading(isLoading: boolean, error?: string): void {
    this.loading = isLoading;
    this.error = error;
  }
}
