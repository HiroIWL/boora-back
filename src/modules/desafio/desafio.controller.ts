import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Req,
    Request,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiBody,
    ApiOperation,
    ApiResponse,
    ApiTags,
    OmitType,
} from '@nestjs/swagger';
import { Desafio, DesafioTurma, TipoUsuario } from '@prisma/client';
import { Roles } from '../../auth/roles.decorator';
import { RolesGuard } from '../../auth/roles.guard';
import { DesafioService } from '../../modules/desafio/desafio.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { type AuthenticatedRequest } from '../../auth/authenticated-request.interface';
import { DesafioDto } from '../../modules/desafio/desafio.dto';
import { DesafioTurmaDto } from './desafio-turma.dto';

class VincularTurma {
    public data_desafio: string;
    public turmas: string[];
}

@Controller('desafios')
@ApiTags('desafios')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class DesafioController {
    constructor(private readonly desafioService: DesafioService) {}

    @Get()
    @ApiOperation({ summary: 'Lista os desafios para o professor online' })
    @ApiResponse({
        status: 200,
        description: 'Executado com sucesso.',
        type: [DesafioDto],
    })
    async get(@Req() { user }: AuthenticatedRequest) {
        return await this.desafioService.desafios(user.id, user.role);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Retorna um desafio de acordo com o ID' })
    @ApiResponse({
        status: 200,
        description: 'Desafio enconrtrado com sucessos.',
        type: DesafioDto,
    })
    async getId(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
        const { user } = req;

        return this.desafioService.desafioPorId(id, user.id, user.role);
    }

    @Post()
    @ApiOperation({ summary: 'Cria um desafio' })
    @ApiResponse({
        status: 201,
        description: 'Retorna o desafio criado.',
        type: DesafioDto,
    })
    @Roles(TipoUsuario.PROFESSOR)
    async post(@Body() dto: DesafioDto, @Request() req: AuthenticatedRequest) {
        const { user } = req;

        return this.desafioService.criarDesafio(dto, user.id);
    }

    @Post(':id/turmas')
    @ApiOperation({
        summary: 'Atribui um desafio para as turmas na requisição',
    })
    @ApiResponse({
        status: 201,
        description: 'Sucesso ao atribuir turmas.',
        type: [DesafioTurmaDto],
    })
    @ApiBody({
        type: VincularTurma,
    })
    @Roles(TipoUsuario.PROFESSOR)
    async atribuirTurmas(@Body() dto: VincularTurma, @Param('id') id: string) {
        return this.desafioService.atribuirTurmas(
            id,
            dto.turmas.map((t) =>
                DesafioTurmaDto.fromPrisma({
                    id_desafio: id,
                    id_turma: t,
                } as DesafioTurma),
            ),
            dto.data_desafio,
        );
    }
}
