import { Component } from '@angular/core';
import { ChatService, Message } from './chatbot.service';
import { FecService } from './file-upload/file-upload.service';
import { ViewChild, ElementRef } from '@angular/core'; // Import for ViewChild

@Component({
  selector: 'app-chatbot',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  messages: Message[] = [];
  value: string = '';

  @ViewChild('importFecButton', { static: true })
  importButtonRef!: ElementRef; // Use ViewChild and static for direct access

  constructor(public chatService: ChatService, public fecService: FecService) {}

  ngOnInit() {
    this.chatService.conversation.subscribe((messages: Message[]) => {
      this.messages = [...this.messages, ...messages];
    });
    this.importButtonRef?.nativeElement.addEventListener('click', () => {

    // Access the button element using ViewChild
    this.importButtonRef.nativeElement.addEventListener('click', () => {
      const fileUploadDialog = window.document.createElement('input');
      fileUploadDialog.type = 'file';
      fileUploadDialog.accept = '.csv';
      fileUploadDialog.addEventListener('change', (event) => {
        if (event.target) {
          const fileInput = event.target as HTMLInputElement; // Type assertion
          if (fileInput.files && fileInput.files.length > 0) {
            const file = fileInput.files[0];
            this.fecService.uploadFile(file).subscribe((response) => {
              console.log(response); // Handle response from backend (optional)
            });
          } else {
            console.warn("No file selected."); // Handle no file selected (optional)
          }
        }
      });
      fileUploadDialog.click();
    });
  });

  }

  sendMessage() {
    if (this.value.trim() !== '') {
      this.chatService.getBotAnswer(this.value);
      this.value = '';
    }
  }
}
