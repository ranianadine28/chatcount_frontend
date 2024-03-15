import { Component, ElementRef, Inject, PLATFORM_ID, ViewChild } from '@angular/core';
import { ChatService } from '../../../chat/chatbot.service';
import { AlertHandlerService } from '../../../SharedModule/alert_handler.service';
import { FecService } from '../../../chat/file-upload/file-upload.service';
import { AuthService } from '../../../authetification/auth.service';
import { isPlatformBrowser } from '@angular/common';
import { User } from '../../../authetification/login/model_user';
import { ToastrService } from 'ngx-toastr';
import { NavigationExtras, Router } from '@angular/router'; // Importer le Router
import { ConfirmmodalComponent } from '../confirmmodal/confirmmodal.component';
import { MatDialog ,MatDialogRef} from '@angular/material/dialog';
import { ConfirmActionModalComponent } from '../../../SharedModule/modals/confirm-action-modal/confirm-action-modal.component';
import { response } from 'express';
import { HttpErrorResponse } from '@angular/common/http';
interface UploadResponse {
  message: string;
  data: any; // Utilisez le type approprié pour vos données
  fecId: string; // Ou le type approprié pour l'identifiant FEC
}

@Component({
  selector: 'app-newchat',
  templateUrl: './newchat.component.html',
  styleUrl: './newchat.component.css'
})
export class NewchatComponent {
  fecs!: any[];
  selectedFec: any;
  public currentUser: User | null = null;
  dialogRef!: MatDialogRef<ConfirmActionModalComponent>;
  conversationName: string = '';
  showPreviousComponent: boolean = false;

  constructor(
    private router: Router,
    private alertServ: AlertHandlerService,
    private fecService: FecService,
    private authService: AuthService,
    private toastr: ToastrService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private dialog: MatDialog ,
    
  ) {}

  ngOnInit(): void {
    this.getFecs();

    if (isPlatformBrowser(this.platformId)) {
      this.authService.retrieveCurrentUserFromLocalStorage();
      this.authService.currentUser$.subscribe(user => {
        this.currentUser = user;
      });
    }
  }

  getFecs(): void {
    this.fecService.getFecs().subscribe(
      response => {
        this.fecs = response.data;
      },
      error => {
        this.alertServ.alertHandler(
          "Une erreur est survenue lors de la récupération des FEC",
          "error"
        );

        console.error(
          "Une erreur est survenue lors de la récupération des FEC :",
          error
        );
      }
    );
  }

  handleFileUpload(file: File) {
    this.fecService.uploadFile(file).subscribe(
      (response: any) => {
        console.log("Response status:", response.status);

        if (response.status === 409) {
          console.log("rrrrrrrrrrrrrrrrrrrrrrrrr", response.status);
          this.openConfirmReplaceDialog(file, response.fecId!);
        } else {
          this.alertServ.alertHandler(
            response.message!,
            "success"
          );
          this.toastr.success(response.message, 'Succès',
            {
              positionClass: 'toast-bottom-right',
              toastClass: 'toast ngx-toastr',
              closeButton: true
            });
        }
      },
      error => {
        console.error("File upload error:", error); // Log l'erreur
  
        if (error.error && error.error.message) {
          this.alertServ.alertHandler(
            error.error.message,
            "error"
          );
        } else {
          this.alertServ.alertHandler(
            "Une erreur inconnue s'est produite lors du chargement du fichier.",
            "error"
          );
        }
      }
    );
  }
  
  
  
  openConfirmReplaceDialog(file: File, existingFecId: string) {
    console.log("heloooooooooooooooooooooo");
    this.dialogRef = this.dialog.open(ConfirmActionModalComponent, {
      data: {
        file: file,
        existingFecId: existingFecId 
      }
    });
    
    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.replaceFile(existingFecId, file);
      }
    });
  }


  replaceFile(existingFecId: string, file: File) {
    this.fecService.replaceFile(existingFecId, file).subscribe(
      response => {
        this.alertServ.alertHandler(
          response.message!,
          "success"
        );
        this.toastr.success(response.message, 'Succès',
          {
            positionClass: 'toast-bottom-right',
            toastClass: 'toast ngx-toastr',
            closeButton: true
          });
      },
      error => {
        console.error("Erreur lors du remplacement du fichier :", error);
        this.alertServ.alertHandler(
          "Une erreur est survenue lors du remplacement du fichier",
          "error"
        );
      }
    );
  }
  

  openFileUploadDialog() {
    const fileUploadDialog = document.createElement("input");
    fileUploadDialog.type = "file";
    fileUploadDialog.accept = ".csv";
    fileUploadDialog.addEventListener("change", event => {
      if (event.target) {
        const fileInput = event.target as HTMLInputElement;
        if (fileInput.files && fileInput.files.length > 0) {
          const file = fileInput.files[0];
          this.handleFileUpload(file);
        } else {
          console.warn("No file selected.");
        }
      }
    });
    fileUploadDialog.click();
  }
  navigateToChat(id: string) {
    const navigationExtras: NavigationExtras = {
        replaceUrl: true
    };

    this.router.navigate(['/chat', id], navigationExtras);
}

  launchDiscussion() {
    if (this.selectedFec && this.currentUser) {
        const conversationName = this.getConversationName();
        console.log("name:", conversationName);
        this.fecService.ajoutConversation(this.currentUser.userInfo._id, this.selectedFec, conversationName)
            .subscribe(
                (response) => {
                  
                    console.log(response);
                    this.alertServ.alertHandler("Vous pouvez commencer à discuter", "success");
                    this.toastr.success('Vous pouvez commencer à discuter', 'Succès',
                        {
                            positionClass: 'toast-bottom-right',
                            toastClass: 'toast ngx-toastr',
                            closeButton: true
                        });
                    // Naviguer vers la nouvelle page et effacer l'historique de navigation
               
                      this.router.navigate(['/pages/chat', response.conversationId]);
                    
                  
                },
                (error) => {
                    console.error("Erreur lors de l'ajout de la conversation :", error); // Log l'erreur
                    this.alertServ.alertHandler("Erreur lors de l'ajout de la conversation :", "error");
                }
            );
    } else {
        console.error("Veuillez sélectionner un FEC et un utilisateur.");
        this.alertServ.alertHandler("Veuillez sélectionner un FEC et un utilisateur", "error");
    }
}

    
    getConversationName(): string {
      const conversationNameInput = document.getElementById("conversation-name-input") as HTMLInputElement;
      return conversationNameInput.value;
    }
    
  
}
