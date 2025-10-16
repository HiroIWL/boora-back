import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Desafio, Prisma, Turma } from '@prisma/client';
import { BaseDto } from '../../dtos/base.dto';
import { DesafioDto } from '../desafio/desafio.dto';

export class TurmaDto extends BaseDto {
    @IsString()
    @ApiProperty({
        name: 'nome',
        description: 'Nome da turma',
        example: 'Turma de Desenvolvimento Web',
        type: 'string',
    })
    nome: string;

    desafios: DesafioDto[];
    constructor(partial: Partial<TurmaDto>) {
        super();
        Object.assign(this, partial);
    }

    public static fromPrisma(prismaObj: Turma) {
        const { desafios } = prismaObj as unknown as { desafios: Desafio[] };

        return new TurmaDto({
            id: prismaObj.id,
            nome: prismaObj.nome,
            desafios: desafios
                ? desafios.map((desafio) => DesafioDto.fromPrisma(desafio))
                : [],
        });
    }

    public toPrismaCreate(): Prisma.TurmaCreateInput {
        return {
            nome: this.nome,
        };
    }

    public toPrismaUpdate(): Prisma.TurmaUpdateInput {
        return {
            nome: this.nome,
        };
    }
}
