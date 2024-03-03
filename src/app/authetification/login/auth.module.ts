import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login.component';
import { SharedModule } from '../../SharedModule/shared.module';



// routing
const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    data: { animation: 'auth' }
  },
  
 

];

@NgModule({
  declarations: [LoginComponent],
  imports: [SharedModule,RouterModule.forChild(routes)]
})
export class AuthenticationModule {}