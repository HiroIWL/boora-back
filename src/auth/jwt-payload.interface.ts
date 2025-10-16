import { TipoUsuario } from '@prisma/client';
import { TurmaDto } from '../modules/turma/turma.dto';

export interface JwtPayload {
    id: string;
    registro_academico: string;
    nome: string;
    role: TipoUsuario;
    turma: TurmaDto;
}
