import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import { Observable } from 'rxjs';
import {AuthService} from './auth.service';
import {map, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.verifyLocalLogin()) {
      return true;
    }

    return this.auth.me().pipe(
      map(e => Boolean(e)),
      tap(ok => {
        if (!ok) {
          this.router.navigate(['/login']);
        }
      })
    );
  }

  verifyLocalLogin(): boolean {
    return this.auth.loggedIn;
  }
}
