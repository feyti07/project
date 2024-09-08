import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  private jwtHelper = new JwtHelperService();
  private decodedToken: any;
  constructor() {
    this.decodedToken = this.jwtHelper.decodeToken(localStorage.getItem('token') as string);
  }

  get userId(): number {
    return this.decodedToken.userId;
  }

  get userFullname(): string {
    return this.decodedToken.fullName;
  }
}
