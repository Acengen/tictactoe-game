import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Player } from './create-player/createplayer.model';
import { throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

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
  playersInGame: Player[] = [];

  board = {};
  playerRegist: boolean = false;
  errorMsg: string = '';
  boardId: string;
  players: number;

  /* GAME IS ON */

  player1 = 'X';
  playerXwinner: boolean;
  playerOwinner: boolean;
  activeply: boolean = true;
  gameActive: boolean = true;
  cells = ['', '', '', '', '', '', '', '', ''];

  /* Emitters */

  cellsEmitter = new EventEmitter<string[]>();
  playerRegistEmitter = new EventEmitter<boolean>();
  errorMsgEmitter = new EventEmitter<string>();
  activePlyEmitter = new EventEmitter<boolean>();
  playerWinnerEmitter = new EventEmitter<boolean>();
  playerOwinnerEmitter = new EventEmitter<boolean>();
  playerInTheGameEmitter = new EventEmitter<Player[]>();
  gameActiveEmiiter = new EventEmitter<boolean>();

  /*
   * Registering Candidates on button click.
   * Every time you want to create a new player you need to hit a register button first.
   * This function is used in create-player-component
   */
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

  /*
   * Create a player every time you fill the input field and register a new player.
   * This function is called in form in create-player-component on every submit.
   */
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

  /*
   * This function is called in ngOnInit in a player-list-component -- every time a component initializes.
   * I'm doing this because I want to create a board list with the created api key.
   */
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

  /*
   * This function is also called every time player-list-component initialize.
   * I'm  doing this becouse I wont to know how much players are in the game(I will leave console.log() in this function);
   * In this function im first using player api to create a board, then from that respon I stored how much players are add by using counter++ and board id, and in a subscribe I created a board with id and players, and of course handling errors that i can use them when i did not registered any players.
   */
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
        }, catchError(this.errorHandler))
      )
      .subscribe(
        (resdata) => {
          this.board = { id: this.boardId, players: this.players };
          this.errorMsg = '';
          console.log(this.board);
        },
        (errorRes) => {
          this.errorMsg = errorRes =
            'Register at least 2 players to create board and view tic tac toe page';
          this.errorMsgEmitter.emit(this.errorMsg);
        }
      );
  }

  removePlyerfromRoom(index: number) {
    this.playersInGame.splice(index, 1);
    this.playerInTheGameEmitter.emit(this.playersInGame);
  }

  handelCLicks(cell: number) {
    this.cells[cell] = this.player1;
    this.player1 = this.player1 === 'X' ? 'O' : 'X';
    switch (this.player1) {
      case 'X':
        this.activeply = true;
        break;
      case 'O':
        this.activeply = false;
        break;
    }

    this.winningCase();

    this.activePlyEmitter.emit(this.activeply);
    this.cellsEmitter.emit(this.cells);
  }

  resetCells() {
    this.cells = ['', '', '', '', '', '', '', '', ''];
    this.player1 = 'X';
    this.playerXwinner = false;
    this.playerOwinner = false;
    /*
     * I have created activeply boolean for handling clicks and to add class on html element - with border-bottom when every player change.
     * In this function I put activeply to be true, because when I hit the reset button it will start on a first player and add class with border-bottom.
     */
    this.activeply = true;
    this.gameActive = true;
    this.gameActiveEmiiter.emit(this.gameActive);
    this.activePlyEmitter.emit(this.activeply);
    this.playerWinnerEmitter.emit(this.playerXwinner);
    this.playerOwinnerEmitter.emit(this.playerOwinner);
    this.cellsEmitter.emit(this.cells);
  }

  /* Private functions */
  /*
   * Error was handled by using a private function. And this error is handled in pipe tap operator - catch error with throw error.
   */
  private errorHandler(errorRes: HttpErrorResponse) {
    let errormsg = 'Unknown error';

    if (errorRes.error) {
      throwError(errormsg);
    }
    if (errorRes.error === 'Missing apikey') {
      errormsg =
        'Register at least 2 players to create board and view tic tac toe page';
    }

    return throwError(errormsg);
  }

  /*
   * This code is kind a messy one, and im sorry for that...
   */
  private winningCase() {
    this.gameActive = true;

    if (
      this.cells[0] === 'X' &&
      this.cells[1] === 'X' &&
      this.cells[2] === 'X'
    ) {
      this.playerXwinner = true;
    }
    if (
      this.cells[3] === 'X' &&
      this.cells[4] === 'X' &&
      this.cells[5] === 'X'
    ) {
      this.playerXwinner = true;
    }
    if (
      this.cells[6] === 'X' &&
      this.cells[7] === 'X' &&
      this.cells[8] === 'X'
    ) {
      this.playerXwinner = true;
    }
    if (
      this.cells[0] === 'X' &&
      this.cells[3] === 'X' &&
      this.cells[6] === 'X'
    ) {
      this.playerXwinner = true;
    }
    if (
      this.cells[1] === 'X' &&
      this.cells[4] === 'X' &&
      this.cells[7] === 'X'
    ) {
      this.playerXwinner = true;
    }
    if (
      this.cells[2] === 'X' &&
      this.cells[5] === 'X' &&
      this.cells[8] === 'X'
    ) {
      this.playerXwinner = true;
    }
    if (
      this.cells[0] === 'X' &&
      this.cells[4] === 'X' &&
      this.cells[8] === 'X'
    ) {
      this.playerXwinner = true;
    }

    if (
      this.cells[2] === 'X' &&
      this.cells[4] === 'X' &&
      this.cells[6] === 'X'
    ) {
      this.playerXwinner = true;
    }
    this.playerWinnerEmitter.emit(this.playerXwinner);
    /*---------------------------------- O player ---------------------*/
    /* ------------------------------------------------------------------ */
    /* ------------------------------------------------------------------ */
    /* ------------------------------------------------------------------ */
    /* ------------------------------------------------------------------ */
    if (
      this.cells[0] === 'O' &&
      this.cells[1] === 'O' &&
      this.cells[2] === 'O'
    ) {
      this.playerOwinner = true;
    }
    if (
      this.cells[3] === 'O' &&
      this.cells[4] === 'O' &&
      this.cells[5] === 'O'
    ) {
      this.playerOwinner = true;
    }
    if (
      this.cells[6] === 'O' &&
      this.cells[7] === 'O' &&
      this.cells[8] === 'O'
    ) {
      this.playerOwinner = true;
    }
    if (
      this.cells[0] === 'O' &&
      this.cells[3] === 'O' &&
      this.cells[6] === 'O'
    ) {
      this.playerOwinner = true;
    }
    if (
      this.cells[1] === 'O' &&
      this.cells[4] === 'O' &&
      this.cells[7] === 'O'
    ) {
      this.playerOwinner = true;
    }
    if (
      this.cells[2] === 'O' &&
      this.cells[5] === 'O' &&
      this.cells[8] === 'O'
    ) {
      this.playerOwinner = true;
    }
    if (
      this.cells[0] === 'O' &&
      this.cells[4] === 'O' &&
      this.cells[8] === 'O'
    ) {
      this.playerOwinner = true;
    }
    if (
      this.cells[0] === 'O' &&
      this.cells[4] === 'O' &&
      this.cells[6] === 'O'
    ) {
      this.playerOwinner = true;
    }
    if (
      this.cells[2] === 'O' &&
      this.cells[4] === 'O' &&
      this.cells[6] === 'O'
    ) {
      this.playerOwinner = true;
    }
    this.handledraw();
    this.playerOwinnerEmitter.emit(this.playerOwinner);
  }

  /*
   *This function is called every time if a round is draw.
   */
  private handledraw() {
    let roundDraw = !this.cells.includes('');
    if (roundDraw) {
      this.gameActive = false;
      this.gameActiveEmiiter.emit(this.gameActive);
      return;
    }
  }
  constructor(private http: HttpClient) {}
}
