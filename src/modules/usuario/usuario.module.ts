import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { UsuarioService } from './usuario.service';
import { AuthModule } from 'src/auth/auth.module';
import { AuthController } from './auth.controller';
import { AlunosController } from './alunos.controller';
import { ProfessoresController } from './professores.controller';

@Module({
    imports: [PrismaModule, AuthModule],
    providers: [UsuarioService],
    exports: [],
    controllers: [AuthController, AlunosController, ProfessoresController],
})
export class UsuarioModule {}
