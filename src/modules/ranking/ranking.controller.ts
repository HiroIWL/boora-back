import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { TipoUsuario } from '@prisma/client';
import { RankingService } from './ranking.service';
import { RankingDto } from './ranking.dto';
import type { AuthenticatedRequest } from 'src/auth/authenticated-request.interface';
import { RankingAlunoDto } from './ranking-aluno.dto';

@Controller('ranking')
@ApiTags('ranking')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class RankingController {
    constructor(private readonly rankingService: RankingService) {}

    @Get()
    @Roles(TipoUsuario.PROFESSOR, TipoUsuario.ALUNO)
    @ApiOperation({
        summary: 'Obtém o ranking das turmas por desempenho médio',
    })
    @ApiResponse({
        status: 200,
        description: 'Ranking calculado com sucesso',
        type: [RankingDto],
    })
    async getRanking() {
        return this.rankingService.calcularRanking();
    }

    @Get('/alunos')
    @Roles(TipoUsuario.PROFESSOR, TipoUsuario.ALUNO)
    @ApiOperation({
        summary: 'Obtém o ranking das turmas por desempenho médio',
    })
    @ApiResponse({
        status: 200,
        description: 'Ranking calculado com sucesso',
        type: [RankingAlunoDto],
    })
    async getRankingIndividual(@Request() req: AuthenticatedRequest) {
        const { user } = req;

        if (!user.turma?.id) {
            return [];
        }

        return this.rankingService.rankingIndividual(user.turma.id);
    }
}
