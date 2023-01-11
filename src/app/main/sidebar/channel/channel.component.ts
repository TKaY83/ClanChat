import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { ChannelService } from 'src/app/shared/services/channel.service';
import { GeneralService } from 'src/app/shared/services/general.service';
import { environment } from 'src/environments/environment';
import { AddChannelDialogComponent } from '../add-channel-dialog/add-channel-dialog.component';

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.scss']
})
export class ChannelComponent implements OnInit {
  app = initializeApp(environment.firebase);
  db = getFirestore(this.app);
  panelOpenState: boolean = false;

  constructor(
    public channelService: ChannelService,
    private router: Router,
    public dialog: MatDialog,
    public generalService: GeneralService) {
    channelService.loadChannels();
  }

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    if (this.generalService.adminActive) {
      this.dialog.open(AddChannelDialogComponent, {
        width: '250px',
        enterAnimationDuration,
        exitAnimationDuration,
      });
    }
    else {alert('Nur für Admins')}
  }

  ngOnInit(): void {
  }

  saveCurrentChannelId(channel) {
    this.channelService.saveCurrentChannel(channel);
    localStorage.setItem('currentChannel', JSON.stringify(channel))
    this.generalService.scrollToBottomBoolean();
    if (this.generalService.mobilViewIsActive) this.generalService.showNextSlide = true;
  }

  navigateToChannelMain() {
    this.router.navigate(['/channel-main'])
  }

}
