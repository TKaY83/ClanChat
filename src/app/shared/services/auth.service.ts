import { Injectable, NgZone } from '@angular/core';
import { User } from '../services/user';
import * as auth from 'firebase/auth';
import { getAuth, onAuthStateChanged, signInAnonymously, updateEmail, updatePassword, updateProfile } from "firebase/auth";
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment';
import { doc, getDoc, getFirestore, setDoc } from 'firebase/firestore';
@Injectable({
  providedIn: 'root',
})

export class AuthService {
  userData: any; // Save logged in user data
  app = initializeApp(environment.firebase);
  auth = getAuth(this.app);
  db = getFirestore(this.app);
  user = {};

  showForgotPassword: boolean = false;
  showVerifyMail: boolean = false;
  showSignUp: boolean = false;
  showSignIn: boolean = true;

  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', Validators.required);
  name = new FormControl('', [Validators.required, Validators.maxLength(5)]);
  phone = new FormControl('', [Validators.required, Validators.pattern('[- +()0-9]+')]);
  showLoginArea: boolean = true;

  constructor(
    public afs: AngularFirestore, // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    public ngZone: NgZone // NgZone service to remove outside scope warning
  ) {
    /* Saving user data in localstorage when 
    logged in and setting up null when logged out */
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user')!);
      } else {
        localStorage.setItem('user', 'null');
        JSON.parse(localStorage.getItem('user')!);
      }
    });
  }

  // Sign in with email/password
  SignIn(email: string, password: string) {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.SetUserData(result.user);
        this.afAuth.authState.subscribe((user) => {
          if (user) {
            this.showLoginArea = false;
            this.changeUserStatusToOnline()
          }
        });
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }

  // Sign up with email/password
  SignUp(email: string, password: string) {
    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        /* Call the SendVerificaitonMail() function when new user sign 
        up and returns promise */
        this.SendVerificationMail();
        this.SetUserData(result.user);
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }

  // Send email verfificaiton when new user sign up
  SendVerificationMail() {
    return this.afAuth.currentUser
      .then((u: any) => u.sendEmailVerification())
      .then(() => {
        this.showVerifyMail = true;
        this.showSignUp = false;
      });
  }

  // Reset Forggot password
  ForgotPassword(passwordResetEmail: string) {
    return this.afAuth
      .sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        window.alert('Password reset email sent, check your inbox.');
      })
      .catch((error) => {
        window.alert(error);
      });
  }

  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    return user !== null && user.emailVerified !== false ? true : false;
  }

  // Sign in with Google
  GoogleAuth() {
    return this.AuthLogin(new auth.GoogleAuthProvider()).then((res: any) => {
    });
  }

  // Auth logic to run auth providers
  AuthLogin(provider: any) {
    return this.afAuth
      .signInWithPopup(provider)
      .then((result) => { this.SetUserData(result.user) })
      .catch((error) => {
        window.alert(error);
      });
  }

  /* Setting up user data when sign in with username/password, 
  sign up with username/password and sign in with social auth  
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  SetUserData(user: any) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${user.uid}`
    );
    let userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName ? user.displayName : 'User', //necessary because if user.displayName is empty, search fkt for chat partner doesnt run
      phoneNumber: user.phoneNumber,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified
    };
    return userRef.set(userData, { merge: true });
  }

  // Sign out
  async SignOut() {
    await this.changeUserStatusToOffline();
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.userData = '';
      this.showLoginArea = true;
      this.router.navigate(['/']);
    });
  }

  //error message for authentication processes
  getErrorMessage() {
    if (this.email.hasError('required') || this.password.hasError('required') || this.name.hasError('required')) {
      return 'You must enter a value';
    }
    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

  //change user data mail in firestore
  changeUserDataMail(email: string) {
    updateEmail(this.userData, email)
      .then(() => {
        this.SendVerificationMail();
      }).catch((error) => {
        window.alert(error.message);
      });
  }

  //change user data pw in firestore
  changeUserDataPw(newPassword: string) {
    updatePassword(this.userData, newPassword)
      .then(() => {
        this.SignOut();
      }).catch((error) => {
        window.alert(error.message);
      });
  }

  //change user data name in firestore
  changeUserDataName(userName) {
    updateProfile(this.userData, { displayName: userName })
      .then(() => {
      }).catch((error) => {
        window.alert(error.message);
      });
  }

  //change user data img in firestore
  changeUserDataImg(src) {
    updateProfile(this.userData, { photoURL: src })
      .then(() => {
      }).catch((error) => {
        window.alert(error.message);
      });
  }

  /** SIGN IN ANONYM */
  signInAnonymously() {
    signInAnonymously(this.auth)
      .then(() => {
        // Signed in..
        this.showLoginArea = false;
        this.onAuthStateChanged();
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  }

  onAuthStateChanged() {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user')!);
      } else {
        localStorage.setItem('user', 'null');
        JSON.parse(localStorage.getItem('user')!);
      }
    });
  }

  async changeUserStatusToOnline() {
    if (await this.additionUserDataExist()) {
      this.afs.collection('more-user-infos')
        .doc(this.userData.uid)
        .update({ isOnline: true })
        .then(() => {
        }).catch((error) => {
          window.alert(error.message);
        });
    }
    else if (await this.UserDataExist()) this.addDocInFirestore()
  }

  //Check if additional user data exist to check if the document have to created or updated.
  async additionUserDataExist() {
    const docRef = doc(this.db, "more-user-infos", this.userData.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) return true;
    else return false;
  }

  async addDocInFirestore() {
    await setDoc(doc(this.db, "more-user-infos", this.userData.uid), {
      uid: this.userData.uid,
      isOnline: true
    });
  }

  async changeUserStatusToOffline() {
    if (await this.UserDataExist()) {
      this.afs.collection('more-user-infos')
        .doc(this.userData.uid)
        .update({ isOnline: false })
        .then(() => {
        }).catch((error) => {});
    }
  }

  //Check if user exist, necessary to detect if it is a user or a guest. Guests will be return false
  async UserDataExist() {
    const docRef = doc(this.db, "users", this.userData.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) return true;
    else return false;
  }
}
