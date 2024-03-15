import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { environment } from '../environment/environment';
import { User } from '../authetification/login/model_user';
import { AuthService } from '../authetification/auth.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  public    currentSkin:string = "white";
  imgPrefix = environment.apiUrl + '/avatars/';
  public currentUser: User | null = null;

  constructor(private authService: AuthService,@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {

  

    if (isPlatformBrowser(this.platformId)) {


      this.authService.retrieveCurrentUserFromLocalStorage();
      this.authService.currentUser$.subscribe(user => {
        this.currentUser = user;
      });    console.log("thisssss",this.currentUser);
  } else {
  }

  }


  logout(): void {
    this.authService.logout(); 
  }
 
}
