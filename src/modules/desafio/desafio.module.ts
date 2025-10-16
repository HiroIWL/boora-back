import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { DesafioService } from './desafio.service';
import { DesafioController } from './desafio.controller';

@Module({
    imports: [PrismaModule],
    providers: [DesafioService],
    exports: [],
    controllers: [DesafioController],
})
export class DesafioModule {}
