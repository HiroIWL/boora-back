import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Desafio, Entrega, Prisma, Usuario } from '@prisma/client';
import { UsuarioDto } from 'src/modules/usuario/usuario.dto';
import { BaseDto } from 'src/dtos/base.dto';
import { DesafioDto } from '../desafio/desafio.dto';

export class EntregaDto extends BaseDto {
    @IsString()
    @ApiProperty({
        name: 'id_desafio',
        description: 'ID do desafio entregue',
        example: 'af3b2c1d-4e5f-6789-abcd-ef0123456789',
        type: 'string',
    })
    id_desafio: string;

    @IsString()
    @ApiProperty({
        name: 'id_usuario_aluno',
        description: 'ID do usuário aluno que fez a entrega',
        example: 'bf4c3d2e-5f6a-7890-bcde-fa1234567890',
        type: 'string',
    })
    id_usuario_aluno: string;

    @IsString()
    @ApiProperty({
        name: 'video_url',
        description: 'URL do vídeo da entrega',
        example: 'https://www.exemplo.com/video-entrega',
        type: 'string',
    })
    video_url: string;

    @IsNumber()
    @ApiProperty({
        name: 'nota',
        description: 'Nota da entrega',
        example: 85.5,
        type: 'number',
        required: false,
    })
    nota?: number;

    aluno: UsuarioDto;
    desafio: DesafioDto;

    constructor(partial: Partial<EntregaDto>) {
        super();
        Object.assign(this, partial);
    }

    public static fromPrisma(prismaObj: Entrega) {
        const { aluno, desafio } = prismaObj as unknown as {
            aluno: Usuario;
            desafio: Desafio;
        };

        
        return new EntregaDto({
            id: prismaObj.id,
            id_desafio: prismaObj.id_desafio,
            id_usuario_aluno: prismaObj.id_usuario_aluno,
            video_url: prismaObj.video_url,
            nota: prismaObj.nota ? prismaObj.nota.toNumber() : undefined,
            aluno: aluno ? UsuarioDto.fromPrisma(aluno) : undefined,
            desafio: desafio ? DesafioDto.fromPrisma(desafio) : undefined,
        });
    }

    public toPrismaCreate(): Prisma.EntregaCreateInput {
        return {
            desafio: { connect: { id: this.id_desafio } },
            aluno: { connect: { id: this.id_usuario_aluno } },
            video_url: this.video_url,
            nota: this.nota,
        };
    }

    public toPrismaUpdate(): Prisma.EntregaUpdateInput {
        return {
            desafio: { connect: { id: this.id_desafio } },
            aluno: { connect: { id: this.id_usuario_aluno } },
            video_url: this.video_url,
            nota: this.nota,
        };
    }
}
