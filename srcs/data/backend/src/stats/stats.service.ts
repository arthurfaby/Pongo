import { Injectable } from '@nestjs/common';
import { StatsDto } from './dto/stats.dto';
import { StatCategory } from './stat.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class StatsService {
    constructor(
        @InjectRepository(StatCategory)
        private readonly statsRepository: Repository<StatCategory>,
    ){} 

    create(stat: StatsDto){
        return this.statsRepository.insert(stat);
    }

    findAll(): Promise<StatCategory[]>{
        return this.statsRepository.find();
    }

    findOneByUserId(user_id: number): Promise<StatCategory | null>{
        return this.statsRepository
            .createQueryBuilder("stat")
            .where("user_id = :id", { id: user_id })
            .getOne();
    }

    update(statsDto: StatsDto){
        return this.statsRepository.save(statsDto);
    }

    async remove(user_id: number): Promise<void> {
        await this.statsRepository.delete(user_id);
    }
}
