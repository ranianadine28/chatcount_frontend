import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../SharedModule/shared.module';
import { KnowledgeComponent } from './knowledge.component';
import { ConfirmActionModalComponent } from '../SharedModule/modals/confirm-action-modal/confirm-action-modal.component';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';
import { knowledgeService } from './knowledge.service';

const routes: Routes = [
  {
    path: '',
    component: KnowledgeComponent,
    data: { animation: 'knowledge' }
  }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [KnowledgeComponent],
  providers: [knowledgeService, provideAnimations(),
  provideToastr(),
ConfirmActionModalComponent],
})
export class KnowledgeManagementModule { }
