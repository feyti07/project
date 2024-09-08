import { Component, Input, OnInit } from '@angular/core';
import { HistoriqueService } from '../../../services/historique.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Historique } from '../../Models/Historique';

@Component({
  selector: 'app-historique',
  templateUrl: './historique.component.html',
  styleUrls: ['./historique.component.css']
})
export class HistoriqueComponent implements OnInit {
  historiques: Historique[] = [];
  @Input() demandeId: number | null = null; // Initialize demandeId as null
  typeOptions: string[] = ['Ajout', 'Modification']; // Replace with your actual types
  selectedType: string = ''; // For storing the selected type
  searchTerm: string = ''; // Search term for filtering

  constructor(
    private historiqueService: HistoriqueService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
      const demandeIdString = params.get('demandeId');
      
      if (demandeIdString !== null) {
        this.demandeId = parseInt(demandeIdString, 10);
        
        if (!isNaN(this.demandeId)) {
          this.loadHistorique();
        } else {
          console.error('Invalid demandeId:', demandeIdString);
        }
      } else {
        console.error('No demandeId provided in URL.');
      }
    });
  }

  loadHistorique(): void {
    if (this.demandeId !== null) {
      this.historiqueService.getHistoriqueByDemandeId(this.demandeId)
        .subscribe(
          historiques => {
            this.historiques = historiques;
            this.applyFilters(); // Apply filters after loading data
          },
          error => {
            console.error('Error loading historiques:', error);
          }
        );
    }
  }

  applyFilters(): void {
    let filteredHistoriques = this.historiques;

    if (this.selectedType.trim()) {
      filteredHistoriques = filteredHistoriques.filter(historique =>
        historique.type && historique.type === this.selectedType.trim()
      );
    }

    if (this.searchTerm.trim()) {
      filteredHistoriques = filteredHistoriques.filter(historique =>
        historique.description.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    this.historiques = filteredHistoriques;
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
    this.selectedType = '';
    this.toggleSearch();
    this.loadHistorique(); // Reload data after clearing search
  }

  onTypeChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedType = selectElement.value;
    this.applyFilters(); // Apply filters based on type change
  }

  onSearchChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.searchTerm = inputElement.value;
    this.applyFilters(); // Apply filters based on search term
  }
}
