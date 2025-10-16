import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { EntregaController } from './entrega.controller';
import { EntregaService } from './entrega.service';

@Module({
    imports: [PrismaModule],
    controllers: [EntregaController],
    providers: [EntregaService],
})
export class EntregaModule {}
