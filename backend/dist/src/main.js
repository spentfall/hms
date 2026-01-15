"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        bodyParser: true,
    });
    const server = app.getHttpServer();
    server.maxHeadersCount = 0;
    server.maxHeaderSize = 65536;
    app.enableCors({
        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
    }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('MediSys Hospital Management System API')
        .setDescription('Complete API documentation for the Hospital Management System')
        .setVersion('1.0')
        .addTag('Auth', 'Authentication endpoints')
        .addTag('Doctors', 'Doctor management endpoints')
        .addTag('Departments', 'Department management endpoints')
        .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
    }, 'JWT-auth')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document, {
        customSiteTitle: 'MediSys API Docs',
        customCss: '.swagger-ui .topbar { display: none }',
        swaggerOptions: {
            persistAuthorization: true,
            tagsSorter: 'alpha',
            operationsSorter: 'alpha',
        },
    });
    await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
    console.log(`Application is running on: http://localhost:${process.env.PORT ?? 3000}`);
    return app.getHttpAdapter().getInstance();
}
exports.default = bootstrap();
//# sourceMappingURL=main.js.map