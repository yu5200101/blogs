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
  UseFilters,
  UsePipes,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import {CreateCatDto} from './dto/create-cats.dto'
import { CatsService } from './cats.service';
import { Cat } from './interfaces/cats.interface'
import {ForbiddenException} from '../common/filter/forbidden.exception'
import {HttpExceptionFilter} from '../common/filter/http-exception.filter'
// import {JoiValidationPipe} from '../common/validate/validate.pipe'
import {ValidationPipe} from '../common/validate/validate.pipe'
import {ParseIntPipe} from '../common/validate/parse-int.pipe'
import {RolesGuard} from '../common/guard/roles.guard'
import {Roles} from '../common/decorator/roles.decorator'
import {User} from '../common/decorator/user.decorator'
import {LoggingInterceptor} from '../common/interceptor/logging.interceptor'

@Controller('cats')
@UseFilters(new HttpExceptionFilter())
// @UseGuards(new RolesGuard())
@UseGuards(RolesGuard)
@UseInterceptors(LoggingInterceptor)
export class CatsController {
  constructor(private catsService: CatsService) {}

  @Post('firstName')
  async findFirstNameOne(@User('firstName') firstName: string) {
    return `Hello ${firstName}`
  }

  @Post('service')
  // @UsePipes(new JoiValidationPipe())
  // @UsePipes(new ValidationPipe())
  @UsePipes(ValidationPipe)
  @Roles('admin')
  async create(@Body() createCatDto: CreateCatDto) {
    this.catsService.create(createCatDto);
  }
  // async create(@Body(new ValidationPipe()) createCatDto: CreateCatDto) {
  //   this.catsService.create(createCatDto);
  // }

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
  findGetIdOne(@Param('id', new ParseIntPipe()) id): string {
    return `This action returns a #${id} cat`;
  }

  // @Get(':id')
  // findIdOne(@Param('id', UserByIdPipe) userEntity: UserEntity) {
  //   return userEntity;
  // }

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
