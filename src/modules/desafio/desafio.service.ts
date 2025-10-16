import {
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DesafioDto } from '../../modules/desafio/desafio.dto';
import { DesafioTurmaDto } from './desafio-turma.dto';
import { Prisma } from '@prisma/client';
import { UsuarioDto } from '../usuario/usuario.dto';
import { TipoUsuario } from '../../enums/tipo_usuario.enum';

@Injectable()
export class DesafioService {
    constructor(private readonly prismaService: PrismaService) {}

    async criarDesafio(dto: DesafioDto, idProfessor: string) {
        dto.id_usuario_professor = idProfessor;
        const desafio = await this.prismaService.desafio.create({
            data: dto.toPrismaCreate(),
        });

        if (!desafio) {
            throw new InternalServerErrorException('Falha ao criar desafio.');
        }

        return DesafioDto.fromPrisma(desafio);
    }

    async desafios(idUsuario: string, role: string) {
        if (role == TipoUsuario.ALUNO) {
            const usuario = await this.prismaService.usuario.findFirst({
                where: {
                    id: idUsuario,
                },
            });

            const desafiosAluno = await this.prismaService.desafio.findMany({
                where: {
                    turmas: {
                        some: {
                            id_turma: usuario?.id_turma || '-1',
                        },
                    },
                },
            });

            return desafiosAluno.map(DesafioDto.fromPrisma);
        }

        const desafios = await this.prismaService.desafio.findMany({
            where: {
                id_usuario_professor: idUsuario,
            },
        });

        return desafios.map(DesafioDto.fromPrisma);
    }

    async desafioPorId(idDesafio: string, id_usuario: string, tipo: string) {
        const where =
            tipo == TipoUsuario.PROFESSOR
                ? {
                      id_usuario_professor: id_usuario,
                  }
                : {};
        const desafio = await this.prismaService.desafio.findFirst({
            where: {
                id: idDesafio,
                ...where,
            },
            include: {
                turmas: {
                    include: {
                        turma: true,
                    },
                },
            },
        });

        if (!desafio) {
            throw new NotFoundException('Desafio não encontrado.');
        }

        return DesafioDto.fromPrisma(desafio);
    }

    async atribuirTurmas(
        id_desafio: string,
        turmas: DesafioTurmaDto[],
        data_desafio: string,
    ): Promise<DesafioTurmaDto[]> {
        await this.prismaService.desafioTurma.deleteMany({
            where: {
                id_desafio: id_desafio,
            },
        });

        const resultado =
            await this.prismaService.desafioTurma.createManyAndReturn({
                data: turmas as unknown as Prisma.DesafioTurmaCreateManyInput[],
            });

        const [ano, mes, dia] = data_desafio.split('-');
        await this.prismaService.desafio.updateMany({
            data: {
                data_desafio: new Date(+ano, +mes, +dia, 0, 0, 0),
            },
            where: {
                id: id_desafio,
            },
        });

        return resultado.map((r) => DesafioTurmaDto.fromPrisma(r));
    }
}
