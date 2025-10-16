import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from 'src/auth/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { TipoUsuario } from 'src/enums/tipo_usuario.enum';
import { Prisma } from '@prisma/client';
import { UsuarioDto } from './usuario.dto';

@Injectable()
export class UsuarioService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly jwtService: JwtService,
    ) {}

    async criarUsuario(usuario: UsuarioDto) {
        const salt = await bcrypt.genSalt(12);
        const senhaHash = await bcrypt.hash(usuario.senha, salt);

        usuario.senha = senhaHash;

        const createdUser = await this.prismaService.usuario.create({
            data: usuario.toPrismaCreate(),
        });
        return UsuarioDto.fromPrisma(createdUser);
    }

    async efetuarLogin(registro_academico: string, senha: string) {
        const usuario = await this.prismaService.usuario.findUnique({
            where: {
                codigo_registro: registro_academico,
            },
            include: {
                turma: true,
            },
        });

        if (!usuario) {
            throw new BadRequestException('Usuário não encontrado');
        }

        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida) {
            throw new BadRequestException('Senha inválida');
        }

        const payload: JwtPayload & { sub: string } = {
            sub: usuario.id,
            nome: usuario.nome,
            registro_academico: usuario.codigo_registro,
            role: usuario.tipo,
            turma: usuario.turma,
        } as JwtPayload & { sub: string };

        const access_token = this.jwtService.sign(payload);

        return {
            access_token,
        };
    }

    async listarAlunos() {
        const alunos = await this.prismaService.usuario.findMany({
            where: {
                tipo: TipoUsuario.ALUNO,
            },
        });
    }
}
