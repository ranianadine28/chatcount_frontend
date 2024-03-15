import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ChatService, Message } from './chatbot.service';
import { FecService } from './file-upload/file-upload.service';
import { ViewChild, ElementRef } from '@angular/core'; // Import for ViewChild
import { AuthService } from '../authetification/auth.service';
import { environment } from '../environment/environment';
import { User } from '../authetification/login/model_user';
import { isPlatformBrowser } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NewchatComponent } from '../chat-div/modal/newchat/newchat.component';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  showContent = true;
  imgPrefix = environment.apiUrl + '/avatars/';
  messages: Message[] = [];
  value = '';
  currentUser: User | null = null;
  conversationSubscription: Subscription | undefined;
  conversationId: string | undefined;

  constructor(
    public chatService: ChatService,
    private modal: NgbModal,
    public fecService: FecService,
    private route: ActivatedRoute,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.authService.retrieveCurrentUserFromLocalStorage();
      this.authService.currentUser$.subscribe(user => {
        this.currentUser = user;
      });
    } else {
      // Handle server-side logic (if needed)
    }
  
    this.route.paramMap.subscribe(params => {
      this.conversationId = params.get('id') || '';
      
      this.chatService.initSocketListeners(this.conversationId!);
    });
  
    this.chatService.conversation.subscribe((messages: Message[]) => {
      this.messages = [...this.messages, ...messages];
    });
  
    this.conversationSubscription = this.chatService.conversation.subscribe(
      (messages) => (this.messages = messages)
    );
    
  }
  
  bots: any[] = []; 
  ngOnDestroy() {
    this.conversationSubscription!.unsubscribe();
  }
  addChat() {
    this.showContent = false;

    const modalRef = this.modal.open(NewchatComponent, {
      size: 'md',
      windowClass: 'modal modal-primary'
    });
    modalRef.componentInstance.modalMode = 'add';

    modalRef.result.then((x) => {
      if (x) {
          // Réinitialiser les messages après avoir créé une nouvelle conversation
      this.messages = [];
      this.showContent = false; // Hide the div
      }
    }, () => {});
  }
  saveConversation() {
    this.chatService.saveConversation(this.messages, this.conversationId!).subscribe(
      (response) => {
        console.log('Conversation enregistrée avec succès:', response);
        this.messages = [];
      },
      (error) => {
        console.error('Erreur lors de l\'enregistrement de la conversation:', error);
      }
    );
  }
  sendMessage() {
    if (this.value.trim() !== '') {
      this.chatService.getBotAnswer(this.value, this.conversationId!);
      console.log("currentUser",this.currentUser);
      this.value = '';
    }
  }
}
