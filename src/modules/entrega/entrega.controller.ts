import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Put,
    Request,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { EntregaService } from './entrega.service';
import { EntregaDto } from './entrega.dto';
import { Roles } from '../../auth/roles.decorator';
import { RolesGuard } from '../../auth/roles.guard';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { TipoUsuario } from '../../enums/tipo_usuario.enum';
import type { AuthenticatedRequest } from '../../auth/authenticated-request.interface';

@Controller('entregas')
@ApiTags('entregas')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class EntregaController {
    constructor(private readonly entregaService: EntregaService) {}

    @Post()
    @Roles(TipoUsuario.ALUNO)
    @ApiOperation({ summary: 'Cria uma entrega de desafio (aluno)' })
    @ApiResponse({ status: 201, type: EntregaDto })
    async criar(
        @Body() body: { video_url: string; id_desafio: string },
        @Request() req: AuthenticatedRequest,
    ) {
        const { user } = req;
        return this.entregaService.criarEntrega(
            body.id_desafio,
            body.video_url,
            user.id,
        );
    }

    @Get()
    @Roles(TipoUsuario.PROFESSOR, TipoUsuario.ALUNO)
    @ApiOperation({ summary: 'Lista todas as entregas do professor' })
    @ApiResponse({ status: 200, type: [EntregaDto] })
    async listar(@Request() req: AuthenticatedRequest) {
        const { user } = req;
        return this.entregaService.listarEntregas(user.id, user.role);
    }

    @Get(':id')
    @Roles(TipoUsuario.PROFESSOR)
    @ApiOperation({ summary: 'Obtém uma entrega específica' })
    @ApiResponse({ status: 200, type: EntregaDto })
    async obter(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
        const { user } = req;
        return this.entregaService.entregaPorId(id, user.id, user.role);
    }

    @Put(':id/avaliar')
    @Roles(TipoUsuario.PROFESSOR)
    @ApiOperation({ summary: 'Atribui nota a uma entrega (professor)' })
    @ApiResponse({ status: 200, type: EntregaDto })
    async avaliar(
        @Param('id') id: string,
        @Body('nota') nota: number,
        @Request() req: AuthenticatedRequest,
    ) {
        const { user } = req;
        return this.entregaService.avaliarEntrega(id, nota, user.id);
    }
}
