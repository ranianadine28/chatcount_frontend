import { Component, OnInit, PLATFORM_ID, Inject, ViewChild, ElementRef, NgModule } from '@angular/core';
import { NgbDropdown, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { Subscription } from 'rxjs';
import { AuthService } from '../authetification/auth.service';
import { FecService } from '../chat/file-upload/file-upload.service';
import { ChatService } from '../chat/chatbot.service';
import { AlertHandlerService } from '../SharedModule/alert_handler.service';
import { User } from '../authetification/login/model_user';

@Component({
  selector: 'app-chat-div', 
  templateUrl: './chat-div.component.html',
  styleUrls: ['./chat-div.component.css']
})
export class ChatDivComponent implements OnInit {
  conversations: any = [];
  private subscriptions = new Subscription();
  @ViewChild('conversationList') conversationList: ElementRef | undefined;

  public loadingData: boolean = false;
  public currentUser: User | null = null;
  @ViewChild('dropdown') dropdown: NgbDropdown | undefined;

  constructor(
    private conversationService: ChatService,
    private alertServ: AlertHandlerService,
    private modal: NgbModal,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private fecService: FecService
  ) {}



  ngOnInit(): void {
    
    if (isPlatformBrowser(this.platformId)) {
      this.authService.retrieveCurrentUserFromLocalStorage();
      this.authService.currentUser$.subscribe(user => {
        this.currentUser = user;
        console.log("tawa",this.currentUser?.userInfo._id);
        this.getConversations();

      });
    } else {
    }
  }
  openDropdown(event: MouseEvent, dropdown: NgbDropdown): void {
    event.stopPropagation();
  }

  closeDropdown(dropdown: NgbDropdown): void {
    dropdown.close();
  }
  getConversations(): void {
    const userId = this.currentUser?.userInfo._id;
    console.log("idddddddddddd",userId);

    this.loadingData = true;
    this.subscriptions.add(
      this.conversationService.getConversations(userId!).subscribe(
        (response: any) => {
          if (response && response.conversations) {
            const allConversations = response.conversations;
            const lastTenConversations = allConversations.slice(-20).reverse();
            this.conversations = lastTenConversations;
          } else {
            this.conversations = [];
          }
        },
        (error) => {
          this.alertServ.alertHandler("Erreur lors de la récupération des conversations", 'error');
        },
        () => {
          this.loadingData = false;
        }
      )
    );
  }
  onDeleteConversation(conversationId: string): void {
    this.conversationService.deleteConversation(conversationId).subscribe(
      () => {
        console.log('Conversation supprimée avec succès');
      },
      error => {
        console.error('Erreur lors de la suppression de la conversation :', error);
      }
    );
  }

  addChat() {
    const userId = this.currentUser?.userInfo._id;
    const fecId = '65e5a437c9c96fac48007881';

    this.fecService.ajoutConversation(userId!, fecId, "new_conversation").subscribe(
      (response) => {
        if (response && response.conversationId) {
          this.router.navigate(['/pages/chat', response.conversationId]);
          this.alertServ.alertHandler("Conversation lancée", 'success');
          this.conversations = []; 
        } else {
          console.error('Error creating conversation: Invalid response');
          this.alertServ.alertHandler("Erreur lors de la création de la conversation", 'error');
        }
      },
      (error) => {
        console.error('Error creating conversation:', error);
        this.alertServ.alertHandler("Erreur lors de la création de la conversation", 'error');
      }
    );
    this.scrollToBottom();

  }
  scrollToBottom(): void {
    try {
      this.conversationList!.nativeElement.scrollTop = this.conversationList!.nativeElement.scrollHeight;
    } catch(err) { }
  }
  startRenaming(conversation: any): void {
    conversation.isRenaming = true;
    conversation.newName = conversation.name;
  }

  renameConversation(conversation: any): void {
    this.conversationService.renameConversation(conversation._id, conversation.newName).subscribe(
      () => {
        conversation.isRenaming = false;
        conversation.name = conversation.newName;
        console.log('Conversation renommée avec succès');
      },
      error => {
        console.error('Erreur lors du renommage de la conversation :', error);
      }
    );
  }
}
