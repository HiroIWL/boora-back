import { Module } from '@nestjs/common';
import { UsuarioModule } from './modules/usuario/usuario.module';
import { TurmaModule } from './modules/turma/turma.module';
import { DesafioModule } from './modules/desafio/desafio.module';
import { EntregaModule } from './modules/entrega/entrega.module';
import { RankingModule } from './modules/ranking/ranking.module';

@Module({
    imports: [
        UsuarioModule,
        TurmaModule,
        DesafioModule,
        EntregaModule,
        RankingModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
