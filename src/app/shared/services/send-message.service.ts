import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { arrayUnion, doc, getFirestore, setDoc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes, uploadBytesResumable } from 'firebase/storage';
import { FileUpload } from 'src/app/models/file-upload.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SendMessageService {
  //show and hide editor
  showEditorChannel: boolean = true;
  showEditorThread: boolean = true;
  showEditorChat: boolean = true;

  //set editor active for fileupload
  activeEditorIsChannel: boolean = false;
  activeEditorIsThread: boolean = false;
  activeEditorIsChat: boolean = false;
  activeEditorIsUser: boolean = false;

  //User
  selectedFilesUser?: FileList;
  currentFileUploadUser?: FileUpload;
  urlUser: any;
  filePreviewUser: any;
  fileSelectedUser: boolean = false;
  myFilesUser: File[] = [];;

  //THREAD
  selectedFilesThread?: FileList;
  currentFileUploadThread?: FileUpload;
  urlThread: any;
  filesPreviewThread: any[] = [];
  fileSelectedThread: boolean = false;
  myFilesThread: File[] = [];

  //CHANNEL
  selectedFiles?: FileList;
  currentFileUpload?: FileUpload;
  url: any;
  filesPreview: any[] = [];
  fileSelected: boolean = false;
  myFiles: File[] = [];

  //CHAT
  selectedFilesChat?: FileList;
  currentFileUploadChat?: FileUpload;
  urlChat: any;
  filesPreviewChat: any[] = [];
  fileSelectedChat: boolean = false;
  myFilesChat: File[] = [];


  private basePath = '/uploads';
  storage = getStorage();
  app = initializeApp(environment.firebase);
  db = getFirestore(this.app);

  messageChannel: string = '';
  messageThread: string = '';
  messageChat: string = '';
  urlImageChannel: string[] = [];
  urlImageThread: string[] = [];
  urlImageChat: string[] = [];
  uploadRunning: boolean = false;

  constructor() { }

  changeActiveEditorToChannel() {
    this.activeEditorIsThread = false;
    this.activeEditorIsChannel = true;
    this.activeEditorIsChat = false;
    this.activeEditorIsUser = false;
  }

  changeActiveEditorToThread() {
    this.activeEditorIsThread = true;
    this.activeEditorIsChannel = false;
    this.activeEditorIsChat = false;
    this.activeEditorIsUser = false;
  }

  changeActiveEditorToChat() {
    this.activeEditorIsThread = false;
    this.activeEditorIsChannel = false;
    this.activeEditorIsChat = true;
    this.activeEditorIsUser = false;
  }

  changeActiveEditorToUser() {
    this.activeEditorIsThread = false;
    this.activeEditorIsChannel = false;
    this.activeEditorIsChat = false;
    this.activeEditorIsUser = true;
  }

  selectFile(event: any): void {
    if (this.activeEditorIsThread) this.selectFileThread(event)
    if (this.activeEditorIsChannel) this.selectFileChannel(event)
    if (this.activeEditorIsChat) this.selectFileChat(event)
    if (this.activeEditorIsUser) this.selectFileUser(event)
  }

  selectFileChannel(event) {
    this.selectedFiles = event.target.files
    for (var i = 0; i < this.selectedFiles.length; i++) {
      this.myFiles.push(this.selectedFiles.item(i));
    }
    //show a preview of selected File
    this.filesPreview = [];
    if (event.target.files) {
      this.renderFilesPreview();
      this.fileSelected = true;
    }
    event.target.value = ''; // necessary to be able to load the same file again
  }

  selectFileUser(event) {
    this.selectedFilesUser = event.target.files
    this.myFilesUser.push(this.selectedFilesUser.item(0))
    //show a preview of selected File
    this.filesPreview = [];
    if (event.target.files) {
      this.renderFilePreviewUser();
      this.fileSelectedUser = true;
    }
    event.target.value = ''; // necessary to be able to load the same file again
  }

  selectFileThread(event) {
    this.selectedFilesThread = event.target.files
    for (var i = 0; i < this.selectedFilesThread.length; i++) {
      this.myFilesThread.push(this.selectedFilesThread.item(i));
    }
    //show a preview of selected File
    this.filesPreviewThread = [];
    if (event.target.files) {
      this.renderFilesPreviewThread();
      this.fileSelectedThread = true;
    }
    event.target.value = ''; // necessary to be able to load the same file again
  }

  selectFileChat(event) {
    this.selectedFilesChat = event.target.files
    for (var i = 0; i < this.selectedFilesChat.length; i++) {
      this.myFilesChat.push(this.selectedFilesChat.item(i));
    }
    //show a preview of selected File
    this.filesPreviewChat = [];
    if (event.target.files) {
      this.renderFilesPreviewChat();
      this.fileSelectedChat = true;
    }
    event.target.value = ''; // necessary to be able to load the same file again
  }

  renderFilesPreviewThread() {
    this.filesPreviewThread = [];
    for (let i = 0; i < this.myFilesThread.length; i++) {
      const file = this.myFilesThread[i];
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event: any) => {
        this.urlThread = event.target.result;
        let filePreview = {
          url: this.urlThread,
          hidden: true,
          position: i
        }
        this.filesPreviewThread.push(filePreview)
      }
    }
  }

  renderFilePreviewUser() {
    const file = this.selectedFilesUser.item(0);
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event: any) => {
      this.urlUser = event.target.result;
      this.filePreviewUser = this.urlUser
    }
  }

  renderFilesPreviewChat() {
    this.filesPreviewChat = [];
    for (let i = 0; i < this.myFilesChat.length; i++) {
      const file = this.myFilesChat[i];
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event: any) => {
        this.urlChat = event.target.result;
        let filePreview = {
          url: this.urlChat,
          hidden: true,
          position: i
        }
        this.filesPreviewChat.push(filePreview)
      }
    }
  }

  //render files preview channel
  renderFilesPreview() {
    this.filesPreview = [];
    for (let i = 0; i < this.myFiles.length; i++) {
      const file = this.myFiles[i];
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event: any) => {
        this.url = event.target.result;
        let filePreview = {
          url: this.url,
          hidden: true,
          position: i
        }
        this.filesPreview.push(filePreview)
      }
    }
  }

  expandEditorChannel() {
    this.showEditorChannel = !this.showEditorChannel
  }

  expandEditorThread() {
    this.showEditorThread = !this.showEditorThread
  }

  expandEditorChat() {
    this.showEditorChat = !this.showEditorChat
  }




  /**here the new doc id in the subcollection texts will be generated with two components. 
 * The first one is a timestamp, so the messeages are in the right order when they come 
 * from firestore. The second component is a randowm string with 6 characters if two 
 * users post at the same time. */
  async sendMessageChannel(uid, currentChannelId) {
    let textId = Math.round(new Date().getTime() / 1000);
    let idAdd = Math.random().toString(16).substr(2, 6)
    this.urlImageChannel = [];
    if (this.selectedFiles) {
      this.uploadChannel(textId, idAdd, currentChannelId);
      this.filesPreview.length = 0;
      this.uploadRunning = true;
    }
    this.setDocInFirestoreChannel(textId, idAdd, uid, currentChannelId)
  }

  uploadChannel(textId, idAdd, currentChannelId): any {
    for (let i = 0; i < this.myFiles.length; i++) {
      const file: File | null = this.myFiles[i];
      this.currentFileUpload = new FileUpload(file);
      this.pushFileToStorageChannel(this.currentFileUpload, i, this.myFiles.length, textId, idAdd, currentChannelId)
    }
    this.myFiles.length = 0; //if set undefined, it runs into an error on next loading picture
  }

  async setDocInFirestoreChannel(textId, idAdd, uid, currentChannelId) {
    await setDoc(doc(this.db, "channel", currentChannelId, "posts", `${textId + idAdd}`),
      {
        content: this.messageChannel,
        author: uid,
        id: `${textId + idAdd}`,
        timeStamp: textId,
      })
    this.messageChannel = '';
    this.fileSelected = false;
  }

  pushFileToStorageChannel(fileUpload: FileUpload, currentFile, totalNbrOfFiles, textId, idAdd, currentChannelId) {
    const filePath = `${this.basePath}/${fileUpload.file.name}`;
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
          this.updateloadedImagesChannel(downloadURL, textId, idAdd, currentChannelId)
          if (currentFile + 1 == totalNbrOfFiles) this.uploadRunning = false;
        });
      }
    );
  }

  async updateloadedImagesChannel(downloadURL, textId, idAdd, currentChannelId) {
    await updateDoc(doc(this.db, "channel", currentChannelId, "posts", `${textId + idAdd}`), {
      imageUrl: arrayUnion(downloadURL)
    });
  }

  sendMessageThread(uid, currentChannelId, currentThreadPostId) {
    let textId = Math.round(new Date().getTime() / 1000);
    let idAdd = Math.random().toString(16).substr(2, 6)
    this.urlImageThread = [];
    if (this.selectedFilesThread) {
      this.uploadThread(textId, idAdd, currentChannelId, currentThreadPostId);
      this.filesPreview.length = 0;
      this.uploadRunning = true;
    }
    this.setDocInFirestoreThread(textId, idAdd, uid, currentChannelId, currentThreadPostId)
  }

  uploadThread(textId, idAdd, currentChannelId, currentThreadPostId): any {
    for (let i = 0; i < this.myFilesThread.length; i++) {
      const file: File | null = this.myFilesThread[i];
      this.currentFileUploadThread = new FileUpload(file);
      this.pushFileToStorageThread(this.currentFileUploadThread, i, this.myFilesThread.length, textId, idAdd, currentChannelId, currentThreadPostId)
    }
    this.myFilesThread.length = 0; //if set undefined, it runs into an error on next loading picture
  }

  pushFileToStorageThread(fileUpload: FileUpload, currentFile, totalNbrOfFiles, textId, idAdd, currentChannelId, currentThreadPostId) {
    const filePath = `${this.basePath}/${fileUpload.file.name}`;
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
          this.updateloadedImagesThread(downloadURL, textId, idAdd, currentChannelId, currentThreadPostId)
          if (currentFile + 1 == totalNbrOfFiles) this.uploadRunning = false;
        });
      }
    );
  }

  async setDocInFirestoreThread(textId, idAdd, uid, currentChannelId, currentThreadPostId) {
    await setDoc(doc(this.db, "channel", currentChannelId, "posts", currentThreadPostId, "answers", `${textId + idAdd}`),
      {
        content: this.messageThread,
        author: uid,
        id: `${textId + idAdd}`,
        timeStamp: textId,
      })
    this.messageThread = '';
    this.fileSelectedThread = false;
  }

  async updateloadedImagesThread(downloadURL, textId, idAdd, currentChannelId, currentThreadPostId) {
    await updateDoc(doc(this.db, "channel", currentChannelId, "posts", currentThreadPostId, "answers", `${textId + idAdd}`), {
      imageUrl: arrayUnion(downloadURL)
    });
  }


  sendMessageChat(uid, currentChatId) {
    let textId = Math.round(new Date().getTime() / 1000);
    let idAdd = Math.random().toString(16).substr(2, 6)
    this.urlImageChat = [];
    if (this.selectedFilesChat) {
      this.uploadChat(textId, idAdd, currentChatId);
      this.filesPreview.length = 0;
      this.uploadRunning = true;
    }
    this.setDocInFirestoreChat(textId, idAdd, uid, currentChatId)
  }

  uploadChat(textId, idAdd, currentChatId): any {
    for (let i = 0; i < this.myFilesChat.length; i++) {
      const file: File | null = this.myFilesChat[i];
      this.currentFileUploadChat = new FileUpload(file);
      this.pushFileToStorageChat(this.currentFileUploadChat, i, this.myFilesChat.length, textId, idAdd, currentChatId)
    }
    this.myFilesChat.length = 0; //if set undefined, it runs into an error on next loading picture
  }

  pushFileToStorageChat(fileUpload: FileUpload, currentFile, totalNbrOfFiles, textId, idAdd, currentChatId) {
    const filePath = `${this.basePath}/${fileUpload.file.name}`;
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
          this.updateloadedImagesChat(downloadURL, textId, idAdd, currentChatId)
          if (currentFile + 1 == totalNbrOfFiles) this.uploadRunning = false;
        });
      }
    );
  }

  async setDocInFirestoreChat(textId, idAdd, uid, currentChatId) {
    await setDoc(doc(this.db, "posts", currentChatId, "texts", `${textId + idAdd}`),
      {
        content: this.messageChat,
        author: uid,
        id: `${textId + idAdd}`,
        timeStamp: textId,
      })
    this.messageChat = '';
    this.fileSelectedChat = false;
  }

  async updateloadedImagesChat(downloadURL, textId, idAdd, currentChatId) {
    await updateDoc(doc(this.db, "posts", currentChatId, "texts", `${textId + idAdd}`), {
      imageUrl: arrayUnion(downloadURL)
    });
  }
}
