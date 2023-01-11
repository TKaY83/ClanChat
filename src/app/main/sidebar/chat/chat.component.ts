import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { ChatService } from 'src/app/shared/services/chat.service';
import { GeneralService } from 'src/app/shared/services/general.service';
import { UsersService } from 'src/app/shared/services/users.service';
import { environment } from 'src/environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { AddChatDialogComponent } from '../add-chat-dialog/add-chat-dialog.component';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  app = initializeApp(environment.firebase);
  db = getFirestore(this.app);
  panelOpenState: boolean = false;
  userUnkown: string = 'https://firebasestorage.googleapis.com/v0/b/slack-clone-a06c2.appspot.com/o/f3ZXAi4IOARnYwZxZTOZNb5VddW2%2Fuser-black.png?alt=media&token=5c13dc67-3f10-441d-8134-ac1e2980088f';

  constructor(
    public chatService: ChatService,
    private router: Router,
    public dialog: MatDialog,
    public usersService: UsersService,
    public generalService: GeneralService,
    private authService: AuthService) {
    chatService.loadChats();
  }

  ngOnInit(): void {
  }

  saveCurrentChatId(userChatId) {
    this.chatService.saveCurrentChatId(userChatId);
    this.generalService.scrollToBottomBoolean();
    if (this.generalService.mobilViewIsActive) this.generalService.showNextSlide = true;
  }

  navigateToMain() {
    this.router.navigate(['/main-community'])
  }

  async openDialog(enterAnimationDuration: string, exitAnimationDuration: string): Promise<void> {
    if (await this.authService.UserDataExist()) {
      this.dialog.open(AddChatDialogComponent, {
        width: '250px',
        enterAnimationDuration,
        exitAnimationDuration,
      });
    }
    else alert('Please register for this function')
  }
}
