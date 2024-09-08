import { Component } from '@angular/core';
import { UserDto } from '../../../Models/UserDto';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrl: './password.component.css'
})
export class PasswordComponent {
  user: UserDto | undefined;
  oldPassword: string = '';
  newPassword: string = '';
  successMessage: string = '';
  errorMessage: string = '';
 
  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.getUser();
  }

  getUser(): void {
    const userId = 1;  // Assurez-vous de récupérer l'ID utilisateur approprié
    this.userService.findById({ 'user-id': userId }).subscribe(
      (data: UserDto) => this.user = data,
      error => console.error('There was an error!', error)
    );
  }
  displayPasswordContent: boolean = false;
  displayPersonalInfoContent: boolean = false;

  showPasswordContent() {
    this.displayPasswordContent = true;
    this.displayPersonalInfoContent = false;
  }

  showPersonalInfoContent() {
    this.displayPasswordContent = false;
    this.displayPersonalInfoContent = true;
  }

  onSubmit(): void {
    this.userService.changePassword(this.oldPassword, this.newPassword).subscribe(
      () => {
        this.successMessage = 'Mot de passe mis à jour avec succès';
        this.errorMessage = '';
      },
      error => {
        this.errorMessage = 'Erreur lors de la mise à jour du mot de passe';
        this.successMessage = '';
      }
    );
  }

}
