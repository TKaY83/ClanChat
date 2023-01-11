import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { User } from 'firebase/auth';
import { collection, deleteDoc, doc, getFirestore, onSnapshot, query, setDoc } from 'firebase/firestore';
import { FileUpload } from 'src/app/models/file-upload.model';
import { ChannelService } from 'src/app/shared/services/channel.service';
import { DetailViewPageService } from 'src/app/shared/services/detail-view-page.service';
import { GeneralService } from 'src/app/shared/services/general.service';
import { UsersService } from 'src/app/shared/services/users.service';
import { environment } from 'src/environments/environment';
import { MatButtonModule } from '@angular/material/button';
import { getStorage, ref, getDownloadURL, uploadBytes, uploadBytesResumable } from "firebase/storage";
import { BidiModule } from '@angular/cdk/bidi';
import { SendMessageService } from 'src/app/shared/services/send-message.service';

@Component({
  selector: 'app-channel-main',
  templateUrl: './channel-main.component.html',
  styleUrls: ['./channel-main.component.scss']
})
export class ChannelMainComponent implements OnInit {
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;

  app = initializeApp(environment.firebase);
  db = getFirestore(this.app);

  
  name: string = '';
  currentChannel: any;
  posts: any[] = [];
  showChannel: boolean = true;
  currentChannelId: string = '';
  message: string = '';
  actualUser: User;
  menuPositionY: any = 'below';
  selectedFiles?: FileList;
  currentFileUpload?: FileUpload;
  url: any;
  filesPreview: any[] = [];
  fileSelected: boolean = false;
  hidden: boolean = true;
  myFiles: File[] = [];
  private basePath = '/uploads';

  constructor(
    public channelServ: ChannelService,
    public detailViewService: DetailViewPageService,
    public userService: UsersService,
    public generalService: GeneralService,
    public messageService: SendMessageService) {
    this.currentChannel = JSON.parse(localStorage.getItem('currentChannel')!)
    this.actualUser = JSON.parse(localStorage.getItem('user')!)
    channelServ.currentChannel = this.currentChannel;

    if (!this.currentChannel) {
      this.currentChannel = {
        name: 'Regeln',
        id: 'JsFlpBJololcnDEjcSqz'
      }
      channelServ.currentChannel = this.currentChannel;
    }
    this.channelServ.loadChannel();
    channelServ.showChannel = true;
  }

  ngOnInit() {
    this.scrollToBottom();
  }

  sendMessageChannel(){
    this.messageService.sendMessageChannel(this.actualUser.uid, this.channelServ.currentChannel.id)
  }

  async deletePost(post) {
    await deleteDoc(doc(this.db, "channel", this.channelServ.currentChannel.id, "posts", post.id));
  }

  deleteSelectedFile(position) {
    this.messageService.myFiles.splice(position, 1)
    if (this.messageService.myFiles.length > 0) this.messageService.renderFilesPreview();
    else this.messageService.fileSelected = false;
  }



  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  getPosition(e) {
    let container = this.myScrollContainer.nativeElement.getBoundingClientRect()

    let y = e.clientY; //y-position of mouse

    let halfContainerHeight = container.height / 2
    if ((halfContainerHeight + container.top) >= y) this.menuPositionY = 'below'
    else this.menuPositionY = 'above'
  }

  /** scroll automatically to last message */
  scrollToBottom(): void {
    if (this.generalService.scrollToBottom) {
      try {
        this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
      } catch (err) { }
    }
  }

  changeDetailViewPageContentToThread() {
    this.detailViewService.showUserInfo = false;
    this.detailViewService.showOtherUserInfo = false;
    this.detailViewService.showThread = true;
    if (this.generalService.mobilViewIsActive) this.generalService.showNextSlide = true;
  }

  saveAnswersToShow(post) {
    let postForThread = {
      name: this.channelServ.currentChannel.name,
      post: post
    }
    localStorage.setItem('postForThread', JSON.stringify(postForThread));
    this.channelServ.showThread = true; //proof if it is necessary, two times called
    this.channelServ.currentThread = postForThread;
  }



}
