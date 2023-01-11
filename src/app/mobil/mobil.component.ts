import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { doc, getFirestore, updateDoc } from 'firebase/firestore';
import { environment } from 'src/environments/environment';

// import Swiper core and required modules
import SwiperCore, { Keyboard, Navigation, Pagination, Swiper, Virtual } from "swiper";
import { SwiperComponent } from 'swiper/angular';
import { AuthService } from '../shared/services/auth.service';
import { GeneralService } from '../shared/services/general.service';
import { UsersService } from '../shared/services/users.service';

// install Swiper modules
SwiperCore.use([Virtual, Navigation, Pagination, Keyboard]);
@Component({
  selector: 'app-mobil',
  templateUrl: './mobil.component.html',
  styleUrls: ['./mobil.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MobilComponent implements OnInit {
  showDetailViewPageMobil: boolean = true

  app = initializeApp(environment.firebase);
  db = getFirestore(this.app);
  activeUser: any;
  storageTime;
  time = 0;
  showNavigationIconSwipe: boolean = false;

  constructor(
    public generalService: GeneralService,
    private authService: AuthService,
    private userService: UsersService
  ) { 
    this.activeUser = JSON.parse(localStorage.getItem('user')!);

     document.addEventListener('visibilitychange', () => {
       if (document.hidden) this.userIsAway()
       else this.userIsStillActive()
     })
 
     document.addEventListener('touchstart', () => {
       this.userIsStillActive()
     })
  }

  ngOnInit(): void {
    this.showNavigationIconSwipe = true;
    setTimeout(() => {
      this.showNavigationIconSwipe = false;
    }, 5000);
  }

  @ViewChild('swiper', { static: false }) swiper?: SwiperComponent;
  slideNext() {
    this.swiper.swiperRef.slideNext(100);
  }
  slidePrev() {
    this.swiper.swiperRef.slidePrev(100);
  }

  checkShowNextSlide() {
    if (this.generalService.showNextSlide) {
      this.slideNext();
      this.generalService.showNextSlide = false;
    }
  }

  checkShowPrevSlide(){
    if (this.generalService.showPrevSlide) {
      this.slidePrev();
      this.generalService.showPrevSlide = false;
    }
  }

  async userIsStillActive() {
    if (await this.userService.UserDataOfUserExist(this.activeUser.uid)) {
      let newTime = Math.round(new Date().getTime() / 1000);
      if (newTime - this.time > 300) {
        this.time = newTime;
        await updateDoc(doc(this.db, "more-user-infos", this.activeUser.uid), {
          timeStampLastActivity: newTime,
          isOnline: true,
          isAway: false
        });
      }
    }
  }


  async userIsAway() {
    if (await this.userService.UserDataOfUserExist(this.activeUser.uid)) {
      let newTime = Math.round(new Date().getTime() / 1000);
      if (await this.authService.UserDataExist()) {
        await updateDoc(doc(this.db, "more-user-infos", this.activeUser.uid), {
          timeStampLastActivity: newTime,
          isAway: true
        });
      }
    }
  }
}
