import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '../SharedModule/shared.module';
import { MainLayoutComponent } from './main-layout.component';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { BodyComponent } from '../body/body.component';
import { ChatDivComponent } from '../chat-div/chat-div.component';
import { ChatService } from '../chat/chatbot.service';
import { ChatManagementModule } from '../chat/chat.module';
import { NavbarComponent } from '../navbar/navbar.component';
import { NgbDropdown, NgbDropdownModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';





const routes: Routes = [
 
    {
        path: '',
     

        component: MainLayoutComponent,
        children: [
          {
            path: 'dashboard',
            loadChildren:()=> import('../dashboard/dashboard.module').then(m=> m.DashboardManagementModule),
            data: {
              role: {
                page: 'dashboard',
              }
            },
          },
          {
            path:  'chat/:id',
            loadChildren:()=> import('../chat/chat.module').then(m=> m.ChatManagementModule),
            data: {
              role: {
                page: 'chat',
              }
            },
          },
          {
            path:  'chat',
            loadChildren:()=> import('../initchat/initchat.module').then(m=> m.InitChatManagementModule),
            data: {
              role: {
                page: 'chat',
              }
            },
          },
        {
          path: 'knowledge',
          loadChildren: () => import('../knowledge/knowledge.module').then(m => m.KnowledgeManagementModule),
          data: {
            role: {
              page: 'knowledge',
            }
          },
        },
        {
            path: 'settings',
            loadChildren: () => import('../settings/settings.module').then(m => m.SettingsManagementModule),
            data: {
              role: {
                page: 'settings',
              }
            },
        }
    ]
  }
    
];

@NgModule({
    declarations: [
        MainLayoutComponent,
        SidenavComponent,
        BodyComponent,
        ChatDivComponent,
        NavbarComponent,
        ChatDivComponent
        
    ],
    imports: [
      SharedModule,
      RouterModule.forChild(routes),
      NgbModule,
      NgbDropdownModule,

    ],
    providers: [ChatService],
  })
export class AppRoutingModule { }

