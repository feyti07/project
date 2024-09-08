import { Component, OnInit } from '@angular/core';
import { Chart } from 'angular-highcharts';
import { DemandeService } from '../../../services/demande.service';

@Component({
  selector: 'app-statistique',
  templateUrl: './statistique.component.html',
  styleUrls: ['./statistique.component.css']
})
export class StatistiqueComponent implements OnInit {
  chart: Chart | undefined;

  constructor(private demandeService: DemandeService) {}

  ngOnInit(): void {
    this.demandeService.getDemandCountByCategory().subscribe(data => {
      const chartData = Object.keys(data).map(key => ({
        name: key,
        y: data[key]
      }));

      this.chart = new Chart({
        chart: {
          type: 'pie'
        },
        title: {
          text: 'Répartition des Catégories de Demandes'
        },
        series: [{
          name: 'Categories',
          type: 'pie',
          data: chartData
        }]
      });
    });
  }
}
