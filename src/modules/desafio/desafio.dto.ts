import { IsNumber, IsOptional, IsString } from 'class-validator';
import { BaseDto } from '../../dtos/base.dto';
import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { Desafio, Prisma, Usuario } from '@prisma/client';
import { UsuarioDto } from '../usuario/usuario.dto';

export class DesafioDto extends BaseDto {
    @IsString()
    @ApiProperty({
        name: 'nome',
        description: 'Nome do desafio',
        example: 'Desafio de Matemática',
        type: 'string',
    })
    nome: string;

    @IsNumber()
    @ApiProperty({
        name: 'duracao',
        description: 'Duração do desafio em minutos',
        example: 60,
        type: 'number',
    })
    duracao: number;

    @IsString()
    @ApiProperty({
        name: 'descricao',
        description: 'Descrição do desafio',
        example: 'Este desafio abrange tópicos de álgebra e geometria.',
        type: 'string',
    })
    descricao: string;

    @IsString()
    @ApiProperty({
        name: 'video_url',
        description: 'URL do vídeo explicativo do desafio',
        example: 'https://www.exemplo.com/video-explicativo',
        type: 'string',
    })
    video_url: string;

    @IsNumber()
    @ApiProperty({
        name: 'nota_maxima',
        description: 'Nota máxima que pode ser alcançada no desafio',
        example: 100,
        type: 'number',
    })
    nota_maxima: number;

    @IsString()
    @IsOptional()
    @ApiProperty({
        name: 'id_usuario_professor',
        description: 'ID do usuário professor que criou o desafio',
        example: 'af3b2c1d-4e5f-6789-abcd-ef0123456789',
        type: 'string',
        required: false,
    })
    id_usuario_professor: string;

    profesor: UsuarioDto;

    data_desafio?: string;

    constructor(data?: Partial<DesafioDto>) {
        super(data);
        if (data) {
            if (data.nome !== undefined) this.nome = data.nome;
            if (data.duracao !== undefined) this.duracao = data.duracao;
            if (data.descricao !== undefined) this.descricao = data.descricao;
            if (data.video_url !== undefined) this.video_url = data.video_url;
            if (data.nota_maxima !== undefined)
                this.nota_maxima = data.nota_maxima;
            if (data.id_usuario_professor !== undefined)
                this.id_usuario_professor = data.id_usuario_professor;
            if (data.profesor !== undefined)
                this.profesor = new UsuarioDto(data.profesor);
            if (data.data_desafio !== undefined)
                this.data_desafio = data.data_desafio;
        }
    }

    public static fromPrisma(prismaObj: Desafio) {
        const { professor } = prismaObj as unknown as { professor: Usuario };

        return new DesafioDto({
            id: prismaObj.id,
            nome: prismaObj.nome,
            duracao: prismaObj.duracao,
            descricao: prismaObj.descricao,
            video_url: prismaObj.video_url,
            nota_maxima: prismaObj.nota_maxima.toNumber(),
            id_usuario_professor: prismaObj.id_usuario_professor,
            data_desafio: prismaObj.data_desafio
                ? prismaObj.data_desafio?.toISOString().split('T')[0]
                : undefined,
            profesor: professor ? UsuarioDto.fromPrisma(professor) : undefined,
        });
    }

    public toPrismaCreate(): Prisma.DesafioCreateInput {
        return {
            nome: this.nome,
            duracao: this.duracao,
            descricao: this.descricao,
            video_url: this.video_url,
            nota_maxima: new Prisma.Decimal(this.nota_maxima),
            professor: {
                connect: { id: this.id_usuario_professor },
            },
        };
    }

    public toPrismaUpdate(): Prisma.DesafioUpdateInput {
        return {
            nome: this.nome,
            duracao: this.duracao,
            descricao: this.descricao,
            video_url: this.video_url,
            nota_maxima: new Prisma.Decimal(this.nota_maxima),
            professor: {
                connect: { id: this.id_usuario_professor },
            },
        };
    }
}
