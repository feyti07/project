import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Message } from '../app/Models/Message';
import { BaseService } from './BaseService';
import { ApiConfiguration } from './ApiConfiguration';
import { UserDto } from '../app/Models/UserDto';

@Injectable({
  providedIn: 'root'
})
export class MessageService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }


  

  getMessagesByDemande(demandeId: number): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.rootUrl}/api/messages/demande/${demandeId}`);
  }

   getUserByMatricule(matricule: string): Observable<UserDto> {
    return this.http.get<UserDto>(`${this.rootUrl}/api/employee/user/${matricule}`);
  }

  getAdmins(): Observable<UserDto[]> {
    return this.http.get<UserDto[]>(`${this.rootUrl}/api/users/admins`);
  }

  getMessages(senderId: number, receiverId: number): Observable<any[]> {
    // Correction du chemin pour récupérer les messages
    return this.http.get<any[]>(`${this.rootUrl}/api/messages/conversation?senderId=${senderId}&receiverId=${receiverId}`);
  }
  
  sendMessage(employeeId: number, content: string): Observable<any> {
    return this.http.post<any>(`${this.rootUrl}/api/messages/${employeeId}`, content);
  }
  
  
  
}
