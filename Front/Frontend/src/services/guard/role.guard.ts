import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { AuthenticationService } from '../authentication.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private authService: AuthenticationService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    const expectedRoles = route.data['expectedRoles'];
    const currentRole = this.authService.getUserRole();

    if (this.authService.isLoggedIn() && expectedRoles.includes(currentRole)) {
      return true;
    }

    // Navigate to login page or access denied page if not authorized
    this.router.navigate(['/login']);
    return false;
  }
}

