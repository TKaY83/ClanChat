import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { initializeApp } from 'firebase/app';
import { addDoc, collection, doc, getFirestore, updateDoc } from 'firebase/firestore';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ChatService } from 'src/app/shared/services/chat.service';
import { DetailViewPageService } from 'src/app/shared/services/detail-view-page.service';
import { GeneralService } from 'src/app/shared/services/general.service';
import { UsersService } from 'src/app/shared/services/users.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-user-window',
  templateUrl: './user-window.component.html',
  styleUrls: ['./user-window.component.scss']
})
export class UserWindowComponent implements OnInit {
  @Input() uid: string;
  app = initializeApp(environment.firebase);
  db = getFirestore(this.app);
  actualUser: any;
  userUnkown: string = 'https://firebasestorage.googleapis.com/v0/b/slack-clone-a06c2.appspot.com/o/f3ZXAi4IOARnYwZxZTOZNb5VddW2%2Fuser-black.png?alt=media&token=5c13dc67-3f10-441d-8134-ac1e2980088f';
  constructor(
    public userService: UsersService,
    public detailViewService: DetailViewPageService,
    private generalService: GeneralService,
    private chatService: ChatService,
    private authService: AuthService,
    private router: Router,) {
    this.actualUser = JSON.parse(localStorage.getItem('user')!)
  }

  ngOnInit(): void {
  }

  showUserDetails() {
    this.detailViewService.showUserInfo = false;
    this.detailViewService.showThread = false;
    this.detailViewService.showOtherUserInfo = true;
    this.detailViewService.userToShow = this.uid;
    if (this.generalService.mobilViewIsActive) this.generalService.showNextSlide = true;
  }

  checkIfNbrExist(uid) {
    if (this.userService.returnUsersPhoneNumber(uid) == 'No Phone') alert('Keine Nummer hinterlegt')
  }

  async goToChat(userChatId) {
    this.chatService.saveCurrentChatId(userChatId);
    this.generalService.scrollToBottomBoolean();
    this.router.navigate(['/chat-main'])
  }

  async checkIfUserHasChat(userUid) {
    if (await this.userService.UserDataOfUserExist(userUid) && await this.userService.UserDataOfUserExist(this.actualUser.uid)) {
      if (this.chatService.arrayOfFriendsWithChatUid.some(user => user.author == userUid)) {
        let chatId = this.getChatId(userUid)
        this.goToChat(chatId)
      }
      else this.createChat(userUid);
    }
    else alert('Please register for this function')
  }

  getChatId(userUid) {
    let chat = this.chatService.arrayOfFriendsWithChatUid.find(chat => chat.author == userUid);
    let chatId = chat.id;
    return chatId;
  }

  async createChat(userUid) {
    let docRef = await addDoc(collection(this.db, "posts"), {
      authors: [userUid, this.actualUser.uid]
    });
    this.updateIdInFirestoreChatDocs(docRef.id);
    this.goToChat(docRef.id)
  }

  //give the id of document in the document as a field
  async updateIdInFirestoreChatDocs(id) {
    let docRef = doc(this.db, "posts", id);
    await updateDoc(docRef, {
      id: id
    })
  }
}
