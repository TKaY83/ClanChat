import { Component, HostListener } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { doc, getDoc, getFirestore, updateDoc } from 'firebase/firestore';
import { environment } from 'src/environments/environment';
import { AuthService } from './shared/services/auth.service';
import { GeneralService } from './shared/services/general.service';
import { SendMessageService } from './shared/services/send-message.service';
import { UsersService } from './shared/services/users.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  app = initializeApp(environment.firebase);
  db = getFirestore(this.app);
  windowWidth: number;
  windowHeight: number;

  title = 'slack-clone';
  constructor(
    public authService: AuthService,
    private userService: UsersService,
    private generalService: GeneralService,
    public messageService: SendMessageService,
    public sendMessageService: SendMessageService) {
    let user = JSON.parse(localStorage.getItem('user'))
    if (user) this.authService.showLoginArea = false;
    else this.authService.showLoginArea = true;
  }

  ngOnInit() {
    this.windowWidth = window.innerWidth;
    if (window.innerWidth < 800) this.generalService.mobilViewIsActive = true;
    this.loadColor();
  }

  @HostListener('window:resize', ['$event'])

  resizeWindow() {
    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;
    if (this.windowWidth < 800) this.generalService.mobilViewIsActive = true;
    if (this.windowWidth > 800) this.generalService.mobilViewIsActive = false;
    //closes the chatbox
    if (this.windowHeight < 500){
      this.messageService.showEditorChannel = false;
      this.messageService.showEditorThread = false;
      this.messageService.showEditorChat = false;
    }
    //opens the chatbox
    if (this.windowHeight > 500){
      this.messageService.showEditorChannel = true;
      this.messageService.showEditorThread = true;
      this.messageService.showEditorChat = true;
    }

  }

  getMainColor() {
    return localStorage.getItem('mainColor');
  }

  getSecColor() {
    return localStorage.getItem('secColor');
  }

  getBackgroundColor() {
    return localStorage.getItem('backgroundColor')
  }

  loadColor() {
    document.documentElement.style.setProperty('--main-color', this.getMainColor());
    document.documentElement.style.setProperty('--secondary-color', this.getSecColor());
    document.documentElement.style.setProperty('--background-color', this.getBackgroundColor());
  }
}

