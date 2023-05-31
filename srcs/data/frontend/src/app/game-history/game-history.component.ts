import { Component } from '@angular/core';
import { GameHistoryService } from './game-history.service';
import { GameHistoryInterface } from '../interfaces/gameHistory.interface';
import { UserInterface } from '../interfaces/profiles.interface';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

class UserHistory {
  constructor(
    public game: GameHistoryInterface,
    public user1: string,
    public user2: string
  ) {}
}

@Component({
  selector: 'app-game-history',
  templateUrl: './game-history.component.html',
  styleUrls: ['./game-history.component.scss'],
})
export class GameHistoryComponent {
  gameHistory!: GameHistoryInterface[];
  all_users!: UserInterface[];
  userHistory!: UserHistory[];

  constructor(
    private gameHistoryService: GameHistoryService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.gameHistory = [];
    this.all_users = [];
    this.userHistory = [];
    let id = this.route.snapshot.queryParamMap.get('id');
    if (!id) return;

    this.gameHistoryService.getHistory(Number(id)).subscribe((games) => {
      if (!games) return;
      this.gameHistory = games;
      this.gameHistoryService.getUsers().subscribe((users) => {
        this.all_users = users;
        for (let i = 0; i < this.gameHistory.length; i++) {
          this.userHistory.push(
            new UserHistory(
              this.gameHistory[i],
              this.findUsernames(
                this.gameHistory[i].player1_id,
                this.all_users
              ),
              this.findUsernames(this.gameHistory[i].player2_id, this.all_users)
            )
          );
        }
      });
    });
  }

  findUsernames(id: number, users: UserInterface[]): string {
    for (let i = 0; i < users.length; i++) {
      if (users[i].id == id) {
        return users[i].username;
      }
    }
    return 'NaN';
  }
}
