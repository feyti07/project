import { Injectable } from '@angular/core';
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, filter, catchError } from 'rxjs/operators';
import { BaseService } from './BaseService';
import { ApiConfiguration } from './ApiConfiguration';
import { RequestBuilder } from './RequestBuilder'; // Assurez-vous d'avoir votre propre RequestBuilder
import { Historique } from '../app/Models/Historique';
import { StrictHttpResponse } from './StrictHttpResponse';

@Injectable({
  providedIn: 'root'
})
export class HistoriqueService {
  private baseUrl = 'http://localhost:8085/api/historiques'; // Assurez-vous que l'URL correspond à votre backend

  constructor(private http: HttpClient) { }

  getHistoriqueByDemandeId(demandeId: number): Observable<Historique[]> {
    return this.http.get<any[]>(`${this.baseUrl}/demande/${demandeId}`)
      .pipe(
        map(historiques => historiques.map(h => ({
          ...h,
          date: this.convertDate(h.date) // Convertir la date ici
        }))),
        catchError(error => {
          console.error('Error fetching historiques:', error);
          return of([]); // Retourner une liste vide en cas d'erreur
        })
      );
  }

  private convertDate(dateArray: number[]): string {
    // Convertir [year, month, day, hour, minute, second] en chaîne de caractères
    const [year, month, day, hour, minute, second] = dateArray;
    const date = new Date(year, month - 1, day, hour, minute, second);
    return date.toLocaleString(); // Utiliser une méthode de formatage selon vos besoins
  }
  
}
