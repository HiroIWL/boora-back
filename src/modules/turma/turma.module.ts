import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { TurmaService } from './turma.service';
import { TurmaController } from './turma.controller';

@Module({
    imports: [PrismaModule],
    providers: [TurmaService],
    exports: [],
    controllers: [TurmaController],
})
export class TurmaModule {}
