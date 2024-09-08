import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../services/authentication.service';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css'
})
export class SideBarComponent implements OnInit {
  role: string | null = null;

  constructor(private authService: AuthenticationService) { }

  ngOnInit(): void {
    this.role = this.authService.getUserRole();
  }

}
