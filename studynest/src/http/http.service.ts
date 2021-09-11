import { Injectable, Optional, Inject } from '@nestjs/common';

@Injectable()
export class HttpService<T> {
  // 构造函数的注入 但是需要在子类中调用super
  // constructor(
  //   // Optional 表示可选
  //   @Optional() @Inject('HTTP_OPTIONS') private readonly httpClient: T
  // ) {}

  // 基于属性的注入
  // @Inject('HTTP_OPTIONS')
  // private readonly httpClient: T;
}