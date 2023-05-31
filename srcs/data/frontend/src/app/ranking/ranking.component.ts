import { Component } from '@angular/core';
import { StatsInterface } from '../interfaces/stats.interface';
import { UserInterface } from '../interfaces/profiles.interface';
import { RankingService } from './ranking.service';

class userStats {
  constructor(public stat: StatsInterface, public user: UserInterface) {}
}

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.scss'],
})
export class RankingComponent {
  all_stats!: StatsInterface[];
  all_users!: UserInterface[];
  userStats!: userStats[];

  constructor(private rankingService: RankingService) {}

  ngOnInit() {
    this.all_stats = [];
    this.all_users = [];
    this.userStats = [];
    this.rankingService.getRanking().subscribe((stats) => {
      if (!stats) return;
      this.all_stats = stats;
      this.rankingService.getUsers().subscribe((users) => {
        this.all_users = users;
        for (let i = 0; i < users.length; i++) {
          this.findStat(users[i], stats);
        }
        this.userStats.sort((a, b) => (a.stat.wins < b.stat.wins ? 1 : -1));
      });
    });
  }

  findStat(user: UserInterface, stats: StatsInterface[]) {
    for (let i = 0; i < stats.length; i++) {
      if (user.id == stats[i].user_id) {
        this.userStats.push(new userStats(stats[i], user));
        break;
      }
    }
  }
}
