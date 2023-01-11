import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignInComponent } from './authentication/sign-in/sign-in.component';
import { SignUpComponent } from './authentication/sign-up/sign-up.component';
import { VerifyEmailComponent } from './authentication/verify-email/verify-email.component';
import { ForgotPasswordComponent } from './authentication/forgot-password/forgot-password.component';
import { MainComponent } from './main/main.component';
import { HeaderComponent } from './main/header/header.component';


//firebase
import { environment } from 'src/environments/environment';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AuthService } from './shared/services/auth.service';


//angular material
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatExpansionModule } from '@angular/material/expansion';
import {MatDialogModule} from '@angular/material/dialog';
import {MatDividerModule} from '@angular/material/divider';
import {MatTooltipModule} from '@angular/material/tooltip';




import { SwiperModule } from 'swiper/angular';
import { ChatComponent } from './main/sidebar/chat/chat.component';
import { EditorModule } from '@tinymce/tinymce-angular';
import { ChannelComponent } from './main/sidebar/channel/channel.component';
import { ChannelMainComponent } from './main/main-page/channel-main/channel-main.component';
import { MainChatComponent } from './main/main-page/main-chat/main-chat.component';
import { DetailViewPageComponent } from './main/main-page/detail-view-page/detail-view-page.component';
import { ThreadComponent } from './main/main-page/detail-view-page/thread/thread.component';
import { UserInfoComponent } from './main/main-page/detail-view-page/user-info/user-info.component';
import { AddChannelDialogComponent } from './main/sidebar/add-channel-dialog/add-channel-dialog.component';
import { AuthenticationComponent } from './authentication/authentication.component';
import { UserWindowComponent } from './main/main-page/user-window/user-window.component';
import { OtherUserInfoComponent } from './main/main-page/detail-view-page/other-user-info/other-user-info.component';
import { AddChatDialogComponent } from './main/sidebar/add-chat-dialog/add-chat-dialog.component';
import { MobilComponent } from './mobil/mobil.component';
import { SidebarComponent } from './main/sidebar/sidebar.component';
import { FooterComponent } from './main/footer/footer.component';
import { ImprintComponent } from './main/footer/imprint/imprint.component';
import { LoadingCircleComponent } from './loading-circle/loading-circle.component';
//import { ChannelMainComponent } from './main/main-page/channel-main/channel-main.component';

@NgModule({
  declarations: [
    AppComponent,
    SignInComponent,
    SignUpComponent,
    VerifyEmailComponent,
    ForgotPasswordComponent,
    MainComponent,
    HeaderComponent,
    ChatComponent,
    ChannelComponent,
    ChannelMainComponent,
    MainChatComponent,
    DetailViewPageComponent,
    ThreadComponent,
    UserInfoComponent,
    AddChannelDialogComponent,
    AuthenticationComponent,
    UserWindowComponent,
    OtherUserInfoComponent,
    AddChatDialogComponent,
    MobilComponent,
    SidebarComponent,
    FooterComponent,
    ImprintComponent,
    LoadingCircleComponent,
    ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatMenuModule,
    MatCardModule,
    MatSidenavModule,
    SwiperModule,
    MatExpansionModule,
    EditorModule,
    MatDialogModule,
    MatDividerModule,
    MatTooltipModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireDatabaseModule,
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
