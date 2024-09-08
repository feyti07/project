import { Component, HostListener } from '@angular/core';
import { DemandeService } from '../../../services/demande.service';

import { Chart } from 'angular-highcharts';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  showLoginForm: boolean = true;
  totalDemandesCount: number = 0;
  chart: Chart | undefined;

  constructor(private demandeService: DemandeService) { }

  ngOnInit(): void {
    this.demandeService.getTotalDemandesCount().subscribe(
      (count) => {
        this.totalDemandesCount = count;
      },
      (error) => {
        console.error('Erreur lors de la récupération du nombre total de demandes', error);
      }
    );

    this.demandeService.getDemandCountByCategory().subscribe(data => {
      const chartData = Object.keys(data).map(key => ({
        name: key,
        y: data[key]
      }));

      this.chart = new Chart({
        chart: {
          type: 'column'
        },
        title: {
          text: 'Répartition des Catégories de Demandes'
        },
        xAxis: {
          categories: Object.keys(data)
        },
        yAxis: {
          title: {
            text: 'Nombre de Demandes'
          }
        },
        series: [{
          name: 'Categories',
          type: 'column',
          data: Object.values(data)
        }]
      });
    });
  }

  isDropdownOpen = false;

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  @HostListener('window:click', ['$event'])
  clickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement | null;

    // Close the dropdown if click is outside
    if (target && !target.closest('.profile-dropdown')) {
      this.isDropdownOpen = false;
    }
  }



  }




  


