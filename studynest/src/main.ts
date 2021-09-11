import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { AppModule } from './app.module';
// import { logger } from './common/middleware/logger.middleware';
import { HttpExceptionFilter } from './common/filter/http-exception.filter';
import { AllExceptionsFilter } from './common/filter/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.use(logger);
  // app.useGlobalFilters(new HttpExceptionFilter());
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
  await app.listen(3000);
}
bootstrap();
