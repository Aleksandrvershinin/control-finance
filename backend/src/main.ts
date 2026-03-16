import { NestFactory } from '@nestjs/core'
import { useContainer } from 'class-validator'
import * as cookieParser from 'cookie-parser'
import { AppModule } from './app.module'
import { GlobalValidationPipe } from './common/pipes/global-validation.pipe'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    app.setGlobalPrefix('api')
    app.use(cookieParser())
    // Включаем глобальную валидацию для всех запросов
    app.useGlobalPipes(new GlobalValidationPipe())
    app.enableCors({
        origin: ['http://localhost', 'http://localhost:5173'], // Указываете разрешенные источники
        credentials: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        allowedHeaders: 'Content-Type, Authorization', // Разрешенные заголовки
    })
    app.enableShutdownHooks()
    useContainer(app.select(AppModule), { fallbackOnErrors: true })
    await app.listen(3000)
}
bootstrap()
