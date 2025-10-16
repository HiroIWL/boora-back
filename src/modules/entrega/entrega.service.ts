import {
    Injectable,
    ForbiddenException,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EntregaDto } from './entrega.dto';
import { TipoUsuario } from 'src/enums/tipo_usuario.enum';
import { connect } from 'http2';

@Injectable()
export class EntregaService {
    constructor(private readonly prisma: PrismaService) {}

    async criarEntrega(idDesafio: string, videoUrl: string, idAluno: string) {
        const entrega = await this.prisma.entrega.create({
            data: {
                desafio: {
                    connect: {
                        id: idDesafio,
                    },
                },
                aluno: {
                    connect: {
                        id: idAluno,
                    },
                },
                video_url: videoUrl,
            },
        });

        return EntregaDto.fromPrisma(entrega);
    }

    async listarEntregas(idUsuario: string, tipo: string) {
        if (tipo === TipoUsuario.PROFESSOR) {
            const entregas = await this.prisma.entrega.findMany({
                where: {
                    desafio: {
                        id_usuario_professor: idUsuario,
                    },
                },
                include: {
                    desafio: true,
                    aluno: {
                        include: {
                            turma: true,
                        },
                    },
                },
            });

            return entregas.map(EntregaDto.fromPrisma);
        }

        const entregasAluno = await this.prisma.entrega.findMany({
            where: {
                id_usuario_aluno: idUsuario,
            },
        });

        return entregasAluno.map(EntregaDto.fromPrisma);
    }

    async entregaPorId(id: string, idUsuario: string, tipo: string) {
        const entrega = await this.prisma.entrega.findUnique({
            where: { id },
            include: { desafio: true, aluno: true },
        });
        if (!entrega) throw new NotFoundException('Entrega não encontrada.');

        if (
            tipo === TipoUsuario.PROFESSOR &&
            entrega.desafio.id_usuario_professor !== idUsuario
        ) {
            throw new ForbiddenException('Sem permissão.');
        }

        return EntregaDto.fromPrisma(entrega);
    }

    async avaliarEntrega(id: string, nota: number, idProfessor: string) {
        const entrega = await this.prisma.entrega.findUnique({
            where: { id },
            include: { desafio: true },
        });

        if (!entrega) throw new NotFoundException('Entrega não encontrada.');
        if (entrega.desafio.id_usuario_professor !== idProfessor)
            throw new ForbiddenException('Sem permissão.');

        const atualizada = await this.prisma.entrega.update({
            where: { id },
            data: { nota },
            include: { desafio: true, aluno: true },
        });

        return EntregaDto.fromPrisma(atualizada);
    }
}
