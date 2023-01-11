import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { DetailViewPageService } from 'src/app/shared/services/detail-view-page.service';
import { GeneralService } from 'src/app/shared/services/general.service';
import { UsersService } from 'src/app/shared/services/users.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  actualUser: any;
  imgUnknownUserWhite: string = 'https://firebasestorage.googleapis.com/v0/b/slack-clone-a06c2.appspot.com/o/f3ZXAi4IOARnYwZxZTOZNb5VddW2%2Fuser-white.png?alt=media&token=2fd9de1c-0708-4531-9e67-548331ab3205';
  constructor(
    public authService: AuthService,
    private router: Router,
    public detailViewService: DetailViewPageService,
    private generalService: GeneralService,
    public userService: UsersService) {
      this.actualUser = JSON.parse(localStorage.getItem('user')!)
    userService.loadUsers();
    userService.loadUsersAdditionalInfos();
  }

  ngOnInit(): void {
  }

  navigateToPersonal() {
    this.router.navigate(['/personal'])
  }

  changeDetailViewPageContentToUserInfo() {
    this.detailViewService.showUserInfo = true;
    this.detailViewService.showThread = false;
    this.detailViewService.showOtherUserInfo = false;
    if (this.generalService.mobilViewIsActive) this.generalService.showNextSlide = true;
    setTimeout(() => {
      if (this.generalService.mobilViewIsActive) this.generalService.showNextSlide = true;
    }, 10);
  }

  adminCheckboxClick() {
    this.generalService.adminActive = !this.generalService.adminActive
  }

  themePink() {
    document.documentElement.style.setProperty('--main-color', '#FA2759');
    document.documentElement.style.setProperty('--secondary-color', '#f7b0c1');
    document.documentElement.style.setProperty('--background-color', '#fff2f5');
    localStorage.setItem('mainColor', '#FA2759');
    localStorage.setItem('secColor', '#f7b0c1');
    localStorage.setItem('backgroundColor', '#fff2f5');
  }

  themeViolett() {
    document.documentElement.style.setProperty('--main-color', '#7403bf');
    document.documentElement.style.setProperty('--secondary-color', '#ae8ec4');
    document.documentElement.style.setProperty('--background-color', '#faf3fe');
    localStorage.setItem('mainColor', '#7403bf');
    localStorage.setItem('secColor', '#ae8ec4');
    localStorage.setItem('backgroundColor', '#faf3fe');

  }

  themeOrange() {
    document.documentElement.style.setProperty('--main-color', '#fe8801');
    document.documentElement.style.setProperty('--secondary-color', '#ffdbb2');
    document.documentElement.style.setProperty('--background-color', '#fff9f1');
    localStorage.setItem('mainColor', '#fe8801');
    localStorage.setItem('secColor', '#ffdbb2');
    localStorage.setItem('backgroundColor', '#fff9f1');
  }

  themeDarkViolett() {
    document.documentElement.style.setProperty('--main-color', '#42324f');
    document.documentElement.style.setProperty('--secondary-color', '#afa1bd');
    document.documentElement.style.setProperty('--background-color', '#faf3fe');
    localStorage.setItem('mainColor', '#42324f');
    localStorage.setItem('secColor', '#afa1bd');
    localStorage.setItem('backgroundColor', '#faf3fe');
  }

}
