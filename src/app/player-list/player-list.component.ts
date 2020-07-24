import { Component, OnInit } from '@angular/core';
import { TicService } from '../tictactoe.service';
import { Player } from '../create-player/createplayer.model';
import { Board } from './board.model';

@Component({
  selector: 'app-player-list',
  templateUrl: './player-list.component.html',
  styleUrls: ['./player-list.component.css'],
})
export class PlayerListComponent implements OnInit {
  errorMessage: string;
  board: Board[];
  playersAdd: Player[];
  numberofplayers: number = null;

  constructor(private ticService: TicService) {}

  ngOnInit() {
    this.ticService.createBoard();
    this.numberofplayers = this.ticService.players;
    this.ticService.errorMsgEmitter.subscribe((error: string) => {
      this.errorMessage = error;
    });
    this.board = this.ticService.board;
    this.playersAdd = this.ticService.playersInGame;
    console.log(this.playersAdd);
  }

  addBoard() {
    this.ticService.listofboards();
  }
}
