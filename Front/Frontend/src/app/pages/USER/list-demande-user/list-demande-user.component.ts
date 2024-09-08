import { Component, OnInit } from '@angular/core';
import { DemandeService } from '../../../../services/demande.service';
import { DemandeDto } from '../../../Models/DemandeDto';
import { HelperService } from '../../../../services/helper.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { DemandeControllerService } from '../../../swagger/services/services';
declare var bootstrap: any;
@Component({
  selector: 'app-list-demande-user',
  templateUrl: './list-demande-user.component.html',
  styleUrl: './list-demande-user.component.css'
})
export class ListDemandeUserComponent implements OnInit{
  StatusOptions: string[] = ['NOUVEAU', 'ATTENTE', 'CLOS'];
  userIdToDelete: any = -1;
  demandes: DemandeDto[] = [];
  searchTerm: string = '';
  selectedStatus: string = ''; // Initialisez la valeur sélectionnée
  itemsPerPage: number = 10; // Nombre d'éléments par page par défaut
  totalDemandes: DemandeDto[] = [];
  currentPage: number = 1; // Page actuelle
  totalDemandesCount: number = 0;
  demandeIdToDelete: number | null = null;

  
  constructor(
    private demandeService: DemandeService,
    private helperService: HelperService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private _fb: FormBuilder,
    private apiGenDemandeSce: DemandeControllerService
  ) { }
  

  ngOnInit(): void {
    this.loadUserDemands();
  }

  loadUserDemands(): void {
    console.log('Chargement des demandes pour l\'utilisateur actuel');
    this.demandeService.getDemandsByCurrentUser().subscribe(
      (data: DemandeDto[]) => {
        console.log('Demandes reçues:', data);
        this.demandes = data;
        this.totalDemandes = data;
        this.totalDemandesCount = data.length;
      },
      (error: any) => {
        console.error('Erreur lors de la récupération des demandes:', error);
      }
    );
  }
  

  delete(demandeIdToDelete: number) {
    console.log('Suppression de la demande avec l\'ID:', demandeIdToDelete);
    this.demandeService.delete2({
      'demande-id': demandeIdToDelete
    }).subscribe({
      next: () => {
        this.loadUserDemands(); // Recharger les demandes après une suppression réussie
      },
      error: (error) => {
        console.error('Erreur lors de la suppression de la demande:', error);
        // Optionnellement, gérer l'erreur ici, comme afficher un message d'erreur à l'utilisateur
      }
    });
  } 
  

  async update(id: number | undefined) {
    console.log("Mise à jour de la demande avec l'ID:", id);
    if (id !== undefined) {
      await this.router.navigate(['/new-demande', id]);
    } else {
      console.error('ID de demande non défini.');
    }

  

}

convertToDate(dateValue: any): Date | null {
  if (typeof dateValue === 'string') {
    const parts = dateValue.split(',').map(part => parseInt(part, 10));
    if (parts.length < 6) {
      console.error('La chaîne de date n\'a pas le format attendu :', dateValue);
      return null; // Ou renvoyez une valeur par défaut ou null selon votre logique
    }
    // Les mois dans JavaScript sont de 0 à 11, donc soustrayez 1 du mois
    return new Date(parts[0], parts[1] - 1, parts[2], parts[3], parts[4], parts[5]);
  } else if (Array.isArray(dateValue) && dateValue.length >= 6) {
    // Si dateValue est un tableau de nombres, utilisez-le pour créer un objet Date
    return new Date(dateValue[0], dateValue[1] - 1, dateValue[2], dateValue[3], dateValue[4], dateValue[5]);
  } else {
    console.error('La valeur de date n\'est pas une chaîne de caractères ou un tableau valide :', dateValue);
    return null; // Ou renvoyez une valeur par défaut ou null selon votre logique
  }
}

updateStatus(demande: DemandeDto): void {
  this.demandeService.updateStatus(demande.id, demande.status).subscribe(
    () => {
      console.log('Status updated successfully');
      // Mettre à jour localement la demande modifiée et recharger les demandes
      const index = this.totalDemandes.findIndex(d => d.id === demande.id);
      if (index !== -1) {
        this.totalDemandes[index] = demande;
        localStorage.setItem('demandes', JSON.stringify(this.totalDemandes));
        this.demandes = this.totalDemandes.slice(0, this.itemsPerPage);
      }
    },
    (error) => {
      console.error('Erreur lors de la mise à jour du statut:', error);
    }
  );
}

searchDemandes() {
  if (!this.searchTerm.trim()) {
    this.loadUserDemands;
    return;
  }
  this.demandes = this.totalDemandes.filter(demande =>
    demande.employeeMatricule && demande.employeeMatricule.includes(this.searchTerm.trim())
  );
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
  this.searchDemandes();
}




prepareDelete(demandeId: number): void {
  this.demandeIdToDelete = demandeId;
}

confirmDelete(): void {
  if (this.demandeIdToDelete !== null) {
    this.demandeService.delete2({ 'demande-id': this.demandeIdToDelete }).subscribe({
      next: () => {
        this.loadUserDemands(); // Reload demandes after successful deletion
        this.demandeIdToDelete = null; // Reset demande ID to delete
      },
      error: (error) => {
        console.error('Erreur lors de la suppression de la demande:', error);
      }
    });
  }
  // Close the modal manually
  const modal = document.getElementById('confirmDeleteModal');
  if (modal) {
    const bootstrapModal = bootstrap.Modal.getInstance(modal);
    bootstrapModal.hide();
  }
}
}
