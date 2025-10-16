import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { RankingService } from './ranking.service';
import { RankingController } from './ranking.controller';

@Module({
    imports: [PrismaModule],
    providers: [RankingService],
    controllers: [RankingController],
})
export class RankingModule {}
