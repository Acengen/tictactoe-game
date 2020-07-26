import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { TicService } from '../tictactoe.service';

@Injectable()
export class TicTacToeGuard implements CanActivate {
  constructor(private tsService: TicService, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    router: RouterStateSnapshot
  ): boolean | Promise<boolean> | Observable<boolean> {
    if (this.tsService.playersInGame.length >= 2) {
      return true;
    } else {
      return this.router.navigate(['/player-list']);
    }
  }
}
