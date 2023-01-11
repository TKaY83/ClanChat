import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { collection, getDocs, getFirestore, onSnapshot, query } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref } from 'firebase/storage';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChannelService {
  app = initializeApp(environment.firebase);
  db = getFirestore(this.app);
  storage = getStorage();

  currentChannelId: string = '';
  currentChannel: any;
  arrayOfChannels: any[] = [];
  showThread: boolean = false;
  posts: any;
  showChannel: boolean = false;
  showAnswers: boolean = false;
  currentThread: any;
  tryImgSearchInStorageAgain: boolean = false;
  counter: number = 0;

  constructor() { }

  //load all channels as observables which will be run again if in firestore collection sth change
  async loadChannels() {
    let q = query(collection(this.db, "channel"))
    let unsubscribe = onSnapshot(q, (querySnapshot) => {
      this.arrayOfChannels.length = 0;
      querySnapshot.forEach((doc) => {
        this.arrayOfChannels.push(doc.data())
      })
    });
  }

  //get current channel from sideboard
  saveCurrentChannel(channel) {
    this.currentChannel = channel;
    this.loadChannel();
  }

  //load all posts of the channel
  loadChannel() {
    let q = query(collection(this.db, "channel", this.currentChannel.id, "posts"))
    let unsubscribe = onSnapshot(q, (querySnapshot) => {
      this.posts = [];
      querySnapshot.forEach((doc) => {
        this.posts.push(doc.data())
        this.loadChannelAnswers();
      })
    });
    this.showChannel = true;
  }

  loadChannelAnswers() {
    for (let i = 0; i < this.posts.length; i++) {
      const post = this.posts[i];
      let answers = [];
      this.posts[i].answers = answers; //necessary for inital load, because else it doesn't know posts.answers in html
      let q = query(collection(this.db, "channel", this.currentChannel.id, "posts", `${post.id}`, 'answers'))
      let unsubscribe = onSnapshot(q, (querySnapshot) => {
        answers = [];
        querySnapshot.forEach((doc) => {
          answers.push(doc.data())
          this.posts[i].answers = answers;
        })
      });
      this.showAnswers = true;
    }
  }
}
