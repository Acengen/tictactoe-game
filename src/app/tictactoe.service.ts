import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Player } from './create-player/createplayer.model';
import { throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Board } from './player-list/board.model';

interface APIKEYS {
  apikey: string;
}

interface PlayerCreatedRespons {
  id: number;
  name: string;
}

interface BOARDCREATED {
  id: string;
  players: number;
}

@Injectable()
export class TicService {
  playerApiKey: string;
  boardApiKey: string;
  playersInGame: Player[] = [];

  board: Board[] = [];
  playerRegist: boolean = false;
  errorMsg: string = '';
  boardId: string;
  players: number;

  /* GAME IS ON */

  player1 = 'X';
  activeply: boolean = true;
  gameState = ['', '', '', '', '', '', '', '', ''];
  cells = ['', '', '', '', '', '', '', '', ''];

  /* Emitters */

  playerRegistEmitter = new EventEmitter<boolean>();
  errorMsgEmitter = new EventEmitter<string>();
  activePlyEmitter = new EventEmitter<boolean>();

  registerCandidate() {
    this.http
      .post<APIKEYS>('http://178.128.206.150:7000/register_candidate', {})
      .subscribe((resdata) => {
        this.playerApiKey = resdata.apikey;
        if (this.playerApiKey) {
          this.playerRegist = true;
          this.playerRegistEmitter.emit(this.playerRegist);
        }
      });
  }

  createPlayer(player: string) {
    const obj = {
      name: player,
      apikey: this.playerApiKey,
    };
    this.http
      .post<PlayerCreatedRespons>('http://178.128.206.150:7000/player', obj)
      .subscribe((resdata) => {
        this.playersInGame.push({ id: resdata.id, name: resdata.name });
        this.playerRegist = false;
        this.playerRegistEmitter.emit(this.playerRegist);
      });
  }

  createBoard() {
    this.http
      .post('http://178.128.206.150:7000/create_board', {
        apikey: this.playerApiKey,
      })
      .pipe(catchError(this.errorHandler))
      .subscribe(
        (resData) => {
          this.errorMsg = '';
          this.errorMsgEmitter.emit(this.errorMsg);
        },
        (errorRes) => {
          this.errorMsg = errorRes;
          this.errorMsgEmitter.emit(this.errorMsg);
        }
      );
  }

  listofboards() {
    this.http
      .post<BOARDCREATED>('http://178.128.206.150:7000/boards', {
        apikey: this.playerApiKey,
      })
      .pipe(
        tap((resdata) => {
          for (let key in resdata) {
            this.players = resdata[key].players;
            this.boardId = resdata[key].id;
          }
          for (let key in this.playersInGame) {
            if (this.playersInGame[key].id) {
              this.players++;
            }
          }
        })
      )
      .subscribe((resdata) => {
        this.board.push({ id: this.boardId, players: this.players });
      });
  }

  handelCLicks(cell: number) {
    this.cells[cell] = this.player1;
    this.player1 = this.player1 === 'X' ? 'O' : 'X';
    if (this.player1 === 'X') {
      this.activeply = true;
    }

    if (this.player1 === 'O') {
      this.activeply = false;
    }
    this.activePlyEmitter.emit(this.activeply);
  }

  resetCells() {
    for (let key in this.cells) {
      this.cells[key] = '';
      this.activeply = true;
      this.activePlyEmitter.emit(this.activeply);
    }
  }

  constructor(private http: HttpClient) {}

  private errorHandler(errorRes: HttpErrorResponse) {
    let errormsg = 'You need to go back and create at least 2 players';

    if (errorRes.error) {
      throwError(errormsg);
    }

    return throwError(errormsg);
  }
}
