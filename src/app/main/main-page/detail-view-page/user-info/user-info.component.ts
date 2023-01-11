import { Component, ElementRef, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormControl } from '@angular/forms';
import { TooltipPosition } from '@angular/material/tooltip';
import { initializeApp } from 'firebase/app';
import { doc, getFirestore, updateDoc } from 'firebase/firestore';
import { AuthService } from 'src/app/shared/services/auth.service';
import { GeneralService } from 'src/app/shared/services/general.service';
import { UsersService } from 'src/app/shared/services/users.service';
import { environment } from 'src/environments/environment';
import { FileUpload } from 'src/app/models/file-upload.model';

// import Swiper core and required modules
import SwiperCore, { Pagination, Navigation, Keyboard, Virtual } from "swiper";
import { getDownloadURL, getStorage, ref, uploadBytes, uploadBytesResumable } from 'firebase/storage';
import { SendMessageService } from 'src/app/shared/services/send-message.service';

// install Swiper modules
SwiperCore.use([Keyboard, Pagination, Navigation, Virtual]);

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class UserInfoComponent implements OnInit {

  app = initializeApp(environment.firebase);
  db = getFirestore(this.app);
  storage = getStorage();

  editUserName: boolean = false;
  editUserId: boolean = false;
  editUserMail: boolean = false;
  editUserPw: boolean = false;
  editUserImg: boolean = false;
  editUserPhone: boolean = false;
  editUser: boolean = false;
  editUserSensitive: boolean = false;
  activeUser;
  showUserDetails: boolean = false;
  checkIfPasswordChanged: boolean = false;
  currentFileUpload?: FileUpload;
  private basePathUser: string = '';

  @Input() newName: any;
  @Input() newMail: any;
  @Input() newPhoneNumber: any;
  @Input() newPasswort: any;



  positionOptions: TooltipPosition[] = ['after', 'before', 'above', 'below', 'left', 'right'];
  position = new FormControl(this.positionOptions[0]);

  images: any[] = [
    { 'src': 'icon_female_1.png' },
    { 'src': 'icon_female_2.png' },
    { 'src': 'icon_female_3.jpg' },
    { 'src': 'icon_female_4.jpg' },
    { 'src': 'icon_female_5.jpg' },
    { 'src': 'icon_female_6.png' },
    { 'src': 'icon_female_7.jpg' },
    { 'src': 'icon_male_1.png' },
    { 'src': 'icon_male_2.png' },
    { 'src': 'icon_male_3.png' },
    { 'src': 'icon_male_4.png' },
    { 'src': 'icon_male_5.jpg' },
    { 'src': 'icon_male_6.png' },
    { 'src': 'icon-unknown.svg' },
    { 'src': 'user-white.png' },
  ]
  basePath = '/uploads';
  userUnkown: string = 'https://firebasestorage.googleapis.com/v0/b/slack-clone-a06c2.appspot.com/o/f3ZXAi4IOARnYwZxZTOZNb5VddW2%2Fuser-black.png?alt=media&token=5c13dc67-3f10-441d-8134-ac1e2980088f';
  constructor(
    public authService: AuthService,
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth,
    public usersService: UsersService,
    public generalService: GeneralService,
    public messageService: SendMessageService
  ) {
    this.activeUser = JSON.parse(localStorage.getItem('user')!);
    this.basePathUser = this.activeUser.uid
    this.loadTelephoneNbr()
  }

  loadTelephoneNbr() {
    setTimeout(() => {
      this.activeUser.phoneNumber = this.usersService.returnUsersPhoneNumber(this.activeUser.uid)
      this.showUserDetails = true;
    }, 2000);
  }

  ngOnInit(): void {
  }

  async changeUserDataNameFirestore() {
    if (await this.authService.UserDataExist()) {
      this.afs.collection('users')
        .doc(this.activeUser.uid)
        .update({ displayName: this.activeUser.displayName })
        .then(() => {
        }).catch((error) => {
          window.alert(error.message);
        });
    }
  }

  async changeUserDataMailFirestore() {
    if (await this.authService.UserDataExist()) {
      this.afs.collection('users')
        .doc(this.activeUser.uid)
        .update({ email: this.activeUser.email })
        .then(() => {
        }).catch((error) => {
          window.alert(error.message);
        });
    }
  }

  async saveImgUserPhotoURL(src) {
    if (await this.authService.UserDataExist()) {
      this.afs.collection('users')
        .doc(this.authService.userData.uid)
        .update({ photoURL: src })
        .then(() => {
        }).catch((error) => {
          window.alert(error.message);
        });
    }
  }

  async changeUserDataPhoneFirestore() {
    this.updatedDocInFirestore();
  }

  async updatedDocInFirestore() {
    if (await this.authService.UserDataExist()) {
      await updateDoc(doc(this.db, "more-user-infos", this.activeUser.uid), {
        phoneNumber: this.activeUser.phoneNumber,
        uid: this.activeUser.uid
      });
    }
  }

  editProfile() {
    this.editUser = true
  }

  closeProfileEdit() {
    this.editUser = false
  }

  saveProfileEdit() {
    this.authService.changeUserDataName(this.activeUser.displayName);
    this.changeUserDataNameFirestore();
    this.changeUserDataPhoneFirestore();
    this.closeProfileEdit();
    if (this.messageService.selectedFilesUser) this.uploadImage();
  }

  profileEditSensitiveInfos() {
    this.authService.changeUserDataMail(this.activeUser.email);
    this.changeUserDataMailFirestore();
    if (this.checkIfPasswordChanged) this.authService.changeUserDataPw(this.newPasswort);
    this.editUserSensitive = !this.editUserSensitive;
  }

  closeMoreSettings() {
    this.checkIfPasswordChanged = false;
    this.editUserSensitive = !this.editUserSensitive;
  }

  //Image upload in a folder which has the same name like the user uid
  uploadImage(): any {
    this.basePathUser = this.activeUser.uid
    const file: File | null = this.messageService.myFilesUser[0]
    this.messageService.selectedFilesUser = undefined;
    this.currentFileUpload = new FileUpload(file);
    this.pushFileToStorage(this.currentFileUpload)
    this.messageService.myFiles.length = 0; //if set undefined, it runs into an error on next loading picture
  }

  pushFileToStorage(fileUpload: FileUpload) {
    const filePath = `${this.basePathUser}/${fileUpload.file.name}`;
    const storageRef = ref(this.storage, filePath);
    const uploadTask = uploadBytesResumable(storageRef, fileUpload.file);
    uploadBytes(storageRef, fileUpload.file).then((snapshot) => {
      console.log('Uploaded a blob or file!');
    });

    uploadTask.on('state_changed',
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
        }
      },
      (error) => {
        // Handle unsuccessful uploads
      },
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          this.saveImgUserPhotoURL(downloadURL);
          this.authService.changeUserDataImg(downloadURL)
        });
      }
    );
  }
}
