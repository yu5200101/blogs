import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsController } from './cats/cats.controller';
import { CatsService } from './cats/cats.service';
import { HttpService } from './http/http.service';
import { CatsModule } from './cats/cats.module';
// import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { logger } from './common/middleware/logger.middleware';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './common/filter/http-exception.filter';

@Module({
  imports: [CatsModule],
  controllers: [AppController, CatsController],
  providers: [
    AppService,
    CatsService,
    HttpService, {
      // 全局使用异常处理过滤器
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      // .apply(LoggerMiddleware)
      .apply(logger)
      .exclude(
        { path: 'cats', method: RequestMethod.GET },
        { path: 'cats', method: RequestMethod.POST },
        'cats/(.*)',
      )
      // .forRoutes(CatsController)
      .forRoutes({
        path: 'cats',
        method: RequestMethod.ALL
      });
  }
}
