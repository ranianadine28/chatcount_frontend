import { Component, OnInit } from '@angular/core';
import { knowledgeService } from './knowledge.service';
import { Message } from '../dashboard/message-model';

interface ChatListResponse {
  userId: string;
  conversations: Conversation[];
}
interface Conversation {
  conversationId: string;
  messages: Message[];
  lastMessage: string;
}

@Component({
  selector: 'app-knowledge',
  templateUrl: './knowledge.component.html',
  styleUrl: './knowledge.component.css'
})
export class KnowledgeComponent implements OnInit {
  value: string = ''; 
  conversationList: Conversation[] = []; // Initialisez la liste des conversations
  conversationId: string = ''; // Déclarer conversationId ici

  constructor(private chatService: knowledgeService) {}

  ngOnInit() {
    this.chatService.getChatList('user-id').subscribe((data: ChatListResponse) => { // Assurez-vous de spécifier le type de 'data' comme ChatListResponse
      this.conversationList = data.conversations; // Stockez les conversations dans la variable conversationList
    });

    this.chatService.receiveMessages().subscribe((data) => {
      // Mettre à jour l'interface utilisateur avec le nouveau message
      const conversationIndex = this.conversationList.findIndex(conv => conv.conversationId === data.message.conversationId);
      if (conversationIndex !== -1) {
        this.conversationList[conversationIndex].lastMessage = data.message.text;
      }
    });

    this.chatService.receiveBotResponses("").subscribe((data) => {
      // Afficher la réponse du bot à l'utilisateur
      const conversationIndex = this.conversationList.findIndex(conv => conv.conversationId === this.conversationId);
      if (conversationIndex !== -1) {
        this.conversationList[conversationIndex].lastMessage = data.text;
      }
    });
    
  }
  selectConversation(conversationId: string) {
    this.conversationId = conversationId; 
  }
  getMessages(conversationId: string): Message[] {
  
    const conversation = this.conversationList.find(conv => conv.conversationId === conversationId);
    return conversation ? conversation.messages : [];
  }

  sendMessage(message: string, conversationId: string) {
    this.chatService.sendMessage(message, "65f63b59f18f91fdcf6630c7 ");
  }
}