import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatComponent } from './chat.component';
import { SharedModule } from '../SharedModule/shared.module';
import { ChatService } from './chatbot.service';
import { FileUploadComponent } from './file-upload/file-upload.component';

const routes: Routes = [
  {
    path: '',
    component: ChatComponent,
    data: { animation: 'stock' }
  }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ChatComponent,FileUploadComponent],

  providers: [ChatService],

})
export class ChatManagementModule { }
