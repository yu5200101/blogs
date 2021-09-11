import {
  Controller,
  Get,
  Post,
  HttpCode,
  Header,
  Param,
  Query,
  Body,
  HttpException,
  HttpStatus,
  UseFilters
} from '@nestjs/common';
import {CreateCatDto} from './dto/create-cats.dto'
import { CatsService } from './cats.service';
import { Cat } from './interfaces/cats.interface'
import {ForbiddenException} from '../common/httpException/forbidden.exception'
import {HttpExceptionFilter} from '../common/filter/http-exception.filter'

@Controller('cats')
@UseFilters(new HttpExceptionFilter())
export class CatsController {
  constructor(private catsService: CatsService) {}

  @Post('service')
  async create(@Body() createCatDto: CreateCatDto) {
    this.catsService.create(createCatDto);
  }

  @Get('service')
  async findAll(): Promise<Cat[]> {
    return this.catsService.findAll();
  }

  @Post('post')
  @HttpCode(200)
  @Header('Cache-Control', 'none')
  createPost(): string {
    return 'post cat';
  }

  @Get('get')
  findGetAll(@Query() query): string {
    return `get ca ${query.id}`;
  }

  @Get('getId/:id')
  findOne(@Param() params): string {
    console.log(params.id);
    return `This action returns a #${params.id} cat`;
  }

  @Post('dto')
  async createCatDto(@Body() createCatDto: CreateCatDto) {
    return createCatDto
  }

  @Get('error')
  findError() {
    // throw new HttpException('forbidden', HttpStatus.FORBIDDEN)
    throw new HttpException({
      status: HttpStatus.FORBIDDEN,
      error: 'this is a error msg'
    }, HttpStatus.FORBIDDEN)
  }

  @Get('error2')
  findError2() {
    throw new ForbiddenException()
  }

  @Get('error3')
  @UseFilters(new HttpExceptionFilter())
  findError3() {
    throw new ForbiddenException()
  }
}
