import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, filter, map, Observable, of, throwError } from 'rxjs';
import { UserDto } from '../app/Models/UserDto';
import { AuthenticationResponse } from '../app/Models/AuthenticationResponse';
import { AuthenticationRequest } from '../app/Models/AuthenticationRequest';
import { ApiConfiguration } from './ApiConfiguration';
import { BaseService } from './BaseService';
import { StrictHttpResponse } from './StrictHttpResponse';
import { RequestBuilder } from './RequestBuilder';



@Injectable({
  providedIn: 'root'
})
export class AuthenticationService extends BaseService{
  private currentUser: UserDto | null = null;
  private role: string | null = null;

  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  register(user: UserDto): Observable<AuthenticationResponse> {
    return this.http.post<AuthenticationResponse>(`${this.rootUrl}/auth/register`, user);
  }
  /**
   * Path part for operation authenticate
   */
  static readonly AuthenticatePath = '/auth/authenticate';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `authenticate()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  authenticate$Response(params: {
    context?: HttpContext
    body: AuthenticationRequest
  }): Observable<StrictHttpResponse<AuthenticationResponse>> {

    const rb = new RequestBuilder(this.rootUrl, AuthenticationService.AuthenticatePath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<AuthenticationResponse>;
      }),
      catchError((error) => {
        console.error('Authentication error', error);
        return throwError(error);
      })
    );
  }

  authenticate(params: {
    context?: HttpContext
    body: AuthenticationRequest
  }): Observable<AuthenticationResponse> {
    return this.authenticate$Response(params).pipe(
      map((r: StrictHttpResponse<AuthenticationResponse>) => {
        const response = r.body as AuthenticationResponse;
        if (response && response.role) {
          localStorage.setItem('role', response.role);
          console.log('Role stored in localStorage:', response.role);
        }
        return response;
      }),
      catchError((error) => {
        return throwError(error);
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `authenticate$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  

  getCurrentUser(): Observable<UserDto> {
    if (this.currentUser) {
      return of(this.currentUser);
    } else {
      return this.http.get<UserDto>(`${this.rootUrl}/auth/current-user`).pipe(
        map(user => {
          this.currentUser = user;
          return user;
        })
      );
    }
  }
/* .......guard..... */
  isLoggedIn(): boolean {
    return localStorage.getItem('role') !== null;
  }

  getRole(): string | null {
    if (!this.role) {
      this.role = localStorage.getItem('role');
      console.log('Fetching role from localStorage');
      console.log('Stored role:', this.role);
    }
    return this.role;
  }
  

  logout(): void {
    localStorage.removeItem('role');
  }
  getUserRole(): string {
    return this.getRole() ?? '';
  }
}
