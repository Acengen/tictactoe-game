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
  cells = [];
  activePlayer = '';

  constructor(private ticService: TicService) {}

  ngOnInit() {
    this.players = this.ticService.playersInGame;
    this.cells = this.ticService.cells;
    this.ticService.activePlyEmitter.subscribe(
      (actplay: boolean) => (this.activeply = actplay)
    );
    this.activePlayer = this.ticService.player1;
  }

  handelCellClick(cell: number) {
    this.ticService.handelCLicks(cell);
    console.log(this.activeply);
  }

  resetGame() {
    this.ticService.resetCells();
  }
}
