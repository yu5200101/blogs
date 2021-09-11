import { Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';

// 全局模块 想要使用 CatsService 的模块则不需要在 imports 数组中导入 CatsModule
// @Global()
@Module({
  controllers: [CatsController],
  providers: [CatsService],
  exports: [CatsService]
})
export class CatsModule {
  // 提供者可以注入到模块类中
  constructor(private readonly catsService: CatsService) {}
}