import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { initializeApp } from 'firebase/app';
import { collection, doc, getDoc, getFirestore, onSnapshot, query, updateDoc } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref } from 'firebase/storage';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  app = initializeApp(environment.firebase);
  db = getFirestore(this.app);
  users: any[] = [];
  usersAdditionalInfos: any[] = [];
  storage = getStorage();
  imgUnknownHeader = '<img src="./../../../assets/img/userIcons/user-white.png" height="20px">';
  imgUnknownProfile = '<img src="./../../../assets/img/userIcons/user-black.png" height="120px">';
  imgUnknownSidebar = '<img src="./../../../assets/img/userIcons/user-black.png" height="25px">';
  imgUnknownInfo = '<img src="./../../../assets/img/userIcons/user-black.png" height="160px">';
  imgUnknownWindow = '<img src="./../../../assets/img/userIcons/user-black.png" height="80px">';
  imgUnknownThread = '<img src="./../../../assets/img/userIcons/user-black.png" height="25px">';
  imgUnknownChannel = '<img src="./../../../assets/img/userIcons/user-black.png" height="40px">';
  imgUnknownAddChannel = '<img src="./../../../assets/img/userIcons/user-black.png" height="20px">';
  
  constructor(
    public dialog: MatDialog
  ) { }

  //load all users datas (displayName => name; email: Mail; photoURL => image src)
  async loadUsers() {
    let q = query(collection(this.db, "users"))
    let unsubscribe = onSnapshot(q, (querySnapshot) => {
      this.users = [];
      querySnapshot.forEach((doc) => {
        this.users.push(doc.data())
      })
    });
  }

  //load all users additional datas (isOnline => true/false; isAway: true/false; timeStampLastActivity; uid => user id; phoneNumber)
  async loadUsersAdditionalInfos() {
    let q = query(collection(this.db, "more-user-infos"))
    let unsubscribe = onSnapshot(q, (querySnapshot) => {
      this.usersAdditionalInfos = [];
      querySnapshot.forEach((doc) => {
        this.usersAdditionalInfos.push(doc.data())
      })
      this.checkUsersLastActivity()
    });
  }

  returnUsersPhotoUrl(uid) {
    let user = this.users.find(user => user.uid == uid)
    if (user == undefined || user.photoURL == null) return 'https://firebasestorage.googleapis.com/v0/b/slack-clone-a06c2.appspot.com/o/f3ZXAi4IOARnYwZxZTOZNb5VddW2%2Fuser-black.png?alt=media&token=5c13dc67-3f10-441d-8134-ac1e2980088f'
    else return user.photoURL
  }

  returnUsersPhotoUrlThread(uid) {
    let user = this.users.find(user => user.uid == uid)
    if (user == undefined || user.photoURL == null) return 'https://firebasestorage.googleapis.com/v0/b/slack-clone-a06c2.appspot.com/o/f3ZXAi4IOARnYwZxZTOZNb5VddW2%2Fuser-black.png?alt=media&token=5c13dc67-3f10-441d-8134-ac1e2980088f'
    else  return user.photoURL
  }

  returnUsersDisplayName(uid) {
    let user = this.users.find(user => user.uid == uid)
    if (user == undefined) return 'Anonym'
    else return user.displayName
  }

  returnUsersMail(uid) {
    let user = this.users.find(user => user.uid == uid)
    if (user == undefined) return 'No mail available'
    else return user.email
  }

  returnUsersPhoneNumber(uid) {
    let user = this.usersAdditionalInfos.find(user => user.uid == uid)
    if (user == undefined) return 'No Phone'
    else return user.phoneNumber
  }

  /**
   * find user which is shown in user-window component
   * give back the color for status of this user
   * gray in case he is not online or a not registered user
   * green if he/she is online
   * yellow in case he/she is away (changed tap)
   */
  returnUserStatus(uid) {
    let user = this.usersAdditionalInfos.find(user => user.uid == uid)
    if (user == undefined || !user.isOnline) return 'gray'
    else if (user.isOnline) return 'green'
    else if (user.isOnline && user.isAway) return 'yellow'
    else return 'gray'
  }

  /**
   * this function run everytime when sth changed in the collection more-user-infos
   * the current user itself (in case he/she is not a guest) trigger this change every 5min in the main-component by mouseover or touch event
   * so the following function check the status of the user and set him/her status to isOnline=false
   * so in the user-window component change the color of the small circle to show the status 
   */
  async checkUsersLastActivity() {
    for (let i = 0; i < this.usersAdditionalInfos.length; i++) {
      const user = this.usersAdditionalInfos[i];
      //only if user is online it has to be proofed if he is away
      if (user.isOnline) {
        let newTime = Math.round(new Date().getTime() / 1000);
        if (newTime - user.timeStampLastActivity > 600) {
          await updateDoc(doc(this.db, "more-user-infos", user.uid), {
            isOnline: false
          });
        }
      }
    }
  }

  async UserDataOfUserExist(userUid) {
    const docRef = doc(this.db, "users", userUid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) return true;
    else return false;
  }
}
