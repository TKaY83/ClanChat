import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { User } from 'firebase/auth';
import { collection, deleteDoc, doc, getDocs, getFirestore, setDoc } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes, uploadBytesResumable } from 'firebase/storage';
import { FileUpload } from 'src/app/models/file-upload.model';
import { ChannelService } from 'src/app/shared/services/channel.service';
import { DetailViewPageService } from 'src/app/shared/services/detail-view-page.service';
import { GeneralService } from 'src/app/shared/services/general.service';
import { SendMessageService } from 'src/app/shared/services/send-message.service';
import { UsersService } from 'src/app/shared/services/users.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-thread',
  templateUrl: './thread.component.html',
  styleUrls: ['./thread.component.scss']
})
export class ThreadComponent implements OnInit {
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  app = initializeApp(environment.firebase);
  db = getFirestore(this.app);
  storage = getStorage();
  
  answersForThread: any;
  answers: any[] = []
  message: string = '';
  actualUser: User;
  menuPositionY: any = 'below';
  selectedFilesThread?: FileList;
  currentFileUploadThread?: FileUpload;
  urlThread: any;
  filesPreviewThread: any[] = [];
  fileSelectedThread: boolean = false;
  hidden: boolean = true;
  myFilesThread: File[] = [];
  userUnkown: string = 'https://firebasestorage.googleapis.com/v0/b/slack-clone-a06c2.appspot.com/o/f3ZXAi4IOARnYwZxZTOZNb5VddW2%2Fuser-black.png?alt=media&token=5c13dc67-3f10-441d-8134-ac1e2980088f';
  private basePath = '/uploads';

  constructor(
    public channelService: ChannelService,
    public usersService: UsersService,
    public generalService: GeneralService,
    private detailViewService: DetailViewPageService,
    public messageService: SendMessageService
  ) {
    this.actualUser = JSON.parse(localStorage.getItem('user')!)
  }

  ngOnInit(): void {
  }

  async deletePost(post) {
    await this.deleteAllAnswers(post);
    await this.deletePostComplete(post);
    this.changeDetailViewPageContentToThread();
  }

  async deleteAllAnswers(post) {
    const querySnapshot = await getDocs(collection(this.db, "channel", this.channelService.currentChannel.id, "posts", post.id, "answers"));
    querySnapshot.forEach(async (doc) => {
      this.deletePostAnswer(post, doc.id)
    });
  }

  async deletePostComplete(post) {
    await deleteDoc(doc(this.db, "channel", this.channelService.currentChannel.id, "posts", post.id));
  }

  async deletePostAnswer(post, answerID) {
    await deleteDoc(doc(this.db, "channel", this.channelService.currentChannel.id, "posts", post.id, "answers", answerID));
  }

  sendMessageThread(){
    this.messageService.sendMessageThread(this.actualUser.uid, this.channelService.currentChannel.id, this.channelService.currentThread.post.id)
  }

  changeDetailViewPageContentToThread() {
    this.detailViewService.showUserInfo = false;
    this.detailViewService.showOtherUserInfo = false;
    this.detailViewService.showThread = false;
    if (this.generalService.mobilViewIsActive) this.generalService.showPrevSlide = true;
  }

  getPosition(e) {
    let container = this.myScrollContainer.nativeElement.getBoundingClientRect()
    let y = e.clientY; //y-position of mouse
    let halfContainerHeight = container.height / 2

    if ((halfContainerHeight + container.top) >= y) this.menuPositionY = 'below'
    else this.menuPositionY = 'above'
  }

  deleteSelectedFile(position) {
    this.messageService.myFilesThread.splice(position, 1)
    if (this.messageService.myFilesThread.length > 0) this.messageService.renderFilesPreviewThread();
    else this.messageService.fileSelectedThread = false;
  }
}
