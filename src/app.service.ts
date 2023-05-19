import { Injectable } from '@nestjs/common';
import { Response, Request } from 'express';
import { CreateUserDto } from './user/dtos/create-user.dto';
import { UsersService } from './user/users.service';
import { User } from './user/entities/users.entity';

@Injectable()
export class AppService {
  constructor(private readonly usersService: UsersService) {}

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

  logIn(request: Request): Express.User {
    return request.user;
  }

  logOut(request: Request) {
    return request.session.destroy((err: Error) => {
      if (err) {
        return { message: 'Oops! Something went wrong!' };
      }
      return { message: 'Logged out successfully!' };
    });
  }
}
