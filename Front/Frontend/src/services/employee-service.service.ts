import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiConfiguration } from './ApiConfiguration';
import { BaseService } from './BaseService';
import { EmployeeDto } from '../app/Models/EmployeeDto';

@Injectable({
  providedIn: 'root'
})
export class EmployeeServiceService extends BaseService {

  constructor(
    protected override config: ApiConfiguration,  // Ajoutez le modificateur override ici
    protected override http: HttpClient  
  ) {
    super(config, http);
  }

  getEmployeeMatricules(): Observable<string[]> {
    return this.http.get<string[]>(`${this.rootUrl}/api/employee/matricules`);
  }

  getCurrentEmployee(): Observable<EmployeeDto> {
    return this.http.get<EmployeeDto>(`${this.rootUrl}/api/employee/current-employee`);
  }

  getProfilePhoto(): Observable<Blob> {
    return this.http.get(`${this.rootUrl}/api/employee/profile-photo`, { responseType: 'blob' });
  }

  /* getUserById(userId: number): Observable<UserDto> {
    return this.http.get<UserDto>(`${this.rootUrl}/api/user/${userId}`);
  } */
}

