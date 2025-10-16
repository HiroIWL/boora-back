import { IsString } from 'class-validator';
import { BaseDto } from '../../dtos/base.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Desafio, DesafioTurma, Prisma, Turma } from '@prisma/client';
import { DesafioDto } from './desafio.dto';
import { TurmaDto } from '../turma/turma.dto';

export class DesafioTurmaDto extends BaseDto {
    @IsString()
    @ApiProperty({
        name: 'id_turma',
        description: 'Id Turma',
        type: 'string',
    })
    id_turma: string;

    @IsString()
    @ApiProperty({
        name: 'id_desafio',
        description: 'Id Desafio',
        type: 'string',
    })
    id_desafio: string;

    desafio: DesafioDto;
    turma: TurmaDto;

    constructor(data?: Partial<DesafioTurmaDto>) {
        super(data);
        if (data) {
            if (data.id_turma !== undefined) this.id_turma = data.id_turma;
            if (data.id_desafio !== undefined)
                this.id_desafio = data.id_desafio;

            if (data.desafio !== undefined)
                this.desafio = new DesafioDto(data.desafio);

            if (data.turma !== undefined) this.turma = new TurmaDto(data.turma);
        }
    }

    public static fromPrisma(prismaObj: DesafioTurma) {
        const { turma, desafio } = prismaObj as unknown as {
            turma: Turma;
            desafio: Desafio;
        };

        return new DesafioTurmaDto({
            id: prismaObj.id,
            id_desafio: prismaObj.id_desafio,
            id_turma: prismaObj.id_turma,
            turma: turma ? TurmaDto.fromPrisma(turma) : undefined,
            desafio: desafio ? DesafioDto.fromPrisma(desafio) : undefined,
        });
    }

    public toPrismaCreate(): Prisma.DesafioTurmaCreateInput {
        return {
            turma: {
                connect: {
                    id: this.id_turma,
                },
            },

            desafio: {
                connect: {
                    id: this.id_desafio,
                },
            },
        };
    }
}
