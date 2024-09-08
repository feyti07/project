import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // Import HttpClient
import { Client, Frame, Message } from '@stomp/stompjs';
import { BehaviorSubject, Observable } from 'rxjs';
import SockJS from 'sockjs-client';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = 'http://localhost:8080/api/messages';
  private stompClient!: Client;
  private connected: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) { // Inject HttpClient
    this.initializeWebSocketConnection();
  }

  getMessagesForRoom(roomId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${roomId}`);
  }

  private initializeWebSocketConnection(): void {
    // Create the WebSocket connection
    const socket = new SockJS('http://localhost:8085/chat-socket');
    this.stompClient = new Client({
      webSocketFactory: () => socket,
      debug: (str) => { console.log(str); },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000
    });

    this.stompClient.onConnect = (frame: Frame) => {
      console.log('Connected: ' + frame);
      this.connected.next(true);
    };

    this.stompClient.onDisconnect = (frame) => {
      console.log('Disconnected: ' + frame);
      this.connected.next(false);
    };

    this.stompClient.activate();
  }

  public sendMessage(roomId: string, message: string): void {
    if (this.stompClient && this.stompClient.connected) {
      console.log('Sending message to room:', roomId, 'Message:', message);
  
      // Ensure the roomId and message are valid
      if (roomId && message) {
        this.stompClient.publish({
          destination: `/app/chat/${roomId}`,
          body: message
        });
        console.log('Message sent successfully.');
      } else {
        console.error('Invalid roomId or message. Cannot send message.');
      }
    } else {
      console.error('WebSocket connection is not active. Unable to send message.');
    }
  }
  
  public subscribeToRoom(roomId: string): Observable<Message> {
    return new Observable<Message>(observer => {
      this.stompClient.subscribe(`/topic/${roomId}`, (message: Message) => {
        observer.next(message);
      });
    });
  }

  public isConnected(): Observable<boolean> {
    return this.connected.asObservable();
  }
}
