import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmActionModalComponent } from './modals/confirm-action-modal/confirm-action-modal.component';
import { RouterModule } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    ConfirmActionModalComponent
  ],
  imports: [
    FormsModule,
  ],
  exports: [

    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,

  ],
})
export class SharedModule { }