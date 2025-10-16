import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsuarioService } from 'src/modules/usuario/usuario.service';
import { UsuarioDto } from './usuario.dto';

@Controller('alunos')
@ApiTags('alunos')
export class AlunosController {
    constructor(private readonly usuarioService: UsuarioService) {}

    @Get()
    @ApiOperation({ summary: 'Listar Usuários' })
    @ApiResponse({
        status: 200,
        description: 'Usuários retornados com sucesso',
    })
    async listarAlunos() {
        return this.usuarioService.listarAlunos();
    }
}
