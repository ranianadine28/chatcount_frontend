import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirm-action-modal',
  templateUrl: './confirm-action-modal.component.html',
  styleUrls: ['./confirm-action-modal.component.scss']
})
export class ConfirmActionModalComponent implements OnInit {

  message = null;
  buttonText = null;
  modalClass = null;
  title=null;
  cancelButtonText=null;
  
  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

}
