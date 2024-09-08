import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

// Define an interface for the authority object
interface Authority {
  authority: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminGuardService {

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

      // Type the authorities array
      const authorities: Authority[] = decodedToken.authorities;

      // Check for admin roles
      if (authorities && 
        authorities.some((auth: Authority) => 
          auth.authority === 'ROLE_ADMIN' || 
          auth.authority === 'ROLE_RES')) {
        return true;
      } 
      // Check for user roles
      else if (authorities && 
        authorities.some((auth: Authority) => 
          auth.authority === 'ROLE_USER')) {
        // Redirect to a user-specific route or handle user-specific logic
        this.router.navigate(['/dashuser']);
        return false;
      } 
      else {
        // Redirect to access denied page if no valid role is found
        this.router.navigate(['/access-denied']);
        return false;
      }
    } else {
      // Redirect to login if no token
      this.router.navigate(['/login']);
      return false;
    }
  }
}
