import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutPageComponent } from './about-page/about-page.component';
import { HomePageComponent } from './home-page/home-page.component';
import { PlayPageComponent } from './play-page/play-page.component';
import { ChatComponent } from './chat/chat.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { LogoutComponent } from './logout/logout.component';
import { ReloadComponent } from './reload/reload.component';
import { ProfileComponent } from './profile/profile.component';
import { IsSignedInGuard } from './is-signed-in.guard';
import { ToastrService } from 'ngx-toastr';
import { ProfilesPageComponent } from './profiles-page/profiles-page.component';
import { SingleProfileComponent } from './single-profile/single-profile.component';
import { FriendRequestsComponent } from './friend-requests/friend-requests.component';
import { RankingComponent } from './ranking/ranking.component';
import { GameHistoryComponent } from './game-history/game-history.component';
import { DoubleAuthComponent } from './double-auth/double-auth.component';

const routes: Routes = [
  {
    path: 'home',
    component: HomePageComponent
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [IsSignedInGuard],
  },
  {
    path: 'single-profile/:username',
    component: SingleProfileComponent,
    canActivate: [IsSignedInGuard],
  },
  {
    path: 'profiles',
    component: ProfilesPageComponent,
    canActivate: [IsSignedInGuard],
  },
  {
    path: 'about',
    component: AboutPageComponent,
    canActivate: [IsSignedInGuard],
  },
  {
    path: 'play',
    component: PlayPageComponent,
    canActivate: [IsSignedInGuard],
  },
  {
    path: 'chat',
    component: ChatComponent,
    canActivate: [IsSignedInGuard]
  },
  {
    path: 'chat/:activeChan',
    component: ChatComponent,
    canActivate: [IsSignedInGuard]
  },
  {
    path: 'profile/friend-requests',
    component: FriendRequestsComponent,
    canActivate: [IsSignedInGuard],
  },
  {
    path: 'logout',
    component: LogoutComponent
  },
  {
    path: 'reload',
    component: ReloadComponent
  },
  {
    path: 'login',
    component: LoginPageComponent
  },
  {
    path: 'ranking',
    component: RankingComponent,
    canActivate: [IsSignedInGuard],
  },
  {
    path: 'history',
    component: GameHistoryComponent,
    canActivate: [IsSignedInGuard],
  },
  {
    path: 'doubleAuth',
    component: DoubleAuthComponent
  },
  {
    path: '**',
    redirectTo: 'home'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
