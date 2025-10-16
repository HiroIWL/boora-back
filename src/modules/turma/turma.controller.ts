import { Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TurmaService } from 'src/modules/turma/turma.service';
import { TurmaDto } from './turma.dto';

@Controller('turmas')
@ApiTags('turmas')
export class TurmaController {
    constructor(private readonly turmaService: TurmaService) {}

    @Post('default')
    @ApiOperation({ summary: 'Cria turmas padrão para a aplicação' })
    @ApiResponse({ status: 204, description: 'Executado com sucesso.' })
    @HttpCode(204)
    async criar() {
        await this.turmaService.popularTurmas();
    }

    @Get()
    @ApiOperation({ summary: 'Retorna todas as turmas.' })
    @ApiResponse({
        status: 200,
        description: 'Turmas retornadas com sucesso.',
        type: [TurmaDto],
    })
    async getTurmas(): Promise<TurmaDto[]> {
        return this.turmaService.listarTurmas();
    }

    @Get(':id')
    @ApiParam({
        name: 'id',
        type: 'string',
        description: 'Id da turma.',
    })
    @ApiOperation({ summary: 'Retorna os dados de uma turma específica' })
    @ApiResponse({
        status: 200,
        description: 'Turma retornada com sucesos.',
        type: TurmaDto,
    })
    @ApiResponse({ status: 404, description: 'Turma não encontrata. ' })
    async getTurmaPorId(@Param('id') id: string): Promise<TurmaDto> {
        return this.turmaService.listarTurmaPorId(id);
    }
}
