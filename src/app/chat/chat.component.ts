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
import { ActivatedRoute, Router } from '@angular/router';

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
  public noConversationId: boolean = false;
  recording = false; 
  public conversationExists: boolean = false;

  currentUser: User | null = null;
  conversationSubscription: Subscription | undefined;
  conversationId!: string;
  selectBConvContent:string = '';
  @ViewChild('audioRecorder', {static: false}) audioRecorder!: ElementRef<HTMLAudioElement>; 

  constructor(
    public chatService: ChatService,
    private modal: NgbModal,
    public fecService: FecService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
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
      this.chatService.initSocketListeners(this.conversationId);

     
    if (this.conversationId) {
      this.conversationExists = true; 
      this.loadConversationMessages(this.conversationId);
    } else {
      this.conversationExists = false; 
    }
     
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
  // saveConversation() {
  //   this.chatService.saveConversation(this.messages, this.conversationId).subscribe(
  //     (response) => {
  //       console.log('Conversation enregistrée avec succès:', response);
  //       this.messages = [];
  //       console.log("hanii houni",this.conversationId);
  //     },
  //     (error) => {
  //       console.error('Erreur lors de l\'enregistrement de la conversation:', error);
  //     }
  //   );
  // }
  sendMessage() {
    if (this.value.trim() !== '') {
      this.chatService.getBotAnswer(this.value, this.conversationId);
      console.log("currentUser",this.currentUser);
      this.value = '';
    }
  }
  loadConversationMessages(conversationId: string): void {
    this.messages = []; 
    this.chatService.getConversationMessages(conversationId).subscribe(
      messages => {
        this.messages = messages; // Remplit la liste avec les nouveaux messages
      },
      error => {
      
      }
    );
    this.router.navigateByUrl(`/pages/chat/${conversationId}`);

  }
  
  startRecording() {
    if (!this.recording) {
      this.recording = true;
      navigator.mediaDevices.getUserMedia({ audio: true }) // Request access to user's microphone
        .then(stream => {
          const mediaRecorder = new MediaRecorder(stream); // Create a new MediaRecorder instance
          const chunks: BlobPart[] = []; // Array to store recorded chunks

          mediaRecorder.ondataavailable = (event) => {
            chunks.push(event.data); // Push new recorded chunk to the array
          };

          mediaRecorder.onstop = () => {
            this.recording = false;
            const audioBlob = new Blob(chunks, { type: 'audio/wav' }); // Create a blob from recorded chunks
            const audioUrl = URL.createObjectURL(audioBlob); // Create a URL for the blob

            // You can do further processing here, like sending the audio file to your chat service
            // For now, we'll just set the audio URL to an audio element
            if (this.audioRecorder) {
              this.audioRecorder.nativeElement.src = audioUrl; // Set audio URL to the audio element
              this.audioRecorder.nativeElement.controls = true; // Show controls for playing the audio
            }
          };

          mediaRecorder.start(); // Start recording
          
          setTimeout(() => {
            mediaRecorder.stop(); // Stop recording after a set duration (you can adjust this as needed)
          }, 5000); // Recording for 5 seconds in this example
        })
        .catch(error => {
          console.error('Error accessing microphone:', error);
          // Handle error
        });
    }
  }

  
}
