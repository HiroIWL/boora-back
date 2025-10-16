import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TipoUsuario } from '@prisma/client';
import { ROLES_KEY } from './roles.decorator';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<TipoUsuario[]>(
            ROLES_KEY,
            [context.getHandler(), context.getClass()],
        );

        if (!requiredRoles) {
            return true;
        }

        const { user } = context.switchToHttp().getRequest();
        const userPayload = user as JwtPayload;

        if (!userPayload || !userPayload.role) {
            throw new ForbiddenException(
                'Usuário não autenticado ou sem role definido',
            );
        }

        const hasRole = requiredRoles.some((role) => userPayload.role === role);

        if (!hasRole) {
            throw new ForbiddenException(
                `Acesso negado. Roles necessárias: ${requiredRoles.join(', ')}. Role atual: ${userPayload.role}`,
            );
        }

        return true;
    }
}
