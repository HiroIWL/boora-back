import { ApiProperty } from '@nestjs/swagger';

export class RankingDto {
    @ApiProperty({ example: '3c0c1129-304a-4f2f-a68b-3c06f38767a2' })
    id_turma: string;

    @ApiProperty({ example: '8º Ano' })
    nome_turma: string;

    @ApiProperty({ example: 87.5 })
    media_desempenho: number;

    constructor(data?: Partial<RankingDto>) {
        if (data) {
            Object.assign(this, data);
        }
    }
}
