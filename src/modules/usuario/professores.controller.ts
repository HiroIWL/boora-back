import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsuarioService } from '../../modules/usuario/usuario.service';
import { UsuarioDto } from './usuario.dto';

@Controller('professores')
@ApiTags('professores')
export class ProfessoresController {
    constructor(private readonly usuarioService: UsuarioService) {}

    // @Get()
    // @ApiOperation({ summary: 'Criar Professor' })
    // @ApiBody({ type: UsuarioDto })
    // @ApiResponse({ status: 201, description: 'Professor criado com sucesso' })
    // @HttpCode(201)
    // async criarProfessor(@Body() usuario: UsuarioDto): Promise<UsuarioDto> {
    //     return this.usuarioService.listarAlunos();
    // }
}
