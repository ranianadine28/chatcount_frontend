import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '../SharedModule/shared.module';
import { MainLayoutComponent } from './main-layout.component';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { BodyComponent } from '../body/body.component';




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
            path: 'chat',
            loadChildren:()=> import('../chat/chat.module').then(m=> m.ChatManagementModule),
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
        BodyComponent
    ],
    imports: [
   
      SharedModule,
      RouterModule.forChild(routes),
    ],
  
    providers: []
  })
export class AppRoutingModule { }
