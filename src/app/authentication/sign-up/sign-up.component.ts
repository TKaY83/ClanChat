import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  constructor(public authService: AuthService) { }

  ngOnInit(): void {
  }

  //reload of the website is necessary, because after sign up the login doesn't work without refresh 
  reload() {
    setTimeout(() => {
      location.reload(); //set timeout is necessary because it would jump back to sign-up
    }, 50);
  }

  goToSignIn(){
    this.authService.showSignIn = true;
    this.authService.showSignUp = false;
  }

}
