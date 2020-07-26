import { Component, OnInit } from '@angular/core';
import { TicService } from '../tictactoe.service';
import { Player } from '../create-player/createplayer.model';

@Component({
  selector: 'app-player-list',
  templateUrl: './player-list.component.html',
  styleUrls: ['./player-list.component.css'],
})
export class PlayerListComponent implements OnInit {
  errorMessage: string;
  playersAdd: Player[];
  numberofplayers: number = null;

  constructor(private ticService: TicService) {}

  ngOnInit() {
    this.ticService.createBoard();
    this.numberofplayers = this.ticService.players;

    this.ticService.errorMsgEmitter.subscribe((error: string) => {
      this.errorMessage = error;
    });

    this.ticService.listofboards();
    this.playersAdd = this.ticService.playersInGame;
    this.ticService.playerInTheGameEmitter.subscribe((playerAdd: Player[]) => {
      this.playersAdd = playerAdd;
    });
  }

  removePlayerFromBoardList(index: number) {
    this.ticService.removePlyerfromRoom(index);
    this.ticService.listofboards();
  }
}
