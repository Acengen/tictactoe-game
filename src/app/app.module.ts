import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { CreatePlayerComponent } from './create-player/create-player.component';
import { PlayerListComponent } from './player-list/player-list.component';
import { TictactoeComponent } from './tictactoe/tictactoe.component';
import { TicService } from './tictactoe.service';
import { NavbarComponent } from './navbar/navbar.component';
import { TicTacToeGuard } from './guards/tictactoeGuard.guard';
import { LoadingPageComponent } from './loading-page/loading-page.component';

/*
 * Redirect a path("") to (/create-player) whenever you visit a home page of an application.
 */
const appRoute: Routes = [
  { path: '', redirectTo: '/create-player', pathMatch: 'full' },
  { path: 'create-player', component: CreatePlayerComponent },
  { path: 'player-list', component: PlayerListComponent },
  {
    path: 'tic-tac-toe',
    component: TictactoeComponent,
    canActivate: [TicTacToeGuard],
  },
];
@NgModule({
  declarations: [
    AppComponent,
    CreatePlayerComponent,
    PlayerListComponent,
    TictactoeComponent,
    NavbarComponent,
    LoadingPageComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(appRoute),
    HttpClientModule,
  ],
  providers: [TicService, TicTacToeGuard],
  bootstrap: [AppComponent],
})
export class AppModule {}
