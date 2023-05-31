import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  HttpClient,
  HttpClientModule,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { ProfileComponent } from './profile/profile.component';
import { HomePageComponent } from './home-page/home-page.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { AboutPageComponent } from './about-page/about-page.component';
import { PlayPageComponent } from './play-page/play-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { ProfilesPageComponent } from './profiles-page/profiles-page.component';
import { GameComponent } from './game/game.component';
import { ChatComponent } from './chat/chat.component';
import {
  SocialLoginModule,
} from '@abacritt/angularx-social-login';
import { ProfileService } from './profile/profile.service';
import { IsSignedInGuard } from './is-signed-in.guard';
import { ToastrModule } from 'ngx-toastr';
import { ProfilesService } from './profiles-page/profiles.service';
import { SingleProfileComponent } from './single-profile/single-profile.component';
import { FriendRequestsComponent } from './friend-requests/friend-requests.component';
import { RankingComponent } from './ranking/ranking.component';
import { GameHistoryComponent } from './game-history/game-history.component';
import { registerLocaleData } from '@angular/common';
import * as fr from '@angular/common/locales/fr';
import { DoubleAuthComponent } from './double-auth/double-auth.component';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
  declarations: [
    AppComponent,
    ProfileComponent,
    HomePageComponent,
    NavBarComponent,
    AboutPageComponent,
    PlayPageComponent,
    LoginPageComponent,
    ProfilesPageComponent,
    GameComponent,
    ChatComponent,
    SingleProfileComponent,
    FriendRequestsComponent,
    RankingComponent,
    GameHistoryComponent,
    DoubleAuthComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    SocialLoginModule,
    BrowserAnimationsModule,
    FormsModule,
    ToastrModule.forRoot(),
    MatFormFieldModule,
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'fr-FR' },
    HttpClient,
    ProfileService,
    ProfilesService,
    IsSignedInGuard,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor() {
    registerLocaleData(fr.default);
  }
}
