import { Component, OnInit } from '@angular/core';
import { FecService } from './file-upload.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit {
  selectedFile: File | null = null;

  constructor(private fecService: FecService) {}

  ngOnInit() {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  uploadFile() {
    if (this.selectedFile) {
      this.fecService.uploadFile(this.selectedFile)
        .subscribe((response) => {
          console.log(response); // Handle response from backend (optional)
          this.selectedFile = null; // Clear selection after successful upload
        });
    }
  }
}
