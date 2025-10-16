import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RankingDto } from './ranking.dto';
import { Decimal } from '@prisma/client/runtime/library';
import { RankingAlunoDto } from './ranking-aluno.dto';
import { parse } from 'path';

@Injectable()
export class RankingService {
    constructor(private readonly prisma: PrismaService) {}

    async calcularRanking(): Promise<RankingDto[]> {
        const turmas = await this.prisma.turma.findMany({
            select: { id: true, nome: true },
        });

        const ranking: RankingDto[] = [];

        for (const turma of turmas) {
            const desafiosTurma = await this.prisma.desafioTurma.findMany({
                where: { id_turma: turma.id },
                select: { id_desafio: true },
            });

            if (desafiosTurma.length === 0) {
                ranking.push(
                    new RankingDto({
                        id_turma: turma.id,
                        nome_turma: turma.nome,
                        media_desempenho: 0,
                    }),
                );
                continue;
            }

            const idsDesafios = desafiosTurma.map((d) => d.id_desafio);

            const alunos = await this.prisma.usuario.findMany({
                where: { id_turma: turma.id },
                select: { id: true },
            });

            const idsAlunos = alunos.map((a) => a.id);
            if (idsAlunos.length === 0) {
                ranking.push(
                    new RankingDto({
                        id_turma: turma.id,
                        nome_turma: turma.nome,
                        media_desempenho: 0,
                    }),
                );
                continue;
            }

            const entregas = await this.prisma.entrega.findMany({
                where: {
                    id_usuario_aluno: { in: idsAlunos },
                    id_desafio: { in: idsDesafios },
                    nota: { not: null },
                },
                select: { nota: true },
            });

            const notas = entregas.map((e) =>
                (e.nota as unknown as Decimal).toNumber(),
            );

            const media =
                notas.length > 0
                    ? notas.reduce((a, b) => a + b, 0) / notas.length
                    : 0;

            ranking.push(
                new RankingDto({
                    id_turma: turma.id,
                    nome_turma: turma.nome,
                    media_desempenho: parseFloat(media.toFixed(2)),
                }),
            );
        }

        return ranking.sort((a, b) => b.media_desempenho - a.media_desempenho);
    }

    async rankingIndividual(idTurma: string): Promise<RankingAlunoDto[]> {
        const turma = await this.prisma.turma.findUnique({
            where: { id: idTurma },
            select: { id: true, nome: true },
        });

        if (!turma) return [];

        const desafiosTurma = await this.prisma.desafioTurma.findMany({
            where: { id_turma: idTurma },
            select: {
                id_desafio: true,
                desafio: {
                    select: {
                        nota_maxima: true,
                    },
                },
            },
        });

        if (desafiosTurma.length === 0) return [];

        const notaTurma = desafiosTurma.reduce(
            (a, b) => a + b.desafio.nota_maxima.toNumber(),
            0,
        );

        const idsDesafios = desafiosTurma.map((d) => d.id_desafio);

        const alunos = await this.prisma.usuario.findMany({
            where: { id_turma: idTurma },
            select: { id: true, nome: true },
        });

        if (alunos.length === 0) return [];

        const idsAlunos = alunos.map((a) => a.id);

        const entregas = await this.prisma.entrega.findMany({
            where: {
                id_usuario_aluno: { in: idsAlunos },
                id_desafio: { in: idsDesafios },
                nota: { not: null },
            },
            select: { id_usuario_aluno: true, nota: true },
        });

        const ranking = alunos.map((aluno) => {
            const entregasAluno = entregas.filter(
                (e) => e.id_usuario_aluno === aluno.id,
            );

            const notas = entregasAluno.map((e) =>
                e.nota ? (e.nota as unknown as Decimal).toNumber() : 0,
            );

            const notaAluno = notas.reduce((a, b) => a + b, 0);
            return new RankingAlunoDto({
                id_aluno: aluno.id,
                nome_aluno: aluno.nome,
                media_nota: (notaAluno / notaTurma) * 100,
            });
        });

        return ranking.sort((a, b) => b.media_nota - a.media_nota);
    }
}
