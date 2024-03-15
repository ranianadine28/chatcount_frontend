import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable, Subject, catchError, throwError } from 'rxjs';
import io from 'socket.io-client';
import { environment } from '../environment/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AlertHandlerService } from '../SharedModule/alert_handler.service';
import { Conversation } from '../chat-div/conersation-model';
import { User } from '../authetification/login/model_user';
import { AuthService } from '../authetification/auth.service';

export class Message {
  constructor(public sender: string | undefined, public text: string) {}
}

@Injectable()
export class ChatService {
  private socket: any;
  conversation = new Subject<Message[]>();

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService, @Inject(PLATFORM_ID) private platformId: Object) {
    this.socket = io(environment.apiUrl);
  }
  getBotAnswer(msg: string, conversationId: string) {
    const userMessage = new Message('user', msg);
    this.conversation.next([userMessage]);
    this.socket.emit('message', { text: msg, conversationId });
  }
 
  initSocketListeners(conversationId: string) {
    this.socket.on('message', (data: any) => {
      const botMessage = new Message('bot', data);
      this.conversation.next([botMessage]); 
      this.saveMessageToDatabase('bot', data, conversationId); 
      console.log("id",conversationId);
    });
  }
  
  saveMessageToDatabase(sender: string, text: string, conversationId: string): void {
    if (conversationId && conversationId.trim() !== '') {
      this.saveConversation([{ sender, text }], conversationId)
        .subscribe(
          (response) => {
            console.log("Message enregistré avec succès :", response);
          },
          (error) => {
            console.error("Erreur lors de l'enregistrement du message :", error);
          }
        );
    } else {
      console.error("ConversationId invalide :", conversationId);
    }
  }
  
  saveConversation(conversation: Message[], conversationId: string): Observable<any> {
    const messages = conversation.map(message => ({ sender: message.sender, text: message.text }));
    const requestBody = { messages };
    return this.http.post<any>(`${this.apiUrl}/conversation/enregistrer-message/${conversationId}`, requestBody)
      .pipe(
        catchError(this.handleError) // Gérer les erreurs
      );
  }
  
  
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
    } else {
      const errorMessage = `Backend returned code ${error.status}, body was: ${error.error}`;
      return throwError(errorMessage);
    }
    return throwError('Something bad happened; please try again later.');
  }

  getConversations(userId : string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/conversation/conversations/${userId}`);
  }
  deleteConversation(conversationId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/conversation/conversations/${conversationId}`);
  }
  renameConversation(conversationId: string, newName: string): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/conversation/conversations/${conversationId}`, { name: newName });
  }
}
