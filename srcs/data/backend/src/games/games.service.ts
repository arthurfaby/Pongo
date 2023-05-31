import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { GamesDto } from './dto/games.dto';
import { GameCategory } from './game.entity';

@Injectable()
export class GamesService {
    constructor(
        @InjectRepository(GameCategory)
        private readonly gamesRepository: Repository<GameCategory>,
    ){}

    create(game: GameCategory){
        return this.gamesRepository.insert(game);
    }

    findAll(): Promise<GameCategory[]>{
        return this.gamesRepository.find();
    }

    findOneByGameId(game_id: number): Promise<GameCategory>{
        return this.gamesRepository
            .createQueryBuilder("game")
            .where("id = :id", { id: game_id})
            .getOne();
    }

    async findByUserId(user_id: number): Promise<GameCategory[]>{
        return await this.gamesRepository
            .createQueryBuilder("game")
            .where("player1_id= :player1_id", { player1_id: user_id })
            .orWhere("player2_id= :player2_id", { player2_id: user_id })
            .getMany();
    }

    update(gamesDto: GamesDto){
        return this.gamesRepository.save(gamesDto);
    }

    async remove(game_id: number): Promise<void> {
        await this.gamesRepository.delete(game_id);
    }
}
