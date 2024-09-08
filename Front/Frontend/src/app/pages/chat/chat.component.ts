import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { ChatService } from '../../../services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  demandeId: number | null = null;
  newMessage: string = '';
  roomList: number[] = [];
  currentRoomId: string = '';
  messages: { [key: string]: any[] } = {};

  constructor(private webSocketService: ChatService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const demandeIdParam = params.get('demandeId');
      if (demandeIdParam !== null) {
        this.demandeId = +demandeIdParam;
        this.initializeChat();
        this.loadMessagesForRoom(this.currentRoomId); // Load messages for the initial room
      } else {
        console.error('Demande ID is missing in the URL');
      }
    });
    this.selectRoom(1);
  }

  loadMessagesForRoom(roomId: string): void {
    this.webSocketService.getMessagesForRoom(roomId).subscribe(
      (messages: any[]) => {
        this.messages[roomId] = messages;
        console.log('Messages Loaded:', this.messages);
      },
      error => {
        console.error('Error loading messages:', error);
      }
    );
  }

  selectRoom(roomId: number): void {
    const roomIdStr = roomId.toString();
    
    console.log('Manually setting room ID:', roomIdStr); // Log the room ID being set
    
    this.currentRoomId = roomIdStr;
    
    if (!this.messages[roomIdStr]) {
      this.messages[roomIdStr] = [];
    }
  
    this.webSocketService.subscribeToRoom(roomIdStr).subscribe(message => {
      this.messages[roomIdStr].push(message.body);
    });
  }
  
  

  sendMessage(): void {
    console.log('SendMessage clicked. CurrentRoomId:', this.currentRoomId);
    if (this.newMessage.trim() && this.currentRoomId) {
      this.webSocketService.sendMessage(this.currentRoomId, this.newMessage);
      this.newMessage = '';
    } else {
      console.error('No room selected or message is empty');
    }
  }

  initializeChat(): void {
    console.log('Demande ID:', this.demandeId);
  }

  isMessageFromReceiver(message: any): boolean {
    return message.sender === 'receiver'; // Adjust as needed
  }

  isMessageFromSender(message: any): boolean {
    return message.sender === 'sender'; // Adjust as needed
  }
}
