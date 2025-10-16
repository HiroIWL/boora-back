import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const config = new DocumentBuilder()
        .setTitle('Boora API')
        .setDescription('Api desafios Boora')
        .setVersion('1.0')
        .addBearerAuth()
        .build();

    app.enableCors();

    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
        }),
    );

    const documentFactory = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('swagger', app, documentFactory);

    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
