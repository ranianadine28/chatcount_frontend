import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import  io from 'socket.io-client';
import { environment } from '../environment/environment';
export class Message {
  constructor(public author: string, public content: string) {}
}
@Injectable()
export class ChatService {
  private socket: any;
  constructor() {
    // Replace with your backend server address
    this.socket = io(environment.apiUrl);
    this.initSocketListeners(); 

  }

  conversation = new Subject<Message[]>();

  getBotAnswer(msg: string) {
    const userMessage = new Message('user', msg);
    this.conversation.next([userMessage]);
    // Send message to the server through the socket
    this.socket.emit('message', msg);
  }

  // Handle incoming messages from the server (add this method)
  initSocketListeners() {
    this.socket.on('message', (data: any) => {  // Use 'message' channel here
      const botMessage = new Message('bot', data);
      this.conversation.next([botMessage]); // Update conversation
    });
  }
  

  ngOnInit() {
    this.initSocketListeners(); // Call in ngOnInit
  }

}