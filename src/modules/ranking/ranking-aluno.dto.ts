import { ApiProperty } from '@nestjs/swagger';

export class RankingAlunoDto {
    @ApiProperty({ example: 'a5d8c1d7-7f2b-4b9e-8f9a-26d6a2d18f3a' })
    id_aluno: string;

    @ApiProperty({ example: 'João Silva' })
    nome_aluno: string;

    @ApiProperty({ example: 92.5 })
    media_nota: number;

    constructor(data?: Partial<RankingAlunoDto>) {
        if (data) Object.assign(this, data);
    }
}
