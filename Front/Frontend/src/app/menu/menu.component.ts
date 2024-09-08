import { Component, Input } from '@angular/core';
import { HelperService } from '../../services/helper.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {
  @Input() isAdmin = false;
  role = 'user';
  userFullname = '';

  constructor(
    private helperService: HelperService
  ) { }

  ngOnInit(): void {
    if (this.isAdmin) {
      this.role = 'admin';
    }
    this.userFullname = this.helperService.userFullname;
  }

}
