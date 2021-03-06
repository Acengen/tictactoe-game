import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TicService } from '../tictactoe.service';
import { Player } from './createplayer.model';

@Component({
  selector: 'app-create-player',
  templateUrl: './create-player.component.html',
  styleUrls: ['./create-player.component.css'],
})
export class CreatePlayerComponent implements OnInit {
  plyRegist: boolean;
  players: Player[] = [];

  constructor(private ticService: TicService) {}

  ngOnInit(): void {
    this.ticService.playerRegistEmitter.subscribe((plyReg: boolean) => {
      this.plyRegist = plyReg;
    });
    this.players = this.ticService.playersInGame;
  }

  onSubmit(form: NgForm) {
    const candidate = form.value.candidate.toUpperCase();
    this.ticService.createPlayer(candidate);
    form.reset();
  }

  reqister() {
    this.ticService.registerCandidate();
  }
}
