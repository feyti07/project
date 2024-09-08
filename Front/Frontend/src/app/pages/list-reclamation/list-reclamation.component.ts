import { Component, OnInit } from '@angular/core';
import { ReclamationService } from '../../../services/reclamation.service'; // Assurez-vous que le chemin est correct
import { HelperService } from '../../../services/helper.service';

import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import jsPDF from 'jspdf';
import { Reclamation } from '../../Models/Reclamation'; // Assurez-vous que le chemin est correct
import { ReclamationDto } from '../../Models/ReclamationDto'; // Assurez-vous que le chemin est correct

@Component({
  selector: 'app-list-reclamation',
  templateUrl: './list-reclamation.component.html',
  styleUrls: ['./list-reclamation.component.css']
})
export class ListReclamationComponent implements OnInit {
  StatusOptions: string[] = ['NOUVEAU', 'ATTENTE', 'CLOS'];
  userIdToDelete: any = -1;
  reclamations: ReclamationDto[] = [];
  searchTerm: string = '';
  selectedStatus: string = ''; // Initialisez la valeur sélectionnée
  itemsPerPage: number = 10; // Nombre d'éléments par page par défaut
  totalReclamations: ReclamationDto[] = [];
  currentPage: number = 1; // Page actuelle
  totalReclamationsCount: number = 0;

  constructor(
    private reclamationService: ReclamationService,
    private helperService: HelperService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private _fb: FormBuilder,
    private apiGenReclamationSce: ReclamationService // Assurez-vous que le service est correct
  ) { }

  ngOnInit() {
    this.loadReclamations();
    
    this.reclamationService.findAll$Response().subscribe({
      next: (data) => {
        this.reclamations = data.body || [];
        this.reclamations.forEach(reclamation => {
          if (reclamation.createdAt) {
            const parsedDate = this.convertToDate(reclamation.createdAt); // Utilisez votre fonction convertToDate ici
            if (parsedDate) {
              reclamation.createdAt = parsedDate.toISOString(); // Convertir en chaîne ISO
            } else {
              reclamation.createdAt = new Date(0).toISOString(); // Une date par défaut si la conversion échoue
            }
          } else {
            reclamation.createdAt = new Date(0).toISOString(); // Une date par défaut si createdAt est indéfini
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

  updateDisplayedReclamations() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.reclamations = this.totalReclamations.slice(startIndex, endIndex);
  }

  loadReclamations(): void {
    const savedReclamations = localStorage.getItem('reclamations');
    if (savedReclamations) {
      this.totalReclamations = JSON.parse(savedReclamations);
      this.reclamations = this.totalReclamations.slice(0, this.itemsPerPage);
    } else {
      this.reclamationService.findAll$Response().subscribe({
        next: (data) => {
          this.totalReclamations = data.body || [];
          localStorage.setItem('reclamations', JSON.stringify(this.totalReclamations));
          this.reclamations = this.totalReclamations.slice(0, this.itemsPerPage);
        },
        error: (error) => {
          console.error('Erreur:', error);
        }
      });
    }
    this.filterReclamations();
  }

  updateStatus(reclamation: ReclamationDto): void {
    this.reclamationService.updateReclamationStatus({
      'reclamation-id': reclamation.id,
      context: undefined, // Si vous avez un contexte à ajouter, sinon laissez-le undefined
      body: { status: reclamation.status || 'NOUVEAU' }
    }).subscribe(
      () => {
        console.log('Status updated successfully');
        // Mettre à jour localement la réclamation modifiée et recharger les réclamations
        const index = this.totalReclamations.findIndex(r => r.id === reclamation.id);
        if (index !== -1) {
          this.totalReclamations[index] = reclamation;
          localStorage.setItem('reclamations', JSON.stringify(this.totalReclamations));
          this.reclamations = this.totalReclamations.slice(0, this.itemsPerPage);
        }
      },
      (error) => {
        console.error('Erreur lors de la mise à jour du statut:', error);
      }
    );
  }

  searchReclamations() {
    if (!this.searchTerm.trim()) {
      this.loadReclamations();
      return;
    }
    this.reclamations = this.totalReclamations.filter(reclamation =>
      reclamation.employeeMatricule && reclamation.employeeMatricule.includes(this.searchTerm.trim())
    );
  }

  delete(reclamationIdToDelete: number) {
    console.log('Suppression de la réclamation avec l\'ID:', reclamationIdToDelete);
    this.reclamationService.delete({
      'reclamation-id': reclamationIdToDelete
    }).subscribe({
      next: () => {
        this.loadReclamations(); // Recharger les réclamations après une suppression réussie
      },
      error: (error) => {
        console.error('Erreur lors de la suppression de la réclamation:', error);
        // Optionnellement, gérer l'erreur ici, comme afficher un message d'erreur à l'utilisateur
      }
    });
  }

  async update(id: number | undefined) {
    console.log("Mise à jour de la réclamation avec l'ID:", id);
    if (id !== undefined) {
      await this.router.navigate(['/new-reclamation', id]);
    } else {
      console.error('ID de réclamation non défini.');
    }
  }

  voirReclamation(reclamation: ReclamationDto) {
    if (reclamation && reclamation.id !== undefined) {
      this.router.navigate(['/detail', reclamation.id]);
    } else {
      console.error('ID de réclamation non défini.');
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
    this.filterReclamations();
  }

  filterReclamations() {
    if (this.totalReclamations.length > this.itemsPerPage) {
      this.reclamations = this.totalReclamations.slice(0, this.itemsPerPage);
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
    this.searchReclamations();
  }
  
}
