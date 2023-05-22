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
  Param,
  Delete,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Response, Request } from 'express';
import { CreateUserDto } from './user/dtos/create-user.dto';
import { LocalAuthGuard } from './auth/guards/local-auth.guard';
import { AuthenticatedGuard } from './auth/guards/authenticated.guard';
import { CreateLinkDto } from './link/dto/create-link.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  root(@Res() res: Response, @Req() req: Request) {
    return this.appService.getRoot(res, req);
  }

  @Get(':shortUrl')
  @HttpCode(HttpStatus.PERMANENT_REDIRECT)
  getOriginalUrl(
    @Param('shortUrl') shortUrl: string,
    @Res() response: Response,
  ) {
    return this.appService.getLongUrl(shortUrl, response);
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

  @UseGuards(AuthenticatedGuard)
  @Get('/account/logout')
  @HttpCode(HttpStatus.OK)
  logout(@Req() request: Request, @Res() response: Response) {
    return this.appService.logOut(request, response);
  }

  @UseGuards(AuthenticatedGuard)
  @Get('/me/links/:id/delete')
  @HttpCode(HttpStatus.OK)
  async deleteLink(@Param('id') id: string, @Res() response: Response) {
    return await this.appService.deleteLink(id, response);
  }

  @Post('/v1/api/account/signup')
  @HttpCode(HttpStatus.OK)
  async signUp(@Body() user: CreateUserDto) {
    return await this.appService.signUp(user);
  }

  @UseGuards(LocalAuthGuard)
  @Post('/v1/api/account/login')
  @HttpCode(HttpStatus.OK)
  login(@Req() request: Request) {
    return this.appService.logIn(request);
  }

  @Post('/v1/api/data/atomize')
  @HttpCode(HttpStatus.CREATED)
  atomize(@Body() link: CreateLinkDto) {
    return this.appService.atomizeUrl(link);
  }
}
