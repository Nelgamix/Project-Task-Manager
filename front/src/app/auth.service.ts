import { Injectable } from '@angular/core';
import {ApiService, IUser} from './api.service';
import {Observable, Subject, of} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: IUser;
  user$: Subject<IUser>;

  constructor(private api: ApiService) {
    this.user$ = new Subject();
    this.user$.subscribe(user => this.user = user);
  }

  login(name: string, password: string): Observable<boolean> {
    return this.api.loginUser(name, password).pipe(
      catchError(() => of(undefined)),
      tap(user => this.user$.next(user)),
      map(user => Boolean(user))
    );
  }

  logout(): Observable<boolean> {
    return this.api.logoutUser().pipe(
      tap(() => this.user$.next(undefined))
    );
  }

  me(): Observable<IUser> {
    return this.api.meUser().pipe(
      catchError(() => of(undefined)),
      tap(e => this.user$.next(e))
    );
  }

  get loggedIn() {
    return Boolean(this.user);
  }
}
