import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../../services/authentication.service';
import { Router } from '@angular/router';
import { UserDto } from '../../Models/UserDto';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'] 
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string = '';

  successMessage: string = '';

  constructor(private fb: FormBuilder, private authService: AuthenticationService, private router : Router) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe({
        next: (response) => {
          // Handle successful registration
          this.successMessage = 'L\'utilisateur a été créé avec succès. Veuillez vous connecter.';
          this.errorMessage = '';
          this.registerForm.reset();
        },
        error: (error) => {
          // Handle error, e.g., invalid email
          this.errorMessage = error.error.error || 'Échec de l\'inscription. Veuillez réessayer.';
          this.successMessage = '';
        }
      });
    }
  
  }

  login(): void {
    this.router.navigate(['/home']); // Redirection vers la page Home après inscription
  }
  showPassword: boolean = false;

  togglePassword() {
    this.showPassword = !this.showPassword;
    // Pas besoin de code supplémentaire ici, le binding dans HTML gère le changement de type d'entrée
  }

}
