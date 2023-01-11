import { Component, OnInit } from '@angular/core';
import { DetailViewPageService } from 'src/app/shared/services/detail-view-page.service';
import { UsersService } from 'src/app/shared/services/users.service';

@Component({
  selector: 'app-other-user-info',
  templateUrl: './other-user-info.component.html',
  styleUrls: ['./other-user-info.component.scss']
})
export class OtherUserInfoComponent implements OnInit {

  userUnkown: string = 'https://firebasestorage.googleapis.com/v0/b/slack-clone-a06c2.appspot.com/o/f3ZXAi4IOARnYwZxZTOZNb5VddW2%2Fuser-black.png?alt=media&token=5c13dc67-3f10-441d-8134-ac1e2980088f';
  
  constructor(
    public detailViewService: DetailViewPageService,
    public userService: UsersService) { }

  ngOnInit(): void {
  }

}
