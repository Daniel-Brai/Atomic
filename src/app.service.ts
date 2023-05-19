import { Injectable } from '@nestjs/common';
import { Response, Request } from 'express';
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

  getRoot(res: Response) {
    return res.render('index', {
      title: 'Atomic - Simplify the Web with Smart URLs.',
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

  logIn(request: Request) {
    return { message: 'Login successful' };
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
}
