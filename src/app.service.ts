import { Injectable } from '@nestjs/common';
import { Express, Response, Request } from 'express';
import { CreateUserDto } from './user/dtos/create-user.dto';
import { UsersService } from './user/users.service';
import { User } from './user/entities/users.entity';
import { LinkService } from './link/link.service';
import { CreateLinkDto } from './link/dto/create-link.dto';

@Injectable()
export class AppService {
  constructor(
    private readonly usersService: UsersService,
    private readonly linkService: LinkService,
  ) {}

  async getRoot(res: Response, req: Request) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const userId = req.user ? req.user.id : '';
    const links = await this.getUserLinks(userId);
    const origin = req.headers.origin;
    return res.render('index', {
      title: 'Atomic - Simplify the Web with Smart URLs.',
      userId: userId,
      links: links,
      origin: origin,
    });
  }
  getSignUp(res: Response) {
    return res.render('account/signup', {
      title: 'Create an account | Atomic',
    });
  }
  getSignIn(res: Response) {
    return res.render('account/login', {
      title: 'Sign in into your account | Atomic',
    });
  }

  signUp(user: CreateUserDto): Promise<User> {
    return this.usersService.create(user);
  }

  logIn(request: Request): Express.User {
    return request.user;
  }

  logOut(request: Request, response: Response) {
    request.session.destroy((err: Error) => {
      if (err) {
        return { message: 'Oops! Something went wrong!' };
      }
      return { message: 'Logged out successfully!' };
    });
    response.redirect('/');
  }

  atomizeUrl(link: CreateLinkDto) {
    return this.linkService.create(link);
  }

  async getLongUrl(shortUrl: string, response: Response) {
    const link = await this.linkService.findOneByShortUrl(shortUrl);
    response.redirect(link.longUrl);
  }

  async getUserLinks(userId: string) {
    return await this.linkService.findByUserId(userId);
  }

  async deleteLink(linkId: string, response: Response) {
    await this.linkService.remove(linkId);
    response.redirect('/');
  }
}
