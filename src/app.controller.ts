import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';
import { CreateUserDto } from './user/dtos/create-user.dto';
import { LocalAuthGuard } from './auth/guards/local-auth.guard';
import { AuthenticatedGuard } from './auth/guards/authenticated.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  root(@Res() res: Response) {
    return this.appService.getRoot(res);
  }

  @Get('/account/signup')
  @HttpCode(HttpStatus.OK)
  signup(@Res() res: Response) {
    return this.appService.getSignUp(res);
  }

  @Get('/account/login')
  @HttpCode(HttpStatus.OK)
  signin(@Res() res: Response) {
    return this.appService.getSignIn(res);
  }

  @Post('/v1/api/account/signup')
  @HttpCode(HttpStatus.OK)
  async signUP(@Body() user: CreateUserDto) {
    return await this.appService.signUp(user);
  }

  @UseGuards(LocalAuthGuard)
  @Post('/v1/api/account/login')
  @HttpCode(HttpStatus.OK)
  login(@Req() request) {
    return this.appService.logIn(request);
  }

  @UseGuards(AuthenticatedGuard)
  @Get('/v1/api/account/logout')
  @HttpCode(HttpStatus.OK)
  logout(@Req() request) {
    return this.appService.logOut(request);
  }
}
