import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { catchError, map } from 'rxjs/operators';

interface Authority {
  authority: string;
}

interface DecodedToken {
  authorities: Authority[];
  // other properties
}

@Injectable({
  providedIn: 'root'
})
export class UserGuard {

  constructor(private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const token = localStorage.getItem('token');
    if (token) {
      const helper = new JwtHelperService();
      const decodedToken = helper.decodeToken(token);
      console.log("decodedToken", decodedToken);

      if (decodedToken.authorities && 
        (decodedToken.authorities[0].authority === 'ROLE_USER')) {
      return true;
      } else {
        this.router.navigate(['']);
        return false;
      }
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}