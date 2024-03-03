import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ChatService, Message } from './chatbot.service';
import { FecService } from './file-upload/file-upload.service';
import { ViewChild, ElementRef } from '@angular/core'; // Import for ViewChild
import { AuthService } from '../authetification/auth.service';
import { environment } from '../environment/environment';
import { User } from '../authetification/login/model_user';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  public    currentSkin:string = "white";
  

  imgPrefix = environment.apiUrl + '/avatars/';
  messages: Message[] = [];
  value: string = '';
  public currentUser: User | null = null;
    @ViewChild('importFecButton', { static: true }) importButtonRef!: ElementRef;

  constructor(public chatService: ChatService, public fecService: FecService,private authService: AuthService,@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {

    this.chatService.conversation.subscribe((messages: Message[]) => {
      this.messages = [...this.messages, ...messages];
    });

    // Add event listener to the import button
    this.importButtonRef.nativeElement.addEventListener('click', () => {
      const fileUploadDialog = document.createElement('input');
      fileUploadDialog.type = 'file';
      fileUploadDialog.accept = '.csv';
      fileUploadDialog.addEventListener('change', (event) => {
        if (event.target) {
          const fileInput = event.target as HTMLInputElement;
          if (fileInput.files && fileInput.files.length > 0) {
            const file = fileInput.files[0];
            this.handleFileUpload(file);
          } else {
            console.warn("No file selected.");
          }
        }
      });
      fileUploadDialog.click();
    });
    if (isPlatformBrowser(this.platformId)) {


      this.authService.retrieveCurrentUserFromLocalStorage();
      this.authService.currentUser$.subscribe(user => {
        this.currentUser = user;
      });    console.log("thisssss",this.currentUser);
  } else {
    // Handle server-side logic (if needed)
  }

  }

  // Function to handle file upload
  handleFileUpload(file: File) {
    this.fecService.uploadFile(file).subscribe(
      (response) => {
        console.log(response); // Handle response from backend (optional)
      },
      (error) => {
        console.error('File upload error:', error); // Log the error
      }
    );
  }
  logout(): void {
    this.authService.logout(); 
  }
  // Function to send a message
  sendMessage() {
    if (this.value.trim() !== '') {
      this.chatService.getBotAnswer(this.value);
      this.value = '';
    }
  }}