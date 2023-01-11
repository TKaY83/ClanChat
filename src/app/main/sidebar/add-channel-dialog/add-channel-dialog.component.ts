import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { initializeApp } from 'firebase/app';
import { collection, getDocs, getFirestore, onSnapshot, query, addDoc, doc, updateDoc } from 'firebase/firestore';
import { ChannelService } from 'src/app/shared/services/channel.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-channel-dialog',
  templateUrl: './add-channel-dialog.component.html',
  styleUrls: ['./add-channel-dialog.component.scss']
})
export class AddChannelDialogComponent implements OnInit {
  app = initializeApp(environment.firebase);
  db = getFirestore(this.app);
  @Input() name: any;

  constructor(
    public dialogRef: MatDialogRef<AddChannelDialogComponent>,
    public channelService: ChannelService
  ) { }

  ngOnInit(): void {
  }

  async createNewChannel() {
    if (this.name.length >= 3 && !this.checkIfNameAlreadyExist()) {
      let docRef = await addDoc(collection(this.db, "channel"), {
        name: this.name,
      });
      this.updateIdInFirestoreChannelDocs(docRef.id);
    } else {
      if(this.name.length < 3) alert('Bitte Channel mit mindestens 3 zeichen eigeben');
      if(this.checkIfNameAlreadyExist()) alert('Channel existiert bereits');
    }
  }

  //give the id of document in the document as a field
  async updateIdInFirestoreChannelDocs(id) {
    let docRef = doc(this.db, "channel", id);
    await updateDoc(docRef, {
      id: id
    })
    this.dialogRef.close();
  }

  checkIfNameAlreadyExist(){
   return this.channelService.arrayOfChannels.some(channel => channel.name == this.name)
  }
}
