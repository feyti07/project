import { Component, OnInit, Renderer2, ElementRef, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationRequest } from '../../Models/AuthenticationRequest';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthenticationService } from '../../../services/authentication.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { fromEvent } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {
  showLoginForm: boolean = true;
  authRequest: AuthenticationRequest = {};
  errorMessages: Array<string> = [];
  _loginForm!: FormGroup;
  errorMessage: string = '';

  @ViewChildren('input') inputs!: QueryList<ElementRef>;

  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private _fb: FormBuilder,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this._loginForm = this._fb.group({
      email: [''],
      password: [''],
    });

    this.renderer.setStyle(document.body, 'min-height', '100vh');
    this.renderer.setStyle(document.body, 'width', '100%');
    this.renderer.setStyle(document.body, 'background', '#eceeed');
    this.renderer.setStyle(document.body, 'background-size', 'cover');
    this.renderer.setStyle(document.body, 'background-repeat', 'no-repeat');
    this.renderer.setStyle(document.body, 'background-position', 'center');
  }

  ngAfterViewInit(): void {
    // Initialize input focus and blur events after the view has been initialized
    this.inputs.changes.subscribe(() => {
      this.inputs.forEach(input => {
        fromEvent(input.nativeElement, 'focus').subscribe(() => this.addFocus(input.nativeElement));
        fromEvent(input.nativeElement, 'blur').subscribe(() => this.removeFocus(input.nativeElement));
      });
    });
  }

  login() {
    console.log('start login');
    this.errorMessage = '';
    this.authService.authenticate({
      body: this._loginForm.value,
    }).subscribe({
      next: async (data) => {
        console.log('data', data);
        if (data && data.token) {
          localStorage.setItem('token', data.token);
          const helper = new JwtHelperService();
          const decodedToken = helper.decodeToken(data.token);
          if (decodedToken && decodedToken.authorities && decodedToken.authorities[0] && decodedToken.authorities[0].authority === 'ROLE_ADMIN') {
            await this.router.navigate(['dash']);
          } else {
            await this.router.navigate(['dash']);
          }
        } else {
          console.error("Token is missing in the response data");
        }
      },
      error: (err) => {
        console.log(err);
        this.errorMessage = err.error.errorMessage || 'Email ou mot de passe incorrect. Veuillez réessayer.';
      }
    });
  }

  register(): void {
    this.router.navigate(['/register']); // Redirection vers la page Home après inscription
  }

  private addFocus(element: HTMLElement) {
    const parent = (element as HTMLInputElement).parentElement?.parentElement;
    if (parent) {
      parent.classList.add('focus');
    }
  }

  private removeFocus(element: HTMLElement) {
    const inputElement = element as HTMLInputElement;
    const parent = inputElement.parentElement?.parentElement;
    if (parent && inputElement.value === '') {
      parent.classList.remove('focus');
    }
  }
}
