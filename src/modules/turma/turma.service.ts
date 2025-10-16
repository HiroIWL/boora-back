import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Turma } from '@prisma/client';
import { TurmaDto } from './turma.dto';

@Injectable()
export class TurmaService {
    constructor(private readonly prismaService: PrismaService) {}

    async popularTurmas() {
        //Método para criar turmas default para o app, já que por enquanto não existe uma tela de criação de turma.
        const turmasExistentes = await this.prismaService.turma.findMany();

        const turmasPadrao = [
            '5º Ano',
            '6º Ano',
            '7º Ano',
            '8º Ano',
            '9º Ano',
            '1ª Série',
            '2ª Série',
            '3ª Série',
        ];

        const turmasParaCriar: Prisma.TurmaCreateInput[] = turmasPadrao
            .filter((turma) => !turmasExistentes.find((t) => t.nome === turma))
            .map((nome) => ({ nome }) as Prisma.TurmaCreateInput);

        await this.prismaService.turma.createMany({ data: turmasParaCriar });
    }

    async criarTurma(turma: TurmaDto) {
        this.prismaService.turma.create({
            data: turma.toPrismaCreate(),
        });
    }

    async listarTurmas() {
        const turmas = await this.prismaService.turma.findMany();

        return turmas.map((turma) => TurmaDto.fromPrisma(turma));
    }

    async listarTurmaPorId(id: string) {
        const turma = await this.prismaService.turma.findFirst({
            where: { id },
        });

        if (!turma) {
            throw new NotFoundException('turma não encontrada.');
        }

        return TurmaDto.fromPrisma(turma);
    }
}
