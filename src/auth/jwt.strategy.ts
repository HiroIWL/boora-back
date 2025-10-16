import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET || 'uma-secret-boa',
        });
    }

    async validate(payload: any) {
        return {
            id: payload.sub,
            nome: payload.nome,
            role: payload.role,
            registro_academico: payload.registro_academico,
            turma: payload.turma,
        } as JwtPayload;
    }
}
