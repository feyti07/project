import { Component } from '@angular/core';
import { UserDto } from '../../../Models/UserDto';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrl: './info.component.css'
})
export class InfoComponent {

  user: UserDto | undefined;
 
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


}
