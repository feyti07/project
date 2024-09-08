import { Component } from '@angular/core';
import { DemandeService } from '../../../services/demande.service';
import { HelperService } from '../../../services/helper.service';

import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DemandeControllerService } from '../../swagger/services/services';
import jsPDF from 'jspdf';
import { Demande } from '../../Models/Demande';
import { DemandeDto } from '../../Models/DemandeDto';
declare var bootstrap: any;

@Component({
  selector: 'app-list-demande',
  templateUrl: './list-demande.component.html',
  styleUrls: ['./list-demande.component.css']
})
export class ListDemandeComponent {
  StatusOptions: string[] = ['NOUVEAU', 'ATTENTE', 'CLOS'];
  userIdToDelete: any = -1;
  demandes: DemandeDto[] = [];
  demande: Demande[] = [];
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

  ngOnInit() {
    this.loadDemandes();
    
    this.demandeService.findAll2$Response().subscribe({
      next: (data) => {
        this.demandes = data.body || [];
        this.demandes.forEach(demande => {
          if (demande.createdAt) {
            const parsedDate = this.convertToDate(demande.createdAt); // Utilisez votre fonction convertToDate ici
            if (parsedDate) {
              demande.createdAt = parsedDate.toISOString(); // Convertir en chaîne ISO
            } else {
              demande.createdAt = new Date(0).toISOString(); // Une date par défaut si la conversion échoue
            }
          } else {
            demande.createdAt = new Date(0).toISOString(); // Une date par défaut si createdAt est indéfini
          }
        });
      },
      error: (error) => {
        console.error('Erreur:', error);
      }
    });
    
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


  

  updateDisplayedDemandes() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.demandes = this.totalDemandes.slice(startIndex, endIndex);
  }

  loadDemandes(): void {
    const savedDemandes = localStorage.getItem('demandes');
    if (savedDemandes) {
      this.totalDemandes = JSON.parse(savedDemandes);
      this.demandes = this.totalDemandes.slice(0, this.itemsPerPage);
    } else {
      this.demandeService.findAll2$Response().subscribe({
        next: (data) => {
          this.totalDemandes = data.body || [];
          localStorage.setItem('demandes', JSON.stringify(this.totalDemandes));
          this.demandes = this.totalDemandes.slice(0, this.itemsPerPage);
        },
        error: (error) => {
          console.error('Erreur:', error);
        }
      });
    }
    this.filterDemandes();
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
      this.loadDemandes();
      return;
    }
    this.demandes = this.totalDemandes.filter(demande =>
      demande.employeeMatricule && demande.employeeMatricule.includes(this.searchTerm.trim())
    );
  }
  

  delete(demandeIdToDelete: number) {
    console.log('Suppression de la demande avec l\'ID:', demandeIdToDelete);
    this.demandeService.delete2({
      'demande-id': demandeIdToDelete
    }).subscribe({
      next: () => {
        this.loadDemandes(); // Recharger les demandes après une suppression réussie
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

 

  
  
  getStatusClass(status: string | undefined): string {
    if (!status) {
      return ''; // Handle the case where status is undefined
    }
  
    switch (status) {
      case 'En attente':
        return 'pending';
      case 'Accepté':
        return 'accepted';
      case 'Refusé':
        return 'rejected';
      default:
        return '';
    }
  }

  onItemsPerPageChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.itemsPerPage = parseInt(selectElement.value, 10);
    this.filterDemandes();
  }

  filterDemandes() {
    if (this.totalDemandes.length > this.itemsPerPage) {
      this.demandes = this.totalDemandes.slice(0, this.itemsPerPage);
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
    this.searchDemandes();
  }




  prepareDelete(demandeId: number): void {
    this.demandeIdToDelete = demandeId;
  }

  confirmDelete(): void {
    if (this.demandeIdToDelete !== null) {
      this.demandeService.delete2({ 'demande-id': this.demandeIdToDelete }).subscribe({
        next: () => {
          this.loadDemandes(); // Reload demandes after successful deletion
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

