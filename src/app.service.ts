import { Injectable } from '@nestjs/common';
import { Response } from 'express';
@Injectable()
export class AppService {
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
}
