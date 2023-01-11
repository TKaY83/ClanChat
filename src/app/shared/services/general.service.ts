import { Injectable } from '@angular/core';
import { FileUpload } from 'src/app/models/file-upload.model';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {
  timedOutCloser;
  scrollToBottom;
  showDetailView: boolean = false;
  mobilViewIsActive: boolean = false;
  showNextSlide: boolean = false;
  showPrevSlide: boolean = false;

  adminActive: boolean = false;



  constructor() { }

  getTransformedTimeStampToDate(timeStamp) {
    let time = Number(timeStamp)
    let date = new Date(time * 1000);
    let cDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    let cTime = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    let dateTime = cDate + ' ' + cTime;
    return dateTime;
  }

  //timeout in this function is necessary, because he needs time to write the variable for the yPosition of the mat menu
  mouseEnter(trigger) {
    setTimeout(() => {
      if (this.timedOutCloser) clearTimeout(this.timedOutCloser);
      trigger.openMenu();
    }, 10);
  }

  mouseLeave(trigger) {
    this.timedOutCloser = setTimeout(() => {
      trigger.closeMenu();
    }, 50);
  }

  scrollToBottomBoolean() {
    this.scrollToBottom = true;
    setTimeout(() => {
      this.scrollToBottom = false;
    }, 500);
  }

  
}


