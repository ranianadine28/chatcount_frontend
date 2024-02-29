import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../SharedModule/shared.module';
import { KnowledgeComponent } from './knowledge.component';

const routes: Routes = [
  {
    path: '',
    component: KnowledgeComponent,
    data: { animation: 'stock' }
  }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [KnowledgeComponent],
})
export class KnowledgeManagementModule { }
