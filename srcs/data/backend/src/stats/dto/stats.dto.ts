export class StatsDto {
    constructor(user_id: number) {
        this.user_id = user_id;
        this.wins = 0;
        this.losses = 0;
    }
    id: number;
    user_id: number;
    wins: number;
    losses: number;
}