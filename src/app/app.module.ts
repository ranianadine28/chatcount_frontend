import { NgModule } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import { BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { HttpClientModule, HttpClient, withFetch, provideHttpClient } from '@angular/common/http';

import { AppComponent } from './app.component';

import { ToastrModule } from 'ngx-toastr';
import { SharedModule } from './SharedModule/shared.module';

import { RouterModule, Routes } from '@angular/router';
import { ChatService } from './chat/chatbot.service';


const appRoutes: Routes = [
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full',
  },
  {
    path: 'pages',
    loadChildren: () => import('./main-layout/pages.module').then(m => m.AppRoutingModule),
  },

  {
    path: 'auth',
    loadChildren: () => import('./authetification/login/auth.module').then(m => m.AuthenticationModule)
  },

];

@NgModule({
  declarations: [
    AppComponent,
    
    
   
    
  ],
  imports: [
    HttpClientModule,
    SharedModule,
    RouterModule.forRoot(appRoutes, {
      scrollPositionRestoration: 'enabled', // Add options right here
    }),
    BrowserAnimationsModule,
     BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    })
  ],
  providers: [
    provideClientHydration(),
    provideHttpClient(withFetch()),
    ChatService

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
