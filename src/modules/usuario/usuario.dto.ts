import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumberString, IsOptional, IsString } from 'class-validator';
import { TipoUsuario } from '../../enums/tipo_usuario.enum';
import { Prisma, Turma, Usuario } from '@prisma/client';
import { BaseDto } from '../../dtos/base.dto';
import { TurmaDto } from '../turma/turma.dto';

export class UsuarioDto extends BaseDto {
    @IsString()
    @ApiProperty({
        name: 'nome',
        description: 'Nome do usuário',
        example: 'Joãozinho Silva',
        type: 'string',
    })
    nome: string;

    @IsString()
    @ApiProperty({
        name: 'senha',
        description: 'senha do usuário',
        example: '123456',
        type: 'string',
        minLength: 6,
        maxLength: 12,
    })
    senha: string;

    @IsString()
    @IsOptional()
    @ApiProperty({
        required: false,
        name: 'id_turma',
        description: 'id_turma',
        type: 'string',
    })
    id_turma: string;

    @IsEnum(TipoUsuario)
    @ApiProperty({
        name: 'tipo',
        description: 'tipo de usuário',
        example: 'ALUNO',
    })
    tipo: TipoUsuario;
    turma: TurmaDto;

    @IsNumberString()
    @ApiProperty({
        name: 'codigo_registro',
        description: 'RA do usuário',
        example: '00456789',
        type: 'string',
        minLength: 8,
        maxLength: 8,
    })
    codigo_registro: string;

    constructor(partial: Partial<UsuarioDto>) {
        super();
        Object.assign(this, partial);
    }

    public static fromPrisma(prismaObj: Usuario) {
        const { turma } = prismaObj as unknown as { turma: Turma };
        return new UsuarioDto({
            id: prismaObj.id,
            nome: prismaObj.nome,
            tipo: prismaObj.tipo as TipoUsuario,
            codigo_registro: prismaObj.codigo_registro,
            turma: turma ? TurmaDto.fromPrisma(turma) : undefined,
            id_turma: prismaObj.id_turma ?? undefined,
        });
    }

    public toPrismaCreate(): Prisma.UsuarioCreateInput {
        return {
            nome: this.nome,
            senha: this.senha,
            tipo: this.tipo,
            codigo_registro: this.codigo_registro,
            turma: this.id_turma
                ? {
                      connect: {
                          id: this.id_turma,
                      },
                  }
                : undefined,
        };
    }

    public toPrismaUpdate(): Prisma.UsuarioUpdateInput {
        return {
            nome: this.nome,
            senha: this.senha,
            tipo: this.tipo,
            codigo_registro: this.codigo_registro,
        };
    }
}
