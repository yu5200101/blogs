import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsController } from './cats/cats.controller';
import { CatsService } from './cats/cats.service';
import { HttpService } from './http/http.service';
import { CatsModule } from './cats/cats.module';
// import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { logger } from './common/middleware/logger.middleware';
import {
  APP_FILTER,
  APP_PIPE,
  APP_GUARD,
  APP_INTERCEPTOR
} from '@nestjs/core';
import { HttpExceptionFilter } from './common/filter/http-exception.filter';
import { ValidationPipe } from './common/validate/validate.pipe';
import { RolesGuard } from './common/guard/roles.guard';
import { LoggingInterceptor } from './common/interceptor/logging.interceptor';
import { TransformInterceptor } from './common/interceptor/transform.interceptor';
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
    }, {
      // 全局使用管道校验
      provide: APP_PIPE,
      useClass: ValidationPipe
    }, {
      // 全局使用守卫
      provide: APP_GUARD,
      useClass: RolesGuard
    }, {
      // 全局使用拦截器
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor
    }, {
      // 全局使用拦截器
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor
    }],
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
