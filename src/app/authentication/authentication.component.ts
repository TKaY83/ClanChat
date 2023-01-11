import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.scss']
})
export class AuthenticationComponent implements OnInit {

  showForgotPassword: boolean = false;
  showVerifyMail: boolean = false;
  showSignUp: boolean = false;
  showSignIn: boolean = true;
  constructor(
    public authService: AuthService
  ) { }

  ngOnInit(): void {
  }

}
