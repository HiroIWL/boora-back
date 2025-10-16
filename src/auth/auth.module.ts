import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { RolesGuard } from './roles.guard';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { UsuarioService } from 'src/modules/usuario/usuario.service';
import { UsuarioModule } from 'src/modules/usuario/usuario.module';
import { PrismaModule } from 'src/modules/prisma/prisma.module';

@Module({
    imports: [
        PassportModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: '24h' },
            global: true,
        }),
        PrismaModule,
    ],
    providers: [JwtStrategy, RolesGuard],
    exports: [JwtModule, PassportModule, RolesGuard],
})
export class AuthModule {}
