import { Component } from '@angular/core';
import { UserDto } from '../../Models/UserDto';
import { UserService } from '../../../services/user.service';


@Component({
  selector: 'app-list-accee',
  templateUrl: './list-accee.component.html',
  styleUrl: './list-accee.component.css'
})
export class ListAcceeComponent {
  users: UserDto[] = [];
  roles: string[] = ['ROLE_USER', 'ROLE_ADMIN', 'ROLE_RES']; // Ajoutez tous les rôles possibles ici
  searchTerm: string = '';
  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();

  }

  loadUsers(): void {
  this.userService.findAll().subscribe(users => {
    // Filtrer les utilisateurs avec rôle admin
    this.users = users.filter(user => user.username !== 'admin');
  });
}

  onRoleChange(user: UserDto, newRole: string): void {
    if (user.id !== undefined) { // Vérifiez si l'ID de l'utilisateur est défini
      user.role = newRole;
      this.userService.updateUserRole(user.id, newRole).subscribe(() => {
        // Réussi, vous pouvez ajouter ici tout code de gestion des succès si nécessaire
      }, error => {
        console.error('Erreur lors de la mise à jour du rôle de l\'utilisateur :', error);
        // Gestion des erreurs, affichage d'un message d'erreur par exemple
      });
    } else {
      console.error('Impossible de mettre à jour le rôle de l\'utilisateur car son ID est indéfini.');
      // Gestion de l'erreur, affichage d'un message d'erreur par exemple
    }
  }
  

  onStatusChange(user: UserDto): void {
    if (user.id !== undefined) { // Vérifiez si l'ID de l'utilisateur est défini
      const newStatus = !user.active;
      this.userService.updateUserStatus(user.id, newStatus).subscribe(() => {
        // Réussi, vous pouvez ajouter ici tout code de gestion des succès si nécessaire
      }, error => {
        console.error('Erreur lors de la mise à jour du statut de l\'utilisateur :', error);
        // Gestion des erreurs, affichage d'un message d'erreur par exemple
      });
    } else {
      console.error('Impossible de mettre à jour le statut de l\'utilisateur car son ID est indéfini.');
      // Gestion de l'erreur, affichage d'un message d'erreur par exemple
    }
  }

  toggleSearch() {
    const searchBox = document.querySelector('.search-box') as HTMLElement;
    const searchIcon = document.querySelector('.search-icon') as HTMLElement;
    const cancelIcon = document.querySelector('.cancel-icon') as HTMLElement;
    const searchInput = document.querySelector('input') as HTMLInputElement;
    searchBox.classList.toggle('active');
    searchIcon.classList.toggle('active');
    cancelIcon.classList.toggle('active');
    searchInput.classList.toggle('active');
    if (searchInput.classList.contains('active')) {
      searchInput.focus();
    }
  }

  clearSearch() {
    this.searchTerm = '';
    this.toggleSearch();
    
  }
  

  
  
}