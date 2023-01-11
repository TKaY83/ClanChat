import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { doc, getFirestore, updateDoc } from 'firebase/firestore';
import { environment } from 'src/environments/environment';
import { AuthService } from '../shared/services/auth.service';
import { DetailViewPageService } from '../shared/services/detail-view-page.service';
import { UsersService } from '../shared/services/users.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  app = initializeApp(environment.firebase);
  db = getFirestore(this.app);
  activeUser: any;
  storageTime;
  time = 0;

  constructor(
    private authService: AuthService,
    private userService: UsersService,
    public detailService: DetailViewPageService
  ) {
    this.activeUser = JSON.parse(localStorage.getItem('user')!);

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) this.userIsAway()
      else this.userIsStillActive()
    })

    document.addEventListener('touchstart', () => {
      this.userIsStillActive()
    })
  }

  ngOnInit(): void {
  }

  async userIsStillActive() {
    if (await this.userService.UserDataOfUserExist(this.activeUser.uid)) {
      let newTime = Math.round(new Date().getTime() / 1000);
      if (newTime - this.time > 300) {
        this.time = newTime;
        await updateDoc(doc(this.db, "more-user-infos", this.activeUser.uid), {
          timeStampLastActivity: newTime,
          isOnline: true,
          isAway: false
        });
      }
    }
  }


  async userIsAway() {
    if (await this.userService.UserDataOfUserExist(this.activeUser.uid)) {
      let newTime = Math.round(new Date().getTime() / 1000);
      if (await this.authService.UserDataExist()) {
        await updateDoc(doc(this.db, "more-user-infos", this.activeUser.uid), {
          timeStampLastActivity: newTime,
          isAway: true
        });
      }
    }
  }

  closeDetailView() {
    this.detailService.showOtherUserInfo = false;
    this.detailService.showThread = false;
    this.detailService.showUserInfo = false;
  }
}
