import { Component, OnInit } from '@angular/core';
import { Player } from '../create-player/createplayer.model';
import { TicService } from '../tictactoe.service';

@Component({
  selector: 'app-tictactoe',
  templateUrl: './tictactoe.component.html',
  styleUrls: ['./tictactoe.component.css'],
})
export class TictactoeComponent implements OnInit {
  players: Player[];
  activeply: boolean = true;
  gameActive: boolean;
  cells = [];
  activePlayer = '';
  playerXwinner: boolean;
  playerOwinner: boolean;
  constructor(private ticService: TicService) {}

  ngOnInit() {
    this.players = this.ticService.playersInGame;
    this.cells = this.ticService.cells;
    this.gameActive = this.ticService.gameActive;
    this.ticService.activePlyEmitter.subscribe(
      (actplay: boolean) => (this.activeply = actplay)
    );
    this.activePlayer = this.ticService.player1;

    this.ticService.playerWinnerEmitter.subscribe(
      (xwinner: boolean) => (this.playerXwinner = xwinner)
    );
    this.ticService.playerOwinnerEmitter.subscribe(
      (owinner: boolean) => (this.playerOwinner = owinner)
    );
    this.ticService.cellsEmitter.subscribe((cells: string[]) => {
      this.cells = cells;
    });
    this.ticService.gameActiveEmiiter.subscribe(
      (gameactive: boolean) => (this.gameActive = gameactive)
    );
  }

  handelCellClick(cell: number) {
    this.ticService.handelCLicks(cell);
  }

  resetGame() {
    this.ticService.resetCells();
  }
}
