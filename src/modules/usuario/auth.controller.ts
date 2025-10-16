import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import {
    ApiBody,
    ApiExtraModels,
    ApiOperation,
    ApiProperty,
    ApiResponse,
    ApiTags,
    OmitType,
} from '@nestjs/swagger';
import { UsuarioService } from '../../modules/usuario/usuario.service';
import { UsuarioDto } from './usuario.dto';

class LoginForm {
    @ApiProperty({ name: 'registro_academico', type: 'string' })
    registro_academico: string;
    @ApiProperty({ name: 'senha', type: 'string' })
    senha: string;
}

class RegisterDTO extends OmitType(UsuarioDto, ['id']) {}

@Controller('auth')
@ApiTags('auth')
@ApiExtraModels(OmitType)
export class AuthController {
    constructor(private readonly usuarioService: UsuarioService) {}

    @Post('login')
    @ApiOperation({ summary: 'Realiza Login' })
    @ApiBody({ type: LoginForm })
    @ApiResponse({ status: 200, description: 'Usuário logado com sucesso' })
    @ApiResponse({
        status: 400,
        description: 'Registro Academico ou Senha inválidos',
    })
    async login(@Body() { registro_academico, senha }: LoginForm) {
        return this.usuarioService.efetuarLogin(registro_academico, senha);
    }

    @Post('register')
    @ApiOperation({ summary: 'Criar Usuário' })
    @ApiBody({ type: RegisterDTO })
    @ApiResponse({ status: 201, description: 'Usuário criado com sucesso!' })
    @HttpCode(201)
    async criarUsuario(@Body() usuario: UsuarioDto): Promise<UsuarioDto> {
        return this.usuarioService.criarUsuario(usuario);
    }
}
