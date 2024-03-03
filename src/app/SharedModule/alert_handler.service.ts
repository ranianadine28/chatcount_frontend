import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AlertHandlerService {

constructor(private _toastrService: ToastrService) { }

confirmModal(title : string,text: string):Promise<any>{
  return new Promise(()=>{});
}


alertHandler(message: string | undefined, type: 'success' | 'error') {
  switch (type) {
    case 'success':
      this._toastrService.success(message,'Succès',{
        //positionClass: 'toast-bottom-right',
        toastClass: 'toast ngx-toastr', 
        closeButton: true 
      });
      break;

    case 'error':
      this._toastrService.error(message, 'Erreur!', {
        //positionClass: 'toast-bottom-right',
        toastClass: 'toast ngx-toastr',
        closeButton: true
      });
      break;

  }
}
}

