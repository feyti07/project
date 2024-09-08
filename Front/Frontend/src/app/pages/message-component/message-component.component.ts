import { Component, Input, OnInit } from '@angular/core';
import { Message } from '../../Models/Message';
import { MessageService } from '../../../services/message.service';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../../services/authentication.service';
import { DemandeService } from '../../../services/demande.service';
import { UserDto } from '../../Models/UserDto';
import { EmployeeServiceService } from '../../../services/employee-service.service';


@Component({
  selector: 'app-message-component',
  templateUrl: './message-component.component.html',
  styleUrls: ['./message-component.component.css']
})
export class MessageComponent implements OnInit {
  @Input() senderId!: number; // The ID of the current user (sender)
  @Input() receiverId!: number; // The ID of the other user (receiver)
  messages: any[] = [];
  newMessage: string = '';
  @Input() employeeId!: number;

  constructor(
    private route: ActivatedRoute, 
    private messageService: MessageService) {}

  ngOnInit(): void {
    this.loadMessages();

    this.route.paramMap.subscribe(params => {
      const id = params.get('employeeId');
      if (id) {
        this.employeeId = +id; // Convert to number
      } else {
        console.error('employeeId parameter is missing in the route');
      }
    });
  }

  loadMessages(): void {
    this.messageService.getMessages(this.senderId, this.receiverId).subscribe((data: any[]) => {
      this.messages = data;
    });
  }

  sendMessage(): void {
    if (this.newMessage.trim() && this.employeeId) {
      this.messageService.sendMessage(this.employeeId, this.newMessage).subscribe(() => {
        this.loadMessages(); // Reload messages after sending a new one
        this.newMessage = ''; // Clear the input field
      }, (error) => {
        console.error('Error sending message:', error); // Log any errors
      });
    } else {
      console.error('employeeId is undefined or message is empty');
    }
  }
  


}