import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthenticationService } from '../authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthenticationService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      const role = this.authService.getUserRole();
      if (role === 'ROLE_USER') {
        this.router.navigate(['/dashuser']); // Redirige les utilisateurs avec le rôle USER
      } else {
        this.router.navigate(['/dash']); // Redirige les autres utilisateurs (ex : Admin)
      }
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
