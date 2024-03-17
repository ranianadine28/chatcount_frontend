import { Injectable } from '@angular/core';
import { Observable, timestamp } from 'rxjs';
import io from 'socket.io-client';
import { Message } from '../dashboard/message-model';
import { environment } from '../environment/environment';

  
  interface Conversation {
    conversationId: string;
    messages: Message[];
    lastMessage: string;
  }
  
  interface ChatListResponse {
    userId: string;
    conversations: Conversation[];
  }
  
  interface BotResponseData {
    text: string;
    // Ajoutez d'autres propriétés si nécessaire
  }
  
  interface MessageSocketEvent {
    conversationId: string;
    message: Message;
  }
  
@Injectable()
export class knowledgeService {
    private socket: any;

  constructor() {
    this.socket = io(environment.apiUrl);

  }
  currentTimestamp = Date.now();
      date = new Date(this.currentTimestamp);

      sendMessage(message: string, conversationId: string): void {
        const timestamp = Date.now();
        const userMessage: Message = {
          sender: 'user',
          text: message,
         timestamp: this.date,
         conversationId: conversationId,
        };
        const messageWithTimestamp = { ...userMessage, timestamp };
        this.socket.emit('user-message', { conversationId, message: messageWithTimestamp });
      }
      
      receiveBotResponses(conversationId: string): Observable<Message> {
        return new Observable(observer => {
          this.socket.on('bot-response', (data: BotResponseData) => {
        const timestamp = Date.now();
        const botResponse: Message = new  Message('bot', data.text, this.date, conversationId);
        observer.next(botResponse);
      });

      return () => {
        this.socket.disconnect();
      };
    });
  }

  getChatList(userId: string ): Observable<ChatListResponse> {
    if (userId !== null) {
      this.socket.emit('chat-list', { userId: userId });
    }
    return new Observable(observer => {
      this.socket.on('chat-list-response', (data: ChatListResponse) => {
        observer.next(data);
      });

      return () => {
        this.socket.disconnect();
      };
    });
  }

  sendMessageEvent(message: MessageSocketEvent): void {
    this.socket.emit('add-message', message);
  }

  receiveMessages(): Observable<MessageSocketEvent> {
    return new Observable(observer => {
      this.socket.on('add-message-response', (data: MessageSocketEvent) => {
        observer.next(data);
      });

      return () => {
        this.socket.disconnect();
      };
    });
  }

  getConversationHistory(conversationId: string): Observable<Conversation> {
    return new Observable(observer => {
      this.socket.emit('get-conversation-history', { conversationId });
      this.socket.on('conversation-history-response', (data: Conversation) => {
        observer.next(data);
      });

      return () => {
        this.socket.disconnect();
      };
    });
  }
}
