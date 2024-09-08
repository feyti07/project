import { Component, OnInit } from '@angular/core';
import { UserDto } from '../../swagger/services/models';
import { UserService } from '../../../services/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeServiceService } from '../../../services/employee-service.service';
import { EmployeeDto } from '../../Models/EmployeeDto';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';


@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css']
})
export class ProfilComponent implements OnInit {
  user: UserDto | undefined;
  changePasswordForm: FormGroup;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  employee: EmployeeDto | null = null;
  photoUrl: SafeUrl | null = null;
 
  displayPasswordContent: boolean = false;
  displayPersonalInfoContent: boolean = false;

  constructor(private userService: UserService, private fb: FormBuilder, private employeeService: EmployeeServiceService, private sanitizer: DomSanitizer) {
    this.changePasswordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  ngOnInit(): void {
    this.getUser();

    this.employeeService.getCurrentEmployee().subscribe(
      (data: EmployeeDto) => {
        this.employee = data;
      },
      error => {
        console.error('Error fetching employee data', error);
      }
    );
    this.getProfilePhoto();

  }

  getUser(): void {
    const userId = 1;  // Assurez-vous de récupérer l'ID utilisateur approprié
    this.userService.findById({ 'user-id': userId }).subscribe(
      (data: UserDto) => this.user = data,
      error => console.error('There was an error!', error)
    );
  }

  showPasswordContent() {
    this.displayPasswordContent = true;
    this.displayPersonalInfoContent = false;
  }

  showPersonalInfoContent() {
    this.displayPasswordContent = false;
    this.displayPersonalInfoContent = true;
  }

  onSubmit(): void {
    if (this.changePasswordForm.valid) {
      const { oldPassword, newPassword } = this.changePasswordForm.value;
      this.userService.changePassword(oldPassword, newPassword).subscribe(
        response => {
          this.successMessage = 'Password changed successfully';
          this.errorMessage = null;
        },
        error => {
          this.errorMessage = 'Error changing password';
          this.successMessage = null;
        }
      );
    }
  }


  getProfilePhoto(): void {
    this.employeeService.getCurrentEmployee().subscribe(employee => {
      if (employee.photo) {
        this.photoUrl = this.sanitizer.bypassSecurityTrustUrl(`data:image/jpeg;base64,${employee.photo}`);
      } else {
        this.photoUrl = null; // ou définissez une URL de placeholder si nécessaire
      }
    });
  }


  
}
